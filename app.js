/* ===================================
   APLICACIÓN EDUFIT - GESTIÓN LOCAL
   ===================================
   
   Este archivo maneja toda la lógica de la aplicación:
   - Autenticación local con LocalStorage
   - Navegación entre pantallas
   - Validación de formularios
   - Gestión de sesiones
   
   Preparado para futura migración a Firebase
   =================================== */

// ===================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ===================================

// Claves para el almacenamiento local
const STORAGE_KEYS = {
    USERS: 'edufit_users',           // Array de usuarios registrados
    CURRENT_USER: 'edufit_current_user',  // Usuario actualmente logueado
    EXERCISES: 'edufit_exercises',   // Array de ejercicios disponibles
    ROUTINES: 'edufit_routines',     // Array de rutinas creadas
    STUDENTS: 'edufit_students'      // Array de estudiantes por profesor
};

// Referencias a elementos del DOM que usaremos frecuentemente
const DOM_ELEMENTS = {
    // Contenedores principales
    authContainer: document.getElementById('auth-container'),
    dashboardContainer: document.getElementById('dashboard-container'),
    loadingOverlay: document.getElementById('loading-overlay'),
    
    // Formularios
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginFormContainer: document.getElementById('login-form'),
    registerFormContainer: document.getElementById('register-form'),
    
    // Inputs de login
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    
    // Inputs de registro
    registerName: document.getElementById('register-name'),
    registerLastname: document.getElementById('register-lastname'),
    registerEmail: document.getElementById('register-email'),
    registerPassword: document.getElementById('register-password'),
    registerBirthdate: document.getElementById('register-birthdate'),
    
    // Elementos de navegación
    showRegisterLink: document.getElementById('show-register'),
    showLoginLink: document.getElementById('show-login'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Elementos de error
    loginError: document.getElementById('login-error'),
    registerError: document.getElementById('register-error'),
    
    // Elementos del dashboard
    userNameHeader: document.getElementById('user-name-header'),
    displayName: document.getElementById('display-name'),
    displayLastname: document.getElementById('display-lastname'),
    displayEmail: document.getElementById('display-email'),
    displayBirthdate: document.getElementById('display-birthdate'),
    displayAge: document.getElementById('display-age'),
    currentDate: document.getElementById('current-date'),
    
    // Elementos para editar perfil completo
    editProfileBtn: document.getElementById('edit-profile-btn'),
    saveProfileBtn: document.getElementById('save-profile-btn'),
    cancelProfileBtn: document.getElementById('cancel-profile-btn'),
    editNameInput: document.getElementById('edit-name'),
    editLastnameInput: document.getElementById('edit-lastname'),
    editEmailInput: document.getElementById('edit-email'),
    editBirthdateInput: document.getElementById('edit-birthdate'),
    
    // Elementos de crear rutinas
    createRoutineContainer: document.getElementById('create-routine-container'),
    btnCrearRutinas: document.getElementById('btn-crear-rutinas'),
    btnAddExercise: document.getElementById('btn-add-exercise'),
    btnBackDashboard: document.getElementById('btn-back-dashboard'),
    logoutBtnRoutine: document.getElementById('logout-btn-routine'),
    
    // Elementos de ver rutinas
    viewRoutinesContainer: document.getElementById('view-routines-container'),
    btnVerRutinas: document.getElementById('btn-ver-rutinas'),
    btnBackDashboardView: document.getElementById('btn-back-dashboard-view'),
    logoutBtnView: document.getElementById('logout-btn-view'),
    
    // Formulario de rutina básica
    routineName: document.getElementById('routine-name'),
    routineIntensity: document.getElementById('routine-intensity'),
    routineDescription: document.getElementById('routine-description'),
    
    // Selector de ejercicios
    exercisesList: document.getElementById('exercises-list'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Rutina en construcción
    selectedExercisesList: document.getElementById('selected-exercises-list'),
    routineExerciseCount: document.getElementById('routine-exercise-count'),
    routineEstimatedTime: document.getElementById('routine-estimated-time'),
    btnPreviewRoutine: document.getElementById('btn-preview-routine'),
    btnSaveRoutine: document.getElementById('btn-save-routine'),
    
    // Elementos de ver rutinas - estadísticas y controles
    totalRoutines: document.getElementById('total-routines'),
    routineSelector: document.getElementById('routine-selector'),
    intensityFilter: document.getElementById('intensity-filter'),
    btnCreateNewRoutine: document.getElementById('btn-create-new-routine'),
    btnCreateFirstRoutine: document.getElementById('btn-create-first-routine'),
    
    // Lista de rutinas y modal
    routinesList: document.getElementById('routines-list'),
    noRoutinesMessage: document.getElementById('no-routines-message'),
    routineDetailsModal: document.getElementById('routine-details-modal'),
    modalRoutineTitle: document.getElementById('modal-routine-title'),
    modalRoutineContent: document.getElementById('modal-routine-content'),
    closeModal: document.getElementById('close-modal'),
    btnPrintRoutine: document.getElementById('btn-print-routine'),
    btnEditRoutine: document.getElementById('btn-edit-routine'),
    
    // Pantalla de agregar ejercicio
    addExerciseContainer: document.getElementById('add-exercise-container'),
    backToDashboardFromAddExercise: document.getElementById('back-to-dashboard-from-add-exercise'),
    btnLogoutFromAddExercise: document.getElementById('btn-logout-from-add-exercise'),
    addExerciseForm: document.getElementById('add-exercise-form'),
    exerciseName: document.getElementById('exercise-name'),
    exerciseDescription: document.getElementById('exercise-description'),
    exerciseCategory: document.getElementById('exercise-category'),
    exerciseIcon: document.getElementById('exercise-icon'),
    exerciseType: document.getElementById('exercise-type'),
    exerciseDefaultSeries: document.getElementById('exercise-default-series'),
    exerciseDefaultValue: document.getElementById('exercise-default-value'),
    exerciseDefaultRest: document.getElementById('exercise-default-rest'),
    btnCancelExercise: document.getElementById('btn-cancel-exercise'),
    btnSaveExercise: document.getElementById('btn-save-exercise'),
    
    // Vista previa del ejercicio
    exercisePreviewIcon: document.querySelector('.exercise-preview-icon'),
    exercisePreviewName: document.querySelector('.exercise-preview-name'),
    exercisePreviewCategory: document.querySelector('.exercise-preview-category'),
    exercisePreviewDescription: document.querySelector('.exercise-preview-description'),
    previewSeries: document.getElementById('preview-series'),
    previewValue: document.getElementById('preview-value'),
    previewRest: document.getElementById('preview-rest'),
    previewValueType: document.getElementById('preview-value-type'),
    valueLabel: document.getElementById('value-label'),
    valueHelp: document.getElementById('value-help'),
    
    // Pantalla de gestión de estudiantes
    studentManagementContainer: document.getElementById('student-management-container'),
    btnGestionEstudiantes: document.getElementById('btn-gestion-estudiantes'),
    backToDashboardFromStudents: document.getElementById('back-to-dashboard-from-students'),
    btnLogoutFromStudents: document.getElementById('btn-logout-from-students'),
    addStudentForm: document.getElementById('add-student-form'),
    studentName: document.getElementById('student-name'),
    studentLastname: document.getElementById('student-lastname'),
    studentBirthdate: document.getElementById('student-birthdate'),
    studentGrade: document.getElementById('student-grade'),
    studentHeight: document.getElementById('student-height'),
    studentWeight: document.getElementById('student-weight'),
    studentMedicalConditions: document.getElementById('student-medical-conditions'),
    studentObservations: document.getElementById('student-observations'),
    studentFitnessLevel: document.getElementById('student-fitness-level'),
    studentParticipation: document.getElementById('student-participation'),
    btnCancelStudent: document.getElementById('btn-cancel-student'),
    btnSaveStudent: document.getElementById('btn-save-student'),
    studentsList: document.getElementById('students-list'),
    studentsCount: document.getElementById('students-count'),
    filterGrade: document.getElementById('filter-grade'),
    filterFitness: document.getElementById('filter-fitness'),
    btnClearFilters: document.getElementById('btn-clear-filters'),
    noStudentsMessage: document.getElementById('no-students-message'),
    
    // Notificaciones
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notification-text'),
    notificationClose: document.getElementById('notification-close')
};

// ===================================
// VARIABLES GLOBALES DE ESTADO
// ===================================

// Estado de edición de rutinas
let isEditingRoutine = false;
let editingRoutineId = null;
let editingRoutineData = null;

// Estado de gestión de estudiantes
let isEditingStudent = false;
let editingStudentId = null;
let editingStudentData = null;

// ===================================
// FUNCIONES DE UTILIDAD
// ===================================

/**
 * Muestra u oculta el overlay de carga
 * @param {boolean} show - Si debe mostrar (true) u ocultar (false) el loading
 */
function showLoading(show = true) {
    if (show) {
        DOM_ELEMENTS.loadingOverlay.classList.remove('hidden');
    } else {
        DOM_ELEMENTS.loadingOverlay.classList.add('hidden');
    }
}

/**
 * Muestra una notificación al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación ('success', 'error', 'info')
 */
function showNotification(message, type = 'success') {
    const notification = DOM_ELEMENTS.notification;
    const notificationText = DOM_ELEMENTS.notificationText;
    
    // Configurar el mensaje
    notificationText.textContent = message;
    
    // Aplicar estilos según el tipo
    notification.className = 'notification';
    if (type === 'error') {
        notification.style.background = '#ff6b6b';
    } else if (type === 'info') {
        notification.style.background = '#667eea';
    } else {
        notification.style.background = '#4caf50';
    }
    
    // Mostrar la notificación
    notification.classList.remove('hidden');
    
    // Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}

/**
 * Muestra un mensaje de error en un formulario específico
 * @param {string} formType - 'login' o 'register'
 * @param {string} message - Mensaje de error
 */
function showFormError(formType, message) {
    const errorElement = formType === 'login' ? DOM_ELEMENTS.loginError : DOM_ELEMENTS.registerError;
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

/**
 * Oculta los mensajes de error de los formularios
 */
function hideFormErrors() {
    DOM_ELEMENTS.loginError.classList.add('hidden');
    DOM_ELEMENTS.registerError.classList.add('hidden');
}

/**
 * Calcula la edad basada en la fecha de nacimiento
 * @param {string} birthdate - Fecha en formato YYYY-MM-DD
 * @returns {number} Edad en años
 */
function calculateAge(birthdate) {
    if (!birthdate) {
        return 'No especificada';
    }
    
    // Crear fechas solo con día, sin hora
    let birth;
    if (typeof birthdate === 'string' && birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Formato YYYY-MM-DD - crear fecha local solo con día
        const [year, month, day] = birthdate.split('-').map(Number);
        birth = new Date(year, month - 1, day, 12, 0, 0, 0); // Hora fija 12:00
    } else {
        // Para otros formatos, extraer solo la parte de fecha
        const tempDate = new Date(birthdate);
        if (!isNaN(tempDate.getTime())) {
            birth = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 12, 0, 0, 0);
        } else {
            return 'Fecha inválida';
        }
    }
    
    // Verificar si la fecha es válida
    if (isNaN(birth.getTime())) {
        return 'Fecha inválida';
    }
    
    // Crear fecha actual solo con día
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0);
    
    let age = todayDate.getFullYear() - birth.getFullYear();
    const monthDiff = todayDate.getMonth() - birth.getMonth();
    
    // Ajustar si aún no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && todayDate.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Formatea una fecha para mostrarla de manera legible
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
function formatDate(dateString) {
    if (!dateString) {
        return 'No especificada';
    }
    
    // Crear fecha solo con día, sin hora
    let date;
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Formato YYYY-MM-DD - crear fecha local solo con día
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day, 12, 0, 0, 0); // Hora fija 12:00 para evitar problemas de zona horaria
    } else {
        // Para otros formatos, extraer solo la parte de fecha
        const tempDate = new Date(dateString);
        if (!isNaN(tempDate.getTime())) {
            date = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 12, 0, 0, 0);
        } else {
            return 'Fecha inválida';
        }
    }
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
        return 'Fecha inválida';
    }
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
}

// ===================================
// EJERCICIOS DE EJEMPLO
// ===================================

/**
 * Ejercicios predefinidos para cargar en la aplicación
 * Incluye ejercicios variados con diferentes tipos de series
 */
const DEFAULT_EXERCISES = [
    {
        id: 'ejercicio_1',
        nombre: 'Flexiones de brazos',
        descripcion: 'Ejercicio básico para fortalecer pecho, hombros y tríceps',
        categoria: 'Fuerza',
        tipoSerie: 'repeticiones',
        seriesPorDefecto: { series: 3, valor: 12, descanso: 60 },
        icono: '💪'
    },
    {
        id: 'ejercicio_2',
        nombre: 'Sentadillas',
        descripcion: 'Ejercicio fundamental para piernas y glúteos',
        categoria: 'Fuerza',
        tipoSerie: 'repeticiones',
        seriesPorDefecto: { series: 4, valor: 15, descanso: 45 },
        icono: '🦵'
    },
    {
        id: 'ejercicio_3',
        nombre: 'Plancha abdominal',
        descripcion: 'Isométrico para core y estabilidad',
        categoria: 'Core',
        tipoSerie: 'tiempo',
        seriesPorDefecto: { series: 3, valor: 30, descanso: 30 },
        icono: '🏃‍♂️'
    },
    {
        id: 'ejercicio_4',
        nombre: 'Jumping Jacks',
        descripcion: 'Ejercicio cardiovascular de cuerpo completo',
        categoria: 'Cardio',
        tipoSerie: 'repeticiones',
        seriesPorDefecto: { series: 3, valor: 20, descanso: 30 },
        icono: '🤸‍♂️'
    },
    {
        id: 'ejercicio_5',
        nombre: 'Mountain Climbers',
        descripcion: 'Ejercicio dinámico para cardio y core',
        categoria: 'Cardio',
        tipoSerie: 'tiempo',
        seriesPorDefecto: { series: 4, valor: 45, descanso: 60 },
        icono: '🏔️'
    },
    {
        id: 'ejercicio_6',
        nombre: 'Burpees',
        descripcion: 'Ejercicio completo que combina fuerza y cardio',
        categoria: 'Funcional',
        tipoSerie: 'repeticiones',
        seriesPorDefecto: { series: 3, valor: 8, descanso: 90 },
        icono: '🔥'
    },
    {
        id: 'ejercicio_7',
        nombre: 'Abdominales',
        descripcion: 'Ejercicio clásico para fortalecer el abdomen',
        categoria: 'Core',
        tipoSerie: 'repeticiones',
        seriesPorDefecto: { series: 3, valor: 20, descanso: 45 },
        icono: '💥'
    },
    {
        id: 'ejercicio_8',
        nombre: 'Trote en el lugar',
        descripcion: 'Ejercicio cardiovascular de bajo impacto',
        categoria: 'Cardio',
        tipoSerie: 'tiempo',
        seriesPorDefecto: { series: 3, valor: 120, descanso: 60 },
        icono: '🏃‍♀️'
    }
];

/**
 * Niveles de intensidad para las rutinas
 */
const INTENSITY_LEVELS = {
    BAJA: {
        name: 'Baja',
        description: 'Intensidad suave, ideal para comenzar',
        color: '#4caf50',
        multiplier: 0.7 // Reduce series/tiempo por defecto
    },
    MEDIA: {
        name: 'Media',
        description: 'Intensidad moderada, equilibrada',
        color: '#ff9800',
        multiplier: 1.0 // Mantiene valores por defecto
    },
    ALTA: {
        name: 'Alta',
        description: 'Intensidad elevada, para experimentados',
        color: '#f44336',
        multiplier: 1.4 // Aumenta series/tiempo por defecto
    }
};

// ===================================
// GESTIÓN DE ALMACENAMIENTO LOCAL
// ===================================

/**
 * Obtiene todos los usuarios registrados del LocalStorage
 * @returns {Array} Array de usuarios
 */
async function getStoredUsers() {
    try {
        // Solo usar la API - no fallback a LocalStorage
        const response = await EduFitAPI.verifyToken();
        if (response.success) {
            return [response.data.user];
        }
        return [];
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        return [];
    }
}

/**
 * Guarda un nuevo usuario en el LocalStorage
 * @param {Object} user - Objeto usuario con todos sus datos
 */
async function saveUser(user) {
    try {
        // Solo usar la API - no fallback a LocalStorage
        const response = await EduFitAPI.register(user);
        console.log('✅ Usuario registrado via API:', response);
        return response;
    } catch (error) {
        console.error('❌ Error registrando usuario:', error);
        throw error;
    }
}

/**
 * Verifica si un email ya está registrado
 * @param {string} email - Email a verificar
 * @returns {boolean} true si el email ya existe
 */
async function emailExists(email) {
    // La API maneja la validación de email duplicado automáticamente
    return false;
}

/**
 * Busca un usuario por email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object|null} Usuario encontrado o null
 */
async function findUser(email, password) {
    try {
        if (typeof EduFitAPI === 'undefined') {
            console.error('EduFitAPI no está disponible');
            return null;
        }
        // Solo usar la API - no fallback a LocalStorage
        const response = await EduFitAPI.login({ email, password });
        if (response.success) {
            // El token ya se guarda automáticamente en EduFitAPI.login
            console.log('✅ Login exitoso, token guardado');
            return response.data.user;
        }
        return null;
    } catch (error) {
        console.error('Error en login:', error);
        return null;
    }
}

/**
 * Guarda el usuario actual en la sesión
 * @param {Object} user - Usuario a guardar en la sesión
 */
