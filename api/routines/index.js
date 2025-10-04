const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'edufit-secret-key-2024';

// Función para verificar token
async function verifyToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Token no proporcionado');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
}

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const userId = await verifyToken(req);

        // Conectar a MongoDB
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db('edufit');
        const routines = db.collection('routines');

        switch (req.method) {
            case 'GET':
                // Obtener rutinas del usuario
                const userRoutines = await routines.find({ userId }).toArray();
                await client.close();
                
                res.status(200).json({
                    success: true,
                    data: userRoutines
                });
                break;

            case 'POST':
                // Crear nueva rutina
                const { nombre, objetivo, ejercicios, duracion } = req.body;

                if (!nombre || !objetivo || !ejercicios || !Array.isArray(ejercicios)) {
                    await client.close();
                    return res.status(400).json({ error: 'Datos de rutina incompletos' });
                }

                const newRoutine = {
                    nombre,
                    objetivo,
                    ejercicios,
                    duracion: duracion || 0,
                    userId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                const result = await routines.insertOne(newRoutine);
                await client.close();

                res.status(201).json({
                    success: true,
                    data: { ...newRoutine, id: result.insertedId }
                });
                break;

            case 'PUT':
                // Actualizar rutina
                const { id, ...updateData } = req.body;

                if (!id) {
                    await client.close();
                    return res.status(400).json({ error: 'ID de rutina requerido' });
                }

                const updateResult = await routines.updateOne(
                    { _id: id, userId },
                    { 
                        $set: { 
                            ...updateData, 
                            updatedAt: new Date() 
                        } 
                    }
                );

                await client.close();

                if (updateResult.matchedCount === 0) {
                    return res.status(404).json({ error: 'Rutina no encontrada' });
                }

                res.status(200).json({
                    success: true,
                    data: { message: 'Rutina actualizada correctamente' }
                });
                break;

            case 'DELETE':
                // Eliminar rutina
                const { id: deleteId } = req.query;

                if (!deleteId) {
                    await client.close();
                    return res.status(400).json({ error: 'ID de rutina requerido' });
                }

                const deleteResult = await routines.deleteOne({ _id: deleteId, userId });
                await client.close();

                if (deleteResult.deletedCount === 0) {
                    return res.status(404).json({ error: 'Rutina no encontrada' });
                }

                res.status(200).json({
                    success: true,
                    data: { message: 'Rutina eliminada correctamente' }
                });
                break;

            default:
                await client.close();
                res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('Error en rutinas:', error);
        if (error.message === 'Token no proporcionado') {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
