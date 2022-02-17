const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { user, taskThree, setupDB } = require('./fixtures/db')


describe('Task API tests', () => {

    beforeEach(setupDB)

    it('Check create task', async () => {
        const response = await request(app).post('/tasks')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send({
                description: 'From test'
            })
            .expect(201)
        const taskTest = await Task.findById(response.body._id)
        expect(taskTest.description).toEqual('From test')
        expect(taskTest.completed).toEqual(false)
    })

    it('Check get tasks for user', async () => {
        const response = await request(app).get('/tasks')
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(200)
        expect(response.body.length).toEqual(2)
    })

    it('Check non owner user cannot delete task', async () => {
        await request(app).delete(`/tasks/${taskThree._id}`)
            .set('Authorization', `Bearer ${user.tokens[0].token}`)
            .send()
            .expect(404)
        const task = await Task.find({_id: taskThree._id})
        expect(task).not.toBeNull()
    })
})