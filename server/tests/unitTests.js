'use strict';

const chai = require('chai');
const assert = chai.assert;

const validator = require('../tools/serverValidation');

suite('Unit tests', function() {
    suite('Validation test', function(){
        test('Validation test for valid emails', function() {
            assert.equal(validator.isValidEmail('ex#$ample@mail.com'), true, 'ex#$ample@mail.com');
            assert.equal(validator.isValidEmail('example1231212@school.mail.edu'), true, 'example1231212@school.mail.edu');
            assert.equal(validator.isValidEmail('e122x#$amp!#$%^&*le@mail.com'), true, 'e122x#$amp!#$%^&*le@mail.com');
        });
        test('Validation test for invalid emails', function () {
            assert.equal(validator.isValidEmail('wqjeqklwehqnm1'), false, 'wqjeqklwehqnm1');
            assert.equal(validator.isValidEmail('exa@mple@school.mail.edu'), false, 'exa@mple@school.mail.edu');
            assert.equal(validator.isValidEmail('@mail.com'), false, '@mail.com');
            assert.equal(validator.isValidEmail('@@@@@@@@@@@'), false, '@@@@@@@@@@@');
            assert.equal(validator.isValidEmail(''), false, '');
        });
        test('Validation test for valid usernames', function () {
            assert.equal(validator.isValidUsername('a123456'), true, 'a123456');
            assert.equal(validator.isValidUsername('example1231212'), true, 'example1231212');
            assert.equal(validator.isValidUsername('e122xe'), true, 'e122xe');
        });
        test('Validation test for invalid usernames', function () {
            assert.equal(validator.isValidUsername(''), false, 'empty');
            assert.equal(validator.isValidUsername('au'), false, 'au');
            assert.equal(validator.isValidUsername('abcde'), false, 'abcde');
            assert.equal(validator.isValidUsername('abc__def'), false, 'abc__def');
            assert.equal(validator.isValidUsername('_abcdef'), false, '_abcdef');
            assert.equal(validator.isValidUsername('.abcdef'), false, '.abcdef');
            assert.equal(validator.isValidUsername('-abcdef'), false, '-abcdef');
            assert.equal(validator.isValidUsername('abcdef!'), false, 'abcdef!');
        });
        test('Validation test for valid passwords', function () {
            assert.equal(validator.isValidPassword('Ab!12345'), true, 'Ab!12345');
            assert.equal(validator.isValidPassword('asdazxcASASDqwewqneq!@12315@#$'), true, 'asdazxcASASDqwewqneq!@12315@#$');
            assert.equal(validator.isValidPassword('#$%&*@#$%&*^@!@#!123123hhajs23h43h32h324y@#h12c32132C(^c62382hgc3@&^c9*cbCB@^3@#'), true, '#$%&*@#$%&*^@!@#!123123hhajs23h43h32h324y@#h12c32132C(^c62382hgc3@&^c9*cbCB@^3@#');
        });
        test('Validation test for invalid passwords', function () {
            assert.equal(validator.isValidPassword('a1234567'), false, 'a1234567');
            assert.equal(validator.isValidPassword('example1231212'), false, 'example1231212');
            assert.equal(validator.isValidUsername(''), false, 'empty');
            assert.equal(validator.isValidUsername(' '), false, 'space');
            assert.equal(validator.isValidPassword('a12B34567'), false, 'a12B34567');
            assert.equal(validator.isValidPassword('aB!@#$#$#$#$%'), false, 'aB!@#$#$#$#$%');
            assert.equal(validator.isValidUsername('df yvpoyroiyqwuryvvwyeorviyqwoieryoweqiry'), false, 'df yvpoyroiyqwuryvvwyeorviyqwoieryoweqir');
        });
        
    })    
})