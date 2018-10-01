import sockets from './stack/00-socket';
import mongo from './stack/01-mongo';
import server from 'server';

export default async () => {
  return new Promise(async (resolve, reject) => {
    try {
    	sockets();
      await mongo();
      resolve();
    } catch (e) {
      console.log(e);
      console.log('Server has been closed');
      server.close();
      reject();
    }
  });
};
