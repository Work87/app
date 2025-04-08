/**
 * 4-vendedores.js - Gestión de vendedores
 * Este archivo contiene todas las funciones relacionadas con
 * la administración de vendedores, sus ventas y operaciones.
 */

function agregarVendedor() {
    const nombre = document.getElementById('nombreVendedor').value;
    const precioVenta = parseFloat(document.getElementById('precioVenta').value);
    const porcentaje = parseFloat(document.getElementById('porcentaje').value);
    const fondo = parseFloat(document.getElementById('fondo').value);

    // Obtener los jefes seleccionados del select múltiple
    const jefeSelect = document.getElementById('jefeVendedorSelect');
    const jefesSeleccionados = Array.from(jefeSelect.selectedOptions).map(option => {
        const jefe = jefes[option.value];
        return jefe.nombre;
    });

    // Validación modificada para aceptar fondo = 0
    if (nombre &&
        !isNaN(precioVenta) &&
        !isNaN(porcentaje) &&
        !isNaN(fondo) &&
        jefesSeleccionados.length > 0) {

        vendedores.push({
            nombre,
            precioVenta,
            porcentaje,
            fondo,
            ventas: [],
            jefes: jefesSeleccionados,
            bancoRecogio: 0,
            bancoEntrego: 0
        });
        actualizarListaVendedores();

        // Limpiar campos
        document.getElementById('nombreVendedor').value = '';
        document.getElementById('precioVenta').value = '';
        document.getElementById('porcentaje').value = '';
        document.getElementById('fondo').value = '';
        jefeSelect.selectedIndex = -1; // Desseleccionar todos los jefes

        mostrarMensaje('Vendedor agregado exitosamente', 'success');
    } else {
        mostrarMensaje('Por favor, complete todos los campos y seleccione al menos un jefe.', 'error');
    }
}
function toggleBotones(index) {
    const botonesDiv = document.getElementById(`botones-vendedor-${index}`);
    if (botonesDiv) {
        botonesDiv.style.display = botonesDiv.style.display === 'none' ? 'flex' : 'none';
    }
}

// 1. Función actualizarListaVendedores modificada para incluir configurarDragAndDrop
function actualizarListaVendedores() {
    const listaVendedores = document.getElementById('listaVendedores');
    listaVendedores.innerHTML = '';

    // Primero, identificar vendedores con múltiples jefes
    const vendedoresMultijefe = {};
    const vendedoresProcesados = new Set();

    // Identificar vendedores con múltiples jefes y agruparlos
    vendedores.forEach((vendedor, index) => {
        if (vendedor.jefes.length > 1) {
            const jefesClave = vendedor.jefes.sort().join('|');
            if (!vendedoresMultijefe[jefesClave]) {
                vendedoresMultijefe[jefesClave] = {
                    jefesNombres: vendedor.jefes,
                    vendedores: []
                };
            }
            vendedoresMultijefe[jefesClave].vendedores.push({...vendedor, index});
            vendedoresProcesados.add(index);
        }
    });

    // Organizar vendedores con un solo jefe
    const vendedoresPorJefe = {};

    // Inicializar las listas para cada jefe
    jefes.forEach(jefe => {
        vendedoresPorJefe[jefe.nombre] = [];
    });

    // Agregar vendedores de un solo jefe a sus respectivos jefes
    vendedores.forEach((vendedor, index) => {
        if (!vendedoresProcesados.has(index)) {
            const jefeNombre = vendedor.jefes[0]; // Tomamos el primer y único jefe
            if (vendedoresPorJefe[jefeNombre]) {
                vendedoresPorJefe[jefeNombre].push({...vendedor, index});
            }
        }
    });

    // Crear secciones para jefes individuales
    jefes.forEach(jefe => {
        const vendedoresDelJefe = vendedoresPorJefe[jefe.nombre];

        // Solo crear la sección si tiene vendedores
        if (vendedoresDelJefe.length > 0) {
            crearSeccionJefe(jefe.nombre, vendedoresDelJefe, listaVendedores);
        }
    });

    // Crear secciones para grupos de jefes (vendedores multi-jefe)
    Object.values(vendedoresMultijefe).forEach(grupo => {
        const nombreJefesAgrupados = grupo.jefesNombres.join(' / ');
        crearSeccionJefe(nombreJefesAgrupados, grupo.vendedores, listaVendedores, true);
    });

    // Añadir la funcionalidad de arrastrar y soltar a todos los vendedores
    configurarDragAndDrop();

    // Agregar estilos necesarios si no existen
    if (!document.getElementById('vendedores-por-jefe-styles')) {
        const style = document.createElement('style');
        style.id = 'vendedores-por-jefe-styles';
        style.textContent = `
            .jefe-section {
                margin-bottom: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .dark-mode .jefe-section {
                border-color: #444;
            }
            
            .jefe-header {
                background-color: #f5f5f5;
                padding: 10px 15px;
                cursor: pointer;
            }
            
            .dark-mode .jefe-header {
                background-color: #333;
            }
            
            .jefe-title {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .btn-toggle-jefe {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                padding: 0 5px;
            }
            
            .vendedores-count {
                color: #666;
                font-size: 0.9em;
            }
            
            .dark-mode .vendedores-count {
                color: #999;
            }
            
            .vendedores-list {
                padding: 10px;
            }
            
            .vendedor-item {
                margin: 5px 0;
                padding: 10px;
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid #eee;
            }
            
            .dark-mode .vendedor-item {
                background-color: #222;
                border-color: #444;
            }
            
            .vendedor-item.dragging {
                opacity: 0.5;
                border: 2px dashed #007bff;
            }
            
            .drag-handle {
                cursor: grab;
                margin-right: 10px;
                user-select: none;
            }
            
            .multi-jefe {
                background-color: #f0f7ff;
            }
            
            .dark-mode .multi-jefe {
                background-color: #1a2733;
            }
            
            .order-controls {
                display: flex;
                gap: 5px;
                margin-left: auto;
            }
            
            .btn-order {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: #007bff;
                padding: 2px 5px;
            }
            
            .btn-order:hover {
                background-color: #f0f0f0;
                border-radius: 3px;
            }
            
            .dark-mode .btn-order:hover {
                background-color: #444;
            }
            
            .vendedor-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .vendedor-nombre-container {
                display: flex;
                align-items: center;
            }
        `;
        document.head.appendChild(style);
    }

    actualizarSelectVendedores();
}
   
function actualizarSelectVendedores() {
    const vendedorSelect = document.getElementById('vendedorSelect');
    if (!vendedorSelect) return;
    
    const jefeFilterSelect = document.getElementById('jefeFilterSelect');
    
    // Si existe el filtro, usar la función de filtrado
    if (jefeFilterSelect) {
        const jefeSeleccionado = jefeFilterSelect.value;
        if (jefeSeleccionado) {
            // Solo mostrar y actualizar si hay un jefe seleccionado
            vendedorSelect.style.display = '';
            filtrarVendedoresPorJefe(jefeSeleccionado);
        } else {
            // Si no hay jefe seleccionado, mantener oculto
            vendedorSelect.style.display = 'none';
        }
        return;
    }
    
    // Si no existe filtro, comportamiento original
    // Limpiar el select
    vendedorSelect.innerHTML = '';
    // Agregar la opción vacía por defecto
    const optionVacia = document.createElement('option');
    optionVacia.value = '';
    optionVacia.textContent = '-- Seleccione un vendedor --';
    vendedorSelect.appendChild(optionVacia);
    // Agregar los vendedores
    vendedores.forEach((vendedor, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = vendedor.nombre;
        vendedorSelect.appendChild(option);
    });
    // Forzar la selección de la opción vacía
    vendedorSelect.value = '';
}

