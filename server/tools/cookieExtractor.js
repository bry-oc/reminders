'use strict';

const jwt = require('jsonwebtoken');

exports.cookieExtractor = function(req) {
    let token;
    if(req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
}