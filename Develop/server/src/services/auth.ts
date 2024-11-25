import type { Request } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

const secretKey = process.env.JWT_SECRET_KEY ?? '';

// Middleware function for GraphQL context
export const authenticateToken = ({ req }: any) => {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If the token is sent in the authorization header, extract the token from the header
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  // If no token is provided, return the request object as is
  if (!token) {
    return req;
  }

  // Try to verify the token
  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY ?? '', { maxAge: '2hr' });
    // If the token is valid, attach the user data to the request object
    req.user = data;
  } catch (err) {
    // If the token is invalid, log an error message
    console.log('Invalid token');
  }

  // Return the request object
  return req;
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
