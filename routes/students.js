/**
 * EduFit API - Students Routes
 * Rutas para gestión de alumnos
 */

const express = require('express');
const Student = require('../models/Student');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/students - Obtener todos los alumnos del usuario
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 50, search, schedule, fitnessLevel } = req.query;
        
        // Construir filtros
        const filters = { createdBy: req.user._id };
        
        if (search) {
            filters.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (schedule) {
            filters.schedule = { $regex: schedule, $options: 'i' };
        }
        
        if (fitnessLevel) {
            filters.fitnessLevel = fitnessLevel;
        }

        const students = await Student.find(filters)
            .sort({ name: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Student.countDocuments(filters);

        res.json({
            success: true,
            data: students,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });

    } catch (error) {
        console.error('Error obteniendo alumnos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/students/:id - Obtener alumno por ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Alumno no encontrado'
            });
        }

        res.json({
            success: true,
            data: student
        });

    } catch (error) {
        console.error('Error obteniendo alumno:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/students - Crear nuevo alumno
router.post('/', async (req, res) => {
    try {
        console.log('📝 Datos recibidos para crear alumno:', req.body);
        
        const {
            name,
            email,
            birthDate,
            height,
            weight,
            schedule,
            fitnessLevel,
            observations
        } = req.body;

        // Validaciones
        console.log('🔍 Validando campos:', { name, email, birthDate, height, weight, schedule });
        
        if (!name || !email || !birthDate || !height || !weight || !schedule) {
            console.log('❌ Campos faltantes detectados');
            return res.status(400).json({
                success: false,
                message: 'Todos los campos requeridos deben ser proporcionados'
            });
        }

        // Validar email
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
        }

        // Verificar si ya existe un alumno con el mismo email del usuario
        const existingStudent = await Student.findOne({
            email: email.toLowerCase(),
            createdBy: req.user._id
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Ya tienes un alumno con este email'
            });
        }

        // Validar fecha de nacimiento
        const birth = new Date(birthDate);
        const today = new Date();
        
        // Verificar que la fecha sea válida
        if (isNaN(birth.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Fecha de nacimiento inválida'
            });
        }
        
        const age = today.getFullYear() - birth.getFullYear();
        
        if (age < 0 || age > 100) {
            return res.status(400).json({
                success: false,
                message: 'Fecha de nacimiento inválida'
            });
        }

        const newStudent = new Student({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            birthDate: birth,
            height: parseInt(height),
            weight: parseInt(weight),
            schedule: schedule.trim(),
            fitnessLevel: fitnessLevel || '',
            observations: observations ? observations.trim() : '',
            createdBy: req.user._id
        });

        console.log('💾 Guardando nuevo alumno:', newStudent);
        await newStudent.save();
        console.log('✅ Alumno guardado exitosamente');

        res.status(201).json({
            success: true,
            message: 'Alumno creado exitosamente',
            data: newStudent
        });

    } catch (error) {
        console.error('Error creando alumno:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// PUT /api/students/:id - Actualizar alumno
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Alumno no encontrado o no tienes permisos para editarlo'
            });
        }

        const {
            name,
            email,
            birthDate,
            height,
            weight,
            schedule,
            fitnessLevel,
            observations,
            isActive
        } = req.body;

        // Actualizar campos
        if (name) student.name = name.trim();
        if (email) {
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email inválido'
                });
            }
            student.email = email.toLowerCase().trim();
        }
        if (birthDate) {
            const birth = new Date(birthDate);
            const today = new Date();
            const age = today.getFullYear() - birth.getFullYear();
            
            if (age < 0 || age > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Fecha de nacimiento inválida'
                });
            }
            student.birthDate = birth;
        }
        if (height) student.height = parseInt(height);
        if (weight) student.weight = parseInt(weight);
        if (schedule) student.schedule = schedule.trim();
        if (fitnessLevel !== undefined) student.fitnessLevel = fitnessLevel;
        if (observations !== undefined) student.observations = observations.trim();
        if (isActive !== undefined) student.isActive = isActive;

        await student.save();

        res.json({
            success: true,
            message: 'Alumno actualizado exitosamente',
            data: student
        });

    } catch (error) {
        console.error('Error actualizando alumno:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// DELETE /api/students/:id - Eliminar alumno
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Alumno no encontrado o no tienes permisos para eliminarlo'
            });
        }

        await Student.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Alumno eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error eliminando alumno:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/students/stats/summary - Obtener estadísticas de alumnos
router.get('/stats/summary', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ createdBy: req.user._id });
        const activeStudents = await Student.countDocuments({ 
            createdBy: req.user._id, 
            isActive: true 
        });

        const fitnessLevelStats = await Student.aggregate([
            { $match: { createdBy: req.user._id } },
            { $group: { _id: '$fitnessLevel', count: { $sum: 1 } } }
        ]);

        const scheduleStats = await Student.aggregate([
            { $match: { createdBy: req.user._id } },
            { $group: { _id: '$schedule', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                total: totalStudents,
                active: activeStudents,
                inactive: totalStudents - activeStudents,
                fitnessLevels: fitnessLevelStats,
                schedules: scheduleStats
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas de alumnos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;


