import config from 'config';
import path from 'path';

const DIRS = {};
DIRS.main = path.resolve();
DIRS.public = path.resolve('public');
const ENV = config.get('env');
const ADDRESS = config.get('address');
const MONGO = config.get('mongo');
const JWT = config.get('jwt');
const VK = config.get('vk');
const INTERVALS = config.get('intervals');
const CORS = config.get('cors');

export {
	DIRS,
	ENV,
  ADDRESS,
	MONGO,
	JWT,
	VK,
	CORS,
  INTERVALS,
};
