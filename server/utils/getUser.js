import passport from 'koa-passport';

const usersAuth = {};

export default () => async (ctx, next) => {
	await passport.authenticate('jwt', async (err, user) => {
		if (err) throw (err);
		ctx.user = null;
		if (user) {
			ctx.user = user;
			ctx.cookies.set('user', user._id, { httpOnly: false });
		}
		await next(ctx, next);
	})(ctx, next);
};

export {
	usersAuth,
};
