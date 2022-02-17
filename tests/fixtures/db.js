const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userId = new mongoose.Types.ObjectId()
const user = {
    _id: userId,
    name: 'Test Login User',
    email: 'example_test@email.com',
    password: 'MyTest777!',
    tokens: [{
        token: jwt.sign({ _id: userId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Test Login User Next',
    email: 'example_next@email.com',
    password: 'MyTestN777!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}
const task = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test description',
    completed: false,
    owner: user._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test description two',
    completed: true,
    owner: user._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'test description three',
    completed: true,
    owner: userTwo._id
}


const setupDB = async () => {
    await User.deleteMany({})
    await Task.deleteMany({})
    await new User(user).save()
    await new User(userTwo).save()
    await new Task(task).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userId,
    user,
    taskThree,
    setupDB
}