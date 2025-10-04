# 🛠️ AGENT.MD - Problemas Conocidos y Soluciones

## 📋 Problema Recurrente: Layout Incorrecto en Pantallas

### 🚨 **PROBLEMA IDENTIFICADO:**
**Descripción:** El header de las pantallas no se muestra en la parte superior centrado, y el contenido principal aparece desplazado hacia la derecha, creando un layout incorrecto.

**Pantallas afectadas:**
- ✅ Dashboard (CORREGIDO anteriormente)
- ❌ Crear Rutinas (PROBLEMA ACTUAL)
- ⚠️ Futuras pantallas similares

### 🔍 **CAUSA RAÍZ:**
El problema se debe a la configuración CSS del contenedor principal. Específicamente:

1. **Container genérico** tiene `display: flex` con `justify-content: center` y `align-items: center`
2. **Pantallas complejas** necesitan `flex-direction: column` y `align-items: stretch`
3. **Contenido** debe ocupar todo el ancho y organizarse verticalmente

### ✅ **SOLUCIÓN ESTÁNDAR:**

#### **CSS a aplicar para pantallas complejas:**
```css
/* Para containers de pantallas con header + contenido */
#nombre-pantalla-container.container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0;
    min-height: 100vh;
}

/* Para el contenido principal */
.contenido-principal {
    max-width: [ANCHO_MÁXIMO];
    width: 100%;
    margin: 0 auto;
    flex: 1;
    padding: 40px 20px;
}
```

#### **Estructura HTML requerida:**
```html
<div id="pantalla-container" class="container hidden">
    <header class="dashboard-header">
        <!-- Header ocupa todo el ancho superior -->
    </header>
    
    <main class="contenido-principal">
        <!-- Contenido centrado debajo del header -->
    </main>
</div>
```

### 🎯 **APLICACIÓN INMEDIATA NECESARIA:**

**Archivo:** `styles.css`
**Sección:** Estilos para crear rutinas
**Agregar:**
```css
/* Contenedor específico de crear rutinas */
#create-routine-container.container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0;
    min-height: 100vh;
}
```

### 📝 **CHECKLIST PARA FUTURAS PANTALLAS:**

Antes de crear una nueva pantalla compleja, verificar:

- [ ] ¿La pantalla tiene header + contenido?
- [ ] ¿Se aplicó la regla CSS específica del container?
- [ ] ¿El contenido principal tiene `margin: 0 auto`?
- [ ] ¿Se probó en diferentes tamaños de pantalla?

### 🔄 **HISTORIAL DE CORRECCIONES:**

#### **Dashboard (2 oct 2025):**
- **Problema:** Header a la izquierda, contenido a la derecha
- **Solución:** Agregado `#dashboard-container.container` con layout vertical
- **Estado:** ✅ CORREGIDO

#### **Crear Rutinas (2 oct 2025):**
- **Problema:** Mismo layout incorrecto
- **Solución:** Aplicada regla CSS específica para múltiples pantallas
- **Estado:** ✅ CORREGIDO

#### **Ver Rutinas (2 oct 2025):**
- **Problema:** Header a la izquierda, contenido a la derecha
- **Solución:** Aplicada regla CSS específica
- **Estado:** ✅ CORREGIDO

#### **Agregar Ejercicio (2 oct 2025):**
- **Problema:** Mismo layout incorrecto
- **Solución:** Aplicada regla CSS específica
- **Estado:** ✅ CORREGIDO

### 🚀 **MEJORAS FUTURAS:**

1. **Crear clase CSS reutilizable** para pantallas complejas
2. **Template HTML estándar** para nuevas pantallas
3. **Documentación** de patrones de layout

---

**📌 NOTA IMPORTANTE:** Este problema debe verificarse SIEMPRE que se cree una nueva pantalla con estructura header + contenido. La solución es consistente y debe aplicarse inmediatamente.

## 📋 Problema de Persistencia de Sesión

### 🚨 **PROBLEMA IDENTIFICADO:**
**Descripción:** La sesión del usuario no se mantiene al recargar la página, obligando a hacer login nuevamente.

### 🔍 **CAUSA RAÍZ:**
Inconsistencia entre `localStorage` y `sessionStorage` en las funciones de manejo de sesión:
- `setCurrentUser()` y `getCurrentUser()` usaban `localStorage` ✅
- `clearAllData()` usaba `sessionStorage` para limpiar ❌
- Event listener de logout llamaba función inexistente `logout` en lugar de `handleLogout` ❌

### ✅ **SOLUCIÓN APLICADA:**
1. **Corregida inconsistencia de storage:** Todas las funciones ahora usan `localStorage` consistentemente
2. **Corregido event listener:** `logout` → `handleLogout`
3. **Verificado flujo completo:** login → localStorage → checkAuthStatus → dashboard

**🔧 ESTADO:** ✅ CORREGIDO - La sesión ahora persiste correctamente al recargar la página.

