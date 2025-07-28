"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAndAttachUser = void 0;
const express_jwt_1 = require("express-jwt");
const config_1 = require("../configs/config");
const excludedPathsFromMiddleware = [
    '/api/signUp',
    '/api/signIn'
];
const normalizedPaths = excludedPathsFromMiddleware.map((path) => path.replace(/\//g, ''));
const isExcludedPath = (requestPath) => {
    const normalizedRequestPath = requestPath.replace(/\//g, '');
    return normalizedPaths.some((path) => path === normalizedRequestPath);
};
const verifyAndAttachUser = (0, express_jwt_1.expressjwt)({
    // The secret used to sign the JWTs for verification
    secret: config_1.Configs.JWT_SECRET,
    // Function to extract the JWT token from the request
    getToken: (req) => {
        let token = '';
        // Check if the Authorization header is present and formatted as either 'Token' or 'Bearer'
        if ((req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Token') ||
            (req.headers.authorization &&
                req.headers.authorization.split(' ')[0] === 'Bearer')) {
            // Return the extracted JWT token
            token = req.headers.authorization.split(' ')[1];
        }
        return token;
    },
    algorithms: ['HS256'],
});
const authAndAttachUser = (req, res, next) => {
    if (isExcludedPath(req.path)) {
        next();
    }
    else {
        verifyAndAttachUser(req, res, next);
    }
};
exports.authAndAttachUser = authAndAttachUser;
