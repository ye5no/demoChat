import passport from 'koa-passport';
import pick from 'lodash.pick';
import jwt from 'jsonwebtoken';
import AppError from '../../utils/AppErrors.js';
import { JWT } from 'configuration';
import { User } from '../../models';
import { usersAuth } from '../../utils/getUser';

const generateKey = (len) => {
	const str = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM012345678901234567890';
	const strLength = str.length;
	let key = '';
	let ind;
	for (let i=0; i<len; i++) {
		ind = Math.floor(Math.random()*strLength);
		key += str[ind];
	}
	return key;
};

const setToken = (ctx, user) => {
  const payload = {
    _id: user._id,
    exp: Math.floor(Date.now() / 1000) + JWT.exp,
  };
  const token = jwt.sign(payload, JWT.secret);
  ctx.cookies.set('jwt', token, {httpOnly: true});
  return token;
};

export default {
  async signup(ctx) {
    if (ctx.request.header['content-type'] !== 'application/json' &&
      ctx.request.header['content-type'] !== 'application/x-www-form-urlencoded') throw new AppError(400, 10);
    if (ctx.user) throw new AppError(401, 102);
	  const { username, password } = ctx.request.body;
	  if (!username || !password) throw new AppError(406, 601);
	  try {
		  await User.create({ username, password });
		  await passport.authenticate('local', (err, user) => {
			  if (err) throw (err);
			  if (!user) throw new AppError(401, 100);
			  setToken(ctx, user);
			  ctx.body = { data: 'Ok' };
		  })(ctx);
	  } catch (e) {
		  const { message, errors, name } = e;
		  if (name === 'ValidationError') {
			  throw new AppError(400, message, errors);
		  } else {
			  throw e;
		  }
	  }
  },

  async login(ctx) {
    if (ctx.request.header['content-type']!=='application/json' &&
      ctx.request.header['content-type']!=='application/x-www-form-urlencoded') throw new AppError(400, 10);
    if (ctx.user) throw new AppError(401, 102);
    const { username, password } = ctx.request.body;
    if (!username || !password) throw new AppError(406, 601);
    await passport.authenticate('local', (err, user) => {
      if (err) throw (err);
      if (!user) throw new AppError(401, 100);
	    setToken(ctx, user);
      ctx.body = { data: 'Ok' };
    })(ctx);
  },

  async logout(ctx) {
    if (!ctx.user) throw new AppError(401, 101);
    delete usersAuth[ctx.user._id];
    ctx.cookies.set('jwt', '', {httpOnly: true});
	  ctx.cookies.set('user', '', {httpOnly: false});
    ctx.headers.authorization = '';
    ctx.body = { data: 'Ok' };
  },

	async vk(ctx) {
		if (ctx.user) throw new AppError(401, 102);
		passport.authenticate('vkontakte')(ctx);
	},

	async vkCallback(ctx) {
		await passport.authenticate('vkontakte', async (err, user, profile) => {
			if (err) throw (err);
			if (!user && !profile) throw new AppError(401, 105);
			if (!user) {
				user = await User.create({ username: profile.displayName, password: generateKey(10) });
			}
			setToken(ctx, user);
			ctx.body = { data: 'Ok' };
		})(ctx);
	},
};
