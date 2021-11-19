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
            assert.equal(validator.isValidDate('1900/01/01'), true, '1900/01/01');
            assert.equal(validator.isValidDate('0000/01/02'), true, '0000/01/02');
            assert.equal(validator.isValidDate('1940/02/09'), true, '1940/02/09');
            assert.equal(validator.isValidDate('2000/11/11'), true, '2000/11/11');
            assert.equal(validator.isValidDate('2020/12/22'), true, '2020/12/22');
            assert.equal(validator.isValidDate('1335/02/01'), true, '1335/02/01');
            assert.equal(validator.isValidDate('1995/03/10'), true, '1995/03/10');
            assert.equal(validator.isValidDate('1450/04/30'), true, '1450/04/30');
            assert.equal(validator.isValidDate('1777/05/31'), true, '1777/05/31');
            assert.equal(validator.isValidDate('1811/06/17'), true, '1811/06/17');
            assert.equal(validator.isValidDate('1269/07/22'), true, '1269/07/22');
            assert.equal(validator.isValidDate('1780/08/15'), true, '1780/08/15');
            assert.equal(validator.isValidDate('1902/09/24'), true, '1902/09/24');
            assert.equal(validator.isValidDate('1667/10/18'), true, '1667/10/18');
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
        test('Validation test for valid times', function() {
            assert.equal(validator.isValidTime('01:00'), true, '01:10');
            assert.equal(validator.isValidTime('02:12'), true, '02:12');
            assert.equal(validator.isValidTime('03:23'), true, '03:23');
            assert.equal(validator.isValidTime('04:35'), true, '04:35');
            assert.equal(validator.isValidTime('05:45'), true, '05:45');
            assert.equal(validator.isValidTime('06:58'), true, '06:58');
            assert.equal(validator.isValidTime('07:50'), true, '07:50');
            assert.equal(validator.isValidTime('08:27'), true, '08:27');
            assert.equal(validator.isValidTime('09:38'), true, '09:38');
            assert.equal(validator.isValidTime('10:02'), true, '10:02');
            assert.equal(validator.isValidTime('11:08'), true, '11:08');
            assert.equal(validator.isValidTime('12:59'), true, '12:59');
        });
        test('Validation test for invalid times', function () {
            assert.equal(validator.isValidTime(''), false, 'empty');
            assert.equal(validator.isValidTime('101:10'), false, '101:10');
            assert.equal(validator.isValidTime('01-45'), false, '01-45');
            assert.equal(validator.isValidTime('10-30-00'), false, '10-30-00');
            assert.equal(validator.isValidTime('10:60'), false, '10:60');
        });
        test('Validation test for valid timestamps', function () {
            assert.equal(validator.isValidTimestamp(189489794), true, '189489794');
            assert.equal(validator.isValidTimestamp(789877), true, '789877');
            assert.equal(validator.isValidTimestamp(1), true, '1');
            assert.equal(validator.isValidTimestamp(54640045045045), true, '54640045045045');
        });
        test('Validation test for invalid timestamps', function () {
            assert.equal(validator.isValidTimestamp(-189489794), false, '-189489794');
            assert.equal(validator.isValidTimestamp("nmsdfasdz"), false, 'nmsdfasdz');
            assert.equal(validator.isValidTimestamp("eleven"), false, 'eleven');
        });
        test('Validation test for valid reminder ids', function () {
            assert.equal(validator.isValidReminderID(189489794), true, '189489794');
            assert.equal(validator.isValidReminderID(789877), true, '789877');
            assert.equal(validator.isValidReminderID(1), true, '1');
            assert.equal(validator.isValidReminderID(54640045045045), true, '54640045045045');
        });
        test('Validation test for invalid reminder ids', function () {
            assert.equal(validator.isValidReminderID(-189489794), false, '-189489794');
            assert.equal(validator.isValidReminderID("nmsdfasdz"), false, 'nmsdfasdz');
            assert.equal(validator.isValidReminderID("eleven"), false, 'eleven');
        });
    })    
})