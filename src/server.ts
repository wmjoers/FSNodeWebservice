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
