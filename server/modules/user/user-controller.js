import AppError from '../../utils/AppErrors.js';
import { User, Message } from '../../models';
import app from 'app';
import { onlineUsers } from '../../sockets';

const online = [];

export default {
  currentUser: async (ctx) => {
    if (!ctx.user) throw new AppError(401, 101);
    ctx.body = ctx.user.username;
  },

	history: async (ctx) => {
		const { chat } = ctx.request.body;
		if (!chat) throw new AppError(406, 601);
		if (chat === 'all') {
			ctx.body = await Message.find({ to: 'all' }).select({ from: 1, to: 1, message: 1, _id: 0 });
		} else {
			if (!ctx.user) throw new AppError(401, 101);
			ctx.body = await Message.find({$or: [{from: chat, to: ctx.user.username}, {from: ctx.user.username, to: chat}]}).select({ from: 1, to: 1, message: 1, _id: 0 });
		}
	},

	message: async (ctx) => {
		if (!ctx.user) throw new AppError(401, 101);
		const { message, from, to } = ctx.request.body;
		console.log(`${from} -> ${to}: ${message}`);
		await Message.create({ message, from, to });
		if (to === 'all') {
			app.io.emit('all', JSON.stringify({ message, from }));
		} else {
			const chatId = ctx.user.username < to ? ctx.user.username+'-'+to : to+'-'+ctx.user.username;
			console.log(chatId);
			app.io.emit(chatId, JSON.stringify({ message, from }));
		}
		ctx.body = 'Ok';
	},

	online: async (ctx) => {
  	let us = '';
  	if (ctx.user) us = ctx.user.username;
  	const users = await User.find().select({ username: 1, _id: 0 });
  	const statusedUser = [];
  	users.forEach(u => {
  		if (u.username !== us) {
			  statusedUser.push({
				  username: u.username,
				  status: (onlineUsers.indexOf(u.username) === -1) ? 'offline' : 'online',
			  });
		  }
	  });

		function compare(a, b) {
			if (a.status === 'online' && b.status === 'offline') {
				return -1;
			}
			if (a.status === 'offline' && b.status === 'online') {
				return 1;
			}
			return 0;
		}
		statusedUser.sort(compare);
  	ctx.body = statusedUser;
	},
};