function setCurrentUser(user) {
    // Guardamos sin la contraseña por seguridad
    const userToStore = { ...user };
    delete userToStore.password;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userToStore));
}

/**
 * Obtiene el usuario actual de la sesión
 * @returns {Object|null} Usuario actual o null
 */
function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
}

/**
 * Elimina la sesión actual (logout)
 */
function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// ===================================
// GESTIÓN DE EJERCICIOS
// ===================================

/**
 * Inicializa los ejercicios por defecto si no existen
 */
async function initializeDefaultExercises() {
    try {
        const existingExercises = await getStoredExercises();
        if (existingExercises.length === 0) {
            // Insertar ejercicios por defecto en MongoDB
            for (const exercise of DEFAULT_EXERCISES) {
                await saveExercise(exercise);
            }
            console.log('✅ Ejercicios por defecto inicializados en MongoDB');
        }
    } catch (error) {
        console.error('Error inicializando ejercicios por defecto:', error);
    }
}

/**
 * Obtiene todos los ejercicios del LocalStorage
 * @returns {Array} Array de ejercicios
 */
async function getStoredExercises() {
    try {
        if (typeof EduFitAPI === 'undefined') {
            console.error('EduFitAPI no está disponible');
            return [];
        }
        const response = await EduFitAPI.getExercises();
        return response.data || [];
    } catch (error) {
        console.error('Error obteniendo ejercicios:', error);
        return [];
    }
}

/**
 * Guarda un nuevo ejercicio en el LocalStorage
 * @param {Object} exercise - Objeto ejercicio
 */
async function saveExercise(exercise) {
    try {
        if (typeof EduFitAPI === 'undefined') {
            console.error('EduFitAPI no está disponible');
            throw new Error('EduFitAPI no está disponible');
        }
        
        // Mapear datos del frontend al formato del servidor
        const exerciseData = {
            name: exercise.nombre || exercise.name,
            description: exercise.descripcion || exercise.description,
            category: exercise.categoria || exercise.category || 'Fuerza',
            intensity: 'Media', // Valor por defecto
            duration: 30, // Valor por defecto en minutos
            instructions: [],
            equipment: [],
            muscleGroups: [],
            isDefault: true
        };
        
        const response = await EduFitAPI.createExercise(exerciseData);
        console.log('✅ Ejercicio guardado:', response.data.name);
        return response;
    } catch (error) {
        console.error('Error guardando ejercicio:', error);
        throw error;
    }
}

/**
 * Busca un ejercicio por ID
 * @param {string} exerciseId - ID del ejercicio
 * @returns {Object|null} Ejercicio encontrado o null
 */
async function findExerciseById(exerciseId) {
    try {
        console.log('🔍 Buscando ejercicio con ID:', exerciseId);
        const exercises = await getStoredExercises();
        console.log('📋 Ejercicios disponibles:', exercises.map(ex => ({ id: ex._id || ex.id, name: ex.name || ex.nombre })));
        
        const found = exercises.find(ex => (ex._id === exerciseId) || (ex.id === exerciseId));
        console.log('🎯 Ejercicio encontrado:', found);
        return found || null;
    } catch (error) {
        console.error('Error buscando ejercicio:', error);
        return null;
    }
}

/**
 * Guarda un nuevo ejercicio personalizado
 * @param {Object} exerciseData - Datos del ejercicio
 * @returns {Object} Ejercicio guardado con ID generado
 */
async function saveCustomExercise(exerciseData) {
    try {
        // Generar ID único
        const timestamp = Date.now();
        const exerciseId = `custom_${timestamp}`;
        
        // Crear objeto ejercicio en el formato que espera el servidor
        const newExercise = {
            name: exerciseData.name.trim(),
            description: exerciseData.description.trim(),
            category: exerciseData.category,
            intensity: exerciseData.intensity,
            duration: exerciseData.duration,
            instructions: exerciseData.instructions,
            equipment: exerciseData.equipment,
            muscleGroups: exerciseData.muscleGroups
        };
        
        // Guardar en MongoDB
        await saveExercise(newExercise);
        
        console.log('✅ Ejercicio personalizado guardado:', newExercise);
        return newExercise;
    } catch (error) {
        console.error('Error guardando ejercicio personalizado:', error);
        throw error;
    }
}

/**
 * Obtiene todos los ejercicios personalizados del usuario actual
 * @returns {Array} Array de ejercicios personalizados
 */
async function getCurrentUserCustomExercises() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const allExercises = await getStoredExercises();
    return allExercises.filter(exercise => 
        exercise.esPersonalizado && exercise.creadorId === currentUser.email
    );
}

/**
 * Valida los datos de un ejercicio antes de guardar
 * @param {Object} exerciseData - Datos del ejercicio a validar
 * @returns {Object} Resultado de validación { isValid: boolean, errors: Array }
 */
async function validateExerciseData(exerciseData) {
    const errors = [];
    
    // Validar nombre
    if (!exerciseData.name || exerciseData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (exerciseData.name && exerciseData.name.trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    }
    
    // Validar descripción
    if (!exerciseData.description || exerciseData.description.trim().length < 5) {
        errors.push('La descripción debe tener al menos 5 caracteres');
    }
    
    if (exerciseData.description && exerciseData.description.trim().length > 500) {
        errors.push('La descripción no puede exceder 500 caracteres');
    }
    
    // Validar categoría
    const validCategories = ['Cardio', 'Fuerza', 'Flexibilidad', 'Equilibrio', 'Funcional', 'Otro'];
    if (!exerciseData.category || !validCategories.includes(exerciseData.category)) {
        errors.push('Debe seleccionar una categoría válida');
    }
    
    // Validar intensidad
    const validIntensities = ['Baja', 'Media', 'Alta'];
    if (!exerciseData.intensity || !validIntensities.includes(exerciseData.intensity)) {
        errors.push('La intensidad debe ser Baja, Media o Alta');
    }
    
    // Validar duración
    if (!exerciseData.duration || exerciseData.duration < 1 || exerciseData.duration > 180) {
        errors.push('La duración debe estar entre 1 y 180 minutos');
    }
    
    // Validar nombre duplicado
    const existingExercises = await getStoredExercises();
    const duplicateName = existingExercises.some(ex => 
        ex.name && ex.name.toLowerCase() === exerciseData.name.trim().toLowerCase()
    );
    if (duplicateName) {
        errors.push('Ya existe un ejercicio con este nombre');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ===================================
// GESTIÓN DE RUTINAS
// ===================================

/**
 * Obtiene todas las rutinas del LocalStorage
 * @returns {Array} Array de rutinas
 */
async function getStoredRoutines() {
    try {
        if (typeof EduFitAPI === 'undefined') {
            console.error('EduFitAPI no está disponible');
            return [];
        }
        const response = await EduFitAPI.getRoutines();
        return response.data || [];
    } catch (error) {
        console.error('Error obteniendo rutinas:', error);
        return [];
    }
}

/**
 * Guarda una nueva rutina en el LocalStorage
 * @param {Object} routine - Objeto rutina
 */
async function saveRoutine(routine) {
    try {
        const response = await EduFitAPI.createRoutine(routine);
        console.log('✅ Rutina guardada:', response.data.name);
        return response;
    } catch (error) {
        console.error('Error guardando rutina:', error);
        throw error;
    }
}

/**
 * Obtiene rutinas del usuario actual
 * @returns {Array} Array de rutinas del usuario
 */
async function getCurrentUserRoutines() {
    try {
        const response = await EduFitAPI.getRoutines();
        return response.data || [];
    } catch (error) {
        console.error('Error obteniendo rutinas:', error);
        return [];
    }
}

/**
 * Genera un ID único para rutinas
 * @returns {string} ID único
 */
function generateRoutineId() {
    return 'rutina_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Actualiza una rutina existente en el storage
 * @param {Object} updatedRoutine - Rutina con los datos actualizados
 */
async function updateRoutine(routineId, updatedRoutine) {
    try {
        if (typeof EduFitAPI === 'undefined') {
            console.error('EduFitAPI no está disponible');
            return;
        }
        await EduFitAPI.updateRoutine(routineId, updatedRoutine);
        console.log('✅ Rutina actualizada en MongoDB:', routineId);
    } catch (error) {
        console.error('Error actualizando rutina:', error);
        throw error;
    }
}

/**
 * Resetea el estado de edición de rutinas
 */
function resetEditingState() {
    isEditingRoutine = false;
    editingRoutineId = null;
    editingRoutineData = null;
    
    // Restaurar título y botón original
    const titleElement = document.querySelector('#create-routine-container h1');
    if (titleElement) {
        titleElement.textContent = '📝 Crear Nueva Rutina';
    }
    
    if (DOM_ELEMENTS.btnSaveRoutine) {
        DOM_ELEMENTS.btnSaveRoutine.innerHTML = '💾 Guardar Rutina';
    }
    
    console.log('🔄 Estado de edición reseteado');
}

// ===================================
// NAVEGACIÓN ENTRE PANTALLAS - RUTINAS
// ===================================

/**
 * Oculta todas las pantallas de la aplicación
 */
function hideAllScreens() {
    DOM_ELEMENTS.dashboardContainer.classList.add('hidden');
    DOM_ELEMENTS.createRoutineContainer.classList.add('hidden');
    DOM_ELEMENTS.viewRoutinesContainer.classList.add('hidden');
    DOM_ELEMENTS.addExerciseContainer.classList.add('hidden');
    DOM_ELEMENTS.studentManagementContainer.classList.add('hidden');
    
    // Cerrar modal si está abierto
    if (DOM_ELEMENTS.routineDetailsModal && !DOM_ELEMENTS.routineDetailsModal.classList.contains('hidden')) {
        closeRoutineModal();
    }
}

/**
 * Muestra la pantalla de crear rutinas
 */
async function showCreateRoutineScreen() {
    console.log('🏗️ Navegando a: Crear Rutina');
    
    // Ocultar todas las pantallas primero
    hideAllScreens();
    
    // Mostrar solo la pantalla de crear rutinas
    DOM_ELEMENTS.createRoutineContainer.classList.remove('hidden');
    DOM_ELEMENTS.createRoutineContainer.classList.add('fade-in');
    
    // Inicializar la pantalla de crear rutinas
    await initializeCreateRoutineScreen();
}

/**
 * Vuelve al dashboard desde crear rutinas
 */
function backToDashboard() {
    console.log('🏠 Navegando a: Dashboard');
    
    // Ocultar todas las pantallas primero
    hideAllScreens();
    
    // Mostrar solo el dashboard
    DOM_ELEMENTS.dashboardContainer.classList.remove('hidden');
    DOM_ELEMENTS.dashboardContainer.classList.add('fade-in');
    
    // Limpiar formulario de rutina
    clearRoutineForm();
    
    // Resetear estado de edición si está activo
    if (isEditingRoutine) {
        resetEditingState();
    }
}

/**
 * Inicializa la pantalla de crear rutinas
 */
async function initializeCreateRoutineScreen() {
    // Cargar ejercicios disponibles
    loadAvailableExercises();
    
    // Limpiar rutina en construcción
    await clearRoutineBuilder();
    
    // Activar filtro "todos" por defecto
    await setActiveFilter('todos');
}

/**
 * Limpia el formulario de crear rutina
 */
async function clearRoutineForm() {
    DOM_ELEMENTS.routineName.value = '';
    DOM_ELEMENTS.routineIntensity.value = '';
    DOM_ELEMENTS.routineDescription.value = '';
    await clearRoutineBuilder();
}

/**
 * Limpia la rutina en construcción
 */
async function clearRoutineBuilder() {
    currentRoutineExercises = [];
    await updateRoutineBuilder();
    updateRoutineButtons();
}

// ===================================
// GESTIÓN DE EJERCICIOS EN LA UI
// ===================================

// Variable global para almacenar ejercicios seleccionados
let currentRoutineExercises = [];

/**
 * Carga y muestra todos los ejercicios disponibles
 */
async function loadAvailableExercises() {
    const exercises = await getStoredExercises();
    displayExercises(exercises);
}

/**
 * Muestra ejercicios en la interfaz
 * @param {Array} exercises - Array de ejercicios a mostrar
 */
function displayExercises(exercises) {
    const exercisesContainer = DOM_ELEMENTS.exercisesList;
    
    if (exercises.length === 0) {
        exercisesContainer.innerHTML = `
            <div class="empty-exercises">
                <p>😅 No hay ejercicios disponibles</p>
            </div>
        `;
        return;
    }
    
    exercisesContainer.innerHTML = exercises.map(exercise => {
        // Adaptar estructura del servidor al formato esperado por el frontend
        const adaptedExercise = {
            id: exercise._id || exercise.id,
            nombre: exercise.name || exercise.nombre,
            categoria: exercise.category || exercise.categoria,
            descripcion: exercise.description || exercise.descripcion,
            icono: exercise.icon || exercise.icono || '💪',
            tipoSerie: exercise.type || exercise.tipoSerie || 'repeticiones',
            seriesPorDefecto: exercise.seriesPorDefecto || {
                series: 3,
                valor: 12,
                descanso: 60
            }
        };
        
        console.log('🎨 Creando tarjeta para ejercicio:', { 
            originalId: exercise._id || exercise.id, 
            adaptedId: adaptedExercise.id, 
            name: adaptedExercise.nombre 
        });
        
        return `
            <div class="exercise-card" data-exercise-id="${adaptedExercise.id}">
                <div class="exercise-category">${adaptedExercise.categoria}</div>
                <div class="exercise-header">
                    <span class="exercise-icon">${adaptedExercise.icono}</span>
                    <span class="exercise-name">${adaptedExercise.nombre}</span>
                </div>
                <div class="exercise-description">${adaptedExercise.descripcion}</div>
                <div class="exercise-defaults">
                    <span><strong>Por defecto:</strong> ${adaptedExercise.seriesPorDefecto.series} series</span>
                    <span><strong>${adaptedExercise.tipoSerie === 'repeticiones' ? 'Reps' : 'Tiempo'}:</strong> 
                        ${adaptedExercise.seriesPorDefecto.valor}${adaptedExercise.tipoSerie === 'tiempo' ? 's' : ''}
                    </span>
                    <span><strong>Descanso:</strong> ${adaptedExercise.seriesPorDefecto.descanso}s</span>
                </div>
            </div>
        `;
    }).join('');
    
    // Agregar event listeners a las tarjetas de ejercicios
    exercisesContainer.querySelectorAll('.exercise-card').forEach(card => {
        card.addEventListener('click', () => {
            const exerciseId = card.dataset.exerciseId;
            console.log('🖱️ Click en ejercicio con ID:', exerciseId);
            toggleExerciseSelection(exerciseId);
        });
    });
}

/**
 * Alterna la selección de un ejercicio
 * @param {string} exerciseId - ID del ejercicio
 */
async function toggleExerciseSelection(exerciseId) {
    console.log('🔄 Toggle exercise selection:', exerciseId);
    const exercise = await findExerciseById(exerciseId);
    console.log('🔍 Exercise found:', exercise);
    if (!exercise) {
        console.log('❌ Exercise not found');
        return;
    }
    
    const existingIndex = currentRoutineExercises.findIndex(ex => ex.ejercicioId === exerciseId);
    
    if (existingIndex >= 0) {
        // Quitar ejercicio
        currentRoutineExercises.splice(existingIndex, 1);
    } else {
        // Agregar ejercicio con valores por defecto ajustados por intensidad
        const intensityLevel = DOM_ELEMENTS.routineIntensity.value || 'MEDIA';
        const multiplier = INTENSITY_LEVELS[intensityLevel].multiplier;
        
        // Adaptar estructura del ejercicio para obtener valores por defecto
        const defaultSeries = exercise.seriesPorDefecto?.series || 3;
        const defaultValue = exercise.seriesPorDefecto?.valor || 12;
        const defaultRest = exercise.seriesPorDefecto?.descanso || 60;
        
        const routineExercise = {
            ejercicioId: exerciseId,
            series: Math.max(1, Math.round(defaultSeries * multiplier)),
            valor: Math.max(1, Math.round(defaultValue * multiplier)),
            descanso: defaultRest
        };
        
        currentRoutineExercises.push(routineExercise);
        console.log('✅ Exercise added to routine:', routineExercise);
    }
    
    console.log('📋 Current routine exercises:', currentRoutineExercises);
    
    // Actualizar UI
    updateExerciseCardSelection(exerciseId);
    await updateRoutineBuilder();
    updateRoutineButtons();
}

/**
 * Actualiza el estado visual de selección de una tarjeta de ejercicio
 * @param {string} exerciseId - ID del ejercicio
 */
function updateExerciseCardSelection(exerciseId) {
    const card = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    if (!card) return;
    
    const isSelected = currentRoutineExercises.some(ex => ex.ejercicioId === exerciseId);
    card.classList.toggle('selected', isSelected);
}

/**
 * Remueve un ejercicio específico de la rutina
 * @param {string} exerciseId - ID del ejercicio a remover
 */
async function removeExerciseFromRoutine(exerciseId) {
    console.log('🗑️ Removiendo ejercicio de la rutina:', exerciseId);
    
    const existingIndex = currentRoutineExercises.findIndex(ex => ex.ejercicioId === exerciseId);
    
    if (existingIndex >= 0) {
        // Quitar ejercicio
        currentRoutineExercises.splice(existingIndex, 1);
        console.log('✅ Ejercicio removido de la rutina');
        
        // Actualizar UI
        updateExerciseCardSelection(exerciseId);
        await updateRoutineBuilder();
        updateRoutineButtons();
        
        console.log('📋 Ejercicios restantes en la rutina:', currentRoutineExercises.length);
    } else {
        console.log('❌ Ejercicio no encontrado en la rutina');
    }
}

/**
 * Actualiza la sección de rutina en construcción
 */
async function updateRoutineBuilder() {
    console.log('🔄 updateRoutineBuilder ejecutándose...');
    const container = DOM_ELEMENTS.selectedExercisesList;
    console.log('📦 Container encontrado:', container);
    console.log('📋 Ejercicios actuales:', currentRoutineExercises.length);
    
    if (currentRoutineExercises.length === 0) {
        container.innerHTML = `
            <div class="empty-routine">
                <p>🎯 Agrega ejercicios para comenzar a crear tu rutina</p>
            </div>
        `;
        DOM_ELEMENTS.routineExerciseCount.textContent = '0 ejercicios';
        DOM_ELEMENTS.routineEstimatedTime.textContent = '0 min estimados';
        return;
    }
    
    // Generar HTML de ejercicios seleccionados
    const exercisePromises = currentRoutineExercises.map(async (routineExercise) => {
        console.log('🔄 Procesando ejercicio de rutina:', routineExercise);
        const exercise = await findExerciseById(routineExercise.ejercicioId);
        console.log('🔍 Ejercicio encontrado:', exercise);
        
        if (!exercise) {
            console.log('❌ Ejercicio no encontrado para ID:', routineExercise.ejercicioId);
            return '';
        }
        
        // Adaptar estructura del ejercicio del servidor al formato esperado por el frontend
        const adaptedExercise = {
            id: exercise._id || exercise.id,
            icono: exercise.icon || exercise.icono || '💪',
            nombre: exercise.name || exercise.nombre,
            categoria: exercise.category || exercise.categoria,
            tipoSerie: exercise.type || exercise.tipoSerie || 'repeticiones'
        };
        
        console.log('✅ Ejercicio adaptado:', adaptedExercise);
        
        return `
            <div class="selected-exercise-item" data-exercise-id="${adaptedExercise.id}">
                <div class="selected-exercise-info">
                    <span class="exercise-icon">${adaptedExercise.icono}</span>
                    <div>
                        <div class="selected-exercise-name">${adaptedExercise.nombre}</div>
                        <small style="color: #666;">${adaptedExercise.categoria} • ${adaptedExercise.tipoSerie}</small>
                    </div>
                </div>
                <div class="selected-exercise-config">
                    <div style="text-align: center;">
                        <label style="font-size: 0.8rem; color: #666;">Series</label>
                        <input type="number" class="config-input" 
                               value="${routineExercise.series}" 
                               min="1" max="10"
                               data-field="series" data-exercise-id="${adaptedExercise.id}">
                    </div>
                    <div style="text-align: center;">
                        <label style="font-size: 0.8rem; color: #666;">
                            ${adaptedExercise.tipoSerie === 'repeticiones' ? 'Reps' : 'Seg'}
                        </label>
                        <input type="number" class="config-input" 
                               value="${routineExercise.valor}" 
                               min="1" max="${adaptedExercise.tipoSerie === 'tiempo' ? 300 : 50}"
                               data-field="valor" data-exercise-id="${adaptedExercise.id}">
                    </div>
                    <div style="text-align: center;">
                        <label style="font-size: 0.8rem; color: #666;">Descanso (s)</label>
                        <input type="number" class="config-input" 
                               value="${routineExercise.descanso}" 
                               min="0" max="300" step="15"
                               data-field="descanso" data-exercise-id="${adaptedExercise.id}">
                    </div>
                    <button class="remove-exercise" data-exercise-id="${adaptedExercise.id}">
                        🗑️ Quitar
                    </button>
                </div>
            </div>
        `;
    });
    
    // Esperar a que todas las promesas se resuelvan
    const exerciseHTMLs = await Promise.all(exercisePromises);
    console.log('📝 HTML generado para ejercicios:', exerciseHTMLs.length);
    container.innerHTML = exerciseHTMLs.join('');
    console.log('✅ HTML insertado en el container');
    
    // Agregar event listeners para los controles
    container.querySelectorAll('.config-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const exerciseId = e.target.dataset.exerciseId;
            const field = e.target.dataset.field;
            const value = parseInt(e.target.value);
            
            updateExerciseConfig(exerciseId, field, value);
        });
    });
    
    const removeButtons = container.querySelectorAll('.remove-exercise');
    console.log('🔧 Botones "Quitar" encontrados:', removeButtons.length);
    
    removeButtons.forEach((btn, index) => {
        console.log(`🔧 Configurando botón ${index + 1} con ID:`, btn.dataset.exerciseId);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const exerciseId = e.target.dataset.exerciseId;
            console.log('🗑️ Botón quitar clickeado con ID:', exerciseId);
            console.log('🗑️ Event target:', e.target);
            console.log('🗑️ Dataset completo:', e.target.dataset);
            removeExerciseFromRoutine(exerciseId);
        });
    });
    
    // Actualizar estadísticas
    updateRoutineStats();
}

