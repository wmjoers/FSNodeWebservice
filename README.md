# From Scratch - Node.js webservice

## CLI tools
* Node Version Manager (nvm)
* Node.js (node, npm, npx)
## Base repository
* https://github.com/wmjoers/FSNodeApp/
## Node.js packages
* Express (express, @types/express, cors)
* Supertest (supertest, @types/supertest)
--- 
## Install Node Version Manager (nvm)
Read more about how to install nvm here: https://github.com/nvm-sh/nvm

This is an example of how to install nvm on MacOS:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
```
nvm --version
```
---
## Install Node.js (node, npm, npx)
```
nvm install --lts
nvm ls
nvm use 18
```
```
node --version
npm --version
```
---
## Clone FSNodeApp
```
mkdir FSNodeWebservice
git clone https://github.com/wmjoers/FSNodeApp.git FSNodeWebservice
cd FSNodeWebservice
rm -rf .git
npm install
npm run test
```
Edit the file package.json to change name, version and description.

Read more aboute package.json here: https://docs.npmjs.com/cli/v9/configuring-npm/package-json

---
# Install Node.js packages
```
npm install express
npm install @types/express --save-dev
npm install cors
npm install @types/cors --save-dev
npm install supertest --save-dev
npm install @types/supertest --save-dev
```
---

## Edit .env
Clear the file and add the following line:
```
PORT=3001
```
---
## Create and edit api.ts
Add the following:
```
import express, { Request, Response } from 'express';

const routes = express.Router();

// Redirect root to /version
routes.get('/', (_req: Request, res: Response): void => {
    res.redirect('/version');
});

// Return JSON-object with current package version
routes.get('/version', (_req: Request, res: Response): void => {
    const version =  process.env.npm_package_version;
    res.json({version});
});

export default routes;
```
---
## Create and edit server.ts
Add the following:
```
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import routes from './api';

const server = express();

// Add body parsers
server.use(express.urlencoded({extended: true}));
server.use(express.json());

// Add CORS policy handler
server.use(cors());

// Add API routes
server.use('/', routes);

// Handle not found error
server.use((req, res) => {
    console.log(`404: ${req.url}`);
    return res.status(404).send();
});

// Handle all other errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`500: ${err.message}`);
    console.error(err);
    return res.status(500).send();
});

export default server;
```
---

## Edit index.ts
Clear the file and add the following:
```
import dotenv from 'dotenv';
import server from './server';

// Get portnumber from .env file
dotenv.config();
const port = Number(process.env.PORT);

// Start server
server.listen(port, () => {
    console.log(`Webservice ${process.env.npm_package_version} running on port : ${port}`);
}).on('error', (e) => console.error(e));
```
---

## Edit tests/first.test.ts
Clear the file and add the following:
```
import request from 'supertest';
import server from '../server';

test('Get correct version', async () => {
    const res = await request(server)
        .get('/version')
        .expect(200);

    expect(res.body.version).toBe(process.env.npm_package_version);
});

test('Get redirection from root', async () => {
    const res = await request(server)
        .get('/')
        .expect(302);

    expect(res.headers.location).toBe('/version');
});

test('Get invalid path', async () => {
    await request(server)
        .get('/does_not_exist')
        .expect(404);
});
```
