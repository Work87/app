/**
 * 2-fechas.js - Funciones para manejo de fechas
 * Este archivo contiene todas las funciones relacionadas con el manejo
 * y formateo de fechas en la aplicación.
 */

/**
 * Función mejorada para obtener una fecha formateada o un objeto Date para realizar cálculos
 * @param {Date|string|null} fechaInput - Fecha de entrada en cualquier formato compatible
 * @param {string} tipoRetorno - Tipo de retorno: 'string' (DD/MM/YYYY) o 'date' (objeto Date)
 * @returns {string|Date} - Fecha formateada como string o como objeto Date según el parámetro tipoRetorno
 */
function obtenerFechaFormateada(fechaInput, tipoRetorno = 'string') {
    const padNumber = (n, l) => `${n}`.padStart(l, '0');
    let fechaObj;
    
    // Determinar el objeto Date a partir de la entrada
    if (!fechaInput) {
        // Si no se proporciona fecha, usar la fecha actual
        fechaObj = new Date();
    } else if (fechaInput instanceof Date) {
        // Si ya es un objeto Date, crear una copia
        fechaObj = new Date(fechaInput);
        
        // Verificar si es una fecha válida
        if (isNaN(fechaObj.getTime())) {
            console.error("Fecha inválida:", fechaInput);
            fechaObj = new Date(); // Usar fecha actual si no es válida
        }
    } else if (typeof fechaInput === 'string') {
        // Si es un string, intentar varios formatos
        
        // Si ya está en formato DD/MM/YYYY, convertirla
        if (fechaInput.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const partes = fechaInput.split('/');
            fechaObj = new Date(partes[2], parseInt(partes[1]) - 1, partes[0]);
        } 
        // Si está en formato YYYY-MM-DD, convertirla
        else if (fechaInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const partes = fechaInput.split('-');
            fechaObj = new Date(partes[0], parseInt(partes[1]) - 1, partes[2]);
        }
        // Intentar conversión directa para otros formatos
        else {
            fechaObj = new Date(fechaInput);
        }
        
        // Verificar si la conversión fue exitosa
        if (isNaN(fechaObj.getTime())) {
            console.error("Formato de fecha no reconocido:", fechaInput);
            fechaObj = new Date(); // Usar fecha actual si no se reconoce el formato
        }
    } else {
        // Para otros tipos de datos, intentar conversión directa
        try {
            fechaObj = new Date(fechaInput);
            if (isNaN(fechaObj.getTime())) {
                console.error("No se pudo convertir a fecha:", fechaInput);
                fechaObj = new Date();
            }
        } catch (e) {
            console.error("Error al convertir fecha:", e);
            fechaObj = new Date();
        }
    }
    
    // Retornar según el tipo solicitado
    if (tipoRetorno === 'date') {
        return fechaObj; // Retornar objeto Date para cálculos
    } else {
        // Formatear como DD/MM/YYYY
        return `${padNumber(fechaObj.getDate(), 2)}/${padNumber(fechaObj.getMonth() + 1, 2)}/${fechaObj.getFullYear()}`;
    }
}

/**
 * Normaliza el formato de una fecha
 * @param {string|Date} fecha - La fecha a normalizar
 * @returns {Date} - Objeto Date normalizado
 */
function normalizarFecha(fecha) {
    return obtenerFechaFormateada(fecha, 'date');
}

/**
 * Normaliza todas las fechas en los datos de vendedores y jefes
 * @returns {number} - Número de cambios realizados
 */