/**
 * Actualiza la configuración de un ejercicio en la rutina
 * @param {string} exerciseId - ID del ejercicio
 * @param {string} field - Campo a actualizar (series, valor, descanso)
 * @param {number} value - Nuevo valor
 */
function updateExerciseConfig(exerciseId, field, value) {
    const exerciseIndex = currentRoutineExercises.findIndex(ex => ex.ejercicioId === exerciseId);
    if (exerciseIndex >= 0 && value > 0) {
        currentRoutineExercises[exerciseIndex][field] = value;
        updateRoutineStats();
    }
}

/**
 * Actualiza las estadísticas de la rutina (ejercicios y tiempo estimado)
 */
function updateRoutineStats() {
    const exerciseCount = currentRoutineExercises.length;
    let totalTime = 0;
    
    currentRoutineExercises.forEach(routineExercise => {
        const exercise = findExerciseById(routineExercise.ejercicioId);
        if (exercise) {
            // Calcular tiempo estimado por ejercicio
            let exerciseTime = 0;
            
            if (exercise.tipoSerie === 'tiempo') {
                // Para ejercicios por tiempo: series * tiempo + descansos
                exerciseTime = (routineExercise.series * routineExercise.valor) + 
                              ((routineExercise.series - 1) * routineExercise.descanso);
            } else {
                // Para ejercicios por repeticiones: estimamos 2 segundos por rep + descansos
                exerciseTime = (routineExercise.series * routineExercise.valor * 2) + 
                              ((routineExercise.series - 1) * routineExercise.descanso);
            }
            
            totalTime += exerciseTime;
        }
    });
    
    // Agregar tiempo de transición entre ejercicios (30 segundos por ejercicio)
    totalTime += Math.max(0, exerciseCount - 1) * 30;
    
    DOM_ELEMENTS.routineExerciseCount.textContent = `${exerciseCount} ejercicio${exerciseCount !== 1 ? 's' : ''}`;
    DOM_ELEMENTS.routineEstimatedTime.textContent = `${Math.round(totalTime / 60)} min estimados`;
}

/**
 * Actualiza el estado de los botones de la rutina
 */
function updateRoutineButtons() {
    const hasExercises = currentRoutineExercises.length > 0;
    const hasBasicInfo = DOM_ELEMENTS.routineName.value.trim() && DOM_ELEMENTS.routineIntensity.value;
    
    DOM_ELEMENTS.btnPreviewRoutine.disabled = !hasExercises;
    DOM_ELEMENTS.btnSaveRoutine.disabled = !hasExercises || !hasBasicInfo;
}

// ===================================
// FILTROS DE EJERCICIOS
// ===================================

/**
 * Establece el filtro activo y filtra ejercicios
 * @param {string} category - Categoría a filtrar ('todos' o nombre de categoría)
 */
async function setActiveFilter(category) {
    // Actualizar botones de filtro
    DOM_ELEMENTS.filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Filtrar y mostrar ejercicios
    const allExercises = await getStoredExercises();
    const filteredExercises = category === 'todos' 
        ? allExercises 
        : allExercises.filter(exercise => {
            // Adaptar para manejar ambos formatos
            const exerciseCategory = exercise.category || exercise.categoria;
            return exerciseCategory === category;
        });
    
    displayExercises(filteredExercises);
    
    // Restaurar selecciones visuales
    currentRoutineExercises.forEach(routineEx => {
        updateExerciseCardSelection(routineEx.ejercicioId);
    });
}

// ===================================
// GUARDAR RUTINA
// ===================================

/**
 * Procesa el guardado de una rutina
 */
