const request = require('supertest');
const app = require('../index'); // Path to your Express app

describe('POST /api/v1.0/login', () => {
    it('should return 200 and tokens if login is successful', async () => {
        const userCredentials = {
            email: "phaithoun003@gmail.com",
            password: "password example"
        };

        const response = await request(app)
            .post('/api/v1.0/login')
            .send(userCredentials)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'user login successfully');
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
        expect(response.body.data).toHaveProperty('user_id');
    });

    it('should return 403 if password is incorrect', async () => {
        const response = await request(app)
            .post('/api/v1.0/login')
            .send({
                email: 'phaithoun003@gmail.com',
                password: 'password123'
            })
            .expect('Content-Type', /json/)
            .expect(403);

        expect(response.body).toHaveProperty('message', 'Email or Password is not valid');
        expect(response.body).toHaveProperty('success', false);
    });
    it('should return 403 if email is incorrect', async () => {
        const userCredentials = {
            email: 'wronguser@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/v1.0/login')
            .send(userCredentials)
            .expect('Content-Type', /json/)
            .expect(403);

        expect(response.body).toHaveProperty('message', 'Invalid login credentials');
        expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 if email is missing', async () => {
        const response = await request(app)
            .post('/api/v1.0/login')
            .send({
                password: 'password123'
            })
            .expect('Content-Type', /json/)
            .expect(422);

        expect(response.body).toHaveProperty('message', 'Email or password is required');
        expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 if password is missing', async () => {
        const response = await request(app)
            .post('/api/v1.0/login')
            .send({
                email: 'testuser@example.com'
            })
            .expect('Content-Type', /json/)
            .expect(422);

        expect(response.body).toHaveProperty('message', 'Email or password is required');
        expect(response.body).toHaveProperty('success', false);
    });

});


describe('POST /api/v1.0/register', () => {

    it('should return 400 if email missing', async () => {

        const response = await request(app)
            .post('/api/v1.0/register')
            .send({
                email: '',
                OTP: ""
            })
            .expect('Content-Type', /json/)
            .expect(400);
        expect(response.body).toHaveProperty('message', "please fill data");
        expect(response.body).toHaveProperty('success', false);
    })
    it('should return 400 if OTP missing', async () => {

        const response = await request(app)
            .post('/api/v1.0/register')
            .send({
                email: 'phaithoun003@gmail.com',
                OTP: ""
            })
            .expect('Content-Type', /json/)
            .expect(400);
        expect(response.body).toHaveProperty('message', "please fill data");
        expect(response.body).toHaveProperty('success', false);
    })

});