function verVentasVendedorPorHorario(vendedorIndex, horario) {
    const vendedor = vendedores[vendedorIndex];
    // Depuración específica para Miguel
if (vendedor.nombre === "Migue") {
    console.log("DEPURACIÓN ESPECIAL PARA MIGUEL");
    
    // Filtrar solo por horario para ver todas las ventas por fecha
    const todasVentasHorario = vendedor.ventas
        .filter(v => v.horario === horario)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    console.log("Ventas de Miguel ordenadas por fecha (solo filtradas por horario):");
    todasVentasHorario.forEach(v => {
        console.log(`Fecha: ${v.fecha}, Número ganador: ${v.numeroGanador}, Tipo: ${typeof v.numeroGanador}`);
    });
    
    // Ahora el filtro normal con número ganador
    const ventasConNumeroGanador = vendedor.ventas
        .filter(v => v.horario === horario && v.numeroGanador !== null)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    console.log("Ventas de Miguel con número ganador:");
    ventasConNumeroGanador.forEach(v => {
        console.log(`Fecha: ${v.fecha}, Número ganador: ${v.numeroGanador}, Tipo: ${typeof v.numeroGanador}`);
    });
}
    console.log(vendedor);
    console.log("Todas las ventas sin filtrar:", vendedor.ventas);
    // Sincronizar fondos al inicio para asegurar consistencia
    sincronizarFondosEntreHorarios(vendedor, vendedorIndex);
    
    // Obtener fecha actual usando la función existente
    const fechaActual = obtenerFechaFormateada();
    // Inicializar correctamente los fondos por horario
    inicializarFondosPorHorario(vendedor);
    
    // SINCRONIZACIÓN MANUAL: Si es noche y no hay ventas
    if (horario === 'noche') {
        const ventasNoche = vendedor.ventas.filter(v => v.horario === 'noche');
        if (ventasNoche.length === 0 && vendedor.fondosPorHorario.dia && vendedor.fondosPorHorario.dia.actual) {
            // Usar el valor actual del día para noche
            vendedor.fondosPorHorario.noche.actual = vendedor.fondosPorHorario.dia.actual;
            vendedor.fondosPorHorario.noche.anterior = vendedor.fondosPorHorario.dia.actual;
            guardarVendedores(vendedores);
        }
    }
    
    // Filtrar ventas por horario
    const ventasHorario = vendedor.ventas.filter(v => v.horario === horario);

    // Obtener el número ganador de la última venta
    const ventasRecientes = vendedor.ventas
    .filter(v => v.horario === horario && v.numeroGanador !== null)
    .sort((a, b) => {
        // Usar la función existente para normalizar las fechas antes de compararlas
        const fechaA = normalizarFecha(a.fecha);
        const fechaB = normalizarFecha(b.fecha);
        return fechaB - fechaA; // Ordenar de más reciente a más antigua
    });

    const numeroGanador = ventasRecientes.length > 0 ? ventasRecientes[0].numeroGanador : null;
    
    // Determinar la fecha del reporte
    let fechaReporteVenta = fechaActual;
    if (ventasRecientes.length > 0 && ventasRecientes[0].fecha) {
        // Asegurarse de usar la fecha de la venta más reciente
        fechaReporteVenta = ventasRecientes[0].fecha;
        console.log("Usando fecha de la venta más reciente:", fechaReporteVenta);
    } else if (ventasHorario.length > 0 && ventasHorario[0].fecha) {
        // Si no hay número ganador pero sí hay ventas, usar la fecha de la primera venta del horario
        fechaReporteVenta = ventasHorario[0].fecha;
        console.log("Usando fecha de la primera venta del horario:", fechaReporteVenta);
    }

    // IMPORTANTE: Normalizar la fecha y verificar si hay fondos históricos
    const fechaReporteNormalizada = obtenerFechaFormateada(fechaReporteVenta);
    console.log("Buscando fondos históricos para:", fechaReporteNormalizada, horario);
    
    // Ahora que tenemos fechaReporteNormalizada, filtrar las ventas por fecha también
    const ventasHorarioFiltradas = ventasHorario.filter(v => {
        const fechaVentaNormalizada = obtenerFechaFormateada(v.fecha);
        return fechaVentaNormalizada === fechaReporteNormalizada;
    });

    const fondosHistoricos = obtenerFondosHistoricos(vendedor, fechaReporteNormalizada, horario);

    // Obtener fondos - priorizar fondos históricos si existen
    let fondoActual, fondoAnterior;

    if (fondosHistoricos) {
        console.log("Encontrados fondos históricos:", fondosHistoricos);
        
        // Si hay valor actual, usarlo
        if (fondosHistoricos.actual !== null && fondosHistoricos.actual !== undefined) {
            fondoActual = fondosHistoricos.actual;
        } else {
            // Si no hay valor actual pero sí hay anterior, usar el actual normal
            fondoActual = obtenerFondoActual(vendedor, horario);
        }
        
        // Si hay valor anterior, usarlo
        if (fondosHistoricos.anterior !== null && fondosHistoricos.anterior !== undefined) {
            fondoAnterior = fondosHistoricos.anterior;
        } else {
            // Si no hay valor anterior, usar el anterior normal
            fondoAnterior = obtenerFondoAnterior(vendedor, horario);
        }
    } else {
        // Si no hay fondos históricos, usar los valores actuales
        fondoActual = obtenerFondoActual(vendedor, horario);
        fondoAnterior = obtenerFondoAnterior(vendedor, horario);
    }

    console.log("Fondos determinados para el reporte:", {
        actual: fondoActual,
        anterior: fondoAnterior,
        fuente: fondosHistoricos ? "históricos" : "actuales"
    });

    // Agrega los logs para diagnóstico
    console.log("Datos para el reporte:");
    console.log("Tipo de fondoActual:", typeof fondoActual);
    console.log("Valor de fondoActual:", fondoActual);
    console.log("Tipo de fondoAnterior:", typeof fondoAnterior);
    console.log("Valor de fondoAnterior:", fondoAnterior);
    console.log("fondosPorHorario completo:", JSON.stringify(vendedor.fondosPorHorario));
    
    // Revisar si hay movimientos para mostrarlos en el informe
    let movimientosHoy = [];
    if (vendedor.movimientos && vendedor.movimientos.length > 0) {
        // Normalizar la fecha del reporte
        const fechaReporteNormalizada = obtenerFechaFormateada(fechaReporteVenta);
        
        // Filtrar movimientos por fecha normalizada y horario
        movimientosHoy = vendedor.movimientos.filter(mov => {
            const movFechaNormalizada = obtenerFechaFormateada(mov.fecha);
            return movFechaNormalizada === fechaReporteNormalizada && mov.horario === horario;
        });
        
        // Añadir un log para depuración
        console.log("Fecha del reporte normalizada:", fechaReporteNormalizada);
        console.log("Movimientos disponibles:", vendedor.movimientos);
        console.log("Movimientos filtrados para este reporte:", movimientosHoy);
    }

    // Calcular totales de movimientos para este informe específico
    let totalAgregado = 0;
    let totalQuitado = 0;

    movimientosHoy.forEach(mov => {
        if (mov.tipo === 'agregar') {
            totalAgregado += parseFloat(mov.cantidad);
            console.log(`Movimiento de agregar encontrado: ${mov.cantidad}`);
        } else if (mov.tipo === 'quitar') {
            totalQuitado += parseFloat(mov.cantidad);
            console.log(`Movimiento de quitar encontrado: ${mov.cantidad}`);
        }
    });

    console.log("Total agregado:", totalAgregado);
    console.log("Total quitado:", totalQuitado);

    // Obtener todos los movimientos de la fecha del reporte
    let movimientosDelDia = [];
    let totalAgregadoHoy = 0;
    let totalQuitadoHoy = 0;

    if (vendedor.movimientos && vendedor.movimientos.length > 0) {
        // Normalizar la fecha del reporte
        const fechaReporteNormalizada = obtenerFechaFormateada(fechaReporteVenta);
        
        // Filtrar por la fecha del reporte normalizada (todos los horarios)
        movimientosDelDia = vendedor.movimientos.filter(mov => {
            return obtenerFechaFormateada(mov.fecha) === fechaReporteNormalizada;
        });
        
        console.log("Movimientos para la fecha del reporte (todos los horarios):", movimientosDelDia);
        
        // Calcular totales de movimientos para esa fecha
        movimientosDelDia.forEach(mov => {
            if (mov.tipo === 'agregar') {
                totalAgregadoHoy += parseFloat(mov.cantidad);
            } else if (mov.tipo === 'quitar') {
                totalQuitadoHoy += parseFloat(mov.cantidad);
            }
        });
    }

    // Inicializar variables
    let totalVenta = 0;
    let totalPremios = 0;
    let gananciaVendedor = 0;
    let pagoPremios = 0;
    let entrega = 0;
    let fondoRecomendado = fondoAnterior;
    
    // Calcular totales si hay ventas
    if (ventasHorarioFiltradas.length > 0) {
        ventasHorarioFiltradas.forEach(venta => {
            totalVenta += venta.totalVenta;
            totalPremios += venta.premio;
        });

       // Calcular resultados
pagoPremios = Math.round(totalPremios * vendedor.precioVenta);
gananciaVendedor = Math.round(totalVenta * (vendedor.porcentaje / 100));
entrega = Math.round(totalVenta - gananciaVendedor);
const diferencia = Math.round(entrega - pagoPremios);

// Calcular cuál sería el nuevo fondo, incluyendo los movimientos de fondo
fondoRecomendado = Math.round(
    asegurarNumero(fondoAnterior) + 
    asegurarNumero(diferencia) + 
    asegurarNumero(totalAgregado) - 
    asegurarNumero(totalQuitado)
);

// Agregar log para verificar el cálculo
console.log("Cálculo de Fondo Recomendado:", {
    fondoAnterior,
    diferencia,
    totalAgregado,
    totalQuitado,
    fondoRecomendado });
    }
    
    // ========= CREAR REPORTE EN FORMATO TEXTO PLANO ==========
    let reporte = "";
    // Información de fecha y horario
    let fechaMostrar = fechaReporteVenta;
    // Verificar si la fecha necesita ser formateada
    if (fechaReporteVenta !== fechaActual && typeof fechaReporteVenta === 'string' && !fechaReporteVenta.includes('/')) {
        // Intentar formatear si no está en formato dd/mm/yyyy
        const partes = fechaReporteVenta.split('-');
        if (partes.length === 3) {
            fechaMostrar = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
    }
    if (numeroGanador !== null)
        // Encabezado
    reporte += `${vendedor.nombre}  ${horario === 'dia' ? 'Día' : 'Noche'}  ${numeroAEmoji(numeroGanador)} ${fechaMostrar} \n`;
            
    // RESUMEN GENERAL en formato de texto
    reporte += '----- RESUMEN GENERAL ------\n';
    
    if (ventasHorarioFiltradas.length > 0) {
        // Usar espacios para alinear como una tabla
        const etiquetas = [
            'Número de Ventas:',
            'Venta Total:',
            'Premio Total:',
            'Pago Total:',
            'Entrega Total:',
            `${fondoAnterior < 0 ? 'Fondo Banco Debe:' : 'Fondo Anterior:'}`
        ];
        
        // Formatear todos los valores, convirtiendo a string y alineando
        const valores = [
            ventasHorarioFiltradas.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            Math.round(asegurarNumero(totalVenta)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            asegurarNumero(totalPremios).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            asegurarNumero(pagoPremios).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            Math.round(asegurarNumero(entrega)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            asegurarNumero(fondoAnterior).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        ];
            // CÓDIGO NUEVO: Agregar línea de Ganancia o Pérdida
        // Calcular la ganancia o pérdida del banco
        const gananciaOPerdidaBanco = entrega - pagoPremios;

        // Agregar etiqueta de Ganancia o Pérdida según corresponda
        if (gananciaOPerdidaBanco >= 0) {
            etiquetas.push('Ganancia:');
        } else {
            etiquetas.push('Pérdida:');
        }

        // Formatear el valor (valor absoluto)
        const valorAbsoluto = Math.abs(gananciaOPerdidaBanco);
        valores.push(asegurarNumero(valorAbsoluto).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

        // Encontrar la etiqueta más larga para calcular el padding
        const longitudMaxima = Math.max(...etiquetas.map(e => e.length));

        // Encontrar el valor más largo para calcular cuánto espacio reservar
        const longitudMaximaValores = Math.max(...valores.map(v => v.length));

        // Crear cada línea con alineación
        etiquetas.forEach((etiqueta, index) => {
            // Padding a la derecha para alinear el inicio de los valores
            const espaciosEtiqueta = ' '.repeat(longitudMaxima - etiqueta.length + 5);
            
            // Padding a la izquierda para alinear los valores a la derecha
            const valor = valores[index];
            const espaciosValor = ' '.repeat(longitudMaximaValores - valor.length);
            
            // Combinar todo con el valor alineado a la derecha
            reporte += `${etiqueta}${espaciosEtiqueta}${espaciosValor}${valor}\n`;
        });
        
        // Añadir información de "Banco Entregó" si hay fondos agregados hoy
        if (totalAgregado > 0) {
            const espacios = ' '.repeat(longitudMaxima - 13 + 5);
            reporte += `Banco Entregó:${espacios}+${Math.round(asegurarNumero(totalAgregadoHoy)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`;
        }
        
        // Añadir información de "Banco Recogió" si hay fondos quitados hoy
        if (totalQuitado > 0) {
            // Usar la misma lógica de alineación que para las etiquetas regulares
            const etiqueta = 'Banco Recogió:';
            const valor = Math.round(asegurarNumero(totalQuitadoHoy)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
            // Padding a la derecha para alinear el inicio de los valores (igual que en etiquetas)
            const espaciosEtiqueta = ' '.repeat(longitudMaxima - etiqueta.length + 5);
            
            // Padding a la izquierda para alinear los valores a la derecha
            const espaciosValor = ' '.repeat(longitudMaximaValores - valor.length);
            
            // Combinar todo con el valor alineado a la derecha y con signo negativo
            reporte += `${etiqueta}${espaciosEtiqueta}${espaciosValor}-${valor}\n`;
        }
        // CÓDIGO NUEVO: Añadir el Fondo Actual al final de los movimientos
            const etiquetaFondoAct = 'Fondo Actual:';
            const valorFondoAct = asegurarNumero(fondoActual).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Usar la misma lógica de alineación que para las etiquetas regulares
            const espaciosEtiquetaFondoAct = ' '.repeat(longitudMaxima - etiquetaFondoAct.length + 5);
            const espaciosValorFondoAct = longitudMaximaValores > valorFondoAct.length ? 
            ' '.repeat(longitudMaximaValores - valorFondoAct.length) : '';

        // Agregar al reporte
            reporte += `${etiquetaFondoAct}${espaciosEtiquetaFondoAct}${espaciosValorFondoAct}${valorFondoAct}\n`;

        } else {
        reporte += 'No hay ventas registradas para este horario y fecha.\n';
    }
    
    // Agregar sección de fondos al reporte
    reporte += '\n----- FONDOS ACTUALES -----\n';
    
    // Crear las etiquetas y valores para la información de fondos
    const etiquetasFondos = [
        `${fondoAnterior < 0 ? 'Fondo Banco Debe:' : 'Fondo Anterior:'}`
    ];
    
    const valoresFondos = [
        asegurarNumero(fondoAnterior).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    ];
    // Agregar información de fondos agregados/quitados si existen
    if (totalAgregado > 0) {
        etiquetasFondos.push('Banco Entregó:');
        valoresFondos.push("+" + asegurarNumero(totalAgregado).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }

    if (totalQuitado > 0) {
        etiquetasFondos.push('Banco Recogió:');
        valoresFondos.push("-" + asegurarNumero(totalQuitado).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
    // Añadir fondo recomendado si hay ventas
    if (ventasHorarioFiltradas.length > 0) {
        etiquetasFondos.push('Fondo Recomendado:');
        valoresFondos.push(asegurarNumero(fondoRecomendado).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
    
    // Añadir fondo actual según condición
    if (horario === 'dia' || (horario === 'noche' && ventasHorarioFiltradas.length > 0)) {
        etiquetasFondos.push('Fondo Actual:');
        valoresFondos.push(asegurarNumero(fondoActual).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
    
    // Encontrar la etiqueta más larga para calcular el padding
    const longitudMaximaFondos = Math.max(...etiquetasFondos.map(e => e.length));
    
    // Encontrar el valor más largo para calcular la alineación a la derecha
    const longitudMaximaValoresFondos = Math.max(...valoresFondos.map(v => v.length));
    
    // Crear cada línea de información de fondos con alineación (valores a la derecha)
    etiquetasFondos.forEach((etiqueta, index) => {
        // Espacio entre etiqueta y valor
        const espaciosEtiqueta = ' '.repeat(longitudMaximaFondos - etiqueta.length + 5);
        
        // Espacio para alinear valores a la derecha
        const valor = valoresFondos[index];
        const espaciosValor = ' '.repeat(longitudMaximaValoresFondos - valor.length);
        
        // Combinar todo con el valor alineado a la derecha
        reporte += `${etiqueta}${espaciosEtiqueta}${espaciosValor}${valor}\n`;
    });
    
    // Agregar movimientos de fondo si los hay
    // CÓDIGO NUEVO (alineación dinámica a la derecha)
    if (movimientosHoy.length > 0) {
        reporte += '\n---------- MOVIMIENTOS DE FONDO HOY ----------\n';
    
        // Arrays para las etiquetas y valores de movimientos
        const etiquetasMovimientos = [];
        const valoresMovimientos = [];
        
        // Preparar los datos
        movimientosHoy.forEach(mov => {
            if (mov.tipo === 'agregar') {
                etiquetasMovimientos.push('Banco Entrego:');
                valoresMovimientos.push(Math.round(mov.cantidad).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            } else if (mov.tipo === 'quitar') {
                etiquetasMovimientos.push('Banco Recogio:');
                valoresMovimientos.push(Math.round(mov.cantidad).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            }
        });
        
        // Calcular longitudes máximas
        const longitudMaximaMovimientos = Math.max(...etiquetasMovimientos.map(e => e.length));
        const longitudMaximaValoresMovimientos = Math.max(...valoresMovimientos.map(v => v.length));
        
        // Formatear cada línea de movimiento con valores alineados a la derecha
        etiquetasMovimientos.forEach((etiqueta, index) => {
            const espaciosEtiqueta = ' '.repeat(longitudMaximaMovimientos - etiqueta.length + 5);
            const espaciosValor = ' '.repeat(longitudMaximaValoresMovimientos - valoresMovimientos[index].length);
            
            reporte += `${etiqueta}${espaciosEtiqueta}${espaciosValor}${valoresMovimientos[index]}\n`;
        });
    }
    
    // Crear modal (mantener esta parte pero con la visualización del texto)
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #a9a9a9; /* Gris oscuro */
        color: black;
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    // Usar un elemento pre para mantener el formato del texto
    const preElement = document.createElement('pre');
    preElement.style.cssText = `
        margin: 0;
        font-family: monospace;
        white-space: pre;
        font-size: 14px;
    `;
    preElement.textContent = reporte;
    modalContent.appendChild(preElement);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

    // Botón para actualizar el fondo
    const updateFondoButton = document.createElement('button');
    updateFondoButton.textContent = 'Actualizar Fondo';
    updateFondoButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #2196F3;
        color: white;
        cursor: pointer;
    `;
    
    // En el evento onclick del botón updateFondoButton
    // Botón para actualizar el fondo
    updateFondoButton.onclick = () => {
        // Obtener los fondos actuales
        const fondoActual = obtenerFondoActual(vendedor, horario);
        
        if (ventasHorarioFiltradas.length === 0) {
            alert('No hay ventas para actualizar el fondo.');
            return;
        }
        
        // Obtener la fecha de la venta que estamos procesando
        const fechaVenta = ventasHorarioFiltradas[0].fecha;
        const fechaVentaFormateada = obtenerFechaFormateada(fechaVenta);
        
        console.log("Procesando venta con fecha:", fechaVentaFormateada);
        
        if (confirm(`¿Deseas actualizar el fondo a ${fondoRecomendado}?`)) {
            console.log(`Actualizando fondo a ${fondoRecomendado} para la fecha ${fechaVentaFormateada}`);
            
            // 1. Actualizar o crear el registro histórico para esta fecha y horario específicos
            if (!vendedor.historialFondos) {
                vendedor.historialFondos = [];
            }
            
            // Buscar si ya existe un registro para esta fecha/horario
            const indiceRegistro = vendedor.historialFondos.findIndex(h => 
                obtenerFechaFormateada(h.fecha) === fechaVentaFormateada && 
                h.horario === horario);
            
            if (indiceRegistro !== -1) {
                // Actualizar registro existente
                vendedor.historialFondos[indiceRegistro].fondoActual = fondoRecomendado;
                vendedor.historialFondos[indiceRegistro].actualizadoEl = new Date().toISOString();
                
                console.log(`Actualizado registro existente para ${fechaVentaFormateada}, ${horario}`);
            } else {
                // Crear nuevo registro histórico
                vendedor.historialFondos.push({
                    fecha: fechaVenta,
                    horario: horario,
                    fondoActual: fondoRecomendado,
                    fondoAnterior: fondoAnterior,
                    actualizadoEl: new Date().toISOString()
                });
                
                console.log(`Creado nuevo registro para ${fechaVentaFormateada}, ${horario}`);
            }
            
            // 2. NUEVA LÓGICA: Mantener coherencia cronológica en registros futuros
            
            // Ordenar el historialFondos cronológicamente
            vendedor.historialFondos.sort((a, b) => {
                const fechaA = obtenerFechaFormateada(a.fecha).split('/').map(Number);
                const fechaB = obtenerFechaFormateada(b.fecha).split('/').map(Number);
                
                const dateA = new Date(fechaA[2], fechaA[1] - 1, fechaA[0]);
                const dateB = new Date(fechaB[2], fechaB[1] - 1, fechaB[0]);
                
                // Primero comparamos por fecha
                if (dateA.getTime() !== dateB.getTime()) {
                    return dateA.getTime() - dateB.getTime();
                }
                
                // Si la fecha es la misma, día va antes que noche
                if (a.horario === 'dia' && b.horario === 'noche') return -1;
                if (a.horario === 'noche' && b.horario === 'dia') return 1;
                
                return 0;
            });
            
            // Propagar el cambio a los siguientes registros en la secuencia
            let ultimoFondoActual = fondoRecomendado;
            let ultimaFecha = fechaVentaFormateada;
            let ultimoHorario = horario;
            
            // Recorremos todos los registros para actualizar los fondos anteriores según la cronología
            for (let i = 0; i < vendedor.historialFondos.length; i++) {
                const registro = vendedor.historialFondos[i];
                const fechaRegistro = obtenerFechaFormateada(registro.fecha);
                
                // Convertir a fechas para comparar
                const fechaRegistroObj = new Date(fechaRegistro.split('/')[2], 
                                                 fechaRegistro.split('/')[1] - 1, 
                                                 fechaRegistro.split('/')[0]);
                const ultimaFechaObj = new Date(ultimaFecha.split('/')[2], 
                                               ultimaFecha.split('/')[1] - 1, 
                                               ultimaFecha.split('/')[0]);
                
                // Verificar si este registro es posterior al que acabamos de actualizar
                const esPosterior = (fechaRegistroObj > ultimaFechaObj) || 
                                   (fechaRegistroObj.getTime() === ultimaFechaObj.getTime() && 
                                    ultimoHorario === 'dia' && registro.horario === 'noche');
                
                if (esPosterior) {
                    // Determinar si debemos actualizar el fondo anterior de este registro
                    let debeActualizar = false;
                    
                    // Si es el día siguiente al último registro de noche
                    if (ultimoHorario === 'noche' && registro.horario === 'dia') {
                        // Verificar si es el día siguiente
                        const siguienteDia = new Date(ultimaFechaObj);
                        siguienteDia.setDate(siguienteDia.getDate() + 1);
                        
                        if (fechaRegistroObj.getTime() === siguienteDia.getTime()) {
                            debeActualizar = true;
                        }
                    }
                    // Si es noche del mismo día que el último registro de día
                    else if (ultimoHorario === 'dia' && registro.horario === 'noche' &&
                            fechaRegistroObj.getTime() === ultimaFechaObj.getTime()) {
                        debeActualizar = true;
                    }
                    
                    if (debeActualizar) {
                        console.log(`Actualizando fondo anterior de registro ${fechaRegistro}, ${registro.horario} a ${ultimoFondoActual}`);
                        registro.fondoAnterior = ultimoFondoActual;
                        
                        // Si este registro ya tiene un fondo actual, lo usamos para el siguiente
                        if (registro.fondoActual !== null && registro.fondoActual !== undefined) {
                            ultimoFondoActual = registro.fondoActual;
                            ultimaFecha = fechaRegistro;
                            ultimoHorario = registro.horario;
                        }
                    }
                }
            }
            
            // 3. Si la fecha de la venta es la actual, también actualizamos los fondos actuales
            const fechaActualFormateada = obtenerFechaFormateada();
            if (fechaVentaFormateada === fechaActualFormateada) {
                console.log("La venta es de hoy, actualizando fondos actuales");
                
                // Asegurarse de que la estructura existe
                if (!vendedor.fondosPorHorario) {
                    vendedor.fondosPorHorario = {
                        dia: { anterior: 0, actual: 0 },
                        noche: { anterior: 0, actual: 0 }
                    };
                }
                
                // Actualizar el fondo actual para este horario
                vendedor.fondosPorHorario[horario].actual = fondoRecomendado;
                
                // Si es horario de día, actualizar el fondo anterior de la noche
                if (horario === 'dia') {
                    vendedor.fondosPorHorario.noche.anterior = fondoRecomendado;
                }
                
                // Guardar en localStorage
                localStorage.setItem(`fondoVendedor_${vendedorIndex}_${horario}`, 
                    JSON.stringify(vendedor.fondosPorHorario[horario]));
                    
                if (horario === 'dia') {
                    localStorage.setItem(`fondoVendedor_${vendedorIndex}_noche`, 
                        JSON.stringify(vendedor.fondosPorHorario.noche));
                }
            }
            
            // 4. Guardar todos los cambios
            guardarVendedores(vendedores);
            
            // 5. Registrar la actualización
            registrarActualizacionFondo(
                vendedorIndex,          
                fondoActual,            
                fondoRecomendado,       
                fondoRecomendado - fondoActual,             
                fechaVenta,            
                horario                 
            );
            
            alert('Fondo actualizado correctamente');
            document.body.removeChild(modalContainer);
            
            // Volver a mostrar el reporte actualizado
            verVentasVendedorPorHorario(vendedorIndex, horario);
            
            return false;
        }
    };

    // Botón Copiar
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copiar';
    copyButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;

    copyButton.onclick = async () => {
        try {
            // Obtener el texto completo del reporte
            const reporteCompleto = preElement.textContent;
            
            // Extraer solo el encabezado y el resumen general
            let reporteReducido = "";
            
            // Dividir el reporte en líneas
            const lineas = reporteCompleto.split('\n');
            
            // Variable para rastrear en qué sección estamos
            let enSeccionRelevante = true;
            
            // Recorrer cada línea del reporte
            for (let i = 0; i < lineas.length; i++) {
                const linea = lineas[i];
                
                // Siempre incluir el encabezado (las primeras líneas hasta RESUMEN GENERAL)
                if (i < 3 || linea.includes('RESUMEN GENERAL')) {
                    reporteReducido += linea + '\n';
                    enSeccionRelevante = true;
                    continue;
                }
                
                // Detectar cuando termina la sección de RESUMEN GENERAL
                if (linea.includes('FONDOS ACTUALES')) {
                    enSeccionRelevante = false;
                }
                
                // Añadir líneas solo si estamos en una sección relevante
                if (enSeccionRelevante) {
                    reporteReducido += linea + '\n';
                }
            }
            
            // Copiar el texto reducido al portapapeles
            await navigator.clipboard.writeText(reporteReducido);
            
            // Crear imagen en canvas basada en el texto reducido
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calcular dimensiones según el contenido
            const lineasReducidas = reporteReducido.split('\n');
            const anchoCanvas = 300; // Ancho fijo para dar espacio suficiente
            const altoLinea = 20; // Altura por línea en píxeles
            const margen = 40; // Margen superior e inferior
            
            canvas.width = anchoCanvas;
            canvas.height = lineasReducidas.length * altoLinea + margen;
    
            // Fondo gris claro
            ctx.fillStyle = '#a9a9a9';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            // Configurar texto monoespaciado para preservar alineación
            ctx.fillStyle = '#000000';
            ctx.font = '16px monospace';
            ctx.textAlign = 'left';
            
            // Dibujar cada línea exactamente como está en el texto reducido
            lineasReducidas.forEach((linea, index) => {
                ctx.fillText(linea, 20, 25 + (index * altoLinea));
            });
    
            // Convertir canvas a Blob (imagen)
            canvas.toBlob(async (blobImage) => {
                if (blobImage) {
                    try {
                        // Copiar ambos formatos: texto e imagen
                        const clipboardItems = [
                            new ClipboardItem({
                                'text/plain': new Blob([reporteReducido], {type: 'text/plain'}),
                                'image/png': blobImage
                            })
                        ];
                        
                        await navigator.clipboard.write(clipboardItems);
                        console.log("Texto e imagen copiados con éxito");
                    } catch (e) {
                        console.error("Error al escribir en el portapapeles:", e);
                        // Ya tenemos el texto copiado, así que no necesitamos volver a intentarlo
                    }
                }
            }, 'image/png');
    
            copyButton.textContent = 'Copiado!';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            copyButton.textContent = 'Error al copiar';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        }
    };

    // Botón Aceptar
    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Aceptar';
    acceptButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    acceptButton.onclick = () => {
        document.body.removeChild(modalContainer);
    };

    buttonContainer.appendChild(updateFondoButton);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

function editarVendedor(index) {
    const vendedor = vendedores[index];
    
    // Añadir edición del nombre
    const nuevoNombre = prompt(`Nombre actual: ${vendedor.nombre}. Ingrese el nuevo nombre:`);
    
    const nuevoPrecioVenta = parseFloat(prompt(`Precio de Venta actual: ${vendedor.precioVenta}. Ingrese el nuevo Precio de Venta:`));
    const nuevoPorcentaje = parseFloat(prompt(`Porcentaje actual: ${vendedor.porcentaje}%. Ingrese el nuevo Porcentaje:`));
    
    // Actualizar el nombre si se ingresó uno nuevo
    if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
        vendedor.nombre = nuevoNombre;
    }
    
    if (!isNaN(nuevoPrecioVenta)) {
        vendedor.precioVenta = nuevoPrecioVenta;
    }
    
    if (!isNaN(nuevoPorcentaje)) {
        vendedor.porcentaje = nuevoPorcentaje;
    }
    
    actualizarListaVendedores();
    mostrarMensaje('Vendedor actualizado exitosamente', 'success');
}

/**
 * Reemplaza la función eliminarVendedor original para usar la versión completa
 * @param {number} index - Índice del vendedor
 */
function eliminarVendedor(index) {
    eliminarVendedorCompleto(index, true);
}

/**
 * Elimina completamente un vendedor del sistema junto con todas sus referencias
 * @param {number} vendedorIndex - Índice del vendedor en el array vendedores
 * @param {boolean} confirmar - Si es true, pedirá confirmación al usuario
 * @returns {boolean} - true si se eliminó con éxito, false si se canceló
 */
function eliminarVendedorCompleto(vendedorIndex, confirmar = true) {
    try {
        // Obtener el vendedor
        const vendedor = vendedores[vendedorIndex];
        if (!vendedor) {
            mostrarMensaje('Error: Vendedor no encontrado', 'error');
            return false;
        }

        // Pedir confirmación al usuario si es necesario
        if (confirmar) {
            const mensaje = `¿Está seguro de eliminar completamente al vendedor ${vendedor.nombre}?\n\nEsta acción eliminará todas sus ventas y referencias, y no se puede deshacer.`;
            if (!confirm(mensaje)) {
                mostrarMensaje('Operación cancelada por el usuario', 'info');
                return false;
            }
        }

        // 1. Eliminar referencias a este vendedor en los jefes
        // (no es necesario ya que los jefes solo tienen nombre del vendedor, no referencias directas)

        // 2. Eliminar el vendedor del array principal
        vendedores.splice(vendedorIndex, 1);

        // 3. Actualizar localStorage
        localStorage.setItem('vendedores', JSON.stringify(vendedores));

        // 4. Eliminar cualquier localStorage específico para este vendedor
        // Limpiar fondos y registros específicos
        for (let i = vendedorIndex; i < localStorage.length; i++) {
            // Los índices de localStorage para fondos, etc.
            localStorage.removeItem(`fondoVendedor_${i}_dia`);
            localStorage.removeItem(`fondoVendedor_${i}_noche`);
            localStorage.removeItem(`fondoActual_${i}_dia`);
            localStorage.removeItem(`fondoActual_${i}_noche`);
            localStorage.removeItem(`fondoAnterior_${i}_dia`);
            localStorage.removeItem(`fondoAnterior_${i}_noche`);
        }

        // 5. Actualizar historial
        if (window.historialDatos && window.historialDatos.fechas) {
            // Recorrer todas las fechas en el historial
            Object.keys(window.historialDatos.fechas).forEach(fecha => {
                const datosHistoricos = window.historialDatos.fechas[fecha];
                
                // Si existen datos de vendedores para esa fecha
                if (datosHistoricos && datosHistoricos.vendedores) {
                    // Eliminar el vendedor del historial
                    datosHistoricos.vendedores = datosHistoricos.vendedores.filter(v => 
                        v.nombre !== vendedor.nombre
                    );
                }
            });
            
            // Guardar el historial actualizado
            localStorage.setItem('historialLoteria', JSON.stringify(window.historialDatos));
        }

        // 6. Actualizar la UI
        actualizarListaVendedores();
        actualizarSelectVendedores();

        mostrarMensaje(`Vendedor ${vendedor.nombre} eliminado completamente del sistema`, 'success');
        return true;

    } catch (error) {
        console.error('Error al eliminar vendedor completamente:', error);
        mostrarMensaje('Error al eliminar el vendedor: ' + error.message, 'error');
        return false;
    }
}

// Modificar el inicio de la función agregarMensaje
// Primero, asegurarnos de que la función sea accesible globalmente
window.agregarMensaje = function () {
    // Obtener y validar todos los campos requeridos
    const campos = {
        mensajeVenta: document.getElementById('mensajeVenta')?.value?.trim() || '',
        vendedorSelect: document.getElementById('vendedorSelect'),
        horarioSelect: document.getElementById('horarioSelect'),
        fechaVenta: document.getElementById('fechaVenta'),
        numeroGanador: document.getElementById('numeroGanador')?.value?.trim() || ''
    };
    console.log("Campos obtenidos en agregarMensaje:", campos);
    
    // Validaciones básicas
    if (!campos.vendedorSelect?.value) {
        mostrarMensaje('Por favor seleccione un vendedor', 'error');
        return;
    }
    if (!campos.horarioSelect?.value) {
        mostrarMensaje('Por favor seleccione un horario', 'error');
        return;
    }
    if (!campos.fechaVenta?.value) {
        mostrarMensaje('Por favor seleccione una fecha', 'error');
        return;
    }
    if (!campos.mensajeVenta) {
        mostrarMensaje('Por favor ingrese un mensaje de venta', 'error');
        return;
    }
    
    // Obtener el vendedor
    const vendedorIndex = parseInt(campos.vendedorSelect.value);
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) {
        mostrarMensaje('Error: Vendedor no encontrado', 'error');
        return;
    }
    console.log("Vendedor seleccionado:", vendedor);
    
    // Procesar venta
    try {
        if (campos.mensajeVenta.toUpperCase().startsWith('TOTAL:')) {
            console.log("Procesando venta directa con mensaje:", campos.mensajeVenta);
            procesarVentaDirecta(
                vendedor,
                campos.mensajeVenta,
                campos.horarioSelect.value,
                campos.fechaVenta.value
            );
        } else {
            // Validar número ganador para ventas normales
            if (!campos.numeroGanador) {
                mostrarMensaje('Por favor ingrese el número ganador', 'error');
                return;
            }
            console.log("Procesando venta normal con mensaje:", campos.mensajeVenta);
            procesarVentaNormal(
                vendedor,
                campos.mensajeVenta,
                campos.horarioSelect.value,
                campos.fechaVenta.value
            );
        }
        
        // Guardar y actualizar
        guardarDatos();
        actualizarListaVendedores();
        
        // Limpiar formulario
        document.getElementById('mensajeVenta').value = '';
        document.getElementById('numeroGanador').value = '';
        
        // NUEVO: Limpiar el campo de búsqueda del selector con filtro
        const searchInput = document.querySelector('#vendedorSelectContainer input.vendedor-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // NUEVO: Limpiar el valor seleccionado
        campos.vendedorSelect.value = '';
        
        // Mostrar mensaje de éxito
        mostrarMensaje('Venta procesada correctamente', 'success');
        
    } catch (error) {
        console.error('Error al procesar la venta:', error);
        mostrarMensaje('Error al procesar la venta: ' + error.message, 'error');
    }
};

// VERSIÓN ACTUALIZADA QUE INCLUYE NÚMERO GANADOR
function procesarVentaDirecta(vendedor, mensajeVenta, horario, fecha, numeroGanador = null, premio = 0) {
    console.log("Iniciando procesarVentaDirecta con valores:", {
        vendedor,
        mensajeVenta,
        horario,
        fecha,
        numeroGanador,
        premio
    });
   
    const totalStr = mensajeVenta.split(':')[1].trim();
    const total = parseFloat(totalStr);
   
    if (isNaN(total)) {
        throw new Error('El total no es un número válido');
    }
   
    // Normalizar la fecha usando la función existente
    const fechaNormalizada = obtenerFechaFormateada(fecha);
    
    // NUEVA VALIDACIÓN: Verificar si ya existe una venta con la misma fecha y horario
    // y comprobar que el número ganador sea consistente
    if (numeroGanador !== null) {
        // Buscar en todos los vendedores para encontrar cualquier venta con la misma fecha y horario
        const ventasExistentes = [];
        vendedores.forEach(v => {
            const ventasCoincidentes = v.ventas.filter(venta => 
                venta.fecha === fechaNormalizada && 
                venta.horario === horario && 
                venta.numeroGanador !== null  // Solo considerar ventas que tengan número ganador
            );
            ventasExistentes.push(...ventasCoincidentes);
        });
        
        // Si hay ventas existentes, verificar que el número ganador sea el mismo
        if (ventasExistentes.length > 0) {
            const primeraVenta = ventasExistentes[0];
            
            if (primeraVenta.numeroGanador !== numeroGanador) {
                console.error("Error de consistencia en procesarVentaDirecta: Número ganador diferente", {
                    numeroExistente: primeraVenta.numeroGanador,
                    numeroNuevo: numeroGanador,
                    fecha: fechaNormalizada,
                    horario: horario
                });
                throw new Error(`El número ganador debe ser ${primeraVenta.numeroGanador} para ventas del ${fechaNormalizada} en horario ${horario}`);
            }
            
            console.log("Validación exitosa: El número ganador coincide con ventas existentes");
        } else {
            console.log("No hay ventas existentes para esta fecha y horario con número ganador, continuando con nueva venta");
        }
    } else {
        console.log("No se proporcionó número ganador para esta venta directa");
    }
   
    const nuevaVenta = {
        fecha: fechaNormalizada,
        horario: horario,
        totalVenta: total,
        premio: premio,
        numeroGanador: numeroGanador
    };
   
    console.log("Nueva venta directa creada:", nuevaVenta);
   
    // Asegurarse de que el array de ventas exista
    if (!vendedor.ventas) vendedor.ventas = [];
   
    vendedor.ventas.push(nuevaVenta);
    console.log("Ventas actualizadas del vendedor:", vendedor.ventas);
   
    // Propagar la venta a los jefes asignados
    if (vendedor.jefes && vendedor.jefes.length > 0) {
        vendedor.jefes.forEach(jefeNombre => {
            const jefe = jefes.find(j => j.nombre === jefeNombre);
            if (jefe) {
                // Inicializar ventas si no existe
                if (!jefe.ventas) jefe.ventas = [];
               
                // Agregar una copia de la venta
                jefe.ventas.push({...nuevaVenta});
                console.log(`Venta directa propagada al jefe ${jefeNombre}`);
            }
        });
    }
   
    mostrarMensaje(`Total de ${total.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} registrado correctamente`, 'success');
}

// Función que se Encarga de Guardar las Ventas a los Vendedores
function procesarVentaNormal(vendedor, mensajeVenta, horario, fechaVenta) {
    console.log("Iniciando procesarVentaNormal con valores:", { vendedor, mensajeVenta, horario, fechaVenta });
   
    const numeroGanador = obtenerNumeroGanador();
    if (!numeroGanador && numeroGanador !== 0) {
        throw new Error('Por favor ingrese el número ganador');
    }
   
    console.log("Número ganador obtenido:", numeroGanador); // Verifica el número ganador
    
    // NUEVA VALIDACIÓN: Verificar si ya existe una venta con la misma fecha y horario
    // y comprobar que el número ganador sea consistente
    const fechaNormalizada = obtenerFechaFormateada(fechaVenta);
    
    // Buscar en todos los vendedores para encontrar cualquier venta con la misma fecha y horario
    const ventasExistentes = [];
    vendedores.forEach(v => {
        const ventasCoincidentes = v.ventas.filter(venta => 
            venta.fecha === fechaNormalizada && 
            venta.horario === horario
        );
        ventasExistentes.push(...ventasCoincidentes);
    });
    
    // Si hay ventas existentes, verificar que el número ganador sea el mismo
    if (ventasExistentes.length > 0) {
        const primeraVenta = ventasExistentes[0];
        if (primeraVenta.numeroGanador !== numeroGanador) {
            console.error("Error de consistencia: Número ganador diferente", {
                numeroExistente: primeraVenta.numeroGanador,
                numeroNuevo: numeroGanador,
                fecha: fechaNormalizada,
                horario: horario
            });
            throw new Error(`El número ganador debe ser ${primeraVenta.numeroGanador} para ventas del ${fechaNormalizada} en horario ${horario}`);
        }
        
        console.log("Validación exitosa: El número ganador coincide con ventas existentes");
    } else {
        console.log("No hay ventas existentes para esta fecha y horario, continuando con nueva venta");
    }
   
    const resultado = reprocesarPatrones(); // Cambiado a la nueva función
    if (!resultado) {
        throw new Error('Error al procesar el mensaje');
    }
   
    console.log("Resultado de reprocesarPatrones:", resultado); // Verifica que haya un resultado válido
   
    const nuevaVenta = {
        fecha: fechaNormalizada, // Usar la fecha normalizada en formato DD/MM/YYYY
        horario: horario,
        totalVenta: resultado.totalVenta,
        premio: resultado.premioEncontrado,
        numeroGanador: numeroGanador
    };
   
    console.log("Nueva venta normal creada:", nuevaVenta); // Verifica la estructura de la venta antes de agregarla
    vendedor.ventas.push(nuevaVenta);
    console.log("Ventas actualizadas del vendedor:", vendedor.ventas); // Verifica que la venta se agregue correctamente
   
    // Verifica si el vendedor tiene jefes y actualiza sus ventas
    if (vendedor.jefes && vendedor.jefes.length > 0) {
        vendedor.jefes.forEach(jefeNombre => {
            const jefe = jefes.find(j => j.nombre === jefeNombre);
            if (jefe) {
                jefe.ventas.push({...nuevaVenta});
                console.log(`Venta añadida al jefe ${jefeNombre}:`, jefe.ventas); // Verifica que los jefes también reciban la venta
            }
        });
    }
   
    mostrarMensaje('Venta registrada correctamente', 'success');
}

// Función de validación del número ganador
function validarNumero(input) {
    // Eliminar cualquier carácter que no sea número
    let valor = input.value.replace(/[^0-9]/g, '');

    // Si está vacío, permitirlo
    if (valor === '') {
        input.value = '';
        return;
    }

    // Convertir a número
    let num = parseInt(valor, 10);

    // Validar el rango (0-99)
    if (num >= 0 && num <= 99) {
        input.value = valor;
    } else {
        input.value = '99';
    }
}

// Función para obtener el número ganador
function obtenerNumeroGanador() {
    const input = document.getElementById('numeroGanador');
    const valor = input.value;
    // Si el valor es '00', retornar 100, de lo contrario el número normal
    return valor === '00' ? 100 : parseInt(valor, 10);
}

// Asegurarse de que solo haya una instancia del event listener
document.addEventListener('DOMContentLoaded', function () {
    const numeroGanadorInput = document.getElementById('numeroGanador');
    if (numeroGanadorInput) {
        // Remover listeners previos si existen
        const nuevoInput = numeroGanadorInput.cloneNode(true);
        numeroGanadorInput.parentNode.replaceChild(nuevoInput, numeroGanadorInput);

        // Agregar el nuevo listener
        nuevoInput.addEventListener('input', function (e) {
            validarNumero(this);
        });
    }
});

function verVentasVendedorPorFecha(index) {
    // Crear el modal con un ID único
    const modalId = `modal-ventas-${Date.now()}`;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = modalId;
   
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Ver Ventas por Fecha</h3>
            <div class="fecha-inputs">
                <div>
                    <label for="fecha-${modalId}">Fecha:</label>
                    <input type="date" id="fecha-${modalId}" required>
                </div>
                <div>
                    <label for="horarioSelect-${modalId}">Horario:</label>
                    <select id="horarioSelect-${modalId}">
                        <option value="">Todos</option>
                        <option value="dia">Día</option>
                        <option value="noche">Noche</option>
                    </select>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="btn-primary btn-ver-ventas">Ver Ventas</button>
                <button onclick="cerrarModal()" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
   
    document.body.appendChild(modal);
   
    // Asignar el evento al botón dentro del modal
    const btnVerVentas = modal.querySelector('.btn-ver-ventas');
    btnVerVentas.addEventListener('click', function() {
        // Obtener los elementos dentro de este modal específico
        const fecha = document.getElementById(`fecha-${modalId}`).value;
        const horarioSelect = document.getElementById(`horarioSelect-${modalId}`);
        const horarioFiltro = horarioSelect.value;
       
        console.log(`Modal ${modalId} - Fecha: "${fecha}", Horario seleccionado: "${horarioFiltro}"`);
       
        if (!fecha) {
            alert("Por favor, selecciona una fecha.");
            return;
        }
       
        // Obtener el vendedor
        const vendedor = vendedores[index];
        if (!vendedor) {
            alert("Error: Vendedor no encontrado");
            return;
        }
       
        // Filtrar ventas - Usamos la misma fecha para inicio y fin para obtener un solo día
        const ventasFiltradas = filtrarVentasPorFecha(vendedor, fecha, fecha, horarioFiltro);
       
        // Mostrar el reporte
        mostrarReporteVentas(vendedor, ventasFiltradas, horarioFiltro, fecha, fecha);
        cerrarModal();
    });
}

function filtrarVentasPorFecha(vendedor, fechaInicio, fechaFin, horario) {
    console.log(`Iniciando filtrado: de ${fechaInicio} a ${fechaFin}, horario="${horario}"`);
    
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);
    
    // Array para almacenar todas las ventas combinadas
    let todasLasVentas = [];
    
    // Obtener ventas del estado actual
    if (vendedor.ventas && Array.isArray(vendedor.ventas)) {
        console.log(`Encontradas ${vendedor.ventas.length} ventas en el vendedor actual`);
        todasLasVentas = [...vendedor.ventas];
    }
    
    // Obtener ventas del historial
    if (historialDatos && historialDatos.fechas) {
        console.log("Buscando ventas en historial...");
        let ventasHistoricas = 0;
        
        // Recorrer todas las fechas guardadas
        Object.keys(historialDatos.fechas).forEach(fecha => {
            const datosHistoricos = historialDatos.fechas[fecha];
            // Verificar si hay datos de vendedores para esa fecha
            if (datosHistoricos && datosHistoricos.vendedores) {
                // Buscar el vendedor en esa fecha por su ID o nombre
                const vendedorHistorico = datosHistoricos.vendedores.find(v => 
                    v.id === vendedor.id || v.nombre === vendedor.nombre
                );
                
                if (vendedorHistorico && vendedorHistorico.ventas && Array.isArray(vendedorHistorico.ventas)) {
                    console.log(`Encontradas ${vendedorHistorico.ventas.length} ventas históricas para fecha ${fecha}`);
                    ventasHistoricas += vendedorHistorico.ventas.length;
                    
                    // Combinar las ventas, asegurando que no haya duplicados
                    vendedorHistorico.ventas.forEach(ventaHistorica => {
                        // Comprobar si la venta ya existe en nuestro array combinado
                        const yaExiste = todasLasVentas.some(v => 
                            v.fecha === ventaHistorica.fecha && 
                            v.horario === ventaHistorica.horario &&
                            v.totalVenta === ventaHistorica.totalVenta
                        );
                        
                        if (!yaExiste) {
                            todasLasVentas.push(ventaHistorica);
                        }
                    });
                }
            }
        });
        
        console.log(`Total de ventas históricas añadidas: ${ventasHistoricas}`);
    }
    
    console.log(`Total de ventas combinadas antes de filtrar: ${todasLasVentas.length}`);
    
    // Filtrar primero por fecha
    let ventasFiltradas = todasLasVentas.filter(venta => {
        let fechaVenta;
        try {
            // Normalización de fecha (convertir a objeto Date)
            if (typeof venta.fecha === 'string' && venta.fecha.includes('-')) {
                // Formato ISO (YYYY-MM-DD)
                fechaVenta = new Date(venta.fecha);
            } else if (typeof venta.fecha === 'string' && venta.fecha.includes('/')) {
                // Formato DD/MM/YYYY
                const partes = venta.fecha.split('/');
                fechaVenta = new Date(partes[2], partes[1]-1, partes[0]);
            } else if (venta.fecha instanceof Date) {
                // Ya es un objeto Date
                fechaVenta = new Date(venta.fecha);
            } else {
                // Intentar conversión directa
                fechaVenta = new Date(venta.fecha);
            }
            
            // Verificar si la conversión fue exitosa
            if (isNaN(fechaVenta.getTime())) {
                console.error("Formato de fecha no válido:", venta.fecha);
                return false;
            }
        } catch (e) {
            console.error("Error al procesar fecha:", venta.fecha, e);
            return false;
        }
        
        // Filtrar por fecha
        const coincideFecha = fechaVenta >= inicio && fechaVenta <= fin;
        
        if (coincideFecha) {
            console.log(`Venta dentro del rango de fechas: ${venta.fecha}, horario=${venta.horario}`);
        }
        
        return coincideFecha;
    });
    
    console.log(`Ventas en rango de fechas: ${ventasFiltradas.length}`);
    
    // Filtrar por horario si se especificó
    if (horario && horario.trim() !== "") {
        console.log(`Aplicando filtro de horario: "${horario}"`);
        
        // Normalizar el horario de búsqueda a minúsculas
        const horarioFiltroLower = horario.toLowerCase();
        
        ventasFiltradas = ventasFiltradas.filter(venta => {
            if (!venta.horario) {
                console.warn("Venta sin propiedad 'horario':", venta);
                return false;
            }
            
            // Normalizar el horario de la venta a minúsculas
            const horarioVentaLower = venta.horario.toLowerCase();
            
            // Comparar los horarios normalizados
            const coincide = horarioVentaLower === horarioFiltroLower;
            
            if (!coincide) {
                console.log(`Descartando venta: fecha=${venta.fecha}, horario=${venta.horario} (buscando=${horario})`);
            } else {
                console.log(`Aceptando venta: fecha=${venta.fecha}, horario=${venta.horario}`);
            }
            
            return coincide;
        });
        
        console.log(`Después de filtrar por horario "${horario}": ${ventasFiltradas.length} ventas coinciden`);
        
        // Verificación final para confirmar que todas las ventas tienen el horario correcto
        const ventasHorarioCorrecto = ventasFiltradas.filter(v => 
            v.horario.toLowerCase() === horarioFiltroLower
        );
        
        if (ventasHorarioCorrecto.length !== ventasFiltradas.length) {
            console.error(`ERROR: ${ventasFiltradas.length - ventasHorarioCorrecto.length} ventas tienen horario incorrecto`);
            return ventasHorarioCorrecto;
        }
    }
    
    return ventasFiltradas;
}

function mostrarReporteVentas(vendedor, ventas, horario, fechaInicio, fechaFin) {
    console.log(`Generando reporte para ${vendedor.nombre}: ${ventas.length} ventas, horario=${horario || 'todos'}`);
    
    // Formatear fechas correctamente para el reporte
    const formatoFecha = (fechaStr) => {
        // Si es formato de input date (YYYY-MM-DD)
        if (fechaStr.includes('-')) {
            const partes = fechaStr.split('-');
            return `${partes[2]}/${partes[1]}/${partes[0]}`; // Convertir a DD/MM/YYYY
        }
        // Si ya está en otro formato, devolver tal cual
        return fechaStr;
    };
    
    // Crear una estructura para el reporte
    const reporteHTML = document.createElement('div');
    reporteHTML.style.cssText = `
        font-family: Arial, sans-serif;
        color: black;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        text-align: left;
    `;
    
    // Título y período
    const titulo = document.createElement('h2');
    titulo.style.cssText = `text-align: center; margin-bottom: 5px;`;
    titulo.textContent = `Reporte de Ventas - ${vendedor.nombre}`;
    reporteHTML.appendChild(titulo);
    
    // Modificación para mostrar correctamente el período (si es un solo día o un rango)
    const periodo = document.createElement('p');
    periodo.style.cssText = `text-align: center; margin-bottom: 15px;`;
    
    // Comprobar si es un solo día o un rango
    if (fechaInicio === fechaFin) {
        periodo.textContent = `Fecha: ${formatoFecha(fechaInicio)}`;
    } else {
        periodo.textContent = `Período: ${formatoFecha(fechaInicio)} al ${formatoFecha(fechaFin)}`;
    }
    
    // Agregar el horario si está especificado
    if (horario) {
        periodo.textContent += ` - Horario: ${horario === 'dia' ? 'Día' : 'Noche'}`;
    }
    reporteHTML.appendChild(periodo);
    
    // Separador
    const separador = document.createElement('hr');
    separador.style.cssText = `border: none; border-top: 1px solid #333; margin: 10px 0;`;
    reporteHTML.appendChild(separador);
    
    // Contenido principal
    if (ventas.length === 0) {
        const noVentas = document.createElement('p');
        noVentas.style.cssText = `text-align: center; margin: 20px 0;`;
        noVentas.textContent = 'No hay ventas registradas para este período.';
        reporteHTML.appendChild(noVentas);
    } else {
        // Crear una tabla para el formato de dos columnas
        const tabla = document.createElement('table');
        tabla.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        `;
        
        // Si el horario es "todos", separar ventas por horario
        if (!horario) {
            // Filtrar ventas por horario
            const ventasDia = ventas.filter(v => v.horario.toLowerCase().replace(/\B(?=(\d{3})+(?!\d))/g, ',') === 'dia');
            const ventasNoche = ventas.filter(v => v.horario.toLowerCase().replace(/\B(?=(\d{3})+(?!\d))/g, ',') === 'noche');
            
            // Mostrar resumen general
            agregarFila(tabla, 'Total de Ventas:', ventas.length);
            agregarFila(tabla, '- Ventas Día:', ventasDia.length);
            agregarFila(tabla, '- Ventas Noche:', ventasNoche.length);
            
            // Procesamiento por horario
            procesarVentasPorHorario(tabla, vendedor, 'dia', ventasDia);
            procesarVentasPorHorario(tabla, vendedor, 'noche', ventasNoche);
            
            // Totales generales
            let totalVentaGeneral = 0;
            let totalPremiosGeneral = 0;
            
            ventas.forEach(venta => {
                totalVentaGeneral += venta.totalVenta || 0;
                totalPremiosGeneral += venta.premio || 0;
            });
            
            agregarSeparador(tabla);
            agregarEncabezado(tabla, 'TOTALES GENERALES');
            agregarFila(tabla, 'Venta Total General:', totalVentaGeneral.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            agregarFila(tabla, 'Premio Total General:', totalPremiosGeneral.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            
        } else {
            // Si se seleccionó un horario específico (día o noche)
            procesarVentasPorHorario(tabla, vendedor, horario, ventas);
        }
        
        reporteHTML.appendChild(tabla);
    }
    
    // Información de fondos
    mostrarInformacionFondos(reporteHTML, vendedor, horario, fechaInicio, fechaFin, ventas.length === 0);
    
    // Preparar el texto para copiar
    const reporteTexto = generarReporteTexto(reporteHTML, vendedor, fechaInicio, fechaFin, horario);
    
    // Mostrar el modal con el reporte
    mostrarModalReporte(reporteHTML, reporteTexto, horario, ventas);
}

// 2. Modificación de la función crearSeccionJefe para mantener tus botones pero añadir ordenamiento
function crearSeccionJefe(nombreJefe, vendedoresLista, contenedor, esMultiJefe = false) {
    // Crear sección del jefe
    const jefeSection = document.createElement('div');
    jefeSection.className = 'jefe-section';
    jefeSection.dataset.jefe = nombreJefe;
    
    if (esMultiJefe) {
        jefeSection.classList.add('multi-jefe');
    }
    
    // Encabezado del jefe con botón para expandir/colapsar
    const jefeHeader = document.createElement('div');
    jefeHeader.className = 'jefe-header';
    
    // Título del jefe con botones de ordenamiento
    const headerContent = document.createElement('div');
    headerContent.className = 'jefe-title';
    
    const expandButton = document.createElement('button');
    expandButton.className = 'btn-toggle-jefe';
    expandButton.textContent = '▲';
    
    const jefeNombre = document.createElement('strong');
    jefeNombre.textContent = nombreJefe;
    
    const vendedoresCount = document.createElement('span');
    vendedoresCount.className = 'vendedores-count';
    vendedoresCount.textContent = `(${vendedoresLista.length} ${vendedoresLista.length === 1 ? 'vendedor' : 'vendedores'})`;
    
    headerContent.appendChild(expandButton);
    headerContent.appendChild(jefeNombre);
    headerContent.appendChild(vendedoresCount);
    
    // Añadir controles de ordenamiento
    const orderControls = document.createElement('div');
    orderControls.className = 'order-controls';
    
    const btnOrderAlpha = document.createElement('button');
    btnOrderAlpha.className = 'btn-order';
    btnOrderAlpha.textContent = 'A-Z';
    btnOrderAlpha.title = 'Ordenar alfabéticamente';
    btnOrderAlpha.onclick = function(e) {
        e.stopPropagation(); // Evitar que active el toggle de la sección
        ordenarVendedoresEnSeccion(nombreJefe, 'nombre');
    };
    
    const btnOrderRev = document.createElement('button');
    btnOrderRev.className = 'btn-order';
    btnOrderRev.textContent = '↑↓';
    btnOrderRev.title = 'Invertir orden';
    btnOrderRev.onclick = function(e) {
        e.stopPropagation(); // Evitar que active el toggle de la sección
        invertirOrdenEnSeccion(nombreJefe);
    };
    
    orderControls.appendChild(btnOrderAlpha);
    orderControls.appendChild(btnOrderRev);
    
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.width = '100%';
    
    headerContainer.appendChild(headerContent);
    headerContainer.appendChild(orderControls);
    
    jefeHeader.appendChild(headerContainer);
    
    // Lista de vendedores oculta por defecto
    const vendedoresList = document.createElement('div');
    vendedoresList.className = 'vendedores-list';
    vendedoresList.dataset.jefe = nombreJefe;
    vendedoresList.style.display = 'none';  // Asegurar que esté oculta al inicio
    
    vendedoresLista.forEach(vendedor => {
        const vendedorItem = document.createElement('div');
        vendedorItem.className = 'vendedor-item';
        vendedorItem.dataset.index = vendedor.index;
        vendedorItem.dataset.jefe = nombreJefe;
        vendedorItem.draggable = true; // Hacer el elemento arrastrable
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'vendedor-header';
        
        const nombreContainer = document.createElement('div');
        nombreContainer.className = 'vendedor-nombre-container';
        
        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '☰';
        dragHandle.title = 'Arrastrar para reordenar';
        
        const nombreSpan = document.createElement('span');
        nombreSpan.className = 'vendedor-nombre';
        nombreSpan.textContent = vendedor.nombre;
        
        nombreContainer.appendChild(dragHandle);
        nombreContainer.appendChild(nombreSpan);
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn-toggle';
        toggleBtn.textContent = 'Mostrar/Ocultar';
        toggleBtn.onclick = function() {
            toggleBotones(vendedor.index);
        };
        
        headerDiv.appendChild(nombreContainer);
        headerDiv.appendChild(toggleBtn);
        
        const botonesDiv = document.createElement('div');
        botonesDiv.id = `botones-vendedor-${vendedor.index}`;
        botonesDiv.className = 'vendedor-buttons';
        botonesDiv.style.display = 'none';
        
        botonesDiv.innerHTML = `
            <button onclick="verVentasVendedorPorHorario(${vendedor.index}, 'dia')" class="btn-primary">Ver Ventas Día</button>
            <button onclick="verVentasVendedorPorHorario(${vendedor.index}, 'noche')" class="btn-primary">Ver Ventas Noche</button>
            <button onclick="editarVendedor(${vendedor.index})" class="btn-secondary">Editar</button>
            <button onclick="modificarSaldo(${vendedor.index})" class="btn btn-warning btn-sm">Modificar Saldo</button>
            <button onclick="registrarVenta(${vendedor.index})" class="btn btn-success btn-sm">Registrar Venta</button>
            <button onclick="editarJefesVendedor(${vendedor.index})" class="btn-secondary">Editar Jefes</button>
            <button onclick="verVentasVendedorPorFecha(${vendedor.index})" class="btn-primary">Ver Ventas por Fecha</button>
            <button onclick="eliminarVendedor(${vendedor.index})" class="btn-danger">Eliminar</button>
            <button onclick="abrirModalEliminarVenta(${vendedor.index})" class="btn-danger">Eliminar Venta</button>
        `;
        
        vendedorItem.appendChild(headerDiv);
        vendedorItem.appendChild(botonesDiv);
        vendedoresList.appendChild(vendedorItem);
    });
    
    jefeSection.appendChild(jefeHeader);
    jefeSection.appendChild(vendedoresList);
    contenedor.appendChild(jefeSection);
    
    // Agregar funcionalidad de expandir/colapsar
    jefeHeader.addEventListener('click', () => {
        const isCollapsed = vendedoresList.style.display === 'none';
        vendedoresList.style.display = isCollapsed ? 'block' : 'none';
        expandButton.textContent = isCollapsed ? '▼' : '▲';
    });
}

/**
 * Abre un modal para seleccionar fecha y horario a eliminar
 * @param {number} vendedorIndex - Índice del vendedor en el array vendedores
 */
function abrirModalEliminarVenta(vendedorIndex) {
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) {
        mostrarMensaje('Error: Vendedor no encontrado', 'error');
        return;
    }
    
    // Crear modal para seleccionar fecha y horario
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // Obtener la fecha actual para el valor predeterminado
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    // Contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#333' : '#fff';
    modalContent.style.color = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '500px'; // Aumentado para dar más espacio
    modalContent.style.maxWidth = '90%';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflowY = 'auto';
    
    modalContent.innerHTML = `
        <h3 style="margin-top: 0; text-align: center;">Eliminar Venta/Movimiento de ${vendedor.nombre}</h3>
        <p style="color: red; text-align: center; font-weight: bold;">ADVERTENCIA: Esta acción no se puede deshacer.</p>
        
        <div style="margin: 20px 0;">
            <div style="margin-bottom: 15px;">
                <label for="fechaEliminar" style="display: block; margin-bottom: 5px;">Fecha:</label>
                <input type="date" id="fechaEliminar" value="${fechaFormateada}" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; ${document.body.classList.contains('dark-mode') ? 'background-color: #444; color: white;' : ''}">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Horario:</label>
                <div style="display: flex; gap: 15px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="horarioEliminar" value="dia" checked>
                        <span style="margin-left: 5px;">Día</span>
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="horarioEliminar" value="noche">
                        <span style="margin-left: 5px;">Noche</span>
                    </label>
                </div>
            </div>
            
            <button id="btnBuscarVentas" style="width: 100%; padding: 8px 16px; border: none; border-radius: 4px; background-color: #5cb85c; color: white; cursor: pointer; margin-top: 10px;">Buscar Ventas y Movimientos</button>
            
            <div id="ventasContainer" style="margin-top: 15px; display: none;">
                <h4 style="margin-top: 0;">Ventas encontradas:</h4>
                <div id="listaVentas" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; padding: 10px;"></div>
                
                <div style="margin-top: 10px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="seleccionarTodas">
                        <span style="margin-left: 5px; font-weight: bold;">Seleccionar todas las ventas</span>
                    </label>
                </div>
                
                <h4 style="margin-top: 15px;">Movimientos de fondo encontrados:</h4>
                <div id="listaMovimientos" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; padding: 10px;"></div>
                
                <div style="margin-top: 10px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="seleccionarTodosMovimientos">
                        <span style="margin-left: 5px; font-weight: bold;">Seleccionar todos los movimientos</span>
                    </label>
                </div>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button id="btnCancelarEliminar" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #ccc; cursor: pointer;">Cancelar</button>
            <button id="btnConfirmarEliminar" style="padding: 8px 16px; border: none; border-radius: 4px; background-color: #d9534f; color: white; cursor: pointer;">Eliminar Seleccionados</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Variables para almacenar las ventas y movimientos encontrados
    let ventasEncontradas = [];
    let movimientosEncontrados = [];
    
    // Función para buscar ventas y movimientos según fecha y horario
    function buscarVentasYMovimientos() {
        const fechaSeleccionada = document.getElementById('fechaEliminar').value;
        const horarioSeleccionado = document.querySelector('input[name="horarioEliminar"]:checked').value;
        const fechaNormalizada = obtenerFechaFormateada(fechaSeleccionada);
        
        // Limpiar arrays
        ventasEncontradas = [];
        movimientosEncontrados = [];
        
        // 1. Buscar ventas que coincidan con la fecha y horario
        if (vendedor.ventas && vendedor.ventas.length > 0) {
            vendedor.ventas.forEach((venta, index) => {
                const ventaFechaNormalizada = obtenerFechaFormateada(venta.fecha);
                if (ventaFechaNormalizada === fechaNormalizada && venta.horario === horarioSeleccionado) {
                    ventasEncontradas.push({
                        index: index,
                        venta: venta
                    });
                }
            });
        }
        
        // 2. Buscar movimientos de fondo que coincidan con la fecha y horario
        if (vendedor.movimientos && vendedor.movimientos.length > 0) {
            vendedor.movimientos.forEach((movimiento, index) => {
                const movimientoFechaNormalizada = obtenerFechaFormateada(movimiento.fecha);
                if (movimientoFechaNormalizada === fechaNormalizada && movimiento.horario === horarioSeleccionado) {
                    movimientosEncontrados.push({
                        index: index,
                        movimiento: movimiento
                    });
                }
            });
        }
        
        // Mostrar las ventas encontradas
        const listaVentas = document.getElementById('listaVentas');
        listaVentas.innerHTML = '';
        
        if (ventasEncontradas.length === 0) {
            listaVentas.innerHTML = '<p style="text-align: center; margin: 10px 0;">No se encontraron ventas para esta fecha y horario.</p>';
        } else {
            ventasEncontradas.forEach((item, i) => {
                const venta = item.venta;
                
                // Formatear números para mostrar
                const totalVentaFormateado = venta.totalVenta.toLocaleString();
                const premioFormateado = venta.premio.toLocaleString();
                
                // Crear un elemento para cada venta
                const ventaElement = document.createElement('div');
                ventaElement.style.padding = '8px';
                ventaElement.style.borderBottom = '1px solid #ddd';
                ventaElement.style.display = 'flex';
                ventaElement.style.alignItems = 'center';
                ventaElement.style.gap = '10px';
                
                // Número ganador (si existe)
                const numeroGanadorText = venta.numeroGanador !== null ? 
                    `<span style="color: #5bc0de; font-weight: bold;">Nº ${venta.numeroGanador}</span>` : '';
                
                ventaElement.innerHTML = `
                    <input type="checkbox" class="checkbox-venta" data-index="${i}" id="venta-${i}">
                    <label for="venta-${i}" style="flex-grow: 1; cursor: pointer;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>Venta: ${totalVentaFormateado}</span>
                            <span>Premio: ${premioFormateado}</span>
                            ${numeroGanadorText}
                        </div>
                    </label>
                `;
                
                listaVentas.appendChild(ventaElement);
            });
        }
        
        // Mostrar los movimientos encontrados
        const listaMovimientos = document.getElementById('listaMovimientos');
        listaMovimientos.innerHTML = '';
        
        if (movimientosEncontrados.length === 0) {
            listaMovimientos.innerHTML = '<p style="text-align: center; margin: 10px 0;">No se encontraron movimientos de fondo para esta fecha y horario.</p>';
        } else {
            movimientosEncontrados.forEach((item, i) => {
                const movimiento = item.movimiento;
                
                // Formatear cantidad para mostrar
                const cantidadFormateada = parseFloat(movimiento.cantidad).toLocaleString();
                
                // Crear un elemento para cada movimiento
                const movimientoElement = document.createElement('div');
                movimientoElement.style.padding = '8px';
                movimientoElement.style.borderBottom = '1px solid #ddd';
                movimientoElement.style.display = 'flex';
                movimientoElement.style.alignItems = 'center';
                movimientoElement.style.gap = '10px';
                
                // Color según tipo de movimiento
                const colorTipo = movimiento.tipo === 'agregar' ? '#28a745' : '#dc3545';
                const iconoTipo = movimiento.tipo === 'agregar' ? '➕' : '➖';
                
                movimientoElement.innerHTML = `
                    <input type="checkbox" class="checkbox-movimiento" data-index="${i}" id="movimiento-${i}">
                    <label for="movimiento-${i}" style="flex-grow: 1; cursor: pointer;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>${iconoTipo} ${movimiento.tipo === 'agregar' ? 'Banco Entregó' : 'Banco Recogió'}</span>
                            <span style="color: ${colorTipo}; font-weight: bold;">${cantidadFormateada}</span>
                            <span style="font-size: 0.9em; color: #6c757d;">${movimiento.descripcion || ''}</span>
                        </div>
                    </label>
                `;
                
                listaMovimientos.appendChild(movimientoElement);
            });
        }
        
        // Mostrar el contenedor de ventas y movimientos
        document.getElementById('ventasContainer').style.display = 'block';
    }
    
    // Evento para buscar ventas y movimientos
    document.getElementById('btnBuscarVentas').addEventListener('click', buscarVentasYMovimientos);
    
    // Evento para seleccionar/deseleccionar todas las ventas
    document.getElementById('seleccionarTodas').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.checkbox-venta');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // Evento para seleccionar/deseleccionar todos los movimientos
    document.getElementById('seleccionarTodosMovimientos').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.checkbox-movimiento');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // Evento para cancelar
    document.getElementById('btnCancelarEliminar').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Evento para confirmar eliminación
    document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
        const checkboxesVentas = document.querySelectorAll('.checkbox-venta:checked');
        const checkboxesMovimientos = document.querySelectorAll('.checkbox-movimiento:checked');
        
        if (checkboxesVentas.length === 0 && checkboxesMovimientos.length === 0) {
            mostrarMensaje('Debe seleccionar al menos una venta o movimiento para eliminar', 'warning');
            return;
        }
        
        // Obtener índices de las ventas seleccionadas
        const indicesVentasSeleccionadas = Array.from(checkboxesVentas).map(checkbox => {
            const itemIndex = parseInt(checkbox.getAttribute('data-index'));
            return ventasEncontradas[itemIndex].index;
        });
        
        // Obtener índices de los movimientos seleccionados
        const indicesMovimientosSeleccionados = Array.from(checkboxesMovimientos).map(checkbox => {
            const itemIndex = parseInt(checkbox.getAttribute('data-index'));
            return movimientosEncontrados[itemIndex].index;
        });
        
        // Ordenar índices de mayor a menor para eliminar correctamente
        indicesVentasSeleccionadas.sort((a, b) => b - a);
        indicesMovimientosSeleccionados.sort((a, b) => b - a);
        
        // Construir mensaje de confirmación
        let mensajeConfirmacion = '';
        
        if (indicesVentasSeleccionadas.length > 0) {
            mensajeConfirmacion += `¿Está seguro de eliminar ${indicesVentasSeleccionadas.length} venta(s) seleccionada(s) de ${vendedor.nombre}?\n\n`;
            
            // Mostrar detalles de las ventas a eliminar
            Array.from(checkboxesVentas).forEach(checkbox => {
                const itemIndex = parseInt(checkbox.getAttribute('data-index'));
                const venta = ventasEncontradas[itemIndex].venta;
                mensajeConfirmacion += `- Venta: ${venta.totalVenta.toLocaleString()}, Premio: ${venta.premio.toLocaleString()}\n`;
            });
        }
        
        if (indicesMovimientosSeleccionados.length > 0) {
            if (mensajeConfirmacion) mensajeConfirmacion += '\n';
            mensajeConfirmacion += `¿Está seguro de eliminar ${indicesMovimientosSeleccionados.length} movimiento(s) de fondo seleccionado(s)?\n\n`;
            
            // Mostrar detalles de los movimientos a eliminar
            Array.from(checkboxesMovimientos).forEach(checkbox => {
                const itemIndex = parseInt(checkbox.getAttribute('data-index'));
                const movimiento = movimientosEncontrados[itemIndex].movimiento;
                mensajeConfirmacion += `- ${movimiento.tipo === 'agregar' ? 'Banco Entregó' : 'Banco Recogió'}: ${parseFloat(movimiento.cantidad).toLocaleString()}\n`;
            });
        }
        
        // Pedir confirmación final
        if (!confirm(mensajeConfirmacion)) {
            mostrarMensaje('Operación cancelada por el usuario', 'info');
            return;
        }
        
        // Guardar fecha y horario para actualizar vista después
        const fechaSeleccionada = document.getElementById('fechaEliminar').value;
        const horarioSeleccionado = document.querySelector('input[name="horarioEliminar"]:checked').value;
        const fechaNormalizada = obtenerFechaFormateada(fechaSeleccionada);
        
        // 1. Eliminar las ventas seleccionadas
        if (indicesVentasSeleccionadas.length > 0) {
            indicesVentasSeleccionadas.forEach(index => {
                const venta = vendedor.ventas[index];
                
                // Eliminar la venta del vendedor
                vendedor.ventas.splice(index, 1);
                
                // Eliminar ventas correspondientes de los jefes
                if (vendedor.jefes && vendedor.jefes.length > 0) {
                    const fechaVentaNormalizada = obtenerFechaFormateada(venta.fecha);
                    
                    vendedor.jefes.forEach(jefeNombre => {
                        const jefe = jefes.find(j => j.nombre === jefeNombre);
                        if (jefe && jefe.ventas && jefe.ventas.length > 0) {
                            // Buscar ventas del jefe con la misma fecha, horario y monto
                            // (para identificar la misma venta en el jefe)
                            const indicesJefe = [];
                            jefe.ventas.forEach((ventaJefe, idx) => {
                                const ventaJefeFechaNormalizada = obtenerFechaFormateada(ventaJefe.fecha);
                                if (ventaJefeFechaNormalizada === fechaVentaNormalizada && 
                                    ventaJefe.horario === venta.horario &&
                                    ventaJefe.totalVenta === venta.totalVenta &&
                                    ventaJefe.premio === venta.premio) {
                                    indicesJefe.push(idx);
                                }
                            });
                            
                            // Eliminar solo una venta (la primera que coincida) por cada venta del vendedor
                            if (indicesJefe.length > 0) {
                                jefe.ventas.splice(indicesJefe[0], 1);
                            }
                        }
                    });
                }
            });
        }
        
        // 2. Eliminar los movimientos seleccionados
        if (indicesMovimientosSeleccionados.length > 0) {
            indicesMovimientosSeleccionados.forEach(index => {
                // Eliminar el movimiento del vendedor
                if (vendedor.movimientos && index < vendedor.movimientos.length) {
                    vendedor.movimientos.splice(index, 1);
                }
            });
        }
        
        // 3. Guardar cambios
        guardarDatos();
        
        // 4. Construir mensaje de éxito
        let mensajeExito = '';
        if (indicesVentasSeleccionadas.length > 0) {
            mensajeExito += `Se eliminaron ${indicesVentasSeleccionadas.length} venta(s) `;
        }
        if (indicesMovimientosSeleccionados.length > 0) {
            if (mensajeExito) mensajeExito += 'y ';
            mensajeExito += `${indicesMovimientosSeleccionados.length} movimiento(s) de fondo `;
        }
        mensajeExito += `de ${vendedor.nombre} para la fecha ${fechaNormalizada} (${horarioSeleccionado === 'dia' ? 'Día' : 'Noche'})`;
        
        // 5. Mostrar mensaje de éxito
        mostrarMensaje(mensajeExito, 'success');
        
        // 6. Actualizar la interfaz
        actualizarListaVendedores();
        
        // 7. Mostrar la vista actualizada con las ventas del mismo horario
        verVentasVendedorPorHorario(vendedorIndex, horarioSeleccionado);
        
        // 8. Cerrar el modal
        document.body.removeChild(modal);
    });
}

/**
 * Función auxiliar para eliminar ventas seleccionadas
 * Esta función reemplaza a la anterior eliminarVentaVendedor
 * 
 * @param {number} vendedorIndex - Índice del vendedor
 * @param {Array} indicesVentas - Índices de las ventas a eliminar
 * @returns {boolean} - Resultado de la operación
 */
function eliminarVentasSeleccionadas(vendedorIndex, indicesVentas) {
    // Obtener el vendedor
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor || !indicesVentas || indicesVentas.length === 0) {
        return false;
    }
    
    // Ordenar índices de mayor a menor para no afectar los índices al eliminar
    indicesVentas.sort((a, b) => b - a);
    
    // Eliminar cada venta y su correspondiente en los jefes
    indicesVentas.forEach(index => {
        if (index >= 0 && index < vendedor.ventas.length) {
            const venta = vendedor.ventas[index];
            const fechaNormalizada = obtenerFechaFormateada(venta.fecha);
            
            // Eliminar la venta del vendedor
            vendedor.ventas.splice(index, 1);
            
            // Eliminar la venta correspondiente de los jefes
            if (vendedor.jefes && vendedor.jefes.length > 0) {
                vendedor.jefes.forEach(jefeNombre => {
                    const jefe = jefes.find(j => j.nombre === jefeNombre);
                    if (jefe && jefe.ventas && jefe.ventas.length > 0) {
                        // Buscar ventas del jefe que coincidan exactamente
                        const indicesJefe = [];
                        jefe.ventas.forEach((ventaJefe, idx) => {
                            const ventaJefeFechaNormalizada = obtenerFechaFormateada(ventaJefe.fecha);
                            if (ventaJefeFechaNormalizada === fechaNormalizada && 
                                ventaJefe.horario === venta.horario &&
                                ventaJefe.totalVenta === venta.totalVenta &&
                                ventaJefe.premio === venta.premio) {
                                indicesJefe.push(idx);
                            }
                        });
                        
                        // Eliminar solo una venta (la primera que coincida)
                        if (indicesJefe.length > 0) {
                            jefe.ventas.splice(indicesJefe[0], 1);
                        }
                    }
                });
            }
        }
    });
    
    // Guardar los cambios
    guardarDatos();
    
    return true;
}

/**
 * Función auxiliar para eliminar movimientos de fondo seleccionados
 * 
 * @param {number} vendedorIndex - Índice del vendedor
 * @param {Array} indicesMovimientos - Índices de los movimientos a eliminar
 * @returns {boolean} - Resultado de la operación
 */
function eliminarMovimientosSeleccionados(vendedorIndex, indicesMovimientos) {
    // Obtener el vendedor
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor || !indicesMovimientos || indicesMovimientos.length === 0) {
        return false;
    }
    
    // Verificar si el vendedor tiene movimientos
    if (!vendedor.movimientos || vendedor.movimientos.length === 0) {
        mostrarMensaje(`${vendedor.nombre} no tiene movimientos de fondo registrados`, 'error');
        return false;
    }
    
    // Ordenar índices de mayor a menor para no afectar los índices al eliminar
    indicesMovimientos.sort((a, b) => b - a);
    
    // Eliminar cada movimiento
    indicesMovimientos.forEach(index => {
        if (index >= 0 && index < vendedor.movimientos.length) {
            // Eliminar el movimiento
            vendedor.movimientos.splice(index, 1);
        }
    });
    
    // Guardar los cambios
    guardarDatos();
    
    return true;
}

// Exportar funciones para acceso global
window.agregarVendedor = agregarVendedor;
window.actualizarListaVendedores = actualizarListaVendedores;
window.actualizarSelectVendedores = actualizarSelectVendedores;
window.verVentasVendedorPorHorario = verVentasVendedorPorHorario;
window.editarVendedor = editarVendedor;
window.eliminarVendedor = eliminarVendedor;
window.eliminarVendedorCompleto = eliminarVendedorCompleto;
window.procesarVentaNormal = procesarVentaNormal;
window.procesarVentaDirecta = procesarVentaDirecta;
window.agregarMensaje = window.agregarMensaje;
window.validarNumero = validarNumero;
window.obtenerNumeroGanador = obtenerNumeroGanador;
window.verVentasVendedorPorFecha = verVentasVendedorPorFecha;
window.filtrarVentasPorFecha = filtrarVentasPorFecha;
window.mostrarReporteVentas = mostrarReporteVentas;
window.abrirModalEliminarVenta = abrirModalEliminarVenta;
window.eliminarVentasSeleccionadas = eliminarVentasSeleccionadas;
