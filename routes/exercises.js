/**
 * EduFit API - Exercises Routes
 * Rutas para gestión de ejercicios
 */

const express = require('express');
const Exercise = require('../models/Exercise');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/exercises - Obtener todos los ejercicios (por defecto + del usuario)
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find({
            $or: [
                { isDefault: true },
                { createdBy: req.user._id }
            ]
        }).sort({ name: 1 });

        res.json({
            success: true,
            data: exercises
        });

    } catch (error) {
        console.error('Error obteniendo ejercicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/exercises/default - Obtener solo ejercicios por defecto
router.get('/default', async (req, res) => {
    try {
        const exercises = await Exercise.find({ isDefault: true }).sort({ name: 1 });

        res.json({
            success: true,
            data: exercises
        });

    } catch (error) {
        console.error('Error obteniendo ejercicios por defecto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/exercises/custom - Obtener solo ejercicios personalizados del usuario
router.get('/custom', async (req, res) => {
    try {
        const exercises = await Exercise.find({ 
            createdBy: req.user._id 
        }).sort({ name: 1 });

        res.json({
            success: true,
            data: exercises
        });

    } catch (error) {
        console.error('Error obteniendo ejercicios personalizados:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/exercises/:id - Obtener ejercicio por ID
router.get('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findOne({
            _id: req.params.id,
            $or: [
                { isDefault: true },
                { createdBy: req.user._id }
            ]
        });

        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Ejercicio no encontrado'
            });
        }

        res.json({
            success: true,
            data: exercise
        });

    } catch (error) {
        console.error('Error obteniendo ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/exercises - Crear nuevo ejercicio personalizado
router.post('/', async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            intensity,
            duration,
            instructions,
            equipment,
            muscleGroups
        } = req.body;

        // Validaciones
        if (!name || !description || !category || !intensity || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos requeridos deben ser proporcionados'
            });
        }

        // Verificar si ya existe un ejercicio con el mismo nombre del usuario
        const existingExercise = await Exercise.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            createdBy: req.user._id
        });

        if (existingExercise) {
            return res.status(400).json({
                success: false,
                message: 'Ya tienes un ejercicio con este nombre'
            });
        }

        const newExercise = new Exercise({
            name: name.trim(),
            description: description.trim(),
            category,
            intensity,
            duration: parseInt(duration),
            instructions: instructions || [],
            equipment: equipment || [],
            muscleGroups: muscleGroups || [],
            createdBy: req.user._id
        });

        await newExercise.save();

        res.status(201).json({
            success: true,
            message: 'Ejercicio creado exitosamente',
            data: newExercise
        });

    } catch (error) {
        console.error('Error creando ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// PUT /api/exercises/:id - Actualizar ejercicio personalizado
router.put('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Ejercicio no encontrado o no tienes permisos para editarlo'
            });
        }

        const {
            name,
            description,
            category,
            intensity,
            duration,
            instructions,
            equipment,
            muscleGroups
        } = req.body;

        // Actualizar campos
        if (name) exercise.name = name.trim();
        if (description) exercise.description = description.trim();
        if (category) exercise.category = category;
        if (intensity) exercise.intensity = intensity;
        if (duration) exercise.duration = parseInt(duration);
        if (instructions) exercise.instructions = instructions;
        if (equipment) exercise.equipment = equipment;
        if (muscleGroups) exercise.muscleGroups = muscleGroups;

        await exercise.save();

        res.json({
            success: true,
            message: 'Ejercicio actualizado exitosamente',
            data: exercise
        });

    } catch (error) {
        console.error('Error actualizando ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// DELETE /api/exercises/:id - Eliminar ejercicio personalizado
router.delete('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Ejercicio no encontrado o no tienes permisos para eliminarlo'
            });
        }

        await Exercise.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Ejercicio eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error eliminando ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;


