const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'edufit-secret-key-2024';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const token = authHeader.substring(7); // Remover 'Bearer '

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Conectar a MongoDB
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db('edufit');
        const users = db.collection('users');

        // Buscar usuario
        const user = await users.findOne({ _id: decoded.userId });
        if (!user) {
            await client.close();
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        await client.close();

        // Remover contraseña de la respuesta
        delete user.password;

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        console.error('Error en verificación:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
