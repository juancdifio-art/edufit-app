/**
 * EduFit API - User Model
 * Modelo de Usuario para MongoDB
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    lastname: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'El apellido no puede exceder 50 caracteres'],
        default: ''
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    birthdate: {
        type: Date,
        required: false,
        default: null
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para optimizar consultas
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });

// Método para obtener datos públicos del usuario (sin password)
userSchema.methods.toPublicJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);


