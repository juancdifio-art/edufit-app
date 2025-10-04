/**
 * EduFit API - Student Model
 * Modelo de Alumno para MongoDB
 */

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del alumno es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    birthDate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es requerida'],
        validate: {
            validator: function(date) {
                const today = new Date();
                const age = today.getFullYear() - date.getFullYear();
                return age >= 0 && age <= 100;
            },
            message: 'La fecha de nacimiento debe ser válida'
        }
    },
    height: {
        type: Number,
        required: [true, 'La altura es requerida'],
        min: [50, 'La altura debe ser al menos 50 cm'],
        max: [250, 'La altura no puede exceder 250 cm']
    },
    weight: {
        type: Number,
        required: [true, 'El peso es requerido'],
        min: [10, 'El peso debe ser al menos 10 kg'],
        max: [300, 'El peso no puede exceder 300 kg']
    },
    schedule: {
        type: String,
        required: [true, 'El horario es requerido'],
        trim: true,
        maxlength: [100, 'El horario no puede exceder 100 caracteres']
    },
    fitnessLevel: {
        type: String,
        enum: ['Principiante', 'Intermedio', 'Avanzado', ''],
        default: ''
    },
    observations: {
        type: String,
        trim: true,
        maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Índices para optimizar consultas
studentSchema.index({ name: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ createdBy: 1 });
studentSchema.index({ isActive: 1 });

// Método virtual para calcular la edad
studentSchema.virtual('age').get(function() {
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
});

// Método virtual para calcular el IMC
studentSchema.virtual('bmi').get(function() {
    const heightInMeters = this.height / 100;
    return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

module.exports = mongoose.model('Student', studentSchema);


