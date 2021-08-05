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
            assert.equal(validator.isValidPassword(''), false, 'empty');
            assert.equal(validator.isValidPassword(' '), false, 'space');
            assert.equal(validator.isValidPassword('a12B34567'), false, 'a12B34567');
            assert.equal(validator.isValidPassword('aB!@#$#$#$#$%'), false, 'aB!@#$#$#$#$%');
            assert.equal(validator.isValidUsername('df yvpoyroiyqwuryvvwyeorviyqwoieryoweqiry'), false, 'df yvpoyroiyqwuryvvwyeorviyqwoieryoweqir');
        });
        test('Validation test for valid dates', function () {
            assert.equal(validator.isValidDate('01/01/1900'), true, '01/01/1900');
            assert.equal(validator.isValidDate('01/02/0000'), true, '01/02/0000');
            assert.equal(validator.isValidDate('02/29/1940'), true, '02/29/1940');
            assert.equal(validator.isValidDate('11/11/2000'), true, '11/11/2000');
            assert.equal(validator.isValidDate('12/22/2020'), true, '12/22/2020');
            assert.equal(validator.isValidDate('02/01/1335'), true, '02/01/1335');
            assert.equal(validator.isValidDate('03/10/1995'), true, '03/10/1995');
            assert.equal(validator.isValidDate('04/30/1450'), true, '04/30/1450');
            assert.equal(validator.isValidDate('05/31/1777'), true, '05/31/1777');
            assert.equal(validator.isValidDate('06/17/1811'), true, '06/17/1811');
            assert.equal(validator.isValidDate('07/22/1269'), true, '07/22/1269');
            assert.equal(validator.isValidDate('08/15/1780'), true, '08/15/1780');
            assert.equal(validator.isValidDate('09/24/1902'), true, '09/24/1902');
            assert.equal(validator.isValidDate('10/18/1667'), true, '10/18/1667');
        });
        test('Validation test for invalid dates', function () {
            assert.equal(validator.isValidDate(''), false, 'empty');
            assert.equal(validator.isValidDate('au'), false, 'au');
            assert.equal(validator.isValidDate('abcde'), false, 'abcde');
            assert.equal(validator.isValidDate('99/01/2022'), false, '99/01/2022');
            assert.equal(validator.isValidDate('01/99/2022'), false, '01/99/2022');
            assert.equal(validator.isValidDate('01/01'), false, '01/01');
            assert.equal(validator.isValidDate('99/99/9999'), false, '99/99/9999');
            assert.equal(validator.isValidDate('111/11/2000'), false, '111/11/2000');
            assert.equal(validator.isValidDate('11/1221/2000'), false, '111/1221/2000');
        });
    })    
})