const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const { expect } = chai;
const server = require('../index.js');
const cookieParser = require('cookie-parser');

chai.use(chaiHttp);

const agent = chai.request.agent(server);

suite('User login tests', function() {
        test('user login with invalid credentials', function(done) {
            chai.request(server)
                .post('/api/login')
                .type('form')
                .send({
                    username: 'test_name',
                    password: 'badpassword'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Login failed. Username or password did not match.');
                    done();
                })
        });
        test('user login with missing credentials', function(done) {
            chai.request(server)
                .post('/api/login')
                .end(function (err, res) {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Missing required field(s)!');
                    done();
                })
        });
        test('user login with valid credentials', function(done) {
            chai.request(server)
                .post('/api/login')
                .type('form')
                .send({
                    username: process.env.TEST_ACCOUNT,
                    password: process.env.TEST_PASSWORD
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.success, true);
                    assert.equal(res.body.message, 'Login was successful.');
                    done();
                })
        });
});

suite('Reminders tests', function () {    
    test('create reminder with missing required fields', function (done) {
        agent.post('/api/login')
            .type('form')
            .send({
                username: process.env.TEST_ACCOUNT,
                password: process.env.TEST_PASSWORD
            })
            .end(function(req, res) {
                agent.post('/api/reminder/create')
                    .end(function(err, res){
                        assert.equal(res.status, 400);      
                        assert.equal(res.body.error, 'Missing required field(s)!');          
                        done();
                    })    
            })        
    });
    test('create reminder with valid fields', function (done) {
        agent.post('/api/login')
            .type('form')
            .send({
                username: process.env.TEST_ACCOUNT,
                password: process.env.TEST_PASSWORD
            })
            .end(function (req, res) {
                agent.post('/api/reminder/create')
                    .type('form')
                    .send({
                        reminderName: "test_reminder",
                        reminderDate: "01/02/2022",
                        reminderTime: "02:30",
                        timezone: 0
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.success, true);
                        assert.exists(res.body.reminderid);
                        done();
                    })
            })
    });
});
