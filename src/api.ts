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
