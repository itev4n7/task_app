const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { user, userId, setupDB } = require('./fixtures/db')

describe('Users API tests', () => {

    beforeEach(setupDB)

    it('Check sing up user', async () => {
        const response = await request(app).post('/users')
            .send({
                name: 'Test User',
                email: 'example@email.com',
                password: 'MyPass777!'
            }).expect(201)

        const testUser = await User.findById(response.body.user._id)
        expect(testUser).not.toBeNull()

        expect(response.body).toMatchObject({
            user: {
                name: 'Test User',
                email: 'example@email.com'
            },
            token: testUser.tokens[0].token
        })
        expect(testUser.password).not.toBe('MyPass777!')
    })

    it('Check login user', async () => {
        const response = await request(app).post('/users/login')
            .send({
                email: user.email,
                password: user.password
            }).expect(200)
        const testUser = await User.findById(userId)
        expect(response.body.token).toBe(testUser.tokens[0].token)
    })

    it('Check login with wrong credentials', async () => {
        const wrongPassword = 'wrong_password'
        await request(app).post('/users/login')
            .send({
                email: user.email,
                password: wrongPassword
            }).expect(400)
    })

    it('Check get user profile', async () => {
        await request(app).get('/users/me')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(200)
    })

    it('Check cannot get user profile without auth token', async () => {
        await request(app).get('/users/me')
            .send()
            .expect(401)
    })

    it('Check close user account', async () => {
        await request(app).delete('/users/me')
            .send()
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .expect(200)
        const testUser = await User.findById(userId)
        expect(testUser).toBeNull()
    })

    it('Check cannot close user account without auth token', async () => {
        await request(app).delete('/users/me')
            .send()
            .expect(401)
    })

    it('Check uploading avatar image', async () => {
        await request(app).post('/users/me/avatar')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/avatar/profile-pic.jpg')
            .expect(200)
        const testUser = await User.findById(userId)
        expect(testUser.avatar).toEqual(expect.any(Buffer))
    })

    it('Check updating valid user fields', async () => {
        const updates = { name: 'Alex updated' }
        await request(app).patch('/users/me')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send(updates)
            .expect(200)
        const testUser = await User.findById(userId)
        expect(testUser.name).toEqual(updates.name)
    })

    it('Check updating invalid user fields', async () => {
        const updates = { city: 'LA' }
        await request(app).patch('/users/me')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send(updates)
            .expect(400)
        const testUser = await User.findById(userId)
        expect(testUser.name).toEqual(user.name)
    })

})