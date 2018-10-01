import { MONGO } from 'configuration';
import mongooseConnector from '../../utils/mongoose-connector.js';

export default async () => {
  process.stdout.write('MongoDB...');
  const intProcess = setInterval(() => process.stdout.write('.'), 200);
  try {
	  await mongooseConnector(MONGO);
	  clearInterval(intProcess);
	  process.stdout.write('connected\n');
	} catch (e) {
		clearInterval(intProcess);
		process.stdout.write('error\n');
		throw e;
	}
};
