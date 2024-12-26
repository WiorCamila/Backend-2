import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../utils.js';

const router = Router();
const SECRET_KEY = 'CoderKeyQueFuncionaComoUnSecret';

const users = [];
// Registro de usuario
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const exists = users.find(user => user.email === email);
    if (exists) 
        return res.status(406).send({ status: 'error', error: 'User already exists' });
    const user = {
        name,
        email,
        password
    };
    users.push(user);

    const access_token = generateToken(user);
    res.send({ status: 'success', access_token });
});

// Login de usuario
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) return res.status(408).send({ status: 'error', error: 'Invalid credentials' });

    const access_token = generateToken(user);
    res.send({ status: 'success', access_token });
});


// Middleware de autenticación
export const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Autenticación fallida' });
    }
};

// Ruta current
router.get('/current', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.status(200).json({ status: 'success', user });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;
