/**
 * EduFit API - Authentication Routes
 * Rutas de autenticación (login, registro)
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Middleware para validar email
const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
    try {
        console.log('📥 Datos recibidos en el backend:', req.body);
        const { name, lastname, birthdate, email, password } = req.body;

        // Validaciones
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un usuario con este email'
            });
        }

        // Encriptar contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear nuevo usuario
        const newUser = new User({
            name: name.trim(),
            lastname: lastname ? lastname.trim() : '',
            birthdate: birthdate ? (() => {
                // Crear fecha solo con día, sin hora
                if (typeof birthdate === 'string' && birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    // Formato YYYY-MM-DD - crear fecha local solo con día
                    const [year, month, day] = birthdate.split('-').map(Number);
                    return new Date(year, month - 1, day, 12, 0, 0, 0); // Hora fija 12:00 para evitar problemas de zona horaria
                } else {
                    // Para otros formatos, extraer solo la parte de fecha
                    const tempDate = new Date(birthdate);
                    if (!isNaN(tempDate.getTime())) {
                        return new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 12, 0, 0, 0);
                    }
                    return null;
                }
            })() : null,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        await newUser.save();
        console.log('💾 Usuario guardado en MongoDB:', newUser.toObject());

        // Generar token JWT
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: newUser.toPublicJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
        }

        // Buscar usuario
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Usuario desactivado'
            });
        }

        // Actualizar último login
        user.lastLogin = new Date();
        await user.save();

        // Generar token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: user.toPublicJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/auth/verify - Verificar token
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        res.json({
            success: true,
            data: {
                user: user.toPublicJSON()
            }
        });

    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
});

// Ruta para actualizar usuario
router.put('/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, lastname, birthdate, email } = req.body;
        
        console.log('🔄 Actualizando usuario:', { userId, name, lastname, birthdate, email });
        
        // Buscar el usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Actualizar campos si se proporcionan
        if (name !== undefined) user.name = name.trim();
        if (lastname !== undefined) user.lastname = lastname ? lastname.trim() : '';
        if (birthdate !== undefined) {
            if (birthdate) {
                // Crear fecha solo con día, sin hora
                if (typeof birthdate === 'string' && birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    // Formato YYYY-MM-DD - crear fecha local solo con día
                    const [year, month, day] = birthdate.split('-').map(Number);
                    user.birthdate = new Date(year, month - 1, day, 12, 0, 0, 0); // Hora fija 12:00 para evitar problemas de zona horaria
                } else {
                    // Para otros formatos, extraer solo la parte de fecha
                    const tempDate = new Date(birthdate);
                    if (!isNaN(tempDate.getTime())) {
                        user.birthdate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 12, 0, 0, 0);
                    } else {
                        user.birthdate = null;
                    }
                }
            } else {
                user.birthdate = null;
            }
        }
        if (email !== undefined) {
            // Verificar si el email ya existe en otro usuario
            const existingUser = await User.findOne({ 
                email: email.toLowerCase().trim(), 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un usuario con este email'
                });
            }
            user.email = email.toLowerCase().trim();
        }
        
        // Guardar cambios
        await user.save();
        
        console.log('✅ Usuario actualizado:', user.toObject());
        
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: {
                user: user.toPublicJSON()
            }
        });
        
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;


