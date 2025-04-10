/**
 * 3-mensajes.js - Sistema de mensajes y patrones
 * Este archivo contiene el sistema de notificaciones y los patrones
 * para procesar mensajes de ventas y jugadas.
 */

// Patrones de formato válidos
const patrones = {
    // Formatos básicos originales
    numeroSimple: /^\d{1,2}[-.+=, /;]+\d+$/,                      // 25-10
    linea: /^l(?:inea)?(?:[-., /]+\d{1,2}){1,2}[-.+=, /]+(?:con[-.,]*)*\d+$/i, // Linea-80-20 / L-01-10-05 / l-0-10-5 / l-0-20-5
    decena: /^(?:d|dec|dece|decena)[-., ]*(\d{1,2})[-., ]*(\d+)$/i,  // Captura: decena y monto
    terminal: /^(?:t(?:erminal)?[-.+=, /]+(?:0?\d|00)[-., /]+(?:con[-.,/]*)*\d+)$/i,   // Terminal-5-10
    pareja: /^(?:p(?:areja)?[-.+=, /]+(?:con[-.,]*)*\d+)$/i,                   // Pareja-10
    decenaConY: /^(?:d|dec|dece|decena)[-., ]*(?:\d{1,2}[-., ]*)+(\d+)$/i,  // Para múltiples decenas

    // Números separados por comas con monto
    numerosComaMonto: /^\d{1,3}(?:[-.+=, /]+\d{1,3})*\d+$/i,        // 37,98,1000

    // Números con "con"
    conSimple: /^\d{1,3}-con-\d+$/i,                        // 10-con-100

    // Múltiples números con "con"
    multiplesCon: /^(?:\d{1,3}(?:[-.+=, /]+\d{1,3})*)-con-\d+$/i,// 35 36 37 57-con-20
    // 54-96-con-50
    // 46-98-83-12-07-58-con-10

    // Tres números separados por guion
    tresNumeros: /^(?:\d{1,2}[-.+=, /]+)+\d+$/i,              // 04-10-17

    // Formatos especiales adicionales
    terminalMultiple: /^t(?:erminal)?-(?:0?\d|00)(?:[-.+=, /]+(?:0?\d|00))*[-.+=, /]+(?:con[-.,]*)*\d+$/i,
    lineaConY: /^(?:l(?:inea)?-\d{1,2}-y-\d{1,2}[-.+=, /]+(?:con[-.,]*)*\d+)$/i,
    decenaConY: /^dece(?:na)?[-., /]+(?:\d{1,2}[-., /]+)*\d{1,2}[-., /]+(?:con[-.,]*)*\d+$/i,  // decena-10-20-30-100
    rangoConMonto: /^\d{1,2}-\d{1,2}-\d+\/\d+$/,

    // Nuevos formatos de terminal al, parejas al, y numero al numero
    terminalAl: /^(?:0?[1-9]|10)[-_\s]*al[-_\s]*(?:9[1-9]|100|00)[-.,+=, /]+(?:con[-.,]*)*\d+$/i,
    parejasAl: /^(?:11|00|100)[-_\s]*al[-_\s]*(?:00|99|100|109)[-_\s]*(?:con)[-_\s]*\d+$/i,
    numeroAlNumero: /^(?:del[-\s]*)?\d+\W+aL\W+\d+\W*(?:c|con)*\W*\d+$/i,
    // Detecta números solitarios de 3 o más dígitos
    numeroSolitario: /^\d{3,}$/i,
};

