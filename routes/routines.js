/**
 * EduFit API - Routines Routes
 * Rutas para gestión de rutinas
 */

const express = require('express');
const Routine = require('../models/Routine');
const Exercise = require('../models/Exercise');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/routines - Obtener todas las rutinas del usuario
router.get('/', async (req, res) => {
    try {
        const routines = await Routine.find({ createdBy: req.user._id })
            .populate('exercises.exerciseId', 'name description category intensity duration')
            .sort({ updatedAt: -1 });

        res.json({
            success: true,
            data: routines
        });

    } catch (error) {
        console.error('Error obteniendo rutinas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/routines/:id - Obtener rutina por ID
router.get('/:id', async (req, res) => {
    try {
        const routine = await Routine.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        }).populate('exercises.exerciseId', 'name description category intensity duration');

        if (!routine) {
            return res.status(404).json({
                success: false,
                message: 'Rutina no encontrada'
            });
        }

        res.json({
            success: true,
            data: routine
        });

    } catch (error) {
        console.error('Error obteniendo rutina:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/routines - Crear nueva rutina
router.post('/', async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            intensity,
            estimatedDuration,
            exercises,
            isPublic
        } = req.body;

        // Validaciones
        if (!name || !category || !intensity || !estimatedDuration || !exercises || !Array.isArray(exercises)) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos requeridos deben ser proporcionados'
            });
        }

        if (exercises.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'La rutina debe tener al menos un ejercicio'
            });
        }

        // Verificar si ya existe una rutina con el mismo nombre del usuario
        const existingRoutine = await Routine.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            createdBy: req.user._id
        });

        if (existingRoutine) {
            return res.status(400).json({
                success: false,
                message: 'Ya tienes una rutina con este nombre'
            });
        }

        // Validar que todos los ejercicios existan y pertenezcan al usuario o sean por defecto
        const exerciseIds = exercises.map(ex => ex.exerciseId);
        const validExercises = await Exercise.find({
            _id: { $in: exerciseIds },
            $or: [
                { isDefault: true },
                { createdBy: req.user._id }
            ]
        });

        if (validExercises.length !== exerciseIds.length) {
            return res.status(400).json({
                success: false,
                message: 'Uno o más ejercicios no son válidos'
            });
        }

        const newRoutine = new Routine({
            name: name.trim(),
            description: description ? description.trim() : '',
            category,
            intensity,
            estimatedDuration: parseInt(estimatedDuration),
            exercises: exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                sets: parseInt(ex.sets) || 1,
                reps: parseInt(ex.reps) || 1,
                duration: ex.duration ? parseInt(ex.duration) : undefined,
                restTime: parseInt(ex.restTime) || 30,
                notes: ex.notes ? ex.notes.trim() : ''
            })),
            isPublic: isPublic || false,
            createdBy: req.user._id
        });

        await newRoutine.save();

        // Poblar los ejercicios para la respuesta
        await newRoutine.populate('exercises.exerciseId', 'name description category intensity duration');

        res.status(201).json({
            success: true,
            message: 'Rutina creada exitosamente',
            data: newRoutine
        });

    } catch (error) {
        console.error('Error creando rutina:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// PUT /api/routines/:id - Actualizar rutina
router.put('/:id', async (req, res) => {
    try {
        const routine = await Routine.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!routine) {
            return res.status(404).json({
                success: false,
                message: 'Rutina no encontrada o no tienes permisos para editarla'
            });
        }

        const {
            name,
            description,
            category,
            intensity,
            estimatedDuration,
            exercises,
            isPublic
        } = req.body;

        // Actualizar campos
        if (name) routine.name = name.trim();
        if (description !== undefined) routine.description = description.trim();
        if (category) routine.category = category;
        if (intensity) routine.intensity = intensity;
        if (estimatedDuration) routine.estimatedDuration = parseInt(estimatedDuration);
        if (isPublic !== undefined) routine.isPublic = isPublic;

        // Actualizar ejercicios si se proporcionan
        if (exercises && Array.isArray(exercises)) {
            if (exercises.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La rutina debe tener al menos un ejercicio'
                });
            }

            // Validar ejercicios
            const exerciseIds = exercises.map(ex => ex.exerciseId);
            const validExercises = await Exercise.find({
                _id: { $in: exerciseIds },
                $or: [
                    { isDefault: true },
                    { createdBy: req.user._id }
                ]
            });

            if (validExercises.length !== exerciseIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Uno o más ejercicios no son válidos'
                });
            }

            routine.exercises = exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                sets: parseInt(ex.sets) || 1,
                reps: parseInt(ex.reps) || 1,
                duration: ex.duration ? parseInt(ex.duration) : undefined,
                restTime: parseInt(ex.restTime) || 30,
                notes: ex.notes ? ex.notes.trim() : ''
            }));
        }

        await routine.save();

        // Poblar los ejercicios para la respuesta
        await routine.populate('exercises.exerciseId', 'name description category intensity duration');

        res.json({
            success: true,
            message: 'Rutina actualizada exitosamente',
            data: routine
        });

    } catch (error) {
        console.error('Error actualizando rutina:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// DELETE /api/routines/:id - Eliminar rutina
router.delete('/:id', async (req, res) => {
    try {
        const routine = await Routine.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!routine) {
            return res.status(404).json({
                success: false,
                message: 'Rutina no encontrada o no tienes permisos para eliminarla'
            });
        }

        await Routine.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Rutina eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error eliminando rutina:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/routines/:id/use - Marcar rutina como usada
router.post('/:id/use', async (req, res) => {
    try {
        const routine = await Routine.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!routine) {
            return res.status(404).json({
                success: false,
                message: 'Rutina no encontrada'
            });
        }

        await routine.incrementUsage();

        res.json({
            success: true,
            message: 'Rutina marcada como usada',
            data: {
                usageCount: routine.usageCount,
                lastUsed: routine.lastUsed
            }
        });

    } catch (error) {
        console.error('Error marcando rutina como usada:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;


