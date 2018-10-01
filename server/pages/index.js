import Router from 'koa-router';
import getUser from '../utils/getUser';

const router = new Router();

router
	.get('*', getUser(), async (ctx, next) => {
		await ctx.render('index');
	})
;

export default router.routes();
