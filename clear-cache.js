// Script para limpiar caché del navegador
console.log('🧹 Limpiando caché del navegador...');

// Eliminar todas las referencias a EduFitAPI
if (typeof window !== 'undefined') {
    delete window.EduFitAPI;
    delete window.EduFit;
    
    // Limpiar localStorage
    localStorage.removeItem('edufit_token');
    localStorage.removeItem('edufit_user');
    
    console.log('✅ Caché limpiado');
    console.log('🔄 Recarga la página (Ctrl+F5)');
}

// Forzar recarga si estamos en el navegador
if (typeof window !== 'undefined' && window.location) {
    setTimeout(() => {
        window.location.reload(true);
    }, 1000);
}
