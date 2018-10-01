const sockets = {};
const onlineUsers = [];

export default (socket) => {
  socket.on('login', (us) => {
    if (onlineUsers.indexOf(us) === -1) onlineUsers.push(us);
    Object.getOwnPropertyNames(sockets).forEach(un => {
    	if (un !== us) sockets[un].emit('login', us);
    });
	  sockets[us] = socket;
  });

  socket.on('logout', (us) => {
  	const index = onlineUsers.indexOf(us);
    if (onlineUsers.indexOf(us) !== -1) onlineUsers.splice(index, 1);
    delete sockets[us];
	  Object.getOwnPropertyNames(sockets).forEach(un => {
	  	if (un !== us) sockets[un].emit('logout', us);
	  });
  });
};

export {
	onlineUsers,
};
