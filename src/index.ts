import dotenv from 'dotenv';
import server from './server';

// Get portnumber from .env file
dotenv.config();
const port = Number(process.env.PORT);

// Start server
server.listen(port, () => {
    console.log(`Webservice ${process.env.npm_package_version} running on port : ${port}`);
}).on('error', (e) => console.error(e));
