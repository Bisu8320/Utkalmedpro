import { expressjwt,} from 'express-jwt';
import { Request, Response, NextFunction } from 'express';
import { Configs } from '../configs/config'


const excludedPathsFromMiddleware = [
	'/api/send-otp',
    '/api/verify-otp'
];

const normalizedPaths = excludedPathsFromMiddleware.map((path) =>
	path.replace(/\//g, ''),
);


const isExcludedPath = (requestPath: string): boolean => {
	const normalizedRequestPath = requestPath.replace(/\//g, '');
	return normalizedPaths.some((path) => path === normalizedRequestPath);
};

const verifyAndAttachUser = expressjwt({
	// The secret used to sign the JWTs for verification
	secret: Configs.JWT_SECRET,

	// Function to extract the JWT token from the request
	getToken: (req: Request) => {
		let token = '';
		// Check if the Authorization header is present and formatted as either 'Token' or 'Bearer'
		if (
			(req.headers.authorization &&
				req.headers.authorization.split(' ')[0] === 'Token') ||
			(req.headers.authorization &&
				req.headers.authorization.split(' ')[0] === 'Bearer')
		) {
			// Return the extracted JWT token
			token = req.headers.authorization.split(' ')[1];
		}
		return token;
	},

	algorithms: ['HS256'],
});



export const authAndAttachUser = (req: Request, res: Response, next: NextFunction) => {
    if (isExcludedPath(req.path)) {
        next();
    } else {
        verifyAndAttachUser(req, res, next);
    }
}