//Lineas fijas al reves y normales
function procesarLineaConGanador(linea, numeroGanador) {
    console.log(`procesarLineaConGanador: ${linea}, ganador=${numeroGanador}`);
    linea = linea.toLowerCase();
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros[numeros.length - 1]; // El último número siempre es el monto
    let cabeza = numeros.slice(0, numeros.length - 1);
    console.log(`Cabezas extraídas: ${cabeza}, monto: ${monto}`);
   
    // Normalizar número ganador (00 = 100)
    numeroGanador = numeroGanador === "00" || numeroGanador === 0 ? 100 : numeroGanador;
    
    // Lista de líneas específicas permitidas (decenas) - SIN LITERALES OCTALES
    const lineasPermitidas = [0, 1, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    
    // NUEVA VALIDACIÓN: Verificar que todas las cabezas sean válidas
    const caberasValidas = cabeza.filter(c => lineasPermitidas.includes(c));
    if (caberasValidas.length !== cabeza.length) {
        console.log(`⛔ LÍNEA INVÁLIDA: Alguna cabeza no está en la lista permitida: ${cabeza}`);
        console.log(`Cabezas permitidas: ${lineasPermitidas}`);
        return null;
    }
    
    // Verificar si es una jugada tipo "linea" con el patrón "linea-X-Y-Z"
    const regexLineaDosCabezas = /^l(?:inea)?[-., /]+\d{1,2}[-., /]+\d{1,2}[-., /]+\d+$/i;
    
    // Si es una línea con dos cabezas separadas por al menos 10 y que no son 00-10 ni 00-20
    if (regexLineaDosCabezas.test(linea) && cabeza.length >= 2 && 
        Math.abs(cabeza[0] - cabeza[1]) >= 10 &&
        !(cabeza[0] === 0 && cabeza[1] === 10) && 
        !(cabeza[0] === 0 && cabeza[1] === 20) &&
        !(cabeza[1] === 0 && cabeza[0] === 10) && 
        !(cabeza[1] === 0 && cabeza[0] === 20)) {
        
        // Para jugadas tipo "linea" con dos cabezas distantes, generar las decenas completas
        let jugadas = {};
        
        // Procesar solo las primeras dos cabezas
        [cabeza[0], cabeza[1]].forEach(c => {
            // Calcular la base de la decena
            const baseDecena = Math.floor(c / 10) * 10;
            
            // Generar los 10 números de la decena
            for (let i = 0; i < 10; i++) {
                const numero = baseDecena + i;
                jugadas[numero] = monto;
            }
        });
        
        // Calcular venta total
        const totalVenta = monto * Object.keys(jugadas).length;
        
        // Verificar si el número ganador está entre los números jugados
        const premioEncontrado = Object.keys(jugadas).includes(String(numeroGanador)) ? monto : 0;
        
        return {
            totalVenta: totalVenta,
            premioEncontrado: premioEncontrado,
            jugadas: jugadas
        };
    } else {
        // Código original para otros tipos de jugadas
        if (cabeza.length === 1) cabeza.push(cabeza[0] + 9); // Sumar 9 para generar el rango
        let cantidadNumeros = (cabeza[1] - cabeza[0]) + 1;
        return {
            totalVenta: monto * cantidadNumeros,
            premioEncontrado: (cabeza[0] <= numeroGanador && numeroGanador <= cabeza[1]) ? monto : 0,
            jugadas: Object.fromEntries(Array.from({length: cantidadNumeros}, (_, i) => [cabeza[0] + i, monto]))
        }
    }
}

function procesarLineaConYGanador(linea, numeroGanador) {
    linea = linea.toLowerCase();
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros[numeros.length - 1]; // El último número siempre es el monto
    let cabeza = numeros.slice(0, numeros.length - 1);
    let parcial = {};
    let result = {totalVenta: 0, premioEncontrado: 0, jugadas: {}};

    cabeza.forEach((numero) => {
        parcial = procesarLineaConGanador(`l-${numero}-${monto}`, numeroGanador);
        Object.assign(result.jugadas, parcial.jugadas);
        result.totalVenta += parcial.totalVenta;
        result.premioEncontrado += parcial.premioEncontrado;
    })
    return result;
}

// Función para procesar decenas
function procesarDecenaConGanador(linea, numeroGanador) {
    // Extraer números usando el nuevo patrón
    const matches = linea.match(/^(?:d|dec|dece|decena)[-., ]*(\d{1,2})[-., ]*(\d+)$/i);
    if (!matches) return null;

    const decenaBase = parseInt(matches[1]);
    const monto = parseInt(matches[2]);

    // Validar que sea una decena válida (0,10,20,30,etc)
    if (decenaBase > 90 || decenaBase % 10 !== 0) {
        console.log("⛔ DECENA INVÁLIDA: Solo se permiten números que sean decenas (0,10,20,...)");
        return null;
    }

    let resultado = {
        totalVenta: 0,
        premioEncontrado: 0,
        jugadas: {}
    };

    // Generar los 10 números de la decena
    for (let i = 0; i < 10; i++) {
        const numeroJugada = decenaBase + i;
        resultado.jugadas[numeroJugada] = monto;
        resultado.totalVenta += monto;
    }

    // Verificar si el número ganador está en esta decena
    const numGanador = parseInt(numeroGanador);
    if (Math.floor(numGanador / 10) * 10 === decenaBase) {
        resultado.premioEncontrado = monto;
    }

    return resultado;
}

// Función para procesar decenas con Y
function procesarDecenaConYGanador(linea, numeroGanador) {
    const numeros = linea.match(/\d+/g).map(num => parseInt(num));
    const monto = numeros[numeros.length - 1];
    const decenas = numeros.slice(0, -1);

    // Validar que todas sean decenas válidas
    if (!decenas.every(num => num <= 90 && num % 10 === 0)) {
        return null;
    }

    let resultado = {
        totalVenta: 0,
        premioEncontrado: 0,
        jugadas: {}
    };

    decenas.forEach(decenaBase => {
        for (let i = 0; i < 10; i++) {
            const numeroJugada = decenaBase + i;
            resultado.jugadas[numeroJugada] = monto;
            resultado.totalVenta += monto;
        }

        const numGanador = parseInt(numeroGanador);
        if (Math.floor(numGanador / 10) * 10 === decenaBase) {
            resultado.premioEncontrado += monto;
        }
    });

    return resultado;
}

// Luego tu función de procesar terminales
function procesarTerminalesConGanador(linea, numeroGanador) {
    console.log(`procesarTerminalesConGanador: ${linea}, ganador=${numeroGanador}`);
    linea = linea.toLowerCase();
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros[numeros.length - 1]; // El último número siempre es el monto
    let cabeza = numeros.slice(0, numeros.length - 1);
    console.log(`Cabezas extraídas: ${cabeza}, monto: ${monto}`);

    // VALIDACIÓN CRÍTICA: Solo aceptar cabezas que sean dígitos del 0-9
    const cabezasValidas = cabeza.filter(valor => valor >= 0 && valor <= 9);
    
    // Si alguna cabeza no es válida, rechazar toda la jugada como terminal
    if (cabezasValidas.length !== cabeza.length) {
        console.log(`⛔ TERMINAL INVÁLIDO: Solo se permiten dígitos 0-9 como terminales`);
        return null;
    }

    let resultado = {
        totalVenta: 0,
        premioEncontrado: 0,
        jugadas: {}
    };

    cabeza.forEach((value) => {
        resultado.totalVenta += monto * 10;
        
        // Verificar si el último dígito del número ganador coincide con el terminal
        const ultimoDigitoGanador = numeroGanador % 10;
        if (ultimoDigitoGanador === value) {
            resultado.premioEncontrado += monto;
        }
        
        // Generar las 10 jugadas para este terminal (0, 10, 20, ..., 90 + value)
        for (let i = 0; i < 10; i++) {
            const numeroJugada = i * 10 + value;
            resultado.jugadas[numeroJugada] = monto;
        }
    });

    return resultado;
}

function procesarTerminalAl(linea, numeroGanador) {
    linea = linea.toLowerCase().trim();

    // Patrón para extraer los números incluyendo el formato con "con"
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros[numeros.length - 1]; // El último número siempre es el monto

    if (!isNaN(monto)) {
        // Obtener el último dígito del número antes de "con"
        const numeroJugada = numeros[numeros.length - 2]; // El número antes de "con"
        const ultimoDigito = numeroJugada % 10; // Último dígito de la jugada

        // Generar los números que terminan en el último dígito (del 1 al 100)
        const numerosProcesados = [];
        for (let i = ultimoDigito; i <= 100; i += 10) {
            numerosProcesados.push(i);
        }

        // Modificamos la verificación del premio
        // Si el número ganador es 100, debemos tratarlo como 00 para la comparación
        const numeroComparar = numeroGanador === 100 ? 0 : numeroGanador % 100;

        // Jugadas: solo incluir los números que terminan en el último dígito
        const jugadas = Object.fromEntries(
            numerosProcesados.map(num => [num, monto])
        );

        // Imprimir los números procesados
        console.log("Números procesados:", numerosProcesados);

        return {
            totalVenta: monto * numerosProcesados.length,  // Total basado en los números procesados
            premioEncontrado: numerosProcesados.includes(numeroComparar) ? monto : 0, // Premio si el número está en la lista de jugadas
            jugadas: jugadas,  // Muestra las jugadas y sus montos
        };
    }

    return null;
}

function procesarParejasConGanador(linea, numeroGanador) {
    if (!linea || typeof linea !== 'string') return null;
    linea = linea.toLowerCase().trim();
    // Nueva expresión regular más precisa para todos los formatos
    const patron = /^(p|pareja)(?:[-., ]+(?:con[-., ]*)*(\d+)|[-., ]*(\d+))$/i;

    const matches = linea.match(patron);
    if (matches) {
        // El monto estará en el grupo 2 o 3, dependiendo del formato
        const monto = parseInt(matches[2] || matches[3]);

        if (!isNaN(monto) && monto > 0) {
            return {
                totalVenta: monto * 10,
                premioEncontrado: [0, 11, 22, 33, 44, 55, 66, 77, 88, 99].indexOf(numeroGanador) >= 0 ? monto : 0,
                jugadas: Object.fromEntries([0, 11, 22, 33, 44, 55, 66, 77, 88, 99].map((num) => [num, monto])),
            };
        }
    }

    return null;
}

function procesarParejasAlConGanador(linea, numeroGanador) {
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    const monto = numeros.slice(-1)[0];
    console.log(`procesarParejasAlConGanador ${linea} ${numeros} ${monto} ${numeroGanador}`);
    if (!isNaN(monto)) {
        return {
            totalVenta: monto * 10,
            premioEncontrado: [0, 11, 22, 33, 44, 55, 66, 77, 88, 99].indexOf(numeroGanador) >= 0 ? monto : 0,
            jugadas: Object.fromEntries([0, 11, 22, 33, 44, 55, 66, 77, 88, 99].map((num) => [num, monto])),
        };
    }
    return null;
}

function procesarNumeroAlNumero(linea, numeroGanador) {
    console.log(`Procesando jugada original: "${linea}"`);
    
    // Primero extraer solo la parte de la jugada si contiene "=>" u otros textos
    let jugadaTexto = linea;
    if (jugadaTexto.includes("=>")) {
        jugadaTexto = jugadaTexto.split("=>")[0].trim();
    }
    
    console.log(`Texto de jugada limpio: "${jugadaTexto}"`);
    
    // Usar la expresión regular para extraer los componentes
    const regex = /^(?:del[-\s]*)?(\d+)\W+aL\W+(\d+)\W*(?:c|con)*\W*(\d+)$/i;
    const match = jugadaTexto.match(regex);
    
    if (!match) {
        console.log("ERROR: La jugada no coincide con el formato esperado");
        return null;
    }
    
    // Extraer y convertir los valores
    let inicio = match[1] === "00" ? 100 : parseInt(match[1]);
    let final = match[2] === "00" ? 100 : parseInt(match[2]);
    const monto = parseInt(match[3]);
    
    console.log(`Componentes extraídos - inicio: ${inicio}, final: ${final}, monto: ${monto}`);
    
    // Verificar que todos los valores sean números válidos
    if (isNaN(inicio) || isNaN(final) || isNaN(monto)) {
        console.log("ERROR: Alguno de los valores no es un número válido");
        return null;
    }
    
    // Generar el rango de números
    let jugadas = [];
    
    // Caso especial: inicio es 100 (o "00") y final es menor
    if (inicio === 100 && final < 100) {
        // Generar rango desde 0 hasta final
        for (let i = 0; i <= final; i++) {
            jugadas.push(i);
        }
    } else {
        // Caso normal: inicio es menor o igual que final
        for (let i = inicio; i <= final; i++) {
            // Normalizar la representación: 100 se representa como 0
            const numeroRepresentacion = i === 100 ? 0 : i;
            jugadas.push(numeroRepresentacion);
        }
    }
    
    // Si no hay jugadas, algo salió mal
    if (jugadas.length === 0) {
        console.log("ERROR: No se generaron jugadas");
        return null;
    }
    
    // Normalizar el número ganador si es necesario
    const numeroGanadorNormalizado = numeroGanador === 100 ? 0 : numeroGanador;
    
    // Crear y devolver el resultado
    const resultado = {
        totalVenta: monto * jugadas.length,
        premioEncontrado: jugadas.includes(numeroGanadorNormalizado) ? monto : 0,
        jugadas: Object.fromEntries(jugadas.map((num) => [num, monto])),
    };
    
    console.log(`Resultado procesado:`, resultado);
    return resultado;
}

function procesarGenerica(linea, numeroGanador) {
    const numeros = linea.match(/\b\d+\b/g).map(num => parseInt(num));
    let monto = numeros.slice(-1)[0];
    let cabeza = numeros.slice(0, numeros.length - 1);
    console.log(`monto: ${monto} cabea: ${cabeza}`);
    const cantidad = cabeza.filter(num => num === numeroGanador).length;
    if (!isNaN(monto) && !cabeza.some(num => num > 100)) {
        return {
            totalVenta: monto * cabeza.length,
            premioEncontrado: cantidad > 0 ? cantidad * monto : 0,
            jugadas: Object.fromEntries(cabeza.map((num) => [num, monto])),
        };
    }
    return null;
}

function procesarJugadaUnaLinea(jugada, numeroGanador) {
    console.log('procesarJugadaUnaLinea[1516]');
    if (!jugada || typeof jugada !== 'string') return null;
    jugada = jugada.trim();

    // Validar SMS
    if (jugada.toUpperCase().match(/^SMS\s*:?\s*$/)) {
        return {
            totalVenta: 0,
            premioEncontrado: 0
        };
    }

    // Manejar formato con "con" (10-con-100, 35 36 37 57-con-20)
    const conMatch = jugada.match(/^((?:\d+(?:[\s-]|,\s*)?)+)-con-(\d+)$/);
    if (conMatch) {
        const numeros = conMatch[1].split(/[\s-,]+/).map(n => parseInt(n));
        const monto = parseInt(conMatch[2]);
        if (!isNaN(monto) && numeros.every(n => !isNaN(n))) {
            return {
                totalVenta: monto * numeros.length,
                premioEncontrado: numeros.includes(numeroGanador) ? monto : 0
            };
        }
    }

    // Manejar formato con comas y monto al final (37,98,1000)
    const comasMatch = jugada.match(/^(\d+(?:,\d+)*),(\d+)$/);
    if (comasMatch) {
        const numeros = comasMatch[1].split(',').map(n => parseInt(n));
        const monto = parseInt(comasMatch[2]);
        if (!isNaN(monto) && numeros.every(n => !isNaN(n))) {
            return {
                totalVenta: monto * numeros.length,
                premioEncontrado: numeros.includes(numeroGanador) ? monto : 0
            };
        }
    }

    // Manejar formato de tres números (04-10-17)
    const tresNumerosMatch = jugada.match(/^(\d+)-(\d+)-(\d+)$/);
    if (tresNumerosMatch) {
        const numeros = [
            parseInt(tresNumerosMatch[1]),
            parseInt(tresNumerosMatch[2])
        ];
        const monto = parseInt(tresNumerosMatch[3]);
        if (!isNaN(monto) && numeros.every(n => !isNaN(n))) {
            return {
                totalVenta: monto * numeros.length,
                premioEncontrado: numeros.includes(numeroGanador) ? monto : 0
            };
        }
    }

    // Formato original
    const numerosMatch = jugada.match(/\b\d+\b/g);
    if (!numerosMatch) return null;

    const numeros = numerosMatch.map(num => parseInt(num));
    if (numeros.length < 2) return null;

    let monto = numeros.slice(-1)[0];
    let cabeza = numeros.slice(0, numeros.length - 1);
    if (isNaN(monto)) return null;

    return {
        totalVenta: monto * cabeza.length,
        premioEncontrado: cabeza.includes(numeroGanador) ? monto : 0
    };
}

function procesarJugadasMultilinea(lineas, numeroGanador) {
    console.log('procesarJugadasMultilinea[1708] - para borrar algun dia')
    lineas = lineas.filter(l => l.trim() !== '');
    const montoLinea = lineas[lineas.length - 1];

    // Manejo de diferentes formatos de la línea de monto
    let monto;
    if (montoLinea.includes('-con-')) {
        monto = parseInt(montoLinea.split('-con-')[1]);
    } else if (montoLinea.toLowerCase().includes('con')) {
        monto = parseInt(montoLinea.split(/\s+/).pop());
    } else {
        return null;
    }

    if (isNaN(monto)) return null;

    // Procesar números en las líneas anteriores
    const numeros = lineas.slice(0, -1).map(linea => {
        // Manejar números separados por comas en una línea
        if (linea.includes(',')) {
            return linea.split(',').map(n => parseInt(n.trim()));
        }
        // Manejar números separados por espacios o guiones
        if (linea.includes(' ') || linea.includes('-')) {
            return linea.split(/[\s-]+/).map(n => parseInt(n.trim()));
        }
        return parseInt(linea.trim());
    }).flat();

    const numerosValidos = numeros.filter(n => !isNaN(n));

    return {
        totalVenta: monto * numerosValidos.length,
        premioEncontrado: numerosValidos.includes(numeroGanador) ? monto : 0
    };
}

/**
 * Muestra un mensaje temporal en la interfaz
 * @param {string} mensaje - Texto del mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje: 'info', 'error', 'success', 'warning', 'lineas', 'lineasy', 'terminal', etc.
 * @param {Object} opciones - Opciones adicionales
 * @param {number} opciones.duracion - Duración en ms antes de que desaparezca (0 para no desaparecer)
 * @param {boolean} opciones.cerrable - Si es true, muestra un botón para cerrar el mensaje
 * @param {Function} opciones.onClose - Callback que se ejecuta cuando el mensaje se cierra
 * @returns {HTMLElement} - El elemento del mensaje creado
 */
function mostrarMensaje(mensaje, tipo = 'info', opciones = {}) {
    // Configuración por defecto
    const config = {
        duracion: opciones.duracion !== undefined ? opciones.duracion : 5000,
        cerrable: opciones.cerrable !== undefined ? opciones.cerrable : false,
        onClose: opciones.onClose || null
    };
    
    // Objeto con los tipos de mensajes y sus estilos
    const tiposMensaje = {
        info: {
            icon: 'ℹ️',
            clase: 'mensaje-info',
            color: '#1565c0',
            bgColor: '#e3f2fd'
        },
        error: {
            icon: '❌',
            clase: 'mensaje-error',
            color: '#c62828',
            bgColor: '#ffebee'
        },
        success: {
            icon: '✅',
            clase: 'mensaje-success',
            color: '#2e7d32',
            bgColor: '#e8f5e9'
        },
        warning: {
            icon: '⚠️',
            clase: 'mensaje-warning',
            color: '#f57c00',
            bgColor: '#fff3e0'
        },
        lineas: {
            icon: '📊',
            clase: 'mensaje-lineas',
            color: '#e91e63',
            bgColor: 'rgba(233, 30, 99, 0.1)'
        },
        lineasy: {
            icon: '📈',
            clase: 'mensaje-lineasy',
            color: '#9c27b0',
            bgColor: 'rgba(156, 39, 176, 0.1)'
        },
        terminal: {
            icon: '🎯',
            clase: 'mensaje-terminal',
            color: '#2196f3',
            bgColor: 'rgba(33, 150, 243, 0.1)'
        },
        parley: {
            icon: '🎲',
            clase: 'mensaje-parley',
            color: '#4caf50',
            bgColor: 'rgba(76, 175, 80, 0.1)'
        },
        super: {
            icon: '⭐',
            clase: 'mensaje-super',
            color: '#ffc107',
            bgColor: 'rgba(255, 193, 7, 0.1)'
        },
        pick3: {
            icon: '🎱',
            clase: 'mensaje-pick3',
            color: '#9c27b0',
            bgColor: 'rgba(156, 39, 176, 0.1)'
        },
        pick4: {
            icon: '🎮',
            clase: 'mensaje-pick4',
            color: '#673ab7',
            bgColor: 'rgba(103, 58, 183, 0.1)'
        },
        reventados: {
            icon: '💥',
            clase: 'mensaje-reventados',
            color: '#f44336',
            bgColor: 'rgba(244, 67, 54, 0.1)'
        }
    };

    // Obtener el estilo correspondiente al tipo
    const estilo = tiposMensaje[tipo] || tiposMensaje.info;

    // Crear o obtener el contenedor de mensajes
    let contenedor = document.querySelector('.mensajes-container');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.className = 'mensajes-container';
        document.body.appendChild(contenedor);
    }

    // Crear el elemento del mensaje
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje ${estilo.clase}`;
    mensajeElement.setAttribute('role', 'alert');

    // Crear el contenido del mensaje
    const contenidoHTML = `
        <div class="mensaje-contenido">
            <span class="mensaje-icono">${estilo.icon}</span>
            <span class="mensaje-texto">${mensaje}</span>
            ${config.cerrable ? '<button class="mensaje-cerrar" aria-label="Cerrar mensaje">×</button>' : ''}
        </div>
    `;
    mensajeElement.innerHTML = contenidoHTML;

    // Aplicar estilos
    Object.assign(mensajeElement.style, {
        backgroundColor: estilo.bgColor,
        color: estilo.color,
        borderLeft: `4px solid ${estilo.color}`,
        padding: '12px 20px',
        margin: '8px 0',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
    });

    // Configurar el botón de cerrar si está habilitado
    if (config.cerrable) {
        const btnCerrar = mensajeElement.querySelector('.mensaje-cerrar');
        btnCerrar.onclick = () => cerrarMensaje(mensajeElement, config.onClose);
        
        Object.assign(btnCerrar.style, {
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0 5px',
            opacity: '0.6',
            transition: 'opacity 0.2s'
        });

        btnCerrar.onmouseover = () => btnCerrar.style.opacity = '1';
        btnCerrar.onmouseout = () => btnCerrar.style.opacity = '0.6';
    }

    // Agregar al contenedor
    contenedor.appendChild(mensajeElement);

    // Forzar un reflow para que la animación funcione
    void mensajeElement.offsetWidth;

    // Mostrar con animación
    mensajeElement.style.opacity = '1';
    mensajeElement.style.transform = 'translateY(0)';

    // Configurar el auto-cierre si hay duración
    if (config.duracion > 0) {
        setTimeout(() => {
            if (mensajeElement.parentNode) {
                cerrarMensaje(mensajeElement, config.onClose);
            }
        }, config.duracion);
    }

    // Ajustar estilos para modo oscuro si está activo
    if (document.body.classList.contains('dark-mode')) {
        Object.assign(mensajeElement.style, {
            backgroundColor: `${estilo.color}22`,
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });
    }

    return mensajeElement;
}
 
// Función para agregar estilos de mensajes
function agregarEstilosMensajes() {
    // Verificar si los estilos ya existen
    if (document.getElementById('mensajes-styles')) return;

    const style = document.createElement('style');
    style.id = 'mensajes-styles';
    style.textContent = `
        .mensajes-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
        }

        .mensaje {
            padding: 10px 20px;
            margin: 5px 0;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            opacity: 1;
            transition: opacity 0.5s ease;
        }

        .mensaje-success {
            background-color: #e8f5e9;
            color: #2e7d32;
            border-left: 4px solid #2e7d32;
        }

        .mensaje-error {
            background-color: #ffebee;
            color: #c62828;
            border-left: 4px solid #c62828;
        }

        .mensaje-info {
            background-color: #e3f2fd;
            color: #1565c0;
            border-left: 4px solid #1565c0;
        }

        .dark-mode .mensaje-success {
            background-color: #1b5e20;
            color: #fff;
        }

        .dark-mode .mensaje-error {
            background-color: #b71c1c;
            color: #fff;
        }

        .dark-mode .mensaje-info {
            background-color: #0d47a1;
            color: #fff;
        }
    `;
    document.head.appendChild(style);
}
function limpiarTexto(texto) {
    return texto
        .replace(/\s+/g, ' ')            // Múltiples espacios a uno
        .replace(/\s*,\s*/g, ',')        // Limpiar espacios alrededor de comas
        .replace(/\s+-\s+/g, '-')        // Limpiar espacios alrededor de guiones
        .replace(/\s+con\s+/g, '-con-')  // Normalizar formato "con"
        .trim();
}

function movil() {
    try {
        // Obtener el texto del campo
        let mensajeVenta = document.getElementById('mensajeVenta').value;

        // IMPORTANTE: Asignar cada resultado de replace de vuelta a la variable
        mensajeVenta = mensajeVenta.replace(/^\[.*?\]\s+([^\s]+)\s+(\d+)%\s+(Grupo\s+[^:]+):\s*/gmi, 'SMS:\n');
        mensajeVenta = mensajeVenta.replace(/\[.+?\]\s+[a-zA-Z0-9 ]*:\s/gm, 'SMS:\n');
        mensajeVenta = mensajeVenta.replace(/\s*([-.:,;])\s*([PaL])/g, '$1$2');
        mensajeVenta = mensajeVenta.replace(/([PaL])\s*([-.:,;])\s*/g, '$1$2');
        mensajeVenta = mensajeVenta.replace(/[\*\+\_\¨\^\=\'\-]+(?:von|com|cin|vin|con|c|de)[\*\+\_\¨\^\=\'\-]+|[\*\+\_\¨\^\=\'\-]+(?:von|com|cin|vin|con|c|de)|(?:von|com|cin|vin|con|c|de)[\*\+\_\¨\^\=\'\-]+|\s+(?:von|com|cin|vin|con|c|de)\s+/gmi, '-con-')
        mensajeVenta = mensajeVenta.replace(/--con--/g, '-con-');
        mensajeVenta = mensajeVenta.replace(/\[\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d{1,2}[:|\-]\d{2}\s+[AP]M\](?:\s+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\d+%\s+(?:Grupo|GruPo)\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+[:|\-]):\s*/gmi, '\nsms\n');

        // Procesar cada línea del texto con ajustes específicos para móvil
        mensajeVenta = mensajeVenta.split('\n').map(line => {
            // Corregir problemas comunes de entrada en teclados móviles
            line = line
                .replace(/\[\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d{1,2}[:|\-]\d{2}\s+[AP]M\].*?(?:Grupo|GruPo).*?[:|\-]\s*/gmi, '\nsms\n')
                .replace(/\[\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d{1,2}[:|\-]\d{2}\s+[AP]M\].*?(?:Gru|GruPo).*?[:|\-]\s*/gmi, '\nsms\n')
                .replace(/\[\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d{1,2}[:|\-]\d{2}\s+[AP]M\]\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\d+%\s+(?:Grupo|GruPo)\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+[:|\-]\s*/gmi, '\nsms\n')
                .replace(/(?<!Termin)[\*\+\_\¨\^\=\'\-]+(?:al|aL|Al|AL)[\*\+\_\¨\^\=\'\-]+|(?<!Termin)[\*\+\_\¨\^\=\'\-]+(?:al|aL|Al|AL)|(?<!Termin)(?:al|aL|Al|AL)[\*\+\_\¨\^\=\'\-]+|(?<!Termin)\s+(?:al|aL|Al|AL)\s+/gmi, '-aL-')
                // Para casos de terminal con Y
                .replace(/(?:terminal|t)[\s\-._]*(\d+)[\s\-._]*[yY][\s\-._]*(\d+)/gi, 'Terminal-$1-$2')
                // Para números separados por Y (37 y 20 y 55 y 08)
                .replace(/(\d+)[\s\-._]*[yY][\s\-._]*(?=\d)/gi, '$1-')
                // Caso especial para Linea/L donde la Y debe quedar como -y-
                .replace(/(?:linea|l)[\s\-._]*(\d+)[\s\-._]*[yY][\s\-._]*(\d+)/gi, 'Linea-$1-y-$2')
                // Separar letras de números
                .replace(/([a-zA-Z])(\d)/gi, '$1 $2')    // Letra seguida de número
                .replace(/(\d)([a-zA-Z])/gi, '$1 $2')   // Número seguido de letra
                // Bajar a nueva línea después de con y números
                .replace(/c(?:on)?\W*(\d+)(\s*)(\W+)/gi, 'con-$1\n$2');
            return line;
        }).join('\n');

        // Actualizar el campo de entrada con el texto procesado
        document.getElementById('mensajeVenta').value = mensajeVenta;

        // Mostrar mensaje de éxito
        mostrarMensaje('Procesamiento móvil completado', 'success');
    } catch (error) {
        console.error('Error en función móvil:', error);
        mostrarMensaje('Error al procesar el texto', 'error');
    }
}

// Función de pre-procesamiento de patrones
function preProcesarPatrones() {
    // Obtener el texto del campo de entrada
    let mensajeVenta = document.getElementById('mensajeVenta').value;

    // Procesar cada línea del texto
    mensajeVenta = mensajeVenta.split('\n').map(line => {
        // 1. Reemplazos básicos
        line = line
            // Reemplazar 'o' por '0' si está al lado de un número
            .replace(/o(?=\d)|(?<=\d)o/g, '0')

            // Procesar números mayores al inicio de línea
            .replace(/(?:Total|TOTAL)[-_.:,;\s=]+(\d+)\s*\n\s*\1/gi, 'Total: $1')

            // Eliminar espacios adicionales
            .replace(/\s+/g, ' ')

            // Reemplazar Pj- por P-
            .replace(/Pj-/gi, 'P-')

            // Nuevos patrones de reemplazo
            .replace(/\/+\s*$/, '')          // Borrar / al final de la línea
            .replace(/^[*=#]+/, '')          // Borrar *=# al inicio
            .replace(/^(\d+)-(?![\w\d])/, '$1')  // Borrar - después de número inicial
            .replace(/:/g, "-")
            .replace(/_/g, "-")
            //.replace(/(\w)\s*-\s*(\w)/g, '$1-$2')

            // Reemplazar patrones SMS
            .replace(/\[.+?\]\s+\+\d+\s+\d+\s+\d+:\s/g, '\nsms\n')
            // Reemplazar líneas que empiecen con [algo]
            .replace(/^\[.*?\]\s+([^\s]+)\s+(\d+)%\s+(Grupo\s+[^:]+):\s*/gim, '\nsms\n')
            // Reemplazar patrones como "[algo] texto:"
            .replace(/\[.+?\]\s+[a-zA-Z0-9 ]*:\s/g, '\nsms\n')
            .replace(/\[.+?\]\s+[a-zA-Z0-9 ]*-\s/g, '\nsms\n')
            // Reemplazar el nuevo formato [fecha hora] Nombre porcentaje GruPo Nombre-
            .replace(/\[\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d{1,2}[:|\-]\d{2}\s+[AP]M\].*?(?:Grupo|GruPo).*?[:|\-]/gi, '\nsms\n')
            .replace(/\[\d{2}\/\d{2}\/\d{4}\s+\d{2}-\d{2}\s+[AP]M\]\s+\w+\s+\d+%\s+GruPo\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(-|\s)/gi, '\nsms\n')
            .replace(/\[\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d{1,2}[:|\-]\d{2}\s+[AP]M\].*?(?:Grupo|GruPo).*?[a-zA-ZáéíóúÁÉÍÓÚñÑ][:|\-]/gi, '\nsms\n')
            .replace(/\[\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d{1,2}[:|\-]\d{2}\s+[AP]M\]\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\d+%\s+(?:Grupo|GruPo)\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+[:|\-]/gi, '\nsms\n')
            .replace(/\[\d{2}[\/\-]\d{2}[\/\-]\d{4}\s+\d{1,2}[:|\-]\d{2}\s+[AP]M\].*?(?:Grupo|GruPo).*?[a-zA-ZáéíóúÁÉÍÓÚñÑ\s][:|\-]/gi, '\nsms\n')

            // Cambiar '100' por '00' al inicio de una línea
            .replace(/^(100)/g, '00')
            .replace(/(sms\s*-?\s*)(.*)/gi, '$1\n$2')
            .replace(/([TLPAYtlpay\d]+)\s{1,2}-/gi, '$1-')
            .replace(/-\s{1,2}(\d+)/gi, '-$1')
            .replace(/\.{2,}/g, '.')

            // Añadir un '0' delante de números menores de 10
            .replace(/(?<!\d)(?<![a-zA-Z])(\d)(?!\d)/g, '0$1')
            .replace(/sms(\s+)(\d+.+)/g, 'sms$1\n$2')
            //.replace(/sms(\s+)(Pareja|Linea|Terminal.+)/gi, 'sms$1\n$2')
            .replace(/(Pareja[-.+=, /]+(?:con[-.,]*)*\d+.*?)(\s+sms)$/gm, '$1\n$2')
            .replace(/([a-zA-Z0-9]+)(pareja|lineas|terminal|con)/gmi, '$1 $2')
            .replace(/^(?!(?:d|p|l|t|s|c|o|no|#|\d+|Final|Finales))\w+\s*|[-=./]+\s*$/gmi, '')
            //.replace(/^(?:(\d+[=\-.\/]*)(?:\s+.*)?|(?!(?:d|p|l|t|s|c|o|no|#|\d|Final|Finales))\w+\s*)(.*)/gmi, '$1$2')
            //.replace(/^(\d+[? .,\s]+)\s+/gm, '$1') //

            // Reemplazar '$' por '/'
            .replace(/\$/g, '/')

            // Convertir 'l' en 'L'
            .replace(/l/g, 'L')

            // Convertir 't' en 'T'
            .replace(/t/g, 'T')

            // Convertir 'p' en 'P'
            .replace(/p/g, 'P');

        // 3. Separar números/letras de las palabras clave
        line = line.replace(/([a-zA-Z0-9]+)(pareja|lineas|terminal)/g, '$1 $2');

        return line;
    }).join('\n');

    // Actualizar el campo de entrada con el texto procesado
    document.getElementById('mensajeVenta').value = mensajeVenta;

    // Mostrar mensaje de éxito
    mostrarMensaje('Pre-procesamiento completado', 'success');
}

// Agregar soporte específico para dispositivos móviles a todos los botones de procesamiento
document.addEventListener('DOMContentLoaded', function () {
    // Asegurarnos que inicie en modo oscuro
    document.body.classList.add('dark-mode');
    // Inicialización básica existente
    document.getElementById('Bienvenida').style.display = 'block';
    actualizarSelectJefes();
    updateToggleDarkModeButton();

    // Agregar el event listener para el campo de número ganador
    const numeroGanadorInput = document.getElementById('numeroGanador');
    if (numeroGanadorInput) {
        numeroGanadorInput.addEventListener('input', function (e) {
            validarNumero(this);
        });
    }

    // Configurar el botón de reprocesar
    const btnReprocesar = document.querySelector('.btn-reprocesar');
    if (btnReprocesar) {
        // Eliminar el atributo onclick para evitar duplicación
        btnReprocesar.removeAttribute('onclick');
        
        // Añadir evento para click tradicional
        btnReprocesar.addEventListener('click', function(e) {
            reprocesarPatrones();
        });
        
        // Añadir evento específico para dispositivos táctiles
        btnReprocesar.addEventListener('touchend', function(e) {
            e.preventDefault(); 
            reprocesarPatrones();
        });
    }

    // Configurar el botón de pre-procesar si existe
    const btnPreProcesar = document.querySelector('.btn-pre-procesar');
    if (btnPreProcesar) {
        // Eliminar el atributo onclick para evitar duplicación
        btnPreProcesar.removeAttribute('onclick');
        
        // Añadir evento para click tradicional
        btnPreProcesar.addEventListener('click', function(e) {
            preProcesarPatrones();
        });
        
        // Añadir evento específico para dispositivos táctiles
        btnPreProcesar.addEventListener('touchend', function(e) {
            e.preventDefault();
            preProcesarPatrones();
        });
    }
    
    // Si el botón de pre-procesar no existe, lo creamos
    const botonesContainer = document.querySelector('.button-group');
    if (botonesContainer && !btnPreProcesar) {
        const preBtn = document.createElement('button');
        preBtn.textContent = 'Pre-procesar';
        preBtn.className = 'btn-pre-procesar';
        
        // Usar addEventListener en lugar de onclick
        preBtn.addEventListener('click', function(e) {
            preProcesarPatrones();
        });
        
        // Añadir evento táctil
        preBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            preProcesarPatrones();
        });
        
        // Insertar al inicio del contenedor de botones
        if (botonesContainer.firstChild) {
            botonesContainer.insertBefore(preBtn, botonesContainer.firstChild);
        } else {
            botonesContainer.appendChild(preBtn);
        }
    }
});

// Función principal de procesamiento múltiple
function procesarTextoCompleto() {
    const textarea = document.getElementById('mensajeVenta');
    const indicator = document.querySelector('.validation-indicator');

    try {
        if (indicator) {
            indicator.className = 'validation-indicator processing';
        }

        let texto = textarea.value;
        texto = procesarExpresionesEspecificas(texto, 15);
        texto = procesarPatronesMultiplesVeces(texto, 5); // 3 pasadas por defecto
        textarea.value = texto;

        if (indicator) {
            indicator.className = 'validation-indicator success';
        }

        mostrarMensaje('Procesamiento completado', 'success');

    } catch (error) {
        console.error('Error durante el procesamiento:', error);
        if (indicator) {
            indicator.className = 'validation-indicator error';
        }
        mostrarMensaje('Error en el procesamiento', 'error');
    }
}

// Función para procesar múltiples veces
function procesarPatronesMultiplesVeces(texto, numeroIteraciones = 3) {
    let resultado = texto;
    let iteracionAnterior;

    for (let i = 0; i < numeroIteraciones; i++) {
        iteracionAnterior = resultado;
        resultado = procesarPatronesUnaVez(resultado);

        if (iteracionAnterior === resultado) {
            break;
        }
    }

    return resultado;
}

// Event listener único para el botón de procesar
document.addEventListener('DOMContentLoaded', function () {
    const btnProcesar = document.querySelector('.btn-procesar');
    if (btnProcesar) {
        btnProcesar.addEventListener('click', procesarTextoCompleto);
    }
});

// Función para procesar expresiones regulares específicas múltiples veces
function procesarExpresionesEspecificas(texto, numeroIteraciones = 15) {
    let resultado = texto;

    // Lista de expresiones regulares que necesitan múltiples pasadas
    const expresionesMultiples = [
        [/^(\d+:\d+)(?:\s+|\s*,\s*|\s*\.\s*)(\d+:\d+)/g, '$1\n$2'],
        //[/(\d+(?:[-.+=,]+\d+))\/([\s]*)sms/gi, '$1\nsms'],
        //[/(\d+(?:[-.+=,/ ]+\d+))[\s/]+sms/gi, '$1\nsms'],
        //[/(\d+-\d+\/),?/g, '$1\n'],
        [/^(\d+:\d+)[\s,.]?(\d+:\d+)/g, '$1\n$2'],
        [/(\d+:\d+)[^\n](\d+:\d+)/g, '$1\n$2'],
        // Esta es más agresiva y forzará el salto de línea
        [/(^\d+:\d+)([^\n]*?)(\d+:\d+)/g, '$1\n$3'],
        // Agregar aquí las expresiones que necesitas procesar múltiples veces
        // Separadores con =
        [/(\d+\=\d+)\/(\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/(\d+\/\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/(\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/(\d+\-aL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\=\d+)\/ (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-\d+)\/ (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -/-
        [/(\d+\=\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s=
        [/(\d+\=\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s-
        [/(\d+\=\d+) (\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s.
        [/(\d+\=\d+) (\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s:
        [/(\d+\=\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s:
        [/(\d+\=\d+);(\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s:
        [/(\d+\=\d+) (\d+\-con-)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =\s:
        [/(\d+\=\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+)\.(Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+)\. (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+)\ ,(Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+)\, (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\=\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\=\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\=\d+) (Parejas\-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        // Separadores con -
        [/(\d+\-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\s-
        [/(\d+\-\d+)\, (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\/\. (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\,(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\/,(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\ ,(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\, (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\, (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+)\. (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\.\d+)\. (\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\s;
        [/(\d+\-\d+) (deL \d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\s;
        [/(\d+\-\d+) (\d+\-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\s;
        [/(\d+\-\d+)\/\s*$/gm, '$1'], // Manda para Abajo los # que siguen de -/;
        [/(\d+\-\d+)\/(\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -/;
        [/(\d+\-\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\-\d+)\, (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -\, -
        [/(\d+\-\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\-\d+) (Parejas-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\-\d+) (Parejas-de \d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        // Separador con ,
        [/(\d+\,\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\,\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\,\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s=
        [/(\d+\,\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s;
        [/(\d+\,\d+) (\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s:
        [/(\d+\,\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s-
        [/(\d+\,\d+)\/(\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,/-
        [/(\d+\,\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\,\d+) (\d+\,\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ,\s,
        // Separador con -aL-
        [/(\d+\-aL-\d+\=\d+)\/(\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(\d+\/\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(\d+\-aL-\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(Linea-\d+\-aL-\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(Parejas=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+)\/(TerminaL=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+) (Linea-\d+\-aL-\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+) (Parejas=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+\=\d+) (TerminaL=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\-aL-\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        // Separadores \s
        [/(\d+\.\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\.\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\.\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\.\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .\s=
        [/(\d+\.\d+) (\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .
        [/^(\d+\:\d+)\s(\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de :
        [/(\d+\.\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .\s-
        [/(\d+\.\d+) (\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .\s:
        [/(\d+\.\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de .\s:
        [/(\d+\ \d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\ \d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de =/=
        [/(\d+\ c-\d+) (\d+\ c-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de -/;
        [/(\d+[-:,;=]\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\:\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\:\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\:\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+:\d+)\s+(\d+:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de :
        [/(\d+;\d+)\, (\d+;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de :
        [/(\d+;\d+)\ ,(\d+;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de :
        [/(\d+\;\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(\d+\;\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(\d+\;\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(\d+\;\d+) (\d+\;\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;\s;
        [/(\d+\;\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;\s-
        [/(\d+\;\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;\s=
        [/(\d+\;\d+) (\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;\s:
        [/(\d+\;\d+)\/(\d+\:\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de ;/:
        // Separadores con Lineas- TerminaL- Parejas-
        [/(Linea-\d+\-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(L-\d+\-\d+) (L-\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(L-\d+\-\d+) (T-\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\,\d+) (Parejas,\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-\d+) (\d+\.\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-con-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-con-\d+) (\d+\-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-con-\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-
        [/(Linea-\d+\-con-\d+) (Parejas-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Lineas-#
        [/(TerminaL-\d+\-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(T-\d+\-\d+) (T-\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(TerminaL-\d+\=\d+) (\d+\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(TerminaL-\d+\=\d+) (Parejas\=\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(TerminaL-\d+\-\d+) (\d+\-con-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de TerminaL-
        [/(Parejas-\d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-de \d+) (\d+\-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-\d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-de \d+) (Linea-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-\d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas-de \d+) (TerminaL-\d+)/g, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas=\d+) (\d+\=\d+)/mg, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas=\d+) (Linea-\d+\=\d+)/mg, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/(Parejas=\d+) (TerminaL-\d+\=\d+)/mg, '$1\n$2'], // Manda para Abajo los # que siguen de Parejas-
        [/^(\d+\:\d+)\s+(\d+\:\d+)/mg, '$1\n$2'],
        [/^(\d+\:\d+)\s*(\d+\:\d+)/mg, '$1\n$2'],
        [/^([0-9]+\:[0-9]+)\s+([0-9]+\:[0-9]+)/g, '$1\n$2'],
        [/(sms\s*-?\s*)(.*)/gi, '$1\n$2'],
        [/sms(\s+)(\d+.+)/g, 'sms$1\n$2'],
        //[/sms(\s+)(Pareja|Linea|Terminal.+)/gi, 'sms$1\n$2'],
        //[/Pareja-\d+(\s+)sms/g, 'Pareja-\d+$1\nsms'],
        // Agrega más expresiones aquí según necesites
    ];

    // Procesar solo estas expresiones múltiples veces
    for (let i = 0; i < numeroIteraciones; i++) {
        expresionesMultiples.forEach(([regex, replacement]) => {
            resultado = resultado.replace(regex, replacement);
        });
    }

    return resultado;
}

function procesarPatronesUnaVez(texto) {
    // Asegurarse que el texto esté en trim antes de empezar
    texto = texto.trim();

    // PRIMERO: Procesar los patrones específicos que deben ir primero
    //texto = texto.replace(/(\d+(?:[-.+=,]+\d+))\/([\s]*)sms/gi, '$1\nsms');
    //texto = texto.replace(/(\d+(?:[-.+=,/ ]+\d+))[\s/]+sms/gi, '$1\nsms');
    //texto = texto.replace(/(\d+(?:[-.+=,/ ]+\d+))[\s/]+(\w+)(?:\s+sms)/gi, '$1\n$2\nsms');
    texto = texto.replace(/^\[.*?\]\s+([^\s]+)\s+(\d+)%\s+(Grupo\s+[^:]+):\s*/gmi, 'SMS:\n');
    texto = texto.replace(/\[.+?\]\s+[a-zA-Z0-9 ]*:\s/gm, 'SMS:\n');
    texto = texto.replace(/\s*([-.:,;])\s*([PaL])/g, '$1$2');
    texto = texto.replace(/([PaL])\s*([-.:,;])\s*/g, '$1$2');
    // Normalizar todos los separadores comunes
    texto = texto.replace(/\s+(?:von|com|cin|vin|con|c|de)\s+/gi, 'con');
    texto = texto.replace(/--con--/g, '-con-');
    texto = texto.replace(/-+con-+/g, '-con-');
    //texto = texto.replace(/(sms\s*-?\s*)(.*)/gi, '$1\n$2');
    // Reemplazar letras con tilde por sus equivalentes sin tilde
    texto = texto.replace(/á/g, 'a');
    texto = texto.replace(/é/g, 'e');
    texto = texto.replace(/í/g, 'i');
    texto = texto.replace(/ó/g, 'o');
    texto = texto.replace(/ú/g, 'u');
    // Reemplazar letras con tilde mayúsculas por sus equivalentes sin tilde
    texto = texto.replace(/Á/g, 'A');
    texto = texto.replace(/É/g, 'E');
    texto = texto.replace(/Í/g, 'I');
    texto = texto.replace(/Ó/g, 'O');
    texto = texto.replace(/Ú/g, 'U');
    // Reemplazar la letra "ñ" por "n"
    texto = texto.replace(/ñ/g, 'n');
    // Reemplazar la letra "Ñ" por "N"
    texto = texto.replace(/Ñ/g, 'N');
    // Eliminar espacios alrededor de los símbolos (=, -, :, , ;)
    //texto = texto.replace(/(\d+)\s*([=:\-,;])\s*(\d+)/g, '$1$2$3');
    // Reemplazar * + _ ¨ ^ = con -
    texto = texto.replace(/[\*\+\_\¨\^\=\']/g, '-');
    // 1. Reducir múltiples guiones (`---`) a un solo guion (`-`)
    texto = texto.replace(/-{2,}/g, '-');
    // 2. Reducir múltiples comas (`,,,`) a una sola coma (`,`)
    texto = texto.replace(/,{2,}/g, ',');
    // 3. Reducir múltiples puntos y comas (`;;;`) a un solo punto y coma (`;`)
    texto = texto.replace(/;{2,}/g, ';');
    // 4. Reducir múltiples dos puntos (`:::`) a un solo dos puntos (`:`)
    // texto = texto.replace(/:{2,}/g, ':');
    // 5. Reducir múltiples guiones bajos (`___`) a un solo guion bajo (`_`)
    texto = texto.replace(/_{2,}/g, '_');
    // 6. Reducir múltiples símbolos de intercalación (`^^^`) a un solo símbolo (`^`)
    texto = texto.replace(/\^{2,}/g, '^');
    // 7. Reducir múltiples diéresis (`¨¨¨`) a una sola diéresis (`¨`)
    texto = texto.replace(/¨{2,}/g, '¨');
    // 8. Reducir múltiples espacios en blanco a un solo espacio
    texto = texto.replace(/\s{2,}/g, ' ');

    // Limpiar puntuación y espacios extra
    texto = texto.replace(/(\d+)[,.\s]*-*con-*[,.\s]*(\d+)/gi, '$1-con$2');
    texto = texto.replace(/^[Ll]-(\d+)/gm, 'L-$1');
    texto = texto.replace(/(?<!\d)(\d)(?!\d)/g, '0$1');
    // Resto del procesamiento...
    texto = texto.replace(/\b(?:con|c)\s*\b/gi, '-con-');
    texto = texto.replace(/[-\s]+con[-\s]+/g, '-con-');
    texto = texto.replace(/(?:\s|\W)+aL(?:\s|\W)+/g, '-aL-');
    texto = texto.replace(/(\d+)\s*aL\s*(\d+)/gi, '$1-aL-$2');
    texto = texto.replace(/\b(?:con|c)\b/gi, '-con-');

    // Procesamiento de palabras específicas
    texto = texto.replace(/(\d+)([a-zA-Z]+)/g, '$1 $2');
    texto = texto.replace(/([a-zA-Z])([0-9]+)/g, '$1-$2');
    texto = texto.replace(/Ter([a-zA-Z]*)/gi, 'TerminaL');
    texto = texto.replace(/TerminaL /gi, 'TerminaL-');
    texto = texto.replace(/Lin([a-zA-Z]*)/gi, 'Linea');
    texto = texto.replace(/Linea /gi, 'Linea-');
    texto = texto.replace(/Línea /gi, 'Linea-');
    texto = texto.replace(/Pare([a-zA-Z]*)/gi, 'Pareja');
    texto = texto.replace(/Parejas /gi, 'Pareja-');

    // Limpieza final
    texto = texto.replace(/c(?:on)?\W*(\d+)(\s*)(\W+)/g, 'con-$1\n$2');
    texto = texto.replace(/^(?!(?:d|p|l|t|s|c|o|no|#|\d))\w+\s*|[-=./]+\s*$/gim, '');
    texto = texto.replace(/(?<!\d)(?<![a-zA-Z])(\d)(?!\d)/g, '0$1');
    texto = texto.replace(/ToTaL\W\d+\$*/g, '');
    texto = texto.replace(/(\d+-(?:al|con)-\d+(?:-con-\d+)?)/g, '$1');

    // Procesar las líneas con 'de'
    texto = texto.trim().split('\n').map(line => {
        if (line.includes(' de ')) {
            return line.replace(' de ', 'con');
        }
        return line;
    }).join('\n');

    return texto.trim();
}

// Función reprocesarPatrones optimizada
function reprocesarPatrones() {
    try {
        let mensajeVenta = document.getElementById('mensajeVenta').value;
        const lineas = mensajeVenta.split('\n').filter(linea => linea.trim());
        let mensajesInvalidos = [];
        let mensajesValidos = [];
        let totalVenta = 0;
        let premioEncontrado = 0;
        const montosPorNumero = {};
        const numerosCriticos = [];
        let numeroGanador = obtenerNumeroGanador();

        // Validar número ganador
        if (!numeroGanador && !mensajeVenta.toUpperCase().startsWith('TOTAL:')) {
            mensajesInvalidos.push('Por favor ingrese el número ganador', 'error');
            numeroGanador = null;
            // return false;
        }

        // Función auxiliar para procesar montos por número
        function procesarMontoNumero(jugadas) {
            Object.keys(jugadas).forEach((numero)=> {
                if (!isNaN(numero) && !isNaN(jugadas[numero])) {
                    montosPorNumero[numero] = (montosPorNumero[numero] || 0) + jugadas[numero];
                    if (montosPorNumero[numero] > 5000 && !numerosCriticos.includes(numero)) {
                        numerosCriticos.push(numero);
                    }
                }
            })
        }

        const nuevasLineas = lineas.map(linea => {
            linea = linea.trim();
            if (!linea) return linea;

            if (linea.toUpperCase() === 'SMS') return linea;

            if (esJugadaValida(linea)) {
                let resultado;
                //linea = linea.toLowerCase(); Cambia de Mayuscula a Minuscula todo
                try {
                    // Verificar primero si es un número solitario de 3 o más dígitos
                        if (/^\d{3,}$/.test(linea)) {
                            console.log('Número solitario detectado: ' + linea);
                            mensajesInvalidos.push(linea + ' (número solitario no válido)');
                            return linea;
                    } else if (patrones.linea.test(linea)) {
                        console.log('jugada linea');
                        resultado = procesarLineaConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.lineaConY.test(linea)) {
                        console.log('jugada linea con Y');
                        resultado = procesarLineaConYGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.decena.test(linea)) {
                        console.log('jugada decena');
                        resultado = procesarDecenaConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            premioEncontrado += resultado.premioEncontrado;
                            Object.entries(resultado.jugadas).forEach(([numero, monto]) => {
                                montosPorNumero[numero] = (montosPorNumero[numero] || 0) + monto;
                            });
                            mensajesValidos.push(linea);
                            return linea; // Retornamos la línea después de procesarla
                        }
                    } else if (patrones.terminal.test(linea) || patrones.terminalMultiple.test(linea) ){
                        console.log('jugada terminal');
                        resultado = procesarTerminalesConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.pareja.test(linea)) {
                        console.log('jugada pareja');
                        resultado = procesarParejasConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.terminalAl.test(linea)) {
                        console.log('jugada terminal Al');
                        resultado = procesarTerminalAl(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.parejasAl.test(linea)) {
                        console.log('jugada parejas al');
                        resultado = procesarParejasAlConGanador(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else if (patrones.numeroAlNumero.test(linea)) {
                        console.log('jugada numero al');
                        resultado = procesarNumeroAlNumero(linea, numeroGanador);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                        }
                    } else {
                        resultado = procesarGenerica(linea, numeroGanador);
                        console.log(resultado);
                        if (resultado) {
                            totalVenta += resultado.totalVenta;
                            procesarMontoNumero(resultado.jugadas);
                            console.log('procesado');
                        }
                    }

                    if (resultado) {
                        mensajesValidos.push(linea);
                        premioEncontrado += resultado.premioEncontrado || 0;
                    } else {
                        mensajesInvalidos.push(linea);
                    }
                    return linea;
                } catch (error) {
                    mensajesInvalidos.push(linea);
                    return linea;
                }
            } else {
                mensajesInvalidos.push(linea);
                return linea;
            }
        });

        // Mostrar alerta si hay números que exceden 5000
        if (numerosCriticos.length > 0) {
            const mensaje = `¡ADVERTENCIA!\nLos siguientes números exceden el límite de 5,000:\n${
                numerosCriticos.map(num => `Número ${num}: ${montosPorNumero[num].toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`).join('\n')
            }`;
            alert(mensaje);
        }

        // Actualizar el campo de entrada
        document.getElementById('mensajeVenta').value = nuevasLineas.join('\n');

        // Manejar mensajes no procesados
        const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
        if (mensajesInvalidos.length > 0) {
            mensajesNoProcesadosSection.style.display = 'block';
            document.getElementById('mensajesNoProcesadosTextarea').value = mensajesInvalidos.join('\n');

            const mensajesInteractivosExistente = mensajesNoProcesadosSection.querySelector('.mensajes-interactivos');
            if (mensajesInteractivosExistente) {
                mensajesInteractivosExistente.remove();
            }

            const mensajesInteractivos = crearMensajesInteractivos(mensajesInvalidos);
            mensajesNoProcesadosSection.appendChild(mensajesInteractivos);
            mostrarMensaje('Hay mensajes inválidos. Haga clic en ellos para localizarlos.', 'error');
        } else {
            mensajesNoProcesadosSection.style.display = 'none';
            document.getElementById('mensajesNoProcesadosTextarea').value = '';
        }

        mostrarMensaje('Patrones reprocesados', 'success');
        // Mostrar resultados finales
        // Añadir cálculo de ganancia/pérdida
        const vendedorSeleccionado = document.getElementById('vendedorSelect').value;
            let porcentajeVendedor = 10; // Valor por defecto
            let precioVenta = 1000; // Valor por defecto

            // Obtener valores del vendedor seleccionado si existe
        if (vendedorSeleccionado && vendedores[vendedorSeleccionado]) {
            porcentajeVendedor = vendedores[vendedorSeleccionado].porcentaje || 10;
            precioVenta = vendedores[vendedorSeleccionado].precioVenta || 1000;
        }

        // Cálculo de ganancia del vendedor basado en porcentaje
        const gananciaVendedor = totalVenta * (porcentajeVendedor / 100);

        // Calcular el pago de premios
        const pagoPremios = premioEncontrado * precioVenta;

        // Calcular la entrega (venta total menos ganancia del vendedor)
        const entrega = totalVenta - gananciaVendedor;

        // Calcular si hay ganancia o pérdida
        const diferencia = entrega - pagoPremios;
        const esGanancia = diferencia >= 0;

        let mensaje;
            if (numeroGanador)
            mensaje = `Total Venta: ${totalVenta.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} - Número Ganador: ${numeroGanador} - Premio Total: ${premioEncontrado}`;
        else
            mensaje = `Total Venta: ${totalVenta.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

        // Primero establecer el texto base
        document.getElementById('totalVenta').innerText = mensaje;

        // Luego añadir el span coloreado si hay número ganador
        if (numeroGanador) {
        // Añadir información de ganancia/pérdida con color
        const spanElement = document.createElement('span');
            spanElement.style.color = esGanancia ? 'green' : 'red';
            spanElement.textContent = ` - ${esGanancia ? 'Ganancia' : 'Pérdida'}: ${Math.round(Math.abs(diferencia)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
            document.getElementById('totalVenta').appendChild(spanElement);
        }
        return {
            mensajesValidos,
            totalVenta,
            mensajesInvalidos,
            premioEncontrado
        };

    } catch (error) {
        console.error('Error al reprocesar patrones:', error);
        mostrarMensaje('Error al reprocesar patrones', 'error');
    }

}

function crearMensajesInteractivos(mensajes) {
    const contenedor = document.createElement('div');
    contenedor.className = 'mensajes-interactivos';

    mensajes.forEach(mensaje => {
        const mensajeElement = document.createElement('div');
        mensajeElement.className = 'mensaje-interactivo';

        // Separar el mensaje de error del mensaje original si existe
        const [mensajeOriginal, mensajeError] = mensaje.split('\n⚠️');

        // Crear el contenido principal del mensaje
        const contenidoPrincipal = document.createElement('div');
        contenidoPrincipal.textContent = mensajeOriginal;
        mensajeElement.appendChild(contenidoPrincipal);

        // Si hay mensaje de error, agregar con estilo destacado
        if (mensajeError) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-detalle';
            errorElement.textContent = '⚠️' + mensajeError;
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '0.9em';
            errorElement.style.marginTop = '5px';
            mensajeElement.appendChild(errorElement);
        }

        mensajeElement.onclick = () => resaltarMensaje(mensajeOriginal);
        contenedor.appendChild(mensajeElement);
    });

    return contenedor;
}

// Función auxiliar para cerrar mensajes
function cerrarMensaje(mensajeElement, callback) {
    mensajeElement.style.opacity = '0';
    mensajeElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        if (mensajeElement.parentNode) {
            mensajeElement.remove();
            if (typeof callback === 'function') {
                callback();
            }
        }
    }, 300);
}

// Función principal modificada que integra ambas funcionalidades
function esJugadaValida(linea) {
    // Si la línea está vacía o no es string, retornar falso
    if (!linea || typeof linea !== 'string') {
        return false;
    }

    // Convertir múltiples espacios en uno solo y trim
    linea = linea.trim().replace(/\s+/g, ' ');

    // Validar SMS
    if (linea.toUpperCase() === 'SMS') return true;
    if (linea.toUpperCase().startsWith('SMS-')) return true;

    // Primero limpiamos el texto para normalizar formatos
    linea = limpiarTexto(linea);

    // Verificar si la línea coincide con alguno de los patrones válidos
    return Object.values(patrones).some(patron => patron.test(linea));
}

// Exportar funciones para acceso global
window.procesarLineaConGanador = procesarLineaConGanador;
window.procesarLineaConYGanador = procesarLineaConYGanador;
window.procesarDecenaConGanador = procesarDecenaConGanador;
window.procesarDecenaConYGanador = procesarDecenaConYGanador;
window.procesarTerminalesConGanador = procesarTerminalesConGanador;
window.procesarTerminalAl = procesarTerminalAl;
window.procesarParejasConGanador = procesarParejasConGanador;
window.procesarParejasAlConGanador = procesarParejasAlConGanador;
window.procesarNumeroAlNumero = procesarNumeroAlNumero;
window.procesarGenerica = procesarGenerica;
window.procesarJugadaUnaLinea = procesarJugadaUnaLinea;
window.procesarJugadasMultilinea = procesarJugadasMultilinea;
window.mostrarMensaje = mostrarMensaje;
window.agregarEstilosMensajes = agregarEstilosMensajes;
window.limpiarTexto = limpiarTexto;
window.procesarTextoCompleto = procesarTextoCompleto;
window.procesarPatronesMultiplesVeces = procesarPatronesMultiplesVeces;
window.procesarPatronesUnaVez = procesarPatronesUnaVez;
window.procesarExpresionesEspecificas = procesarExpresionesEspecificas;
window.movil = movil;
window.preProcesarPatrones = preProcesarPatrones;
window.reprocesarPatrones = reprocesarPatrones;
window.crearMensajesInteractivos = crearMensajesInteractivos;
window.cerrarMensaje = cerrarMensaje;
window.esJugadaValida = esJugadaValida;
