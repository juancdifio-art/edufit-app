/**
 * EduFit API - Exercise Model
 * Modelo de Ejercicio para MongoDB
 */

const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del ejercicio es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    category: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: ['Cardio', 'Fuerza', 'Flexibilidad', 'Equilibrio', 'Funcional', 'Otro'],
        default: 'Otro'
    },
    intensity: {
        type: String,
        required: [true, 'La intensidad es requerida'],
        enum: ['Baja', 'Media', 'Alta'],
        default: 'Media'
    },
    duration: {
        type: Number,
        required: [true, 'La duración es requerida'],
        min: [1, 'La duración debe ser al menos 1 minuto'],
        max: [180, 'La duración no puede exceder 180 minutos']
    },
    instructions: {
        type: [String],
        default: []
    },
    equipment: {
        type: [String],
        default: []
    },
    muscleGroups: {
        type: [String],
        default: []
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // null para ejercicios por defecto
    }
}, {
    timestamps: true
});

// Índices para optimizar consultas
exerciseSchema.index({ name: 1 });
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ intensity: 1 });
exerciseSchema.index({ isDefault: 1 });
exerciseSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);


