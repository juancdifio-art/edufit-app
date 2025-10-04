/**
 * EduFit API - Routine Model
 * Modelo de Rutina para MongoDB
 */

const mongoose = require('mongoose');

const exerciseInRoutineSchema = new mongoose.Schema({
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    sets: {
        type: Number,
        required: true,
        min: [1, 'Debe haber al menos 1 serie'],
        max: [20, 'No puede haber más de 20 series']
    },
    reps: {
        type: Number,
        required: true,
        min: [1, 'Debe haber al menos 1 repetición'],
        max: [1000, 'No puede haber más de 1000 repeticiones']
    },
    duration: {
        type: Number,
        min: [1, 'La duración debe ser al menos 1 minuto'],
        max: [60, 'La duración no puede exceder 60 minutos']
    },
    restTime: {
        type: Number,
        default: 30,
        min: [0, 'El tiempo de descanso no puede ser negativo'],
        max: [300, 'El tiempo de descanso no puede exceder 300 segundos']
    },
    notes: {
        type: String,
        maxlength: [200, 'Las notas no pueden exceder 200 caracteres']
    }
});

const routineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la rutina es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    category: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: ['Cardio', 'Fuerza', 'Flexibilidad', 'Mixta', 'Personalizada'],
        default: 'Personalizada'
    },
    intensity: {
        type: String,
        required: [true, 'La intensidad es requerida'],
        enum: ['Baja', 'Media', 'Alta'],
        default: 'Media'
    },
    estimatedDuration: {
        type: Number,
        required: [true, 'La duración estimada es requerida'],
        min: [1, 'La duración debe ser al menos 1 minuto'],
        max: [300, 'La duración no puede exceder 300 minutos']
    },
    exercises: [exerciseInRoutineSchema],
    isPublic: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUsed: {
        type: Date,
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Índices para optimizar consultas
routineSchema.index({ name: 1 });
routineSchema.index({ category: 1 });
routineSchema.index({ intensity: 1 });
routineSchema.index({ createdBy: 1 });
routineSchema.index({ isPublic: 1 });

// Método virtual para calcular la duración total
routineSchema.virtual('totalDuration').get(function() {
    return this.exercises.reduce((total, exercise) => {
        return total + (exercise.duration || 0);
    }, 0);
});

// Método para incrementar el contador de uso
routineSchema.methods.incrementUsage = function() {
    this.usageCount += 1;
    this.lastUsed = new Date();
    return this.save();
};

module.exports = mongoose.model('Routine', routineSchema);


