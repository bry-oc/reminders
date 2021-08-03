const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../index.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('user login with invalid credentials', function(done) {
        chai.request(server)
            .post('/api/login')
            .type('form')
            .send({
                username: 'test_name',
                password: 'badpassword'
            })
            .end(function(err, res) {
                console.log(res.body);
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Login failed. Username or password did not match.');
                done();
            })
    });
    test('user login with missing credentials', function (done) {
        chai.request(server)
            .post('/api/login')
            .end(function (err, res) {
                console.log(res.body);
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Missing required field(s)!');
                done();
            })
    });
    test('user login with valid credentials', function (done) {
        chai.request(server)
            .post('/api/login')
            .type('form')
            .send({
                username: process.env.TEST_ACCOUNT,
                password: process.env.TEST_PASSWORD
            })
            .end(function (err, res) {
                console.log(res.body);
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Login failed. Username or password did not match.');
                done();
            })
    });
});