'use strict';

const chai = require('chai');
const assert = chai.assert;

const validator = require('../tools/serverValidation');

suite('Unit tests', function() {
    suite('Validation test', function(){
        test('Validation test for valid emails', function() {
            assert.equal(validator.isValidEmail('ex#$ample@mail.com'), true);
            assert.equal(validator.isValidEmail('example1231212@school.mail.edu'), true);
            assert.equal(validator.isValidEmail('e122x#$amp!#$%^&*le@mail.com'), true);
        });
        test('Validation test for invalid emails', function () {
            assert.equal(validator.isValidEmail('wqjeqklwehqnm1'), false);
            assert.equal(validator.isValidEmail('exa@mple@school.mail.edu'), false);
            assert.equal(validator.isValidEmail('@mail.com'), false);
            assert.equal(validator.isValidEmail('@@@@@@@@@@@'), false);
            assert.equal(validator.isValidEmail(''), false);
        });
        test('Validation test for valid usernames', function () {
            assert.equal(validator.isValidUsername('a123456'), true);
            assert.equal(validator.isValidUsername('example1231212'), true);
            assert.equal(validator.isValidUsername('e122xe'), true);
        });
        test('Validation test for invalid usernames', function () {
            assert.equal(validator.isValidUsername(''), false);
            assert.equal(validator.isValidUsername('au'), false);
            assert.equal(validator.isValidUsername('abcde'), false);
            assert.equal(validator.isValidUsername('abc__def'), false);
            assert.equal(validator.isValidUsername('_abcdef'), false);
            assert.equal(validator.isValidUsername('.abcdef'), false);
            assert.equal(validator.isValidUsername('-abcdef'), false);
            assert.equal(validator.isValidUsername('abcdef!'), false);
        });
        
    })    
})