async function handleSaveRoutine() {
    // Validar información básica
    const routineName = DOM_ELEMENTS.routineName.value.trim();
    const routineIntensity = DOM_ELEMENTS.routineIntensity.value;
    const routineDescription = DOM_ELEMENTS.routineDescription.value.trim();
    
    if (!routineName) {
        showNotification('Por favor ingresa un nombre para la rutina', 'error');
        DOM_ELEMENTS.routineName.focus();
        return;
    }
    
    if (!routineIntensity) {
        showNotification('Por favor selecciona un nivel de intensidad', 'error');
        DOM_ELEMENTS.routineIntensity.focus();
        return;
    }
    
    if (currentRoutineExercises.length === 0) {
        showNotification('Agrega al menos un ejercicio a la rutina', 'error');
        return;
    }
    
    // Mostrar loading
    showLoading(true);
    
    try {
        const currentUser = getCurrentUser();
        
        if (isEditingRoutine && editingRoutineId) {
            // MODO EDICIÓN - Actualizar rutina existente
            console.log('🔄 Actualizando rutina existente:', editingRoutineId);
            
            // Calcular duración estimada
            const estimatedDuration = await calculateTotalTime();
            
            // Mapear ejercicios al formato del servidor
            const exercises = currentRoutineExercises.map(ex => ({
                exerciseId: ex.ejercicioId,
                sets: ex.series,
                reps: ex.valor,
                restTime: ex.descanso,
                duration: Math.ceil((ex.series * ex.valor * 2 + (ex.series - 1) * ex.descanso) / 60)
            }));
            
            const routine = {
                name: routineName,
                description: routineDescription || 'Sin descripción',
                category: 'Personalizada',
                intensity: routineIntensity.charAt(0).toUpperCase() + routineIntensity.slice(1).toLowerCase(),
                estimatedDuration: Math.ceil(estimatedDuration / 60),
                exercises: exercises,
                isPublic: false
            };
            
            // Actualizar rutina en el storage
            await updateRoutine(editingRoutineId, routine);
            
            // Mostrar éxito
            showNotification(`¡Rutina "${routineName}" actualizada exitosamente!`, 'success');
            
            // Limpiar estado de edición
            resetEditingState();
            
        } else {
            // MODO CREACIÓN - Nueva rutina
            console.log('➕ Creando nueva rutina');
            
            // Calcular duración estimada
            const estimatedDuration = await calculateTotalTime();
            
            // Mapear ejercicios al formato del servidor
            console.log('🔄 Mapeando ejercicios de la rutina:', currentRoutineExercises);
            const exercises = currentRoutineExercises.map(ex => {
                console.log('📝 Mapeando ejercicio:', ex);
                const mapped = {
                    exerciseId: ex.ejercicioId,
                    sets: ex.series,
                    reps: ex.valor,
                    restTime: ex.descanso,
                    duration: Math.ceil((ex.series * ex.valor * 2 + (ex.series - 1) * ex.descanso) / 60) // Calcular duración en minutos
                };
                console.log('✅ Ejercicio mapeado:', mapped);
                return mapped;
            });
            
            const routine = {
                name: routineName,
                description: routineDescription || 'Sin descripción',
                category: 'Personalizada', // Valor por defecto
                intensity: routineIntensity.charAt(0).toUpperCase() + routineIntensity.slice(1).toLowerCase(), // Convertir a formato correcto
                estimatedDuration: Math.ceil(estimatedDuration / 60), // Convertir segundos a minutos
                exercises: exercises,
                isPublic: false
            };
            
            console.log('📋 Datos de la rutina a enviar:', routine);
            
            // Guardar nueva rutina
            await saveRoutine(routine);
            
            // Mostrar éxito
            showNotification(`¡Rutina "${routineName}" creada exitosamente!`, 'success');
        }
        
        // Limpiar formulario y volver al dashboard
        setTimeout(() => {
            backToDashboard();
        }, 2000);
        
    } catch (error) {
        console.error('Error al guardar rutina:', error);
        showNotification('Error al guardar la rutina. Inténtalo de nuevo.', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Muestra vista previa de la rutina
 */
async function showRoutinePreview() {
    if (currentRoutineExercises.length === 0) return;
    
    const routineName = DOM_ELEMENTS.routineName.value.trim() || 'Rutina sin nombre';
    const routineIntensity = DOM_ELEMENTS.routineIntensity.value || 'MEDIA';
    const intensityInfo = INTENSITY_LEVELS[routineIntensity];
    
    let previewHTML = `
        <div style="max-width: 500px; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <h2 style="color: #667eea; margin-bottom: 20px;">📋 Vista Previa</h2>
            <h3 style="color: #333; margin-bottom: 10px;">${routineName}</h3>
            <p style="color: ${intensityInfo.color}; font-weight: 600; margin-bottom: 20px;">
                ${intensityInfo.name} - ${intensityInfo.description}
            </p>
            <div style="background: #f8f9ff; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <strong>📊 Resumen:</strong><br>
                • ${currentRoutineExercises.length} ejercicios<br>
                • ${Math.round(await calculateTotalTime() / 60)} minutos estimados
            </div>
            <h4 style="color: #333; margin-bottom: 15px;">Ejercicios:</h4>
    `;
    
    for (let index = 0; index < currentRoutineExercises.length; index++) {
        const routineEx = currentRoutineExercises[index];
        // Adaptar estructura del ejercicio de la rutina
        const adaptedExercise = {
            ejercicioId: routineEx.exerciseId || routineEx.ejercicioId,
            series: routineEx.sets || routineEx.series,
            valor: routineEx.reps || routineEx.valor,
            descanso: routineEx.restTime || routineEx.descanso
        };
        
        const exercise = await findExerciseById(adaptedExercise.ejercicioId);
        if (exercise) {
            // Adaptar estructura del ejercicio del servidor al formato esperado por el frontend
            const adaptedExerciseData = {
                icono: exercise.icon || exercise.icono || '💪',
                nombre: exercise.name || exercise.nombre || 'Ejercicio',
                tipoSerie: exercise.type || exercise.tipoSerie || 'repeticiones'
            };
            
            previewHTML += `
                <div style="background: #f0f4ff; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                    <strong>${index + 1}. ${adaptedExerciseData.icono} ${adaptedExerciseData.nombre}</strong><br>
                    <small style="color: #666;">
                        ${adaptedExercise.series} series × ${adaptedExercise.valor}${adaptedExerciseData.tipoSerie === 'tiempo' ? ' segundos' : ' repeticiones'} 
                        (${adaptedExercise.descanso}s descanso)
                    </small>
                </div>
            `;
        }
    }
    
    previewHTML += `
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="closePreview()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                    ✅ Cerrar Vista Previa
                </button>
            </div>
        </div>
    `;
    
    // Crear overlay de vista previa
    const overlay = document.createElement('div');
    overlay.id = 'preview-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
        align-items: center; z-index: 2000;
    `;
    overlay.innerHTML = previewHTML;
    
    document.body.appendChild(overlay);
    
    // Función global para cerrar
    window.closePreview = () => {
        document.body.removeChild(overlay);
        delete window.closePreview;
    };
}

/**
 * Calcula el tiempo total de la rutina en segundos
 * @returns {number} Tiempo total en segundos
 */
async function calculateTotalTime() {
    console.log('⏱️ Calculando tiempo total para ejercicios:', currentRoutineExercises);
    let totalTime = 0;
    
    for (const routineExercise of currentRoutineExercises) {
        console.log('🔍 Buscando ejercicio con ID:', routineExercise.ejercicioId);
        const exercise = await findExerciseById(routineExercise.ejercicioId);
        console.log('📋 Ejercicio encontrado:', exercise);
        
        if (exercise) {
            // Usar valores por defecto si no están disponibles
            const tipoSerie = exercise.tipoSerie || 'repeticiones';
            const series = routineExercise.series || 3;
            const valor = routineExercise.valor || 12;
            const descanso = routineExercise.descanso || 60;
            
            console.log(`📊 Calculando tiempo: tipoSerie=${tipoSerie}, series=${series}, valor=${valor}, descanso=${descanso}`);
            
            if (tipoSerie === 'tiempo') {
                totalTime += (series * valor) + ((series - 1) * descanso);
            } else {
                totalTime += (series * valor * 2) + ((series - 1) * descanso);
            }
        } else {
            console.log('❌ Ejercicio no encontrado, usando valores por defecto');
            // Usar valores por defecto si no se encuentra el ejercicio
            const series = routineExercise.series || 3;
            const valor = routineExercise.valor || 12;
            const descanso = routineExercise.descanso || 60;
            totalTime += (series * valor * 2) + ((series - 1) * descanso);
        }
    }
    
    // Tiempo de transición entre ejercicios
    totalTime += Math.max(0, currentRoutineExercises.length - 1) * 30;
    
    console.log('⏱️ Tiempo total calculado:', totalTime, 'segundos');
    return totalTime;
}

// ===================================
// FUNCIONALIDAD VER RUTINAS
// ===================================

/**
 * Muestra la pantalla de ver rutinas
 */
function showViewRoutinesScreen() {
    console.log('👁️ Navegando a: Ver Rutinas');
    
    // Ocultar todas las pantallas primero
    hideAllScreens();
    
    // Mostrar solo la pantalla de ver rutinas
    DOM_ELEMENTS.viewRoutinesContainer.classList.remove('hidden');
    DOM_ELEMENTS.viewRoutinesContainer.classList.add('fade-in');
    
    // Inicializar la pantalla de ver rutinas
    initializeViewRoutinesScreen();
}

/**
 * Vuelve al dashboard desde ver rutinas
 */
function backToDashboardFromView() {
    console.log('🏠 Navegando a: Dashboard desde Ver Rutinas');
    
    // Ocultar todas las pantallas primero
    hideAllScreens();
    
    // Mostrar solo el dashboard
    DOM_ELEMENTS.dashboardContainer.classList.remove('hidden');
    DOM_ELEMENTS.dashboardContainer.classList.add('fade-in');
}

// ===================================
// NAVEGACIÓN - AGREGAR EJERCICIO
// ===================================

/**
 * Muestra la pantalla de agregar ejercicio
 */
function showAddExerciseScreen() {
    console.log('➕ Navegando a: Agregar Ejercicio');
    
    // Ocultar todas las pantallas primero
    hideAllScreens();
    
    // Mostrar solo la pantalla de agregar ejercicio
    DOM_ELEMENTS.addExerciseContainer.classList.remove('hidden');
    DOM_ELEMENTS.addExerciseContainer.classList.add('fade-in');
    
    // Inicializar la pantalla
    initializeAddExerciseScreen();
}

/**
 * Vuelve al dashboard desde agregar ejercicio
 */
function backToDashboardFromAddExercise() {
    console.log('🏠 Navegando a: Dashboard desde Agregar Ejercicio');
    
    // Ocultar todas las pantallas primero
    hideAllScreens();
    
    // Mostrar solo el dashboard
    DOM_ELEMENTS.dashboardContainer.classList.remove('hidden');
    DOM_ELEMENTS.dashboardContainer.classList.add('fade-in');
    
    // Limpiar formulario de ejercicio
    clearAddExerciseForm();
}

/**
 * Muestra la pantalla de gestión de alumnos
 */
function showStudentManagementScreen() {
    console.log('👥 Navegando a: Gestión de Alumnos');
    
    // Ocultar todas las pantallas primero
    hideAllScreens();
    
    // Mostrar solo la pantalla de gestión de estudiantes
    DOM_ELEMENTS.studentManagementContainer.classList.remove('hidden');
    DOM_ELEMENTS.studentManagementContainer.classList.add('fade-in');
    
    // Inicializar la pantalla
    initializeStudentManagementScreen();
}

/**
 * Vuelve al dashboard desde gestión de alumnos
 */
function backToDashboardFromStudents() {
    console.log('🏠 Navegando a: Dashboard desde Gestión de Alumnos');
    
    // Ocultar todas las pantallas primero
    hideAllScreens();
    
    // Mostrar solo el dashboard
    DOM_ELEMENTS.dashboardContainer.classList.remove('hidden');
    DOM_ELEMENTS.dashboardContainer.classList.add('fade-in');
    
    // Limpiar formulario de estudiante
    clearStudentForm();
}

/**
 * Inicializa la pantalla de ver rutinas
 */
async function initializeViewRoutinesScreen() {
    // Cargar estadísticas
    await updateRoutinesStats();
    
    // Resetear filtros primero
    await resetFiltersOnly();
    
    // Poblar desplegable de rutinas
    await populateRoutineSelector();
    
    // Aplicar filtros (que mostrará todas las rutinas por defecto)
    filterRoutines();
}

/**
 * Pobla el desplegable de selector de rutinas basado en el filtro de intensidad
 */
async function populateRoutineSelector() {
    console.log('📋 Poblando selector de rutinas...');
    
    if (!DOM_ELEMENTS.routineSelector || !DOM_ELEMENTS.intensityFilter) {
        console.error('❌ Elementos de selector no encontrados');
        return;
    }
    
    // Obtener todas las rutinas del usuario
    const allUserRoutines = await getCurrentUserRoutines();
    const selectedIntensity = DOM_ELEMENTS.intensityFilter.value;
    
    console.log('🎯 Filtro de intensidad seleccionado:', `"${selectedIntensity}"`);
    
    // Filtrar rutinas por intensidad si hay una seleccionada
    let routinesToShow = allUserRoutines;
    if (selectedIntensity && selectedIntensity !== '') {
        routinesToShow = allUserRoutines.filter(routine => routine.intensidad === selectedIntensity);
    }
    
    console.log('📊 Rutinas a mostrar en selector:', routinesToShow.length);
    
    // Limpiar opciones existentes (excepto la primera)
    DOM_ELEMENTS.routineSelector.innerHTML = '<option value="">Todas las rutinas</option>';
    
    // Agregar cada rutina como opción
    routinesToShow.forEach(routine => {
        const option = document.createElement('option');
        option.value = routine._id || routine.id;
        option.textContent = `${getIntensityEmoji(routine.intensity || routine.intensidad)} ${routine.name || routine.nombre}`;
        DOM_ELEMENTS.routineSelector.appendChild(option);
    });
    
    console.log('✅ Selector de rutinas poblado');
}

/**
 * Obtiene el emoji correspondiente a la intensidad
 */
function getIntensityEmoji(intensity) {
    const normalizedIntensity = intensity?.toUpperCase();
    switch(normalizedIntensity) {
        case 'BAJA': return '🟢';
        case 'MEDIA': return '🟡';
        case 'ALTA': return '🔴';
        default: return '⚪';
    }
}

/**
 * Actualiza las estadísticas de rutinas del usuario
 */
async function updateRoutinesStats() {
    const userRoutines = await getCurrentUserRoutines();
    const totalRoutines = userRoutines.length;
    
    // Actualizar UI - solo mostrar total de rutinas
    DOM_ELEMENTS.totalRoutines.textContent = totalRoutines;
}

/**
 * Calcula la duración de una rutina en segundos
 * @param {Object} routine - Objeto rutina
 * @returns {number} Duración en segundos
 */
function calculateRoutineDuration(routine) {
    let totalTime = 0;
    
    // Adaptar estructura de la rutina del servidor al formato esperado por el frontend
    const adaptedRoutine = {
        ejercicios: routine.exercises || routine.ejercicios
    };
    
    adaptedRoutine.ejercicios.forEach(routineExercise => {
        // Adaptar estructura del ejercicio de la rutina
        const adaptedExercise = {
            ejercicioId: routineExercise.exerciseId || routineExercise.ejercicioId,
            series: routineExercise.sets || routineExercise.series,
            valor: routineExercise.reps || routineExercise.valor,
            descanso: routineExercise.restTime || routineExercise.descanso
        };
        
        // Calcular tiempo basado en valores por defecto si no tenemos el ejercicio
        if (adaptedExercise.series && adaptedExercise.valor) {
            // Estimación conservadora: 2 segundos por repetición + tiempo de descanso
            totalTime += (adaptedExercise.series * adaptedExercise.valor * 2) + 
                       ((adaptedExercise.series - 1) * (adaptedExercise.descanso || 30));
        }
    });
    
    // Tiempo de transición entre ejercicios
    totalTime += Math.max(0, adaptedRoutine.ejercicios.length - 1) * 30;
    
    return totalTime;
}

/**
 * Carga y muestra TODAS las rutinas del usuario (sin filtros)
 */
async function loadUserRoutines() {
    console.log('📥 Cargando todas las rutinas del usuario...');
    const userRoutines = await getCurrentUserRoutines();
    console.log('📊 Rutinas encontradas:', userRoutines.length);
    displayRoutines(userRoutines);
}

/**
 * Muestra rutinas en la interfaz
 * @param {Array} routines - Array de rutinas a mostrar
 */
function displayRoutines(routines) {
    console.log('🎯 displayRoutines llamada con:', routines.length, 'rutinas');
    console.log('📋 Rutinas recibidas:', routines);
    
    const routinesContainer = DOM_ELEMENTS.routinesList;
    const noRoutinesMsg = DOM_ELEMENTS.noRoutinesMessage;
    
    console.log('🔍 Elementos DOM:', {
        routinesContainer: !!routinesContainer,
        noRoutinesMsg: !!noRoutinesMsg
    });
    
    if (!routinesContainer) {
        console.error('❌ CRÍTICO: routinesContainer no encontrado!');
        return;
    }
    
    if (routines.length === 0) {
        console.log('📭 No hay rutinas - mostrando mensaje vacío');
        routinesContainer.innerHTML = '';
        noRoutinesMsg.classList.remove('hidden');
        return;
    }
    
    console.log('✅ Hay rutinas - ocultando mensaje vacío y mostrando rutinas');
    noRoutinesMsg.classList.add('hidden');
    
    routinesContainer.innerHTML = routines.map(routine => {
        // Adaptar estructura de la rutina del servidor al formato esperado por el frontend
        const adaptedRoutine = {
            id: routine._id || routine.id,
            nombre: routine.name || routine.nombre,
            descripcion: routine.description || routine.descripcion,
            intensidad: routine.intensity || routine.intensidad,
            ejercicios: routine.exercises || routine.ejercicios,
            fechaCreacion: routine.createdAt || routine.fechaCreacion
        };
        
        const duration = Math.round(calculateRoutineDuration(adaptedRoutine) / 60);
        const creationDate = new Date(adaptedRoutine.fechaCreacion).toLocaleDateString('es-ES');
        
        console.log('🔍 Intensidad de rutina:', adaptedRoutine.intensidad);
        console.log('🔍 INTENSITY_LEVELS disponibles:', Object.keys(INTENSITY_LEVELS));
        
        // Normalizar la intensidad para que coincida con las claves de INTENSITY_LEVELS
        const normalizedIntensity = adaptedRoutine.intensidad?.toUpperCase() || 'MEDIA';
        console.log('🔍 Intensidad normalizada:', normalizedIntensity);
        
        const intensityInfo = INTENSITY_LEVELS[normalizedIntensity] || INTENSITY_LEVELS['MEDIA'];
        console.log('🔍 intensityInfo encontrado:', intensityInfo);
        
        return `
            <div class="routine-card" data-routine-id="${adaptedRoutine.id}">
                <div class="routine-header">
                    <div>
                        <div class="routine-title">${adaptedRoutine.nombre}</div>
                        <small style="color: #999;">Creada el ${creationDate}</small>
                    </div>
                    <div class="routine-intensity ${normalizedIntensity}">
                        ${intensityInfo.name}
                    </div>
                </div>
                
                <div class="routine-description">
                    ${adaptedRoutine.descripcion}
                </div>
                
                <div class="routine-stats">
                    <div class="routine-stat">
                        <div class="routine-stat-number">${adaptedRoutine.ejercicios.length}</div>
                        <div class="routine-stat-label">Ejercicios</div>
                    </div>
                    <div class="routine-stat">
                        <div class="routine-stat-number">${duration}</div>
                        <div class="routine-stat-label">Minutos</div>
                    </div>
                </div>
                
                <div class="routine-actions">
                    <button class="btn-routine-action btn-view" onclick="event.preventDefault(); event.stopPropagation(); console.log('🔍 Botón Ver clickeado con ID:', '${adaptedRoutine.id}'); showRoutineDetails('${adaptedRoutine.id}')">
                        👁️ Ver
                    </button>
                    <button class="btn-routine-action btn-print" onclick="event.preventDefault(); event.stopPropagation(); printRoutine('${adaptedRoutine.id}')">
                        🖨️ Imprimir
                    </button>
                    <button class="btn-routine-action btn-delete" onclick="event.preventDefault(); event.stopPropagation(); deleteRoutine('${adaptedRoutine.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('🎨 HTML generado para rutinas:', routinesContainer.innerHTML.substring(0, 200) + '...');
    console.log('✅ displayRoutines completada');
}

/**
 * Filtra rutinas según intensidad y rutina específica - NUEVA VERSIÓN CON DESPLEGABLES
 */
async function filterRoutines() {
    console.log('🔍 Iniciando filtrado de rutinas...');
    
    // Obtener todas las rutinas del usuario
    const allUserRoutines = await getCurrentUserRoutines();
    console.log('📋 Total de rutinas del usuario:', allUserRoutines.length);
    
    // Verificar que los elementos DOM existan
    if (!DOM_ELEMENTS.routineSelector || !DOM_ELEMENTS.intensityFilter) {
        console.error('❌ Elementos de filtro no encontrados');
        displayRoutines(allUserRoutines);
        return;
    }
    
    // Obtener valores de los filtros
    const selectedRoutineId = DOM_ELEMENTS.routineSelector.value || '';
    const intensityValue = DOM_ELEMENTS.intensityFilter.value || '';
    
    console.log('🎛️ Valores de filtros:', {
        rutinaSeleccionada: `"${selectedRoutineId}"`,
        intensidad: `"${intensityValue}"`,
        rutinasOriginales: allUserRoutines.map(r => ({
            id: r._id || r.id,
            nombre: r.name || r.nombre,
            intensidad: r.intensity || r.intensidad
        }))
    });
    
    // Si ambos filtros están vacíos, mostrar todas las rutinas
    if ((!intensityValue || intensityValue.trim() === '') && (!selectedRoutineId || selectedRoutineId.trim() === '')) {
        console.log('📋 Ambos filtros vacíos - Mostrando TODAS las rutinas');
        displayRoutines(allUserRoutines);
        return;
    }
    
    // Aplicar filtros paso a paso
    let filteredRoutines = [...allUserRoutines]; // Copia del array original
    
    // 1. Filtro por intensidad
    if (intensityValue && intensityValue.trim() !== '') {
        const normalizedFilterIntensity = intensityValue.toUpperCase();
        filteredRoutines = filteredRoutines.filter(routine => {
            const routineIntensity = (routine.intensity || routine.intensidad)?.toUpperCase();
            return routineIntensity === normalizedFilterIntensity;
        });
        console.log(`🎯 Después del filtro de intensidad "${intensityValue}" (normalizado: "${normalizedFilterIntensity}"):`, filteredRoutines.length, 'rutinas');
    }
    
    // 2. Filtro por rutina específica
    if (selectedRoutineId && selectedRoutineId.trim() !== '') {
        filteredRoutines = filteredRoutines.filter(routine => {
            return (routine._id || routine.id) === selectedRoutineId;
        });
        console.log(`📋 Después del filtro de rutina específica "${selectedRoutineId}":`, filteredRoutines.length, 'rutinas');
    }
    
    console.log('✅ Rutinas finales a mostrar:', filteredRoutines.map(r => r.name || r.nombre));
    
    // Mostrar las rutinas filtradas
    displayRoutines(filteredRoutines);
}

/**
 * Resetea todos los filtros y muestra todas las rutinas
 */
async function resetFilters() {
    console.log('🔄 Reseteando todos los filtros...');
    
    if (DOM_ELEMENTS.routineSelector) {
        DOM_ELEMENTS.routineSelector.value = '';
    }
    if (DOM_ELEMENTS.intensityFilter) {
        DOM_ELEMENTS.intensityFilter.value = '';
    }
    
    // Repoblar el selector con todas las rutinas
    await populateRoutineSelector();
    
    // Cargar todas las rutinas sin filtros
    await loadUserRoutines();
}

/**
 * Solo resetea los valores de los filtros sin cargar rutinas
 */
async function resetFiltersOnly() {
    console.log('🔄 Reseteando solo los valores de filtros...');
    
    if (DOM_ELEMENTS.routineSelector) {
        DOM_ELEMENTS.routineSelector.value = '';
    }
    if (DOM_ELEMENTS.intensityFilter) {
        DOM_ELEMENTS.intensityFilter.value = '';
    }
}

/**
 * Maneja específicamente el cambio del filtro de intensidad
 */
function handleIntensityFilterChange() {
    console.log('🎯 Cambio en filtro de intensidad detectado');
    const selectedValue = DOM_ELEMENTS.intensityFilter.value;
    console.log('🔄 Valor seleccionado:', `"${selectedValue}"`);
    
    // Repoblar el selector de rutinas basado en la nueva intensidad
    populateRoutineSelector();
    
    // Siempre usar filterRoutines() - la función ya maneja el caso de filtros vacíos
    console.log('🔍 Aplicando filtros');
    filterRoutines();
}

/**
 * Maneja específicamente el cambio del selector de rutinas
 */
function handleRoutineSelectorChange() {
    console.log('📋 Cambio en selector de rutinas detectado');
    const selectedRoutineId = DOM_ELEMENTS.routineSelector.value;
    console.log('🔄 Rutina seleccionada:', `"${selectedRoutineId}"`);
    
    // Siempre usar filterRoutines() - la función ya maneja todos los casos
    console.log('🔍 Aplicando filtros');
    filterRoutines();
}

/**
 * Muestra los detalles completos de una rutina en modal
 * @param {string} routineId - ID de la rutina
 */
async function showRoutineDetails(routineId) {
    console.log('👁️ Mostrando detalles de rutina:', routineId);
    
    let routine;
    try {
        const userRoutines = await getCurrentUserRoutines();
        console.log('📋 Rutinas del usuario obtenidas:', userRoutines.length);
        
        routine = userRoutines.find(r => (r._id || r.id) === routineId);
        console.log('🔍 Rutina encontrada:', routine);
        
        if (!routine) {
            console.error('❌ Rutina no encontrada:', routineId);
            showNotification('Rutina no encontrada', 'error');
            return;
        }
    } catch (error) {
        console.error('❌ Error obteniendo rutinas:', error);
        showNotification('Error al cargar la rutina', 'error');
        return;
    }
    
    // Adaptar estructura de la rutina del servidor al formato esperado por el frontend
    const adaptedRoutine = {
        id: routine._id || routine.id,
        nombre: routine.name || routine.nombre,
        descripcion: routine.description || routine.descripcion,
        intensidad: routine.intensity || routine.intensidad,
        ejercicios: routine.exercises || routine.ejercicios,
        fechaCreacion: routine.createdAt || routine.fechaCreacion
    };
    
    // Actualizar título del modal
    DOM_ELEMENTS.modalRoutineTitle.textContent = adaptedRoutine.nombre;
    
    // Generar contenido del modal
    const duration = Math.round(calculateRoutineDuration(adaptedRoutine) / 60);
    const creationDate = new Date(adaptedRoutine.fechaCreacion).toLocaleDateString('es-ES');
    
    // Normalizar intensidad para que coincida con las claves de INTENSITY_LEVELS
    const normalizedIntensity = adaptedRoutine.intensidad ? adaptedRoutine.intensidad.toUpperCase() : 'MEDIA';
    const intensityInfo = INTENSITY_LEVELS[normalizedIntensity] || INTENSITY_LEVELS['MEDIA'];
    
    console.log('🔍 Intensidad original:', adaptedRoutine.intensidad);
    console.log('🔧 Intensidad normalizada:', normalizedIntensity);
    console.log('📊 IntensityInfo encontrado:', intensityInfo);
    
    let modalContent = `
        <div class="routine-detail-info">
            <h3>Información General</h3>
            <p><strong>Descripción:</strong> ${adaptedRoutine.descripcion}</p>
            <p><strong>Intensidad:</strong> <span style="color: ${intensityInfo.color}">${intensityInfo.name}</span> - ${intensityInfo.description}</p>
            <p><strong>Duración estimada:</strong> ${duration} minutos</p>
            <p><strong>Creada el:</strong> ${creationDate}</p>
            <p><strong>Total de ejercicios:</strong> ${adaptedRoutine.ejercicios.length}</p>
        </div>
        
        <div class="routine-detail-exercises">
            <h3>Ejercicios de la Rutina</h3>
    `;
    
    console.log('📋 Procesando ejercicios de la rutina:', adaptedRoutine.ejercicios.length);
    
    for (let index = 0; index < adaptedRoutine.ejercicios.length; index++) {
        const routineEx = adaptedRoutine.ejercicios[index];
        console.log(`🔍 Procesando ejercicio ${index + 1}:`, routineEx);
        
        // Adaptar estructura del ejercicio de la rutina
        const exerciseId = routineEx.exerciseId || routineEx.ejercicioId;
        
        // Si exerciseId es un objeto, extraer el _id
        const actualExerciseId = typeof exerciseId === 'object' && exerciseId !== null 
            ? (exerciseId._id || exerciseId.id) 
            : exerciseId;
        
        console.log('🔍 ExerciseId original:', exerciseId);
        console.log('🔧 ExerciseId extraído:', actualExerciseId);
        
        const adaptedExercise = {
            ejercicioId: actualExerciseId,
            series: routineEx.sets || routineEx.series,
            valor: routineEx.reps || routineEx.valor,
            descanso: routineEx.restTime || routineEx.descanso
        };
        
        console.log('🔧 Ejercicio adaptado:', adaptedExercise);
        
        const exercise = await findExerciseById(adaptedExercise.ejercicioId);
        console.log('💪 Ejercicio encontrado:', exercise);
        
        if (exercise) {
            // Adaptar estructura del ejercicio del servidor al formato esperado por el frontend
            const adaptedExerciseData = {
                icono: exercise.icon || exercise.icono || '💪',
                nombre: exercise.name || exercise.nombre || 'Ejercicio',
                categoria: exercise.category || exercise.categoria || 'General',
                tipoSerie: exercise.type || exercise.tipoSerie || 'repeticiones'
            };
            
            modalContent += `
                <div class="exercise-detail-item">
                    <div class="exercise-detail-header">
                        <span style="font-size: 1.5rem;">${adaptedExerciseData.icono}</span>
                        <div>
                            <div class="exercise-detail-name">${index + 1}. ${adaptedExerciseData.nombre}</div>
                            <small style="color: #666;">${adaptedExerciseData.categoria}</small>
                        </div>
                    </div>
                    <div class="exercise-detail-config">
                        <span><strong>Series:</strong> ${adaptedExercise.series}</span>
                        <span><strong>${adaptedExerciseData.tipoSerie === 'repeticiones' ? 'Repeticiones' : 'Tiempo'}:</strong> 
                            ${adaptedExercise.valor}${adaptedExerciseData.tipoSerie === 'tiempo' ? ' segundos' : ''}
                        </span>
                        <span><strong>Descanso:</strong> ${adaptedExercise.descanso} segundos</span>
                    </div>
                </div>
            `;
        }
    }
    
    modalContent += '</div>';
    
    DOM_ELEMENTS.modalRoutineContent.innerHTML = modalContent;
    
    console.log('📝 Contenido del modal generado:', modalContent);
    console.log('🎭 Elemento modal:', DOM_ELEMENTS.routineDetailsModal);
    
    // Mostrar modal
    DOM_ELEMENTS.routineDetailsModal.classList.remove('hidden');
    
    // Guardar ID de rutina actual para acciones del modal
    DOM_ELEMENTS.routineDetailsModal.dataset.currentRoutineId = routineId;
    console.log('📋 Modal abierto con ID de rutina:', routineId);
    console.log('✅ Función showRoutineDetails completada exitosamente');
}

/**
 * Cierra el modal de detalles
 */
function closeRoutineModal() {
    DOM_ELEMENTS.routineDetailsModal.classList.add('hidden');
    delete DOM_ELEMENTS.routineDetailsModal.dataset.currentRoutineId;
}

/**
 * Imprime una rutina
 * @param {string} routineId - ID de la rutina a imprimir
 */
async function printRoutine(routineId) {
    console.log('🖨️ Imprimiendo rutina:', routineId);
    
    try {
        const userRoutines = await getCurrentUserRoutines();
        console.log('📋 Rutinas obtenidas para imprimir:', userRoutines.length);
        
        const routine = userRoutines.find(r => (r._id || r.id) === routineId);
        console.log('🔍 Rutina encontrada para imprimir:', routine);
        console.log('📋 Estructura completa de la rutina:', JSON.stringify(routine, null, 2));
    
    if (!routine) {
        showNotification('Rutina no encontrada', 'error');
        return;
    }
    
        // Crear ventana de impresión
        const printWindow = window.open('', '_blank');
        
        // Debug: Verificar cada campo de la rutina
        console.log('🔍 Campos de la rutina:');
        console.log('  - routine.name:', routine.name);
        console.log('  - routine.nombre:', routine.nombre);
        console.log('  - routine.description:', routine.description);
        console.log('  - routine.descripcion:', routine.descripcion);
        console.log('  - routine.intensity:', routine.intensity);
        console.log('  - routine.intensidad:', routine.intensidad);
        console.log('  - routine.createdAt:', routine.createdAt);
        console.log('  - routine.fechaCreacion:', routine.fechaCreacion);
        console.log('  - routine.exercises:', routine.exercises);
        console.log('  - routine.ejercicios:', routine.ejercicios);
        
        // Adaptar rutina para calcular duración
        const adaptedRoutineForDuration = {
            ejercicios: routine.exercises || routine.ejercicios || []
        };
        const duration = Math.round(calculateRoutineDuration(adaptedRoutineForDuration) / 60);
        const creationDate = new Date(routine.createdAt || routine.fechaCreacion).toLocaleDateString('es-ES');
        // Normalizar intensidad para que coincida con las claves de INTENSITY_LEVELS
        const normalizedIntensity = (routine.intensity || routine.intensidad) ? (routine.intensity || routine.intensidad).toUpperCase() : 'MEDIA';
        const intensityInfo = INTENSITY_LEVELS[normalizedIntensity] || INTENSITY_LEVELS['MEDIA'];
        const currentUser = getCurrentUser();
        
        console.log('🔧 Valores calculados:');
        console.log('  - duration:', duration);
        console.log('  - creationDate:', creationDate);
        console.log('  - normalizedIntensity:', normalizedIntensity);
        console.log('  - intensityInfo:', intensityInfo);
        console.log('  - currentUser:', currentUser);
    
        let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Rutina: ${routine.name || routine.nombre}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
                .routine-info { background: #f8f9ff; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
                .exercise-item { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
                .exercise-name { font-weight: bold; font-size: 1.1em; margin-bottom: 5px; }
                .exercise-details { color: #666; font-size: 0.9em; }
                @media print { body { margin: 20px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏃‍♂️ EduFit - Rutina de Ejercicios</h1>
                <h2>${routine.name || routine.nombre}</h2>
                <p>Preparada por: ${currentUser.name} ${currentUser.lastname}</p>
            </div>
            
            <div class="routine-info">
                <h3>Información de la Rutina</h3>
                <p><strong>Descripción:</strong> ${routine.description || routine.descripcion}</p>
                <p><strong>Nivel de Intensidad:</strong> ${intensityInfo.name}</p>
                <p><strong>Duración Estimada:</strong> ${duration} minutos</p>
                <p><strong>Total de Ejercicios:</strong> ${(routine.exercises || routine.ejercicios || []).length}</p>
                <p><strong>Fecha de Creación:</strong> ${creationDate}</p>
            </div>
            
            <h3>Ejercicios de la Rutina</h3>
    `;
    
    const exercises = routine.exercises || routine.ejercicios || [];
    console.log('📋 Ejercicios para imprimir:', exercises.length);
    
    exercises.forEach((routineEx, index) => {
        console.log(`🔍 Procesando ejercicio ${index + 1} para imprimir:`, routineEx);
        
        // Extraer el ID del ejercicio si es un objeto
        const exerciseId = routineEx.exerciseId || routineEx.ejercicioId;
        const actualExerciseId = typeof exerciseId === 'object' && exerciseId !== null 
            ? (exerciseId._id || exerciseId.id) 
            : exerciseId;
        
        console.log('🔧 ExerciseId para imprimir:', actualExerciseId);
        
        const exercise = findExerciseById(actualExerciseId);
        console.log('💪 Ejercicio encontrado para imprimir:', exercise);
        
        if (exercise) {
            // Adaptar estructura del ejercicio del servidor al formato esperado por el frontend
            const adaptedExercise = {
                icono: exercise.icon || exercise.icono || '💪',
                nombre: exercise.name || exercise.nombre || 'Ejercicio',
                categoria: exercise.category || exercise.categoria || 'General',
                tipoSerie: exercise.type || exercise.tipoSerie || 'repeticiones',
                descripcion: exercise.description || exercise.descripcion || 'Sin descripción'
            };
            
            // Adaptar datos del ejercicio de la rutina
            const adaptedRoutineExercise = {
                series: routineEx.sets || routineEx.series || 3,
                valor: routineEx.reps || routineEx.valor || 12,
                descanso: routineEx.restTime || routineEx.descanso || 60
            };
            
            console.log('🔧 Ejercicio adaptado para imprimir:', adaptedExercise);
            console.log('🔧 Datos de rutina adaptados:', adaptedRoutineExercise);
            
            printContent += `
                <div class="exercise-item">
                    <div class="exercise-name">${index + 1}. ${adaptedExercise.icono} ${adaptedExercise.nombre}</div>
                    <div class="exercise-details">
                        <strong>Categoría:</strong> ${adaptedExercise.categoria} | 
                        <strong>Series:</strong> ${adaptedRoutineExercise.series} | 
                        <strong>${adaptedExercise.tipoSerie === 'repeticiones' ? 'Repeticiones' : 'Tiempo'}:</strong> 
                        ${adaptedRoutineExercise.valor}${adaptedExercise.tipoSerie === 'tiempo' ? ' segundos' : ''} | 
                        <strong>Descanso:</strong> ${adaptedRoutineExercise.descanso} segundos
                    </div>
                    <p style="margin-top: 10px; color: #555; font-size: 0.9em;">${adaptedExercise.descripcion}</p>
                </div>
            `;
        } else {
            console.log('❌ Ejercicio no encontrado para ID:', actualExerciseId);
            printContent += `
                <div class="exercise-item">
                    <div class="exercise-name">${index + 1}. ❌ Ejercicio no encontrado</div>
                    <div class="exercise-details">
                        <strong>ID:</strong> ${actualExerciseId}
                    </div>
                </div>
            `;
        }
    });
    
    printContent += `
            <div style="margin-top: 40px; text-align: center; color: #666; font-size: 0.8em;">
                <p>Rutina generada por EduFit - ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
        </body>
        </html>
    `;
    
        printWindow.document.write(printContent);
        printWindow.document.close();
    
        // Esperar un momento y luego imprimir
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
        
        showNotification('Rutina enviada a impresión', 'success');
        
    } catch (error) {
        console.error('❌ Error imprimiendo rutina:', error);
        showNotification('Error al imprimir la rutina', 'error');
    }
}

/**
 * Elimina una rutina con confirmación
 * @param {string} routineId - ID de la rutina a eliminar
 */
async function deleteRoutine(routineId) {
    const userRoutines = await getCurrentUserRoutines();
    const routine = userRoutines.find(r => r.id === routineId);
    
    if (!routine) {
        showNotification('Rutina no encontrada', 'error');
        return;
    }
    
    // Confirmación
    if (confirm(`¿Estás seguro de que quieres eliminar la rutina "${routine.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        try {
            // Eliminar rutina de MongoDB
            if (typeof EduFitAPI === 'undefined') {
                console.error('EduFitAPI no está disponible');
                return;
            }
            await EduFitAPI.deleteRoutine(routineId);
            
            // Actualizar interfaz
            await updateRoutinesStats();
            await loadUserRoutines();
            
            showNotification(`Rutina "${routine.nombre}" eliminada correctamente`, 'success');
        } catch (error) {
            console.error('Error eliminando rutina:', error);
            showNotification('Error al eliminar la rutina', 'error');
        }
    }
}

/**
 * Inicia el proceso de edición de una rutina
 * @param {string} routineId - ID de la rutina a editar
 */
async function editRoutine(routineId) {
    console.log('🔄 Iniciando edición de rutina:', routineId);
    
    // Buscar la rutina a editar
    const routines = await getCurrentUserRoutines();
    const routine = routines.find(r => r.id === routineId);
    if (!routine) {
        showNotification('Error: Rutina no encontrada', 'error');
        return;
    }
    
    // Configurar modo de edición
    isEditingRoutine = true;
    editingRoutineId = routineId;
    editingRoutineData = { ...routine }; // Copia profunda
    
    console.log('📝 Datos de rutina cargados para edición:', editingRoutineData);
    
    // Ir a la pantalla de crear rutinas
    await showCreateRoutineScreen();
    
    // Cargar los datos de la rutina en el formulario
    setTimeout(async () => {
        await loadRoutineDataForEditing(routine);
    }, 100); // Pequeño delay para asegurar que la pantalla esté lista
}

/**
 * Carga los datos de una rutina existente en el formulario de edición
 * @param {Object} routine - Datos de la rutina a cargar
 */
async function loadRoutineDataForEditing(routine) {
    console.log('📋 Cargando datos de rutina en formulario:', routine);
    
    // Cargar información básica
    if (DOM_ELEMENTS.routineName) {
        DOM_ELEMENTS.routineName.value = routine.nombre;
    }
    
    if (DOM_ELEMENTS.routineIntensity) {
        DOM_ELEMENTS.routineIntensity.value = routine.intensidad;
    }
    
    if (DOM_ELEMENTS.routineDescription) {
        DOM_ELEMENTS.routineDescription.value = routine.descripcion || '';
    }
    
    // Actualizar título de la pantalla
    const titleElement = document.querySelector('#create-routine-container h1');
    if (titleElement) {
        titleElement.textContent = '✏️ Editar Rutina';
    }
    
    // Cambiar texto del botón de guardar
    if (DOM_ELEMENTS.btnSaveRoutine) {
        DOM_ELEMENTS.btnSaveRoutine.innerHTML = '💾 Actualizar Rutina';
    }
    
    // Limpiar ejercicios seleccionados actuales
    await clearRoutineBuilder();
    
    // Cargar ejercicios de la rutina directamente al array principal
    console.log('📥 Cargando', routine.ejercicios.length, 'ejercicios en modo edición...');
    
    routine.ejercicios.forEach(routineExercise => {
        const exercise = findExerciseById(routineExercise.ejercicioId);
        if (exercise) {
            // Agregar al array principal con la configuración existente
            currentRoutineExercises.push({ ...routineExercise });
            
            // Actualizar estado visual de la tarjeta
            updateExerciseCardSelection(exercise.id);
            
            console.log('✅ Ejercicio cargado:', exercise.nombre, routineExercise);
        }
    });
    
    // Actualizar la UI usando el sistema estándar
    await updateRoutineBuilder();
    
    showNotification('Rutina cargada para edición', 'info');
}

/**
 * Agrega un ejercicio a la rutina con configuración específica
 * NOTA: Esta función ya no se usa para la carga de rutinas en modo edición.
 * Se mantiene para compatibilidad futura si se necesita.
 * @param {Object} exercise - Datos del ejercicio
 * @param {Object} routineExercise - Configuración específica del ejercicio en la rutina
 */
function addExerciseToRoutine(exercise, routineExercise) {
    // Crear elemento HTML para el ejercicio seleccionado
    const exerciseElement = document.createElement('div');
    exerciseElement.className = 'selected-exercise-item';
    exerciseElement.dataset.exerciseId = exercise.id;
    
    const serieType = exercise.tipoSerie === 'repeticiones' ? 'reps' : 'segundos';
    const serieLabel = exercise.tipoSerie === 'repeticiones' ? 'Repeticiones' : 'Tiempo (seg)';
    
    exerciseElement.innerHTML = `
        <div class="selected-exercise-info">
            <span class="selected-exercise-icon">${exercise.icono}</span>
            <span class="selected-exercise-name">${exercise.nombre}</span>
        </div>
        <div class="selected-exercise-config">
            <div class="config-group">
                <label>Series:</label>
                <input type="number" class="config-input series-input" 
                       value="${routineExercise.series}" min="1" max="10">
            </div>
            <div class="config-group">
                <label>${serieLabel}:</label>
                <input type="number" class="config-input ${serieType}-input" 
                       value="${routineExercise.valor}" min="1" max="${exercise.tipoSerie === 'repeticiones' ? '100' : '300'}">
            </div>
            <div class="config-group">
                <label>Descanso (seg):</label>
                <input type="number" class="config-input rest-input" 
                       value="${routineExercise.descanso}" min="0" max="300">
            </div>
            <button class="remove-exercise" data-exercise-id="${exercise.id}">
                🗑️ Quitar
            </button>
        </div>
    `;
    
    // Agregar event listeners para actualizar estadísticas
    const inputs = exerciseElement.querySelectorAll('.config-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateRoutineStats();
            updateRoutineButtons();
        });
    });
    
    // Agregar event listener para el botón de eliminar
    const removeBtn = exerciseElement.querySelector('.remove-exercise');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            console.log('🗑️ Eliminando ejercicio:', exercise.id);
            const exerciseId = e.target.dataset.exerciseId;
            toggleExerciseSelection(exerciseId);
        });
    }
    
    // Agregar al contenedor
    DOM_ELEMENTS.selectedExercisesList.appendChild(exerciseElement);
}

// ===================================
// PANTALLA AGREGAR EJERCICIO - LÓGICA
// ===================================

/**
 * Inicializa la pantalla de agregar ejercicio
 */
function initializeAddExerciseScreen() {
    console.log('🏋️ Inicializando pantalla de agregar ejercicio...');
    
    // Limpiar formulario
    clearAddExerciseForm();
    
    // Configurar vista previa inicial
    updateExercisePreview();
    
    // Configurar event listeners para vista previa en tiempo real
    setupExercisePreviewListeners();
}

/**
 * Limpia el formulario de agregar ejercicio
 */
function clearAddExerciseForm() {
    if (DOM_ELEMENTS.addExerciseForm) {
        DOM_ELEMENTS.addExerciseForm.reset();
        
        // Resetear valores por defecto
        DOM_ELEMENTS.exerciseDefaultSeries.value = 3;
        DOM_ELEMENTS.exerciseDefaultValue.value = 12;
        DOM_ELEMENTS.exerciseDefaultRest.value = 60;
        
        // Actualizar vista previa
        updateExercisePreview();
    }
}

/**
 * Configura los event listeners para la vista previa en tiempo real
 */
function setupExercisePreviewListeners() {
    // Campos que actualizan la vista previa
    const previewFields = [
        DOM_ELEMENTS.exerciseName,
        DOM_ELEMENTS.exerciseDescription,
        DOM_ELEMENTS.exerciseCategory,
        DOM_ELEMENTS.exerciseIcon,
        DOM_ELEMENTS.exerciseType,
        DOM_ELEMENTS.exerciseDefaultSeries,
        DOM_ELEMENTS.exerciseDefaultValue,
        DOM_ELEMENTS.exerciseDefaultRest
    ];
    
    previewFields.forEach(field => {
        if (field) {
            field.addEventListener('input', updateExercisePreview);
            field.addEventListener('change', updateExercisePreview);
        }
    });
    
    // Event listener especial para cambio de tipo de serie
    if (DOM_ELEMENTS.exerciseType) {
        DOM_ELEMENTS.exerciseType.addEventListener('change', handleExerciseTypeChange);
    }
}

/**
 * Actualiza la vista previa del ejercicio en tiempo real
 */
function updateExercisePreview() {
    const name = DOM_ELEMENTS.exerciseName?.value.trim() || 'Nombre del ejercicio';
    const description = DOM_ELEMENTS.exerciseDescription?.value.trim() || 'Descripción del ejercicio';
    const category = DOM_ELEMENTS.exerciseCategory?.value || 'Categoría';
    const icon = DOM_ELEMENTS.exerciseIcon?.value || '❓';
    const type = DOM_ELEMENTS.exerciseType?.value || 'repeticiones';
    const series = DOM_ELEMENTS.exerciseDefaultSeries?.value || '3';
    const value = DOM_ELEMENTS.exerciseDefaultValue?.value || '12';
    const rest = DOM_ELEMENTS.exerciseDefaultRest?.value || '60';
    
    // Actualizar vista previa
    if (DOM_ELEMENTS.exercisePreviewIcon) {
        DOM_ELEMENTS.exercisePreviewIcon.textContent = icon;
    }
    
    if (DOM_ELEMENTS.exercisePreviewName) {
        DOM_ELEMENTS.exercisePreviewName.textContent = name;
    }
    
    if (DOM_ELEMENTS.exercisePreviewCategory) {
        const typeText = type === 'repeticiones' ? 'Repeticiones' : 'Tiempo';
        DOM_ELEMENTS.exercisePreviewCategory.textContent = `${category} • ${typeText}`;
    }
    
    if (DOM_ELEMENTS.exercisePreviewDescription) {
        DOM_ELEMENTS.exercisePreviewDescription.textContent = description;
    }
    
    if (DOM_ELEMENTS.previewSeries) {
        DOM_ELEMENTS.previewSeries.textContent = series;
    }
    
    if (DOM_ELEMENTS.previewValue) {
        DOM_ELEMENTS.previewValue.textContent = value + (type === 'tiempo' ? 's' : '');
    }
    
    if (DOM_ELEMENTS.previewRest) {
        DOM_ELEMENTS.previewRest.textContent = rest;
    }
    
    if (DOM_ELEMENTS.previewValueType) {
        DOM_ELEMENTS.previewValueType.textContent = type === 'repeticiones' ? 'Repeticiones:' : 'Tiempo:';
    }
}

/**
 * Maneja el cambio de tipo de serie (repeticiones/tiempo)
 */
function handleExerciseTypeChange() {
    const type = DOM_ELEMENTS.exerciseType?.value;
    
    if (type === 'tiempo') {
        // Cambiar a configuración de tiempo
        DOM_ELEMENTS.valueLabel.innerHTML = '<span id="value-label">Tiempo por Defecto (segundos) *</span>';
        DOM_ELEMENTS.valueHelp.textContent = '1-300 segundos';
        DOM_ELEMENTS.exerciseDefaultValue.max = 300;
        DOM_ELEMENTS.exerciseDefaultValue.value = 30; // Valor por defecto para tiempo
    } else {
        // Cambiar a configuración de repeticiones
        DOM_ELEMENTS.valueLabel.innerHTML = '<span id="value-label">Repeticiones por Defecto *</span>';
        DOM_ELEMENTS.valueHelp.textContent = '1-50 repeticiones';
        DOM_ELEMENTS.exerciseDefaultValue.max = 50;
        DOM_ELEMENTS.exerciseDefaultValue.value = 12; // Valor por defecto para repeticiones
    }
    
    // Actualizar vista previa
    updateExercisePreview();
}

/**
 * Maneja el envío del formulario de agregar ejercicio
 */
async function handleAddExerciseSubmit(event) {
    event.preventDefault();
    
    console.log('📝 Procesando nuevo ejercicio...');
    
    // Obtener datos del formulario
    const formData = new FormData(DOM_ELEMENTS.addExerciseForm);
    const exerciseData = {
        name: formData.get('name'),
        description: formData.get('description'),
        category: formData.get('category'),
        intensity: 'Media', // Valor por defecto
        duration: 30, // Valor por defecto en minutos
        instructions: [formData.get('description')], // Usar descripción como instrucción
        equipment: [], // Array vacío por defecto
        muscleGroups: [] // Array vacío por defecto
    };
    
    console.log('📋 Datos del ejercicio:', exerciseData);
    
    // Validar datos
    const validation = await validateExerciseData(exerciseData);
    
    if (!validation.isValid) {
        console.error('❌ Errores de validación:', validation.errors);
        showNotification(`Error: ${validation.errors[0]}`, 'error');
        return;
    }
    
    try {
        // Guardar ejercicio
        const savedExercise = await saveCustomExercise(exerciseData);
        
        // Mostrar éxito
        showNotification(`¡Ejercicio "${savedExercise.name}" creado exitosamente!`, 'success');
        
        // Volver al dashboard después de un breve delay
        setTimeout(() => {
            backToDashboardFromAddExercise();
        }, 1500);
        
    } catch (error) {
        console.error('❌ Error al guardar ejercicio:', error);
        showNotification('Error al guardar el ejercicio. Inténtalo de nuevo.', 'error');
    }
}

/**
 * Maneja la cancelación del formulario
 */
function handleAddExerciseCancel() {
    const hasData = DOM_ELEMENTS.exerciseName?.value.trim() || 
                   DOM_ELEMENTS.exerciseDescription?.value.trim();
    
    if (hasData) {
        const confirm = window.confirm('¿Estás seguro de que quieres cancelar? Se perderán los datos ingresados.');
        if (!confirm) return;
    }
    
    backToDashboardFromAddExercise();
}

// ===================================
// GESTIÓN DE ALUMNOS
// ===================================

/**
 * Inicializa la pantalla de gestión de alumnos
 */
function initializeStudentManagementScreen() {
    console.log('👥 Inicializando pantalla de gestión de alumnos');
    
    // Limpiar formulario
    clearStudentForm();
    
    // Cargar alumnos
    loadStudents();
    
    // Configurar filtros
    setupStudentFilters();
}

/**
 * Limpia el formulario de estudiante
 */
function clearStudentForm() {
    if (DOM_ELEMENTS.addStudentForm) {
        DOM_ELEMENTS.addStudentForm.reset();
    }
    
    // Resetear estado de edición
    isEditingStudent = false;
    editingStudentId = null;
    editingStudentData = null;
    
    // Cambiar texto del botón
    if (DOM_ELEMENTS.btnSaveStudent) {
        DOM_ELEMENTS.btnSaveStudent.textContent = 'Guardar Alumno';
    }
}

/**
 * Obtiene todos los estudiantes del profesor actual
 */
async function getCurrentUserStudents() {
    try {
        const response = await EduFitAPI.getStudents();
        return response.data || [];
    } catch (error) {
        console.error('Error obteniendo alumnos:', error);
        return [];
    }
}

/**
 * Guarda un estudiante en LocalStorage
 */
async function saveStudent(studentData) {
    try {
        if (isEditingStudent && editingStudentId) {
            // Actualizar estudiante existente
            const response = await EduFitAPI.updateStudent(editingStudentId, studentData);
            console.log('✅ Alumno actualizado:', editingStudentId);
            return response;
        } else {
            // Crear nuevo estudiante
            const response = await EduFitAPI.createStudent(studentData);
            console.log('✅ Alumno guardado:', response.data.name);
            return response;
        }
    } catch (error) {
        console.error('Error guardando alumno:', error);
        throw error;
    }
}

/**
 * Valida los datos del formulario de estudiante
 */
async function validateStudentData(studentData) {
    const errors = [];
    
    // Validar campos requeridos
    if (!studentData.name || studentData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!studentData.lastname || studentData.lastname.trim().length < 2) {
        errors.push('El apellido debe tener al menos 2 caracteres');
    }
    
    if (!studentData.birthdate) {
        errors.push('La fecha de nacimiento es requerida');
    } else {
        // Validar que la fecha no sea futura
        const birthDate = new Date(studentData.birthdate);
        const today = new Date();
        if (birthDate > today) {
            errors.push('La fecha de nacimiento no puede ser futura');
        }
        
        // Validar que la fecha no sea muy antigua (más de 100 años)
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age > 100) {
            errors.push('La fecha de nacimiento no puede ser tan antigua');
        }
    }
    
    // Validar estatura si se proporciona
    if (studentData.height && (studentData.height < 100 || studentData.height > 250)) {
        errors.push('La estatura debe estar entre 100 y 250 cm');
    }
    
    // Validar peso si se proporciona
    if (studentData.weight && (studentData.weight < 20 || studentData.weight > 200)) {
        errors.push('El peso debe estar entre 20 y 200 kg');
    }
    
    // Validar longitudes de texto
    if (studentData.medicalConditions && studentData.medicalConditions.length > 300) {
        errors.push('Las condiciones médicas no pueden exceder 300 caracteres');
    }
    
    if (studentData.observations && studentData.observations.length > 500) {
        errors.push('Las observaciones no pueden exceder 500 caracteres');
    }
    
    // Verificar que no exista otro alumno con el mismo nombre y apellido
    const existingStudents = await getCurrentUserStudents();
    const fullName = `${studentData.name.trim()} ${studentData.lastname.trim()}`.toLowerCase();
    
    const duplicate = existingStudents.find(student => {
        if (isEditingStudent && student.id === editingStudentId) return false;
        const studentFullName = `${student.name} ${student.lastname}`.toLowerCase();
        return studentFullName === fullName;
    });
    
    if (duplicate) {
        errors.push('Ya existe un alumno con ese nombre y apellido');
    }
    
    return errors;
}

