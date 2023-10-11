const sessionMiddleware = (socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;

  if (sessionId) {
    const session = sesssionStorage.findSession(sessionId);

    if (session) {
      socket.sessionId = session;
      socket.userId = session.userId;
      socket.username = session.username;
      return next();
    }
  }

  const username = socket.handshake.auth.username;

  if (!username) {
    return next(new Error("invalid username"));
  }

  socket.sessionId = uid();
  socket.userId = uid();
  socket.username = username;
};

export { sessionMiddleware };
