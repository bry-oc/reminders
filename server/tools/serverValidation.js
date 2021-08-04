'use strict';

exports.isValidEmail = function(email) {
    //email address followed by service provider
    const filter = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+\.[a-z]{1,4}$/;
    return filter.test(email);
}

exports.isValidUsername = function(username) {
    //minimum length of 6 and max length of 20
    if (username.length < 6 || username.length > 20) {
        return false;
    }
    //alphanumeric with hyphens or underscores or periods as separators
    //two periods, hyphens, or underscores consecutively are not allowed
    //period, hyphen, or underscore at the start is not allowed 
    const filter = /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/;
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
    const filter = /^(?=.*[0-9])(?=.*[!@#$%^&*-._])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*-._]{8,}$/;
    return filter.test(password);
}

exports.isValidDate = function(date) {
    // MM/DD/YYYY format
    const filter = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}$/;
    return filter.test(date);
}

exports.isValidTime = function(time) {
    // HH:MM format
    const filter = /^(0?[1-9]|1[012])[:](0?[0-9]|[1-5][0-9])$/
    return filter.test(time);
}