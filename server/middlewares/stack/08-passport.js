import passport from 'koa-passport';
import passLocal from 'passport-local';
import passJwt from 'passport-jwt';
import VKontakteStrategy from 'passport-vkontakte';
import { JWT, VK, ADDRESS } from 'configuration';
import { User } from '../../models';
import { usersAuth } from '../../utils/getUser';
import { INTERVALS } from 'configuration';

export default (app) => {
  const authExt = (ctx) => ((ctx.headers.authorization) ? ctx.headers.authorization : null);
  const cookieExt = (ctx) => ((ctx.header.cookie !== undefined) ? ctx.cookies.get('jwt') : null);
  const bodyExt = (ctx) => ((ctx.body.jwt !== undefined) ? ctx.body.jwt : null);
  const queryExt = (ctx) => ((ctx.query.jwt !== undefined) ? ctx.query.jwt : null);

  // ---local---
  passport.use(new passLocal.Strategy({
      usernameField: 'username',
      passwordField: 'password',
    },
    async function(username, password, done) {
      try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false);
        if (!user.comparePasswords(password)) return done(null, false);
        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  ));

  // ---jwt---
  passport.use(new passJwt.Strategy({
      secretOrKey: JWT.secret,
      timeout: JWT.exp,
      jwtFromRequest: passJwt.ExtractJwt.fromExtractors([authExt, cookieExt, bodyExt, queryExt]),
    },
    async function(payload, done) {
      try {
        const { _id } = payload;
        let user = false;
        if (!usersAuth[_id]) {
        	const dbUser = await User.findOne({ _id });
        	if (dbUser) {
        		usersAuth[_id] = Object.assign({}, dbUser._doc);
		        usersAuth[_id].timeout = setTimeout(x => delete usersAuth[x], INTERVALS.user.authTimeout, _id);
		        user = usersAuth[_id];
	        }
        } else {
	        clearTimeout(usersAuth[_id].timeout);
	        usersAuth[_id].timeout = setTimeout(x => delete usersAuth[x], INTERVALS.user.authTimeout, _id);
	        user = usersAuth[_id];
        }
        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    })
  );

	// ---vk---
	passport.use(new VKontakteStrategy.Strategy({
			clientID: VK.id,
			clientSecret: VK.secret,
			callbackURL: ADDRESS.external + '/api/user/vk/callback',
		},
		async function(accessToken, refreshToken, params, profile, done) {
			try {
				const user = await User.find({ username: profile.displayName });
				if (user !== null) {
					return done(null, user);
				} else {
					return done(null, false, profile);
				}
			} catch (e) {
				console.error(e);
				return done(e);
			}
		}
	));

  app.use(passport.initialize());
  app.use(passport.session());
};
