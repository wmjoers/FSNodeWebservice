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
