import { Server } from 'socket.io';
import Poll from '../models/Poll.js';


const classroomQueues = {};
const coopRooms = {};
const matchmakingQueue = [];
const onlineUsers = {};
const activeDecks = {};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // ── SOCIAL & FRIEND INVITATION HANDLERS ──
    socket.on('social:join_lobby', ({ userId, userName }) => {
      socket.userId = userId;
      socket.userName = userName;
      onlineUsers[userId] = socket.id;
      console.log(`[Social Socket] User ${userName} (${userId}) registered online`);
      io.emit('social:user_online', { userId });
    });

    socket.on('social:check_online', ({ friendIds }, callback) => {
      if (!Array.isArray(friendIds)) return;
      const statuses = {};
      friendIds.forEach(id => {
        statuses[id] = !!onlineUsers[id];
      });
      if (typeof callback === 'function') {
        callback(statuses);
      } else {
        socket.emit('social:online_statuses', statuses);
      }
    });

    socket.on('coop:invite_friend', ({ friendId, courseId }) => {
      const targetSocketId = onlineUsers[friendId];
      if (targetSocketId) {
        const inviteRoomId = `coop_invite_room_${socket.userId}_${friendId}`;
        io.to(targetSocketId).emit('coop:invite_received', {
          requesterName: socket.userName,
          requesterId: socket.userId,
          roomId: inviteRoomId,
          courseId
        });
        console.log(`[Socket] Invite emitted from ${socket.userName} to friend ${friendId} in room ${inviteRoomId}`);
      }
    });

    socket.on('coop:accept_invite', ({ roomId, requesterId }) => {
      socket.join(roomId);
      socket.coopRoomId = roomId;

      const hostSocketId = onlineUsers[requesterId];
      if (hostSocketId) {
        const hostSocket = io.sockets.sockets.get(hostSocketId);
        if (hostSocket) {
          hostSocket.join(roomId);
          hostSocket.coopRoomId = roomId;
        }
      }

      coopRooms[roomId] = {
        studentA: { userId: requesterId, userName: 'Host Friend', socketId: hostSocketId },
        studentB: { userId: socket.userId, userName: socket.userName, socketId: socket.id },
        isMock: false
      };

      io.to(roomId).emit('coop:matched', {
        roomId,
        partnerName: socket.userName,
        partnerId: socket.userId,
        playerA: { userId: requesterId, userName: 'Host' },
        playerB: { userId: socket.userId, userName: socket.userName }
      });
      
      console.log(`[Socket] Match established via direct invite in room ${roomId}`);
    });


    socket.on('join_classroom', ({ classroomId, userId, name, role }) => {
      socket.join(classroomId);
      socket.classroomId = classroomId;
      socket.userId = userId;
      socket.userName = name;
      socket.userRole = role;
      console.log(`${role} ${name} joined classroom: ${classroomId}`);


      if (!classroomQueues[classroomId]) {
        classroomQueues[classroomId] = [];
      }


      socket.emit('queue_update', classroomQueues[classroomId]);
    });


    // ── MULTI-PLAYER CO-OP MATCHMAKING & SOCKET ROOMS ──
    socket.on('coop:join_queue', ({ userId, userName, courseId }) => {
      // Remove any existing duplicate queue entries
      const existingIdx = matchmakingQueue.findIndex(q => q.userId === userId);
      if (existingIdx !== -1) {
        matchmakingQueue.splice(existingIdx, 1);
      }

      // Add student to the matching queue
      matchmakingQueue.push({
        socket,
        userId,
        userName,
        courseId
      });

      console.log(`[Socket] Student ${userName} (${userId}) joined matchmaking queue for course: ${courseId}`);

      // Try to match with another active student on the same courseId
      const partner = matchmakingQueue.find(q => q.courseId === courseId && q.userId !== userId);

      if (partner) {
        // Remove both students from queue
        const idxA = matchmakingQueue.findIndex(q => q.userId === userId);
        if (idxA !== -1) matchmakingQueue.splice(idxA, 1);
        const idxB = matchmakingQueue.findIndex(q => q.userId === partner.userId);
        if (idxB !== -1) matchmakingQueue.splice(idxB, 1);

        const roomId = `coop_room_${userId}_${partner.userId}`;
        socket.join(roomId);
        partner.socket.join(roomId);

        socket.coopRoomId = roomId;
        partner.socket.coopRoomId = roomId;

        coopRooms[roomId] = {
          studentA: { userId, userName, socketId: socket.id },
          studentB: { userId: partner.userId, userName: partner.userName, socketId: partner.socket.id },
          isMock: false
        };

        // Notify both sockets in the room
        io.to(roomId).emit('coop:matched', {
          roomId,
          partnerName: partner.userName,
          partnerId: partner.userId,
          playerA: { userId, userName },
          playerB: { userId: partner.userId, userName: partner.userName }
        });

        // Redundant direct emits to enforce state transitions on clients
        socket.emit('coop:matched', {
          roomId,
          partnerName: partner.userName,
          partnerId: partner.userId,
          playerA: { userId, userName },
          playerB: { userId: partner.userId, userName: partner.userName }
        });
        partner.socket.emit('coop:matched', {
          roomId,
          partnerName: userName,
          partnerId: userId,
          playerA: { userId: partner.userId, userName: partner.userName },
          playerB: { userId, userName }
        });

        console.log(`[Socket] Real match established between ${userName} and ${partner.userName} in room ${roomId}`);
      }
    });

    socket.on('coop:leave_queue', ({ userId }) => {
      const idx = matchmakingQueue.findIndex(q => q.userId === userId);
      if (idx !== -1) {
        matchmakingQueue.splice(idx, 1);
        console.log(`[Socket] Student ${userId} cancelled matching queue`);
      }
    });

    socket.on('coop:draw', (drawData) => {
      if (socket.coopRoomId) {
        socket.to(socket.coopRoomId).emit('coop:draw', drawData);
      }
    });

    socket.on('coop:clear_canvas', () => {
      if (socket.coopRoomId) {
        socket.to(socket.coopRoomId).emit('coop:clear_canvas');
      }
    });

    socket.on('coop:chat_message', (msg) => {
      if (socket.coopRoomId) {
        socket.to(socket.coopRoomId).emit('coop:chat_message', msg);
      }
    });

    socket.on('coop:sync_progress', (data) => {
      if (socket.coopRoomId) {
        socket.to(socket.coopRoomId).emit('coop:sync_progress', data);
      }
    });

    socket.on('coop:complete_mission', () => {
      if (socket.coopRoomId) {
        io.to(socket.coopRoomId).emit('coop:complete_mission');
      }
    });


    socket.on('draw', (drawData) => {
      if (socket.classroomId) {
        socket.to(socket.classroomId).emit('draw', drawData);
      }
    });


    socket.on('clear_canvas', () => {
      if (socket.classroomId) {
        socket.to(socket.classroomId).emit('clear_canvas');
      }
    });

    // ── LIVE FLIGHT DECK SYNC ──
    socket.on('teacher:start_deck', ({ deckUid }) => {
      activeDecks[deckUid] = socket.id;
      socket.join(`deck_${deckUid}`);
      socket.deckUid = deckUid;
      console.log(`[Socket] Teacher started flight deck with PIN: ${deckUid}`);
    });

    socket.on('student:join_deck', ({ deckUid, studentDetails }) => {
      if (activeDecks[deckUid]) {
        socket.join(`deck_${deckUid}`);
        // Notify the teacher who started this deck
        io.to(activeDecks[deckUid]).emit('teacher:student_joined', studentDetails);
        socket.emit('student:join_success', { deckUid });
        console.log(`[Socket] Student joined flight deck ${deckUid}`);
      } else {
        socket.emit('student:join_error', { message: 'Invalid Deck PIN or Deck is not active' });
      }
    });

    socket.on('teacher:push_material', (material) => {
      if (socket.deckUid) {
        // Send only to students in this specific deck
        socket.to(`deck_${socket.deckUid}`).emit('student:receive_material', material);
      } else {
        // Fallback broadcast
        io.emit('student:receive_material', material);
      }
      console.log(`[Socket] Teacher pushed material: ${material?.title || 'Unknown'}`);
    });

    socket.on('teacher:add_student', (student) => {
      // Notify that a student was added to the flight deck
      io.emit('student:added_to_flight_deck', student);
      console.log(`[Socket] Teacher added student to flight deck: ${student?.name || 'Unknown'}`);
    });


    socket.on('hand:raise', () => {
      const { classroomId, userId, userName } = socket;
      if (!classroomId || !userId) return;

      if (!classroomQueues[classroomId]) {
        classroomQueues[classroomId] = [];
      }


      const exists = classroomQueues[classroomId].some((s) => s.studentId === userId);
      if (!exists) {
        classroomQueues[classroomId].push({
          studentId: userId,
          name: userName || 'Student',
          timestamp: Date.now(),
        });
        io.to(classroomId).emit('queue_update', classroomQueues[classroomId]);
        console.log(`Hand raised by ${userName} in ${classroomId}`);
      }
    });

    socket.on('hand:lower', () => {
      const { classroomId, userId } = socket;
      if (!classroomId || !userId) return;

      if (classroomQueues[classroomId]) {
        classroomQueues[classroomId] = classroomQueues[classroomId].filter(
          (s) => s.studentId !== userId
        );
        io.to(classroomId).emit('queue_update', classroomQueues[classroomId]);
        console.log(`Hand lowered by student ${userId} in ${classroomId}`);
      }
    });


    socket.on('poll:vote', async ({ pollId, optionIndex }) => {
      const { classroomId, userId } = socket;
      if (!classroomId || !userId || !pollId) return;

      try {
        const poll = await Poll.findById(pollId);
        if (!poll || poll.status === 'Closed') return;


        const existingVoteIndex = poll.votes.findIndex(
          (v) => v.studentId && v.studentId.toString() === userId.toString()
        );

        if (existingVoteIndex !== -1) {
          poll.votes[existingVoteIndex].optionIndex = optionIndex;
        } else {
          poll.votes.push({ studentId: userId, optionIndex });
        }

        await poll.save();


        const results = poll.options.map((opt, index) => {
          const count = poll.votes.filter((v) => v.optionIndex === index).length;
          return { option: opt, votes: count };
        });


        io.to(classroomId).emit('poll:results', { pollId, results, totalVotes: poll.votes.length });
        console.log(`Vote registered for poll ${pollId} in ${classroomId}`);
      } catch (err) {
        console.error('Socket poll vote registration error:', err);
      }
    });


    socket.on('chat:message', (msgContent) => {
      const { classroomId, userName, userRole } = socket;
      if (classroomId) {
        const messageObj = {
          sender: userName || 'Anonymous',
          role: userRole || 'Student',
          text: msgContent,
          timestamp: new Date().toLocaleTimeString(),
        };
        io.to(classroomId).emit('chat:message', messageObj);
      }
    });


    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);

      // Handle social onlineUsers cleanup
      if (socket.userId && onlineUsers[socket.userId] === socket.id) {
        delete onlineUsers[socket.userId];
        io.emit('social:user_offline', { userId: socket.userId });
        console.log(`[Social Socket] User ${socket.userName} (${socket.userId}) is offline`);
      }

      // Handle matchmaking queue cleanup
      const qIdx = matchmakingQueue.findIndex(q => q.socket.id === socket.id);
      if (qIdx !== -1) {
        matchmakingQueue.splice(qIdx, 1);
      }

      // Handle active co-op room disconnect
      if (socket.coopRoomId && coopRooms[socket.coopRoomId]) {
        socket.to(socket.coopRoomId).emit('coop:partner_disconnected');
        delete coopRooms[socket.coopRoomId];
      }

      const { classroomId, userId } = socket;
      if (classroomId && userId && classroomQueues[classroomId]) {
        const initialLen = classroomQueues[classroomId].length;
        classroomQueues[classroomId] = classroomQueues[classroomId].filter(
          (s) => s.studentId !== userId
        );
        if (classroomQueues[classroomId].length !== initialLen) {
          io.to(classroomId).emit('queue_update', classroomQueues[classroomId]);
        }
      }
    });
  });

  return io;
};
