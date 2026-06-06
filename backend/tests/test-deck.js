import http from 'http';
import express from 'express';
import { io as ioClient } from 'socket.io-client';
import { initSocket } from '../src/config/socket.js';

const TEST_PORT = 5002;
const baseUrl = `http://localhost:${TEST_PORT}`;

const startTestServer = () => {
  const app = express();
  const server = http.createServer(app);
  
  app.use(express.json());
  app.get('/', (req, res) => res.json({ status: 'ok' }));

  initSocket(server);
  
  return new Promise((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Test deck server active on port ${TEST_PORT}`);
      resolve({ server, app });
    });
  });
};

const runDeckTests = async () => {
  console.log('\n====================================================');
  console.log(' STARTING REDESIGNED LIVE FLIGHT DECK INTEGRATION TEST');
  console.log('====================================================\n');

  const { server } = await startTestServer();

  const deckPin = '987654';
  let teacherSocket;
  let studentSocket;

  try {
    // 1. Establish Teacher socket and start deck
    await new Promise((resolve, reject) => {
      teacherSocket = ioClient(baseUrl);
      
      teacherSocket.on('connect', () => {
        console.log('✅ Teacher connected to socket server.');
        teacherSocket.emit('teacher:start_deck', { deckUid: deckPin });
        console.log(`✅ Teacher emitted teacher:start_deck with PIN: ${deckPin}`);
        resolve();
      });

      teacherSocket.on('connect_error', reject);
    });

    // Setup Teacher update listener immediately, before student joins
    const studentUpdatePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for student update event')), 3000);
      teacherSocket.on('teacher:update_students', (studentsList) => {
        if (studentsList.some(s => s.email === 'rahul@student.edu')) {
          console.log(`✅ Teacher received teacher:update_students list with Student Rahul included. Dynamic list size: ${studentsList.length}`);
          clearTimeout(timeout);
          resolve(studentsList);
        }
      });
    });

    // Setup Student state sync listener before joining
    const studentSyncStatePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for student:sync_state')), 3000);
      
      // We'll bind this once the studentSocket is connected.
      resolve({ bind: (socket) => {
        socket.on('student:sync_state', ({ whiteboardHistory, chatMessages, doubts }) => {
          if (Array.isArray(whiteboardHistory) && Array.isArray(chatMessages) && Array.isArray(doubts)) {
            console.log('✅ Student received initial student:sync_state empty arrays.');
            clearTimeout(timeout);
          } else {
            reject(new Error('Incorrect state payload in sync_state'));
          }
        });
      }});
    });

    // 2. Establish Student socket and join deck
    await new Promise((resolve, reject) => {
      studentSocket = ioClient(baseUrl);
      
      studentSocket.on('connect', async () => {
        console.log('✅ Student connected to socket server.');
        
        // Bind sync state listener
        const binder = await studentSyncStatePromise;
        binder.bind(studentSocket);

        studentSocket.emit('student:join_deck', {
          deckUid: deckPin,
          studentDetails: { name: 'Student Rahul', email: 'rahul@student.edu', uid: 'STU-123' }
        });
        console.log(`✅ Student emitted student:join_deck with PIN: ${deckPin}`);
      });

      studentSocket.on('student:join_success', ({ deckUid }) => {
        if (deckUid === deckPin) {
          console.log('✅ Student verified student:join_success event.');
          resolve();
        } else {
          reject(new Error('Incorrect deck PIN returned in join_success'));
        }
      });

      studentSocket.on('student:join_error', ({ message }) => {
        reject(new Error(`Student join failed: ${message}`));
      });

      studentSocket.on('connect_error', reject);
    });

    // 3. Await the update listeners that were registered
    await studentUpdatePromise;

    // 4. Test Live Chat Event loopback
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for chat loopback')), 3000);
      
      const chatMsg = {
        sender: 'Student Rahul',
        role: 'Student',
        text: 'Hello from Student Rahul!',
        timestamp: '12:00:00'
      };

      teacherSocket.on('deck:chat_message', (msg) => {
        if (msg.text === 'Hello from Student Rahul!' && msg.sender === 'Student Rahul') {
          console.log(`✅ Teacher verified real-time chat message loopback: "${msg.sender}: ${msg.text}"`);
          clearTimeout(timeout);
          resolve();
        }
      });

      studentSocket.emit('deck:chat_message', { deckUid: deckPin, message: chatMsg });
    });

    // 5. Test Live Doubt Submission
    let testDoubtId = 'doubt-' + Date.now();
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for doubt submission')), 3000);

      const doubtObj = {
        id: testDoubtId,
        studentName: 'Student Rahul',
        text: 'How does coordinate scaling work?',
        timestamp: '12:00:05'
      };

      teacherSocket.on('deck:doubt_received', (doubt) => {
        if (doubt.id === testDoubtId && doubt.text === 'How does coordinate scaling work?') {
          console.log(`✅ Teacher verified real-time doubt inbox reception: "${doubt.studentName}: ${doubt.text}"`);
          clearTimeout(timeout);
          resolve();
        }
      });

      studentSocket.emit('deck:submit_doubt', { deckUid: deckPin, doubt: doubtObj });
    });

    // 6. Test Live Doubt Resolution
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for doubt resolution')), 3000);

      studentSocket.on('deck:doubt_resolved', (doubtId) => {
        if (doubtId === testDoubtId) {
          console.log(`✅ Student verified real-time doubt resolution propagation for ID: ${doubtId}`);
          clearTimeout(timeout);
          resolve();
        }
      });

      teacherSocket.emit('deck:resolve_doubt', { deckUid: deckPin, doubtId: testDoubtId });
    });

    // 7. Test Canvas Whiteboard Drawing events
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for drawing sync')), 3000);

      studentSocket.on('student:draw_start', (data) => {
        if (data.x === 10 && data.y === 20 && data.tool === 'pencil') {
          console.log('✅ Student verified student:draw_start transmission.');
          resolve();
        }
      });

      teacherSocket.emit('teacher:draw_start', { x: 10, y: 20, color: '#10b981', size: 4, tool: 'pencil', width: 800, height: 600 });
    });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for drawing move')), 3000);

      studentSocket.on('student:draw_move', (data) => {
        if (data.x === 15 && data.y === 25) {
          console.log('✅ Student verified student:draw_move transmission.');
          resolve();
        }
      });

      teacherSocket.emit('teacher:draw_move', { x: 15, y: 25, tool: 'pencil' });
    });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for drawing end')), 3000);

      studentSocket.on('student:draw_end', (data) => {
        if (data.action && data.action.type === 'shape' && data.action.shape === 'arrow') {
          if (data.action.fillColor === 'rgba(16,185,129,0.15)' && data.action.opacity === 80) {
            console.log('✅ Student verified student:draw_end arrow shape with fill color and opacity transmission.');
            resolve();
          } else {
            reject(new Error('Incorrect arrow properties received by student'));
          }
        }
      });

      teacherSocket.emit('teacher:draw_end', {
        action: {
          type: 'shape',
          shape: 'arrow',
          x1: 10,
          y1: 20,
          x2: 100,
          y2: 200,
          color: '#10b981',
          fillColor: 'rgba(16,185,129,0.15)',
          size: 4,
          opacity: 80,
          canvasWidth: 800,
          canvasHeight: 600
        }
      });
    });

    // 8. Test Canvas History Synchronization (e.g. selection translation update)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout waiting for history sync')), 3000);

      studentSocket.on('student:sync_history', (history) => {
        if (Array.isArray(history) && history.length === 1 && history[0].type === 'shape' && history[0].shape === 'diamond') {
          console.log('✅ Student verified student:sync_history (whiteboard elements drag-n-move update) transmission.');
          resolve();
        }
      });

      teacherSocket.emit('teacher:sync_history', [
        {
          type: 'shape',
          shape: 'diamond',
          x1: 50,
          y1: 50,
          x2: 150,
          y2: 150,
          color: '#3b82f6',
          fillColor: 'transparent',
          size: 4,
          opacity: 100,
          canvasWidth: 800,
          canvasHeight: 600
        }
      ]);
    });

    console.log('\n====================================================');
    console.log(' 🎉 ALL LIVE FLIGHT DECK WEB SOCKET SERVICES VERIFIED');
    console.log('====================================================\n');

  } catch (error) {
    console.error('\n❌ FLIGHT DECK TEST SUITE FAILED:', error);
    process.exitCode = 1;
  } finally {
    if (teacherSocket) teacherSocket.close();
    if (studentSocket) studentSocket.close();
    server.close(() => {
      console.log('Test Server stopped.');
      process.exit();
    });
  }
};

runDeckTests();
