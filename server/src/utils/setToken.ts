import {Request, Response} from "express";

const jwt = require('jsonwebtoken');
const APP_SECRET = "keep_it_secret";

function getTokenPayload(token: string) {
  return jwt.verify(token, APP_SECRET);
}

export function getUserId(req: Request, res: Response) {
  if (req) {
    const authHeader = req.headers.cookie;
    if (authHeader) {
      let token = req?.headers?.cookie?.split('=')[1]

      if (!token) {
        throw new Error('No token found');
      }
      const {sub} = getTokenPayload(token);
      return sub;
    }
  }

  throw new Error('from set Token Not authenticated');
}
