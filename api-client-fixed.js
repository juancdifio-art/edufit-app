/**
 * Cliente API para EduFit
 * Configurado para funcionar con Vercel
 */

class EduFitAPI {
    constructor() {
        // Detectar si estamos en producción (Vercel) o desarrollo
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        
        if (isProduction) {
            // URL base para Vercel - cambiar por la URL real de tu backend en Vercel
            this.baseURL = 'https://tu-backend-en-vercel.vercel.app/api';
        } else {
            // Para desarrollo local
            this.baseURL = 'http://localhost:3000/api';
        }
        
        console.log('🌐 Modo:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
        console.log('🔗 URL base:', this.baseURL);
        
        this.token = localStorage.getItem('edufit_token');
    }

    /**
     * Realiza una petición HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        console.log('🌐 Haciendo petición:', endpoint, options);
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Agregar token si está disponible
        if (this.token && !endpoint.includes('/register') && !endpoint.includes('/login')) {
            config.headers.Authorization = `Bearer ${this.token}`;
            console.log('🔑 Token enviado en headers:', this.token.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No hay token disponible para esta petición');
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error HTTP:', response.status, errorText);
                throw new Error(errorText || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Respuesta exitosa:', data);
            return data;
        } catch (error) {
            console.error('❌ Error en petición API:', error);
            throw error;
        }
    }

    /**
     * Registra un nuevo usuario
     */
    async register(userData) {
        console.log('📝 Registrando usuario:', userData);
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Inicia sesión
     */
    async login(credentials) {
        console.log('🔐 Iniciando sesión:', credentials);
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }
        
        return response;
    }

    /**
     * Verifica el token actual
     */
    async verifyToken() {
        console.log('🔍 Verificando token...');
        return await this.request('/auth/verify');
    }

    /**
     * Actualiza datos del usuario
     */
    async updateUser(userData) {
        console.log('✏️ Actualizando usuario:', userData);
        return await this.request('/auth/update', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Obtiene todos los ejercicios
     */
    async getExercises() {
        console.log('💪 Obteniendo ejercicios...');
        return await this.request('/exercises');
    }

    /**
     * Crea un nuevo ejercicio
     */
    async createExercise(exerciseData) {
        console.log('➕ Creando ejercicio:', exerciseData);
        return await this.request('/exercises', {
            method: 'POST',
            body: JSON.stringify(exerciseData)
        });
    }

    /**
     * Obtiene las rutinas del usuario
     */
    async getUserRoutines() {
        console.log('📋 Obteniendo rutinas del usuario...');
        return await this.request('/routines');
    }

    /**
     * Crea una nueva rutina
     */
    async createRoutine(routineData) {
        console.log('📝 Creando rutina:', routineData);
        return await this.request('/routines', {
            method: 'POST',
            body: JSON.stringify(routineData)
        });
    }

    /**
     * Obtiene todos los estudiantes
     */
    async getStudents() {
        console.log('👥 Obteniendo estudiantes...');
        return await this.request('/students');
    }

    /**
     * Crea un nuevo estudiante
     */
    async createStudent(studentData) {
        console.log('👤 Creando estudiante:', studentData);
        return await this.request('/students', {
            method: 'POST',
            body: JSON.stringify(studentData)
        });
    }

    /**
     * Actualiza un estudiante
     */
    async updateStudent(studentId, studentData) {
        console.log('✏️ Actualizando estudiante:', studentId, studentData);
        return await this.request(`/students/${studentId}`, {
            method: 'PUT',
            body: JSON.stringify(studentData)
        });
    }

    /**
     * Elimina un estudiante
     */
    async deleteStudent(studentId) {
        console.log('🗑️ Eliminando estudiante:', studentId);
        return await this.request(`/students/${studentId}`, {
            method: 'DELETE'
        });
    }

    /**
     * Establece el token de autenticación
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('edufit_token', token);
        console.log('🔑 Token guardado');
    }

    /**
     * Limpia el token de autenticación
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('edufit_token');
        console.log('🧹 Token limpiado');
    }

    /**
     * Verifica si hay un token válido
     */
    hasToken() {
        return !!this.token;
    }
}

// Crear instancia global
window.EduFitAPI = new EduFitAPI();

console.log('🚀 EduFitAPI cargado y listo');
console.log('🌐 URL base:', window.EduFitAPI.baseURL);