/**
 * Maneja el envío del formulario de alumno
 */
async function handleStudentFormSubmit(event) {
    event.preventDefault();
    
    console.log('👥 Procesando formulario de alumno');
    
    try {
        // Recopilar datos del formulario
        const formData = {
            name: DOM_ELEMENTS.studentName.value.trim(),
            lastname: DOM_ELEMENTS.studentLastname.value.trim(),
            birthdate: DOM_ELEMENTS.studentBirthdate.value,
            grade: DOM_ELEMENTS.studentGrade.value.trim(),
            height: DOM_ELEMENTS.studentHeight.value ? parseInt(DOM_ELEMENTS.studentHeight.value) : null,
            weight: DOM_ELEMENTS.studentWeight.value ? parseFloat(DOM_ELEMENTS.studentWeight.value) : null,
            medicalConditions: DOM_ELEMENTS.studentMedicalConditions.value.trim(),
            observations: DOM_ELEMENTS.studentObservations.value.trim(),
            fitnessLevel: DOM_ELEMENTS.studentFitnessLevel.value
        };
        
        // 🔧 ADAPTAR DATOS DEL FRONTEND AL BACKEND
        const studentData = {
            name: formData.name,
            email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}.${formData.lastname.toLowerCase().replace(/\s+/g, '.')}@edufit.com`, // Generar email automático
            birthDate: formData.birthdate, // Backend usa birthDate (camelCase)
            schedule: formData.grade, // Backend usa schedule en lugar de grade
            height: parseInt(formData.height) || 150, // Convertir a número o usar valor por defecto
            weight: parseFloat(formData.weight) || 50, // Convertir a número o usar valor por defecto
            fitnessLevel: formData.fitnessLevel || '',
            observations: formData.observations || ''
            // Nota: medicalConditions no existe en el backend, se guarda en observations
        };
        
        console.log('📝 Datos del formulario:', formData);
        console.log('🔧 Datos adaptados para backend:', studentData);
        
        // Validar datos (usar formData para validación, studentData para envío)
        const errors = await validateStudentData(formData);
        if (errors.length > 0) {
            showNotification(`Errores en el formulario:\n${errors.join('\n')}`, 'error');
            return;
        }
        
        // Guardar estudiante
        await saveStudent(studentData);
        
        // Mostrar notificación de éxito
        const action = isEditingStudent ? 'actualizado' : 'agregado';
        showNotification(`Alumno ${action} exitosamente`, 'success');
        
        // Recargar lista de alumnos
        loadStudents();
        
        // Limpiar formulario
        clearStudentForm();
        
    } catch (error) {
        console.error('Error al guardar alumno:', error);
        showNotification('Error al guardar el alumno', 'error');
    }
}

/**
 * Maneja la cancelación del formulario de alumno
 */
function handleStudentFormCancel() {
    const hasData = DOM_ELEMENTS.studentName?.value.trim() || 
                   DOM_ELEMENTS.studentLastname?.value.trim();
    
    if (hasData) {
        const confirm = window.confirm('¿Estás seguro de que quieres cancelar? Se perderán los datos ingresados.');
        if (!confirm) return;
    }
    
    clearStudentForm();
}

/**
 * Carga y muestra todos los alumnos
 */
async function loadStudents() {
    console.log('👥 Cargando alumnos');
    
    const students = await getCurrentUserStudents();
    
    // Actualizar contador
    if (DOM_ELEMENTS.studentsCount) {
        DOM_ELEMENTS.studentsCount.textContent = `${students.length} alumno${students.length !== 1 ? 's' : ''} registrado${students.length !== 1 ? 's' : ''}`;
    }
    
    // Mostrar/ocultar mensaje de no hay estudiantes
    if (DOM_ELEMENTS.noStudentsMessage) {
        if (students.length === 0) {
            DOM_ELEMENTS.noStudentsMessage.classList.remove('hidden');
        } else {
            DOM_ELEMENTS.noStudentsMessage.classList.add('hidden');
        }
    }
    
    // Renderizar alumnos
    renderStudents(students);
}

/**
 * Renderiza la lista de alumnos en formato tabla
 */
function renderStudents(students) {
    if (!DOM_ELEMENTS.studentsList) return;
    
    DOM_ELEMENTS.studentsList.innerHTML = '';
    
    students.forEach(student => {
        const studentRow = createStudentRow(student);
        DOM_ELEMENTS.studentsList.appendChild(studentRow);
    });
}

/**
 * Crea una fila HTML para un alumno en la tabla
 */
function createStudentRow(student) {
    const row = document.createElement('tr');
    
    // 🔧 ADAPTAR DATOS DEL BACKEND AL FRONTEND
    const adaptedStudent = {
        name: student.name || 'Sin nombre',
        lastname: student.lastname || '', // El backend no tiene lastname
        birthdate: student.birthDate || student.birthdate, // Backend usa birthDate
        grade: student.schedule || student.grade, // Backend usa schedule
        height: student.height,
        weight: student.weight,
        fitnessLevel: student.fitnessLevel,
        observations: student.observations,
        medicalConditions: student.medicalConditions || '' // Backend no tiene este campo
    };
    
    console.log('🔍 Datos originales del estudiante:', student);
    console.log('🔧 Datos adaptados:', adaptedStudent);
    
    // Calcular edad
    const birthDate = adaptedStudent.birthdate ? new Date(adaptedStudent.birthdate) : null;
    const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : 'N/A';
    
    // Obtener emoji para nivel de condición física
    const fitnessEmoji = getFitnessEmoji(adaptedStudent.fitnessLevel);
    
    // Preparar observaciones (combinar observaciones y condiciones médicas)
    let observations = '';
    if (adaptedStudent.observations) {
        observations += `📝 ${adaptedStudent.observations}`;
    }
    if (adaptedStudent.medicalConditions) {
        if (observations) observations += '<br>';
        observations += `🏥 ${adaptedStudent.medicalConditions}`;
    }
    
    // Crear las celdas una por una para evitar problemas con template strings
    const nameCell = document.createElement('td');
    nameCell.className = 'student-name';
    nameCell.textContent = `${adaptedStudent.name} ${adaptedStudent.lastname}`.trim();
    
    const gradeCell = document.createElement('td');
    gradeCell.className = 'student-grade';
    gradeCell.textContent = adaptedStudent.grade || '-';
    
    const ageCell = document.createElement('td');
    ageCell.className = 'student-age';
    ageCell.textContent = `${age} años`;
    
    const heightCell = document.createElement('td');
    heightCell.className = 'student-measurements';
    heightCell.textContent = adaptedStudent.height ? `${adaptedStudent.height} cm` : '-';
    
    const weightCell = document.createElement('td');
    weightCell.className = 'student-measurements';
    weightCell.textContent = adaptedStudent.weight ? `${adaptedStudent.weight} kg` : '-';
    
    const fitnessCell = document.createElement('td');
    if (adaptedStudent.fitnessLevel) {
        const fitnessSpan = document.createElement('span');
        fitnessSpan.className = `fitness-level ${adaptedStudent.fitnessLevel}`;
        fitnessSpan.textContent = `${fitnessEmoji} ${adaptedStudent.fitnessLevel}`;
        fitnessCell.appendChild(fitnessSpan);
    } else {
        fitnessCell.textContent = 'Sin evaluar';
        fitnessCell.style.color = '#7f8c8d';
        fitnessCell.style.fontStyle = 'italic';
    }
    
    const observationsCell = document.createElement('td');
    observationsCell.className = `student-observations ${observations.length > 100 ? 'short' : ''}`;
    observationsCell.innerHTML = observations || '-';
    
    const actionsCell = document.createElement('td');
    actionsCell.className = 'student-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit-student';
    editBtn.textContent = '✏️ Editar';
    editBtn.onclick = () => editStudent(student.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete-student';
    deleteBtn.textContent = '🗑️ Eliminar';
    deleteBtn.onclick = () => deleteStudent(student.id);
    
    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
    
    // Agregar todas las celdas a la fila
    row.appendChild(nameCell);
    row.appendChild(gradeCell);
    row.appendChild(ageCell);
    row.appendChild(heightCell);
    row.appendChild(weightCell);
    row.appendChild(fitnessCell);
    row.appendChild(observationsCell);
    row.appendChild(actionsCell);
    
    return row;
}

/**
 * Obtiene emoji para nivel de condición física
 */
function getFitnessEmoji(level) {
    switch (level) {
        case 'BAJO': return '🟢';
        case 'MEDIO': return '🟡';
        case 'ALTO': return '🔴';
        default: return '⚪';
    }
}


/**
 * Edita un alumno existente
 */
async function editStudent(studentId) {
    console.log('✏️ Editando alumno:', studentId);
    
    const students = await getCurrentUserStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        showNotification('Alumno no encontrado', 'error');
        return;
    }
    
    // Activar modo edición
    isEditingStudent = true;
    editingStudentId = studentId;
    editingStudentData = student;
    
    // 🔧 ADAPTAR DATOS DEL BACKEND AL FRONTEND para edición
    const adaptedStudent = {
        name: student.name || '',
        lastname: student.lastname || '', // El backend no tiene lastname
        birthdate: student.birthDate || student.birthdate, // Backend usa birthDate
        grade: student.schedule || student.grade, // Backend usa schedule
        height: student.height || '',
        weight: student.weight || '',
        medicalConditions: student.medicalConditions || '', // Backend no tiene este campo
        observations: student.observations || '',
        fitnessLevel: student.fitnessLevel || ''
    };
    
    console.log('🔍 Datos originales del estudiante para editar:', student);
    console.log('🔧 Datos adaptados para formulario:', adaptedStudent);
    
    // Llenar formulario con datos adaptados del estudiante
    DOM_ELEMENTS.studentName.value = adaptedStudent.name;
    DOM_ELEMENTS.studentLastname.value = adaptedStudent.lastname;
    DOM_ELEMENTS.studentBirthdate.value = adaptedStudent.birthdate;
    DOM_ELEMENTS.studentGrade.value = adaptedStudent.grade;
    DOM_ELEMENTS.studentHeight.value = adaptedStudent.height;
    DOM_ELEMENTS.studentWeight.value = adaptedStudent.weight;
    DOM_ELEMENTS.studentMedicalConditions.value = adaptedStudent.medicalConditions;
    DOM_ELEMENTS.studentObservations.value = adaptedStudent.observations;
    DOM_ELEMENTS.studentFitnessLevel.value = adaptedStudent.fitnessLevel;
    
    // Cambiar texto del botón
    DOM_ELEMENTS.btnSaveStudent.textContent = 'Actualizar Alumno';
    
    // Scroll al top de la página
    setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 100);
}

/**
 * Elimina un alumno
 */
async function deleteStudent(studentId) {
    console.log('🗑️ Eliminando alumno:', studentId);
    
    const students = await getCurrentUserStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        showNotification('Alumno no encontrado', 'error');
        return;
    }
    
    const confirm = window.confirm(`¿Estás seguro de que quieres eliminar a ${student.name} ${student.lastname}?`);
    if (!confirm) return;
    
    try {
        // Eliminar alumno de MongoDB
        if (typeof EduFitAPI === 'undefined') {
            console.error('EduFitAPI no está disponible');
            return;
        }
        await EduFitAPI.deleteStudent(studentId);
        
        showNotification('Alumno eliminado exitosamente', 'success');
        await loadStudents();
        
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        showNotification('Error al eliminar el alumno', 'error');
    }
}

/**
 * Configura los filtros de alumnos
 */
async function setupStudentFilters() {
    // Configurar filtro de horario
    if (DOM_ELEMENTS.filterGrade) {
        const students = await getCurrentUserStudents();
        // 🔧 Usar schedule (backend) o grade (frontend) para filtros
        const grades = [...new Set(students.map(s => s.schedule || s.grade).filter(g => g))];
        
        // Limpiar opciones existentes (excepto la primera)
        DOM_ELEMENTS.filterGrade.innerHTML = '<option value="">Todos los horarios</option>';
        
        grades.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade;
            option.textContent = grade;
            DOM_ELEMENTS.filterGrade.appendChild(option);
        });
    }
}

/**
 * Filtra alumnos según los criterios seleccionados
 */
async function filterStudents() {
    const students = await getCurrentUserStudents();
    let filteredStudents = [...students];
    
    // Filtrar por horario
    const gradeFilter = DOM_ELEMENTS.filterGrade?.value;
    if (gradeFilter) {
        // 🔧 Usar schedule (backend) o grade (frontend) para filtros
        filteredStudents = filteredStudents.filter(s => (s.schedule || s.grade) === gradeFilter);
    }
    
    // Filtrar por condición física
    const fitnessFilter = DOM_ELEMENTS.filterFitness?.value;
    if (fitnessFilter) {
        filteredStudents = filteredStudents.filter(s => s.fitnessLevel === fitnessFilter);
    }
    
    // Renderizar alumnos filtrados
    renderStudents(filteredStudents);
    
    // Actualizar contador
    if (DOM_ELEMENTS.studentsCount) {
        DOM_ELEMENTS.studentsCount.textContent = `${filteredStudents.length} alumno${filteredStudents.length !== 1 ? 's' : ''} mostrado${filteredStudents.length !== 1 ? 's' : ''}`;
    }
}

/**
 * Limpia los filtros de alumnos
 */
function clearStudentFilters() {
    if (DOM_ELEMENTS.filterGrade) DOM_ELEMENTS.filterGrade.value = '';
    if (DOM_ELEMENTS.filterFitness) DOM_ELEMENTS.filterFitness.value = '';
    
    loadStudents();
}

// Funciones globales para los onclick en HTML
window.showRoutineDetails = showRoutineDetails;
window.printRoutine = printRoutine;
window.deleteRoutine = deleteRoutine;
window.editRoutine = editRoutine;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;

// ===================================
// VALIDACIÓN DE FORMULARIOS
// ===================================

/**
 * Valida los datos del formulario de registro
 * @param {Object} userData - Datos del usuario a validar
 * @returns {Object} Objeto con isValid y errores
 */
function validateRegistrationData(userData) {
    const errors = [];
    
    // Validar nombre
    if (!userData.name.trim()) {
        errors.push('El nombre es obligatorio');
    } else if (userData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    // Validar apellido
    if (!userData.lastname.trim()) {
        errors.push('El apellido es obligatorio');
    } else if (userData.lastname.trim().length < 2) {
        errors.push('El apellido debe tener al menos 2 caracteres');
    }
    
    // Validar fecha de nacimiento
    if (!userData.birthdate) {
        errors.push('La fecha de nacimiento es obligatoria');
    } else {
        const age = calculateAge(userData.birthdate);
        if (age < 18) {
            errors.push('Debes ser mayor de edad para registrarte');
        } else if (age > 100) {
            errors.push('Por favor verifica tu fecha de nacimiento');
        }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
        errors.push('El correo electrónico es obligatorio');
    } else if (!emailRegex.test(userData.email)) {
        errors.push('El formato del correo electrónico no es válido');
    }
    
    // Validar contraseña
    if (!userData.password) {
        errors.push('La contraseña es obligatoria');
    } else if (userData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Valida los datos del formulario de login
 * @param {string} email - Email ingresado
 * @param {string} password - Contraseña ingresada
 * @returns {Object} Objeto con isValid y errores
 */
function validateLoginData(email, password) {
    const errors = [];
    
    if (!email.trim()) {
        errors.push('El correo electrónico es obligatorio');
    }
    
    if (!password) {
        errors.push('La contraseña es obligatoria');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ===================================
// NAVEGACIÓN ENTRE PANTALLAS
// ===================================

/**
 * Muestra el formulario de registro y oculta el de login
 */
function showRegisterForm() {
    hideFormErrors();
    DOM_ELEMENTS.loginFormContainer.classList.add('hidden');
    DOM_ELEMENTS.registerFormContainer.classList.remove('hidden');
    DOM_ELEMENTS.registerFormContainer.classList.add('fade-in');
    
    // Limpiar formularios
    DOM_ELEMENTS.loginForm.reset();
    DOM_ELEMENTS.registerForm.reset();
}

/**
 * Muestra el formulario de login y oculta el de registro
 */
function showLoginForm() {
    hideFormErrors();
    DOM_ELEMENTS.registerFormContainer.classList.add('hidden');
    DOM_ELEMENTS.loginFormContainer.classList.remove('hidden');
    DOM_ELEMENTS.loginFormContainer.classList.add('fade-in');
    
    // Limpiar formularios
    DOM_ELEMENTS.loginForm.reset();
    DOM_ELEMENTS.registerForm.reset();
}

/**
 * Muestra el dashboard y oculta la pantalla de autenticación
 */
async function showDashboard() {
    console.log('🏠 Navegando a: Dashboard');
    
    // Ocultar pantalla de autenticación
    DOM_ELEMENTS.authContainer.classList.add('hidden');
    
    // Ocultar todas las otras pantallas
    hideAllScreens();
    
    // Mostrar solo el dashboard
    DOM_ELEMENTS.dashboardContainer.classList.remove('hidden');
    DOM_ELEMENTS.dashboardContainer.classList.add('fade-in');
    
    // Actualizar información del usuario en el dashboard
    updateDashboardInfo();
    
    // Inicializar ejercicios por defecto solo cuando el usuario esté autenticado
    try {
        await initializeDefaultExercises();
    } catch (error) {
        console.error('Error inicializando ejercicios:', error);
    }
}

/**
 * Muestra la pantalla de autenticación y oculta el dashboard
 */
function showAuthScreen() {
    DOM_ELEMENTS.dashboardContainer.classList.add('hidden');
    DOM_ELEMENTS.authContainer.classList.remove('hidden');
    DOM_ELEMENTS.authContainer.classList.add('fade-in');
    
    // Mostrar formulario de login por defecto
    showLoginForm();
}

/**
 * Actualiza la información del usuario en el dashboard
 */
function updateDashboardInfo() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Actualizar nombre en el header
    DOM_ELEMENTS.userNameHeader.textContent = currentUser.name || 'Usuario';
    
    // Actualizar información personal
    DOM_ELEMENTS.displayName.textContent = currentUser.name || 'No especificado';
    DOM_ELEMENTS.displayLastname.textContent = currentUser.lastname || 'No especificado';
    DOM_ELEMENTS.displayEmail.textContent = currentUser.email || 'Email no especificado';
    DOM_ELEMENTS.displayBirthdate.textContent = formatDate(currentUser.birthdate);
    DOM_ELEMENTS.displayAge.textContent = `${calculateAge(currentUser.birthdate)} años`;
    
    // Mostrar fecha actual
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    DOM_ELEMENTS.currentDate.textContent = today.toLocaleDateString('es-ES', options);
}

/**
 * Inicia la edición del perfil completo
 */
function startEditProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Ocultar valores mostrados y mostrar inputs
    DOM_ELEMENTS.displayName.classList.add('hidden');
    DOM_ELEMENTS.displayLastname.classList.add('hidden');
    DOM_ELEMENTS.displayEmail.classList.add('hidden');
    DOM_ELEMENTS.displayBirthdate.classList.add('hidden');
    
    DOM_ELEMENTS.editNameInput.classList.remove('hidden');
    DOM_ELEMENTS.editLastnameInput.classList.remove('hidden');
    DOM_ELEMENTS.editEmailInput.classList.remove('hidden');
    DOM_ELEMENTS.editBirthdateInput.classList.remove('hidden');
    
    // Precargar valores actuales
    DOM_ELEMENTS.editNameInput.value = currentUser.name || '';
    DOM_ELEMENTS.editLastnameInput.value = currentUser.lastname || '';
    DOM_ELEMENTS.editEmailInput.value = currentUser.email || '';
    
    if (currentUser.birthdate) {
        // Crear fecha solo con día, sin hora
        const date = new Date(currentUser.birthdate);
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            DOM_ELEMENTS.editBirthdateInput.value = `${year}-${month}-${day}`;
        }
    }
    
    // Cambiar botones
    DOM_ELEMENTS.editProfileBtn.classList.add('hidden');
    DOM_ELEMENTS.saveProfileBtn.classList.remove('hidden');
    DOM_ELEMENTS.cancelProfileBtn.classList.remove('hidden');
    
    // Enfocar el primer input
    DOM_ELEMENTS.editNameInput.focus();
}

/**
 * Guarda todos los cambios del perfil
 */
async function saveProfile() {
    const name = DOM_ELEMENTS.editNameInput.value.trim();
    const lastname = DOM_ELEMENTS.editLastnameInput.value.trim();
    const email = DOM_ELEMENTS.editEmailInput.value.trim();
    const birthdate = DOM_ELEMENTS.editBirthdateInput.value;
    
    // Validaciones básicas
    if (!name) {
        showNotification('El nombre es requerido', 'error');
        DOM_ELEMENTS.editNameInput.focus();
        return;
    }
    
    if (!email) {
        showNotification('El email es requerido', 'error');
        DOM_ELEMENTS.editEmailInput.focus();
        return;
    }
    
    try {
        showLoading(true);
        
        console.log('🔄 Actualizando perfil completo:', { name, lastname, email, birthdate });
        
        // Llamar a la API para actualizar todos los campos
        const response = await EduFitAPI.updateUser({
            name,
            lastname,
            email,
            birthdate
        });
        
        if (response.success) {
            // Actualizar el usuario localmente con los datos del servidor
            setCurrentUser(response.data.user);
            
            // Actualizar la información en el dashboard
            updateDashboardInfo();
            
            showNotification('Perfil actualizado correctamente', 'success');
            
            // Salir del modo de edición
            cancelEditProfile();
        } else {
            throw new Error(response.message || 'Error al actualizar el perfil');
        }
        
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        showNotification('Error al actualizar el perfil', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Cancela la edición del perfil
 */
function cancelEditProfile() {
    // Ocultar inputs y mostrar valores
    DOM_ELEMENTS.editNameInput.classList.add('hidden');
    DOM_ELEMENTS.editLastnameInput.classList.add('hidden');
    DOM_ELEMENTS.editEmailInput.classList.add('hidden');
    DOM_ELEMENTS.editBirthdateInput.classList.add('hidden');
    
    DOM_ELEMENTS.displayName.classList.remove('hidden');
    DOM_ELEMENTS.displayLastname.classList.remove('hidden');
    DOM_ELEMENTS.displayEmail.classList.remove('hidden');
    DOM_ELEMENTS.displayBirthdate.classList.remove('hidden');
    
    // Cambiar botones
    DOM_ELEMENTS.editProfileBtn.classList.remove('hidden');
    DOM_ELEMENTS.saveProfileBtn.classList.add('hidden');
    DOM_ELEMENTS.cancelProfileBtn.classList.add('hidden');
}

// ===================================
// MANEJO DE AUTENTICACIÓN
// ===================================

/**
 * Procesa el registro de un nuevo usuario
 * @param {Event} event - Evento del formulario
 */
async function handleRegistration(event) {
    event.preventDefault();
    
    // Mostrar loading
    showLoading(true);
    
    // Simular delay de red (para hacer más realista)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
        // Obtener datos del formulario
        const userData = {
            name: DOM_ELEMENTS.registerName.value.trim(),
            lastname: DOM_ELEMENTS.registerLastname.value.trim(),
            email: DOM_ELEMENTS.registerEmail.value.trim(),
            password: DOM_ELEMENTS.registerPassword.value,
            birthdate: DOM_ELEMENTS.registerBirthdate.value
        };
        
        console.log('🔍 Datos del formulario capturados:', userData);
        
        // Validaciones básicas
        if (!userData.name || !userData.email || !userData.password || !userData.birthdate) {
            showFormError('register', 'Todos los campos son requeridos');
            return;
        }
        
        if (userData.password.length < 6) {
            showFormError('register', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        // Registrar usuario usando la API
        const response = await saveUser(userData);
        
        if (response.success) {
            // Guardar token si está disponible
            if (response.data.token) {
                console.log('🔑 Guardando token después del registro');
                EduFitAPI.setToken(response.data.token);
            }
            
            console.log('👤 Datos del usuario en registro:', response.data.user);
            // Establecer sesión actual
            setCurrentUser(response.data.user);
        } else {
            throw new Error(response.message || 'Error en el registro');
        }
        
        // Mostrar notificación de éxito
        showNotification('¡Registro exitoso! Bienvenido/a a EduFit', 'success');
        
        // Ir al dashboard
        setTimeout(async () => {
            await showDashboard();
        }, 1000);
        
    } catch (error) {
        console.error('Error en el registro:', error);
        showFormError('register', 'Ocurrió un error durante el registro. Inténtalo de nuevo.');
    } finally {
        showLoading(false);
    }
}

/**
 * Procesa el login de un usuario existente
 * @param {Event} event - Evento del formulario
 */
async function handleLogin(event) {
    event.preventDefault();
    
    // Mostrar loading
    showLoading(true);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
        // Obtener credenciales
        const credentials = {
            email: DOM_ELEMENTS.loginEmail.value.trim(),
            password: DOM_ELEMENTS.loginPassword.value
        };
        
        // Validaciones básicas
        if (!credentials.email || !credentials.password) {
            showFormError('login', 'Email y contraseña son requeridos');
            return;
        }
        
        // Buscar usuario usando la API
        console.log('🔍 Buscando usuario con credenciales:', credentials.email);
        const user = await findUser(credentials.email, credentials.password);
        console.log('👤 Usuario encontrado:', user ? 'Sí' : 'No');
        if (!user) {
            showFormError('login', 'Credenciales incorrectas. Verifica tu email y contraseña.');
            return;
        }
        
        console.log('👤 Datos del usuario en login:', user);
        // Establecer sesión actual
        setCurrentUser(user);
        
        // Mostrar notificación de éxito
        showNotification(`¡Bienvenido/a de nuevo, ${user.name}!`, 'success');
        
        // Ir al dashboard
        setTimeout(async () => {
            await showDashboard();
        }, 1000);
        
    } catch (error) {
        console.error('Error en el login:', error);
        showFormError('login', 'Ocurrió un error durante el inicio de sesión. Inténtalo de nuevo.');
    } finally {
        showLoading(false);
    }
}

/**
 * Procesa el logout del usuario actual
 */
function handleLogout() {
    // Mostrar confirmación
    if (confirm('¿Estás seguro/a de que quieres cerrar sesión?')) {
        // Limpiar sesión y token
        clearCurrentUser();
        EduFitAPI.logout();
        
        // Mostrar notificación
        showNotification('Sesión cerrada correctamente', 'info');
        
        // Ir a pantalla de autenticación
        setTimeout(() => {
            showAuthScreen();
        }, 500);
    }
}

// ===================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ===================================

/**
 * Verifica si hay un usuario logueado al cargar la página
 */
async function checkAuthStatus() {
    try {
        // Verificar si hay token en localStorage
        const token = localStorage.getItem('edufit_token');
        
        if (!token) {
            console.log('🔍 No hay token - mostrando pantalla de login');
            showAuthScreen();
            return;
        }
        
        // Verificar si el token es válido
        console.log('🔍 Verificando token existente...');
        const response = await EduFitAPI.verifyToken();
        
        if (response.success) {
            console.log('✅ Token válido - usuario autenticado');
            console.log('👤 Datos del usuario recibidos:', response.data.user);
            // Establecer usuario actual
            setCurrentUser(response.data.user);
            await showDashboard();
        } else {
            console.log('❌ Token inválido - limpiando y mostrando login');
            EduFitAPI.clearToken();
            showAuthScreen();
        }
    } catch (error) {
        console.log('❌ Error verificando token:', error.message);
        EduFitAPI.clearToken();
        showAuthScreen();
    }
}

/**
 * Configura todos los event listeners de la aplicación
 */
function setupEventListeners() {
    // Formularios de autenticación
    DOM_ELEMENTS.registerForm.addEventListener('submit', handleRegistration);
    DOM_ELEMENTS.loginForm.addEventListener('submit', handleLogin);
    
    // Event listeners para editar perfil completo
    if (DOM_ELEMENTS.editProfileBtn) {
        DOM_ELEMENTS.editProfileBtn.addEventListener('click', startEditProfile);
    }
    if (DOM_ELEMENTS.saveProfileBtn) {
        DOM_ELEMENTS.saveProfileBtn.addEventListener('click', saveProfile);
    }
    if (DOM_ELEMENTS.cancelProfileBtn) {
        DOM_ELEMENTS.cancelProfileBtn.addEventListener('click', cancelEditProfile);
    }
    
    // Navegación entre formularios de auth
    DOM_ELEMENTS.showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    
    DOM_ELEMENTS.showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    // Logout (múltiples botones)
    DOM_ELEMENTS.logoutBtn.addEventListener('click', handleLogout);
    if (DOM_ELEMENTS.logoutBtnRoutine) {
        DOM_ELEMENTS.logoutBtnRoutine.addEventListener('click', handleLogout);
    }
    if (DOM_ELEMENTS.logoutBtnView) {
        DOM_ELEMENTS.logoutBtnView.addEventListener('click', handleLogout);
    }
    
    // Navegación a crear rutinas
    if (DOM_ELEMENTS.btnCrearRutinas) {
        DOM_ELEMENTS.btnCrearRutinas.addEventListener('click', showCreateRoutineScreen);
    }
    
    // Navegación a ver rutinas
    if (DOM_ELEMENTS.btnVerRutinas) {
        DOM_ELEMENTS.btnVerRutinas.addEventListener('click', showViewRoutinesScreen);
    }
    
    // Volver al dashboard desde rutinas
    if (DOM_ELEMENTS.btnBackDashboard) {
        DOM_ELEMENTS.btnBackDashboard.addEventListener('click', backToDashboard);
    }
    
    if (DOM_ELEMENTS.btnBackDashboardView) {
        DOM_ELEMENTS.btnBackDashboardView.addEventListener('click', backToDashboardFromView);
    }
    
    // Filtros de ejercicios
    DOM_ELEMENTS.filterBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const category = btn.dataset.category;
            await setActiveFilter(category);
        });
    });
    
    // Botones de rutina
    if (DOM_ELEMENTS.btnPreviewRoutine) {
        DOM_ELEMENTS.btnPreviewRoutine.addEventListener('click', async () => {
            await showRoutinePreview();
        });
    }
    
    if (DOM_ELEMENTS.btnSaveRoutine) {
        DOM_ELEMENTS.btnSaveRoutine.addEventListener('click', handleSaveRoutine);
    }
    
    // Actualizar botones cuando cambie la información básica
    if (DOM_ELEMENTS.routineName) {
        DOM_ELEMENTS.routineName.addEventListener('input', updateRoutineButtons);
    }
    
    if (DOM_ELEMENTS.routineIntensity) {
        DOM_ELEMENTS.routineIntensity.addEventListener('change', updateRoutineButtons);
    }
    
    // Event listeners para ver rutinas con funciones específicas
    if (DOM_ELEMENTS.routineSelector) {
        DOM_ELEMENTS.routineSelector.addEventListener('change', handleRoutineSelectorChange);
    }
    
    if (DOM_ELEMENTS.intensityFilter) {
        DOM_ELEMENTS.intensityFilter.addEventListener('change', handleIntensityFilterChange);
    }
    
    if (DOM_ELEMENTS.btnCreateNewRoutine) {
        DOM_ELEMENTS.btnCreateNewRoutine.addEventListener('click', showCreateRoutineScreen);
    }
    
    if (DOM_ELEMENTS.btnCreateFirstRoutine) {
        DOM_ELEMENTS.btnCreateFirstRoutine.addEventListener('click', showCreateRoutineScreen);
    }
    
    // Modal de detalles
    if (DOM_ELEMENTS.closeModal) {
        DOM_ELEMENTS.closeModal.addEventListener('click', closeRoutineModal);
    }
    
    if (DOM_ELEMENTS.btnPrintRoutine) {
        DOM_ELEMENTS.btnPrintRoutine.addEventListener('click', () => {
            const routineId = DOM_ELEMENTS.routineDetailsModal.dataset.currentRoutineId;
            if (routineId) {
                printRoutine(routineId);
                closeRoutineModal();
            }
        });
    }
    
    if (DOM_ELEMENTS.btnEditRoutine) {
        DOM_ELEMENTS.btnEditRoutine.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔄 Botón editar clickeado');
            
            const routineId = DOM_ELEMENTS.routineDetailsModal.dataset.currentRoutineId;
            console.log('📋 ID de rutina obtenido:', routineId);
            
            if (routineId) {
                editRoutine(routineId);
                closeRoutineModal();
            } else {
                console.error('❌ No se encontró ID de rutina en el modal');
                showNotification('Error: No se pudo obtener la rutina para editar', 'error');
            }
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (DOM_ELEMENTS.routineDetailsModal) {
        DOM_ELEMENTS.routineDetailsModal.addEventListener('click', (e) => {
            if (e.target === DOM_ELEMENTS.routineDetailsModal) {
                closeRoutineModal();
            }
        });
    }
    
    // Cerrar notificaciones
    DOM_ELEMENTS.notificationClose.addEventListener('click', () => {
        DOM_ELEMENTS.notification.classList.add('hidden');
    });
    
    // Ocultar errores al empezar a escribir
    [DOM_ELEMENTS.loginEmail, DOM_ELEMENTS.loginPassword].forEach(input => {
        input.addEventListener('input', () => {
            DOM_ELEMENTS.loginError.classList.add('hidden');
        });
    });
    
    [DOM_ELEMENTS.registerName, DOM_ELEMENTS.registerLastname, 
     DOM_ELEMENTS.registerEmail, DOM_ELEMENTS.registerPassword, DOM_ELEMENTS.registerBirthdate].forEach(input => {
        if (input) { // Verificar que el elemento existe
            input.addEventListener('input', () => {
                DOM_ELEMENTS.registerError.classList.add('hidden');
            });
        }
    });
    
    // ===================================
    // EVENT LISTENERS - AGREGAR EJERCICIO
    // ===================================
    
    // Navegación desde dashboard a agregar ejercicio
    if (DOM_ELEMENTS.btnAddExercise) {
        DOM_ELEMENTS.btnAddExercise.addEventListener('click', showAddExerciseScreen);
    }
    
    // Navegación desde agregar ejercicio
    if (DOM_ELEMENTS.backToDashboardFromAddExercise) {
        DOM_ELEMENTS.backToDashboardFromAddExercise.addEventListener('click', backToDashboardFromAddExercise);
    }
    
    if (DOM_ELEMENTS.btnLogoutFromAddExercise) {
        DOM_ELEMENTS.btnLogoutFromAddExercise.addEventListener('click', handleLogout);
    }
    
    // Formulario de agregar ejercicio
    if (DOM_ELEMENTS.addExerciseForm) {
        DOM_ELEMENTS.addExerciseForm.addEventListener('submit', handleAddExerciseSubmit);
    }
    
    if (DOM_ELEMENTS.btnCancelExercise) {
        DOM_ELEMENTS.btnCancelExercise.addEventListener('click', handleAddExerciseCancel);
    }
    
    // Navegación a gestión de alumnos
    if (DOM_ELEMENTS.btnGestionEstudiantes) {
        DOM_ELEMENTS.btnGestionEstudiantes.addEventListener('click', showStudentManagementScreen);
    }
    
    // Navegación desde gestión de alumnos
    if (DOM_ELEMENTS.backToDashboardFromStudents) {
        DOM_ELEMENTS.backToDashboardFromStudents.addEventListener('click', backToDashboardFromStudents);
    }
    
    if (DOM_ELEMENTS.btnLogoutFromStudents) {
        DOM_ELEMENTS.btnLogoutFromStudents.addEventListener('click', handleLogout);
    }
    
    // Formulario de gestión de alumnos
    if (DOM_ELEMENTS.addStudentForm) {
        DOM_ELEMENTS.addStudentForm.addEventListener('submit', handleStudentFormSubmit);
    }
    
    if (DOM_ELEMENTS.btnCancelStudent) {
        DOM_ELEMENTS.btnCancelStudent.addEventListener('click', handleStudentFormCancel);
    }
    
    // Filtros de alumnos
    if (DOM_ELEMENTS.filterGrade) {
        DOM_ELEMENTS.filterGrade.addEventListener('change', filterStudents);
    }
    
    if (DOM_ELEMENTS.filterFitness) {
        DOM_ELEMENTS.filterFitness.addEventListener('change', filterStudents);
    }
    
    if (DOM_ELEMENTS.btnClearFilters) {
        DOM_ELEMENTS.btnClearFilters.addEventListener('click', clearStudentFilters);
    }
}

/**
 * Función principal que inicializa la aplicación
 */
/**
 * Limpia completamente la base de datos local (solo para debugging)
 */
function clearAllData() {
    console.log('🗑️ Limpiando toda la base de datos local...');
    
    // Limpiar todos los datos de LocalStorage relacionados con la app
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.EXERCISES);
    localStorage.removeItem(STORAGE_KEYS.ROUTINES);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    
    // Limpiar sesión actual
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    
    console.log('✅ Base de datos limpiada completamente');
    
    // Mostrar mensaje de confirmación
    alert('Base de datos limpiada. La página se recargará.');
    
    // Recargar la página
    window.location.reload();
}

async function initializeApp() {
    console.log('🚀 Iniciando EduFit...');
    
    // Verificar que EduFitAPI esté disponible
    // Verificar que EduFitAPI esté disponible
    if (typeof EduFitAPI === 'undefined') {
        console.error('❌ EduFitAPI no está disponible. Verifica que api-client-fixed.js se cargue correctamente.');
        return;
    }
    
    console.log('✅ EduFitAPI cargado correctamente');
    console.log('🔍 Verificando métodos específicos...');
    console.log('EduFitAPI.register:', typeof EduFitAPI.register);
    console.log('EduFitAPI.login:', typeof EduFitAPI.login);
    console.log('EduFitAPI.getExercises:', typeof EduFitAPI.getExercises);
    
    // ACTIVAR ESTA LÍNEA PARA LIMPIAR LA BASE DE DATOS:
    // clearAllData(); return;
    
    // Configurar event listeners
    setupEventListeners();
    
    // Verificar estado de autenticación PRIMERO
    await checkAuthStatus();
    
    // Ocultar loading inicial
    showLoading(false);
    
    console.log('✅ EduFit inicializado correctamente');
}

// ===================================
// INICIALIZACIÓN AUTOMÁTICA
// ===================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initializeApp);

// ===================================
// FUNCIONES DE DESARROLLO Y DEBUG
// ===================================

// Funciones útiles para desarrollo (se pueden usar en la consola del navegador)
window.EduFitDebug = {
    /**
     * Muestra todos los usuarios registrados
     */
    showUsers: async () => {
        const users = await getStoredUsers();
        console.log('👥 Usuarios registrados:', users);
        console.table(users);
        
        // También mostrar desde LocalStorage directamente
        const localUsers = JSON.parse(localStorage.getItem('edufit_users') || '[]');
        console.log('📦 Usuarios en LocalStorage:', localUsers);
        console.table(localUsers);
    },
    
    /**
     * Muestra el usuario actual
     */
    showCurrentUser: () => {
        console.log('Usuario actual:', getCurrentUser());
    },
    
    /**
     * Limpia todos los datos de la aplicación
     */
    clearAllData: () => {
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        console.log('✅ Todos los datos han sido eliminados');
        location.reload();
    },
    
    /**
     * Crea un usuario de prueba
     */
    createTestUser: async () => {
        const testUser = {
            name: 'Juan',
            lastname: 'Pérez',
            birthdate: '1985-03-15',
            email: 'juan@test.com',
            password: '123456',
            registrationDate: new Date().toISOString()
        };
        
        if (!(await emailExists(testUser.email))) {
            await saveUser(testUser);
            console.log('✅ Usuario de prueba creado:', testUser);
        } else {
            console.log('⚠️ El usuario de prueba ya existe');
        }
    }
};

console.log('🔧 Funciones de debug disponibles en window.EduFitDebug');
