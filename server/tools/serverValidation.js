'use strict';

exports.isValidEmail = function(email) {
    //email address followed by service provider
    const filter = /^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~.]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+\.[a-z]{1,4}$/;
    return filter.test(email);
}

exports.isValidUsername = function(username) {
    //minimum length of 6 and max length of 20
    if (username.length < 6 || username.length > 20) {
        return false;
    }
    //alphanumeric minimun length of 6 and max of 20
    const filter = /^[A-Za-z0-9]+$/;
    return filter.test(username);
}

exports.isValidPassword = function(password) {
    //minimum length of 8
    if (password.length < 8) {
        return false;
    }
    //alphanumeric and special characters
    //must contain atleast 
    //one lowercase
    //one uppercase
    //one special character
    //one number
    const filter = /^(?=.*[0-9])(?=.*[!#$%&'*+-/=?^_`{|}~@();:'"<>\\])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~@();:'"<>\\]{8,}$/;
    return filter.test(password);
}

exports.isValidDate = function(date) {
    // YYYY/MM/DD format
    const filter = /^\d{4}[\/|\-](0?[1-9]|1[012])[\/|\-](0?[1-9]|[12][0-9]|3[01])$/;
    return filter.test(date);
}

exports.isValidTime = function(time) {
    // HH:MM format
    const filter = /^(0?[0-9]|1[0-9]|2[0-3])[:](0?[0-9]|[1-5][0-9])$/
    return filter.test(time);
}

exports.isValidTimestamp = function(time) {
    const filter = /^(\d+)$/
    return filter.test(time);
}

exports.isValidReminderID = function(reminderid) {
    const filter = /^(\d+)$/
    return filter.test(reminderid);
}