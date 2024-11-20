import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

const secretKey = process.env.JWT_SECRET_KEY || '';

// Middleware function for GraphQL context
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).send('Forbidden'); // Better to use res.status().send() for flexibility
      }

      req.user = user as JwtPayload;
      next();
    });
  } else {
    res.status(401).send('Unauthorized'); // Unauthorized
  }
};

// Auth middleware for GraphQL context
export const authenticateGraphQL = (context: { req: Request }) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    return jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        throw new Error('Forbidden'); // Throw an error for GraphQL to catch
      }

      return user as JwtPayload;
    });
  } else {
    throw new Error('Unauthorized'); // Throw an error for GraphQL to catch
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
