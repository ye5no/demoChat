import Router from 'koa-router';
import authController from './auth-controller.js';
import userController from './user-controller.js';
import getUser from '../../utils/getUser.js';

const router = new Router({ prefix: '/user' });

router
  .post('/signup', getUser(), authController.signup)
  .post('/login', getUser(), authController.login)
  .get('/logout', getUser(), authController.logout)
	.get('/vk', getUser(), authController.vk)
	.get('/vk/callback', authController.vkCallback)

  .get('/', getUser(), userController.currentUser)
	.post('/history', getUser(), userController.history)
	.post('/message', getUser(), userController.message)
	.get('/online', getUser(), userController.online)

  ;

export default router.routes();

