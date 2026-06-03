import { Server } from 'socket.io';
import Poll from '../models/Poll.js';


const classroomQueues = {};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);


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
