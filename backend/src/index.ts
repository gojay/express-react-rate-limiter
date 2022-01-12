import 'dotenv/config';

import { APP_PORT } from './config';

import server from './server';

server.listen(APP_PORT, () => {
	console.log(`Server is running at https://localhost:${APP_PORT}`);
});