function normalizarTodasLasFechas() {
    let contadorCambios = 0;
    
    // Normalizar fechas en vendedores
    window.vendedores.forEach(vendedor => {
        if (vendedor.ventas && Array.isArray(vendedor.ventas)) {
            vendedor.ventas.forEach(venta => {
                // Guardar el formato original para log
                const formatoOriginal = venta.fecha;
                
                // Normalizar la fecha
                venta.fecha = obtenerFechaFormateada(venta.fecha);
                
                // Contar el cambio si hubo una normalización
                if (formatoOriginal !== venta.fecha) {
                    contadorCambios++;
                    console.log(`Normalizada: ${formatoOriginal} → ${venta.fecha}`);
                }
            });
        }
    });
    
    // Normalizar fechas en jefes
    window.jefes.forEach(jefe => {
        if (jefe.ventas && Array.isArray(jefe.ventas)) {
            jefe.ventas.forEach(venta => {
                const formatoOriginal = venta.fecha;
                venta.fecha = obtenerFechaFormateada(venta.fecha);
                
                if (formatoOriginal !== venta.fecha) {
                    contadorCambios++;
                }
            });
        }
    });
    
    // Guardar los cambios
    if (typeof guardarDatos === 'function') {
        guardarDatos();
    }
    
    return contadorCambios;
}

/**
 * Obtiene la fecha del día anterior en formato formateado
 * @param {string|Date} fecha - Fecha de referencia
 * @returns {string} - Fecha anterior formateada
 */
function obtenerFechaAnterior(fecha) {
    // Si fecha es string en formato DD/MM/YYYY
    if (typeof fecha === 'string' && fecha.includes('/')) {
        const partes = fecha.split('/').map(Number);
        const fechaObj = new Date(partes[2], partes[1] - 1, partes[0]);
        fechaObj.setDate(fechaObj.getDate() - 1);
        
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const anio = fechaObj.getFullYear();
        
        return `${dia}/${mes}/${anio}`;
    }
    // Si fecha es string en formato ISO (YYYY-MM-DD)
    else if (typeof fecha === 'string' && fecha.includes('-')) {
        const fechaObj = new Date(fecha);
        fechaObj.setDate(fechaObj.getDate() - 1);
        
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const anio = fechaObj.getFullYear();
        
        return `${dia}/${mes}/${anio}`;
    }
    // Para otros formatos de fecha
    else {
        try {
            const fechaObj = new Date(fecha);
            if (!isNaN(fechaObj.getTime())) {
                fechaObj.setDate(fechaObj.getDate() - 1);
                
                const dia = String(fechaObj.getDate()).padStart(2, '0');
                const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
                const anio = fechaObj.getFullYear();
                
                return `${dia}/${mes}/${anio}`;
            } else {
                console.error("Formato de fecha no reconocido:", fecha);
                return null;
            }
        } catch (error) {
            console.error("Error al calcular la fecha anterior:", error);
            return null;
        }
    }
}

/**
 * Obtiene la fecha del día siguiente en varios formatos
 * @param {string|Date} fecha - Fecha de referencia
 * @returns {string|Date} - Fecha siguiente en el mismo formato que la entrada
 */
function obtenerFechaSiguiente(fecha) {
    // Si fecha es un string en formato ISO (YYYY-MM-DD)
    if (typeof fecha === 'string' && fecha.includes('-')) {
        const fechaObj = new Date(fecha);
        fechaObj.setDate(fechaObj.getDate() + 1);
        
        // Devolver en el mismo formato
        const anio = fechaObj.getFullYear();
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        
        return `${anio}-${mes}-${dia}`;
    }
    // Si fecha es un objeto Date
    else if (fecha instanceof Date) {
        const fechaObj = new Date(fecha);
        fechaObj.setDate(fechaObj.getDate() + 1);
        return fechaObj;
    }
    // Si es un string en otro formato, convertir primero
    else {
        // Intentar convertir a Date y luego procesar
        const fechaObj = new Date(fecha);
        if (!isNaN(fechaObj.getTime())) { // Verificar si es una fecha válida
            fechaObj.setDate(fechaObj.getDate() + 1);
            return fechaObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        } else {
            console.error("Formato de fecha no reconocido:", fecha);
            return null;
        }
    }
}

// Exportar funciones para acceso global
window.obtenerFechaFormateada = obtenerFechaFormateada;
window.normalizarFecha = normalizarFecha;
window.normalizarTodasLasFechas = normalizarTodasLasFechas;
window.obtenerFechaAnterior = obtenerFechaAnterior;
window.obtenerFechaSiguiente = obtenerFechaSiguiente;