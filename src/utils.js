import passport from 'passport';
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';

const PRIVATE_KEY = 'CoderKeyQueFuncionaComoUnSecret';

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
      if(!req.user) return res.status(401).send({ message: 'Unauthorized' });
      if(req.user.role != role) 
          return res.status(403).send({ error: "No permissions" });
      next();
  }
};

export const generateToken = (user) => {
  const token = jwt.sign(user, PRIVATE_KEY, { expiresIn: '24h' });
  return token;
};

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename)