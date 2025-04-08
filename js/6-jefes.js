/**
 * 6-jefes.js - Gestión de jefes
 * Este archivo contiene todas las funciones relacionadas con
 * la administración de jefes y sus operaciones.
 */

function agregarJefe() {
    const nombre = document.getElementById('nombreJefe').value;
    const precioVenta = document.getElementById('precioVentaJefe').value ? parseFloat(document.getElementById('precioVentaJefe').value) : 0;
    const porcentaje = document.getElementById('porcentajeJefe').value ? parseFloat(document.getElementById('porcentajeJefe').value) : 0;

    if (!nombre) {
        alert('Por favor, ingrese al menos el nombre del jefe.');
        return;
    }

    jefes.push({
        nombre,
        precioVenta,
        porcentaje,
        ventas: []
    });

    document.getElementById('nombreJefe').value = '';
    document.getElementById('precioVentaJefe').value = '';
    document.getElementById('porcentajeJefe').value = '';

    actualizarListaJefes();
    actualizarSelectJefes();
    mostrarMensaje('Jefe agregado exitosamente', 'success');
}
function actualizarListaJefes() {
    const jefeSelect = document.getElementById('jefeSelect');
    const jefeInfo = document.getElementById('jefeInfo');

    // Limpiar completamente las listas
    if (jefeSelect) jefeSelect.innerHTML = '';
    if (jefeInfo) jefeInfo.innerHTML = '';

    // Si no hay jefes, mostrar mensaje apropiado y salir
    if (!jefes || jefes.length === 0) {
        if (jefeInfo) jefeInfo.innerHTML = '<p>No hay jefes registrados</p>';
        return;
    }

    jefes.forEach((jefe, index) => {
        // Agregar opción al select
        if (jefeSelect) {
            jefeSelect.innerHTML += `<option value="${index}">${jefe.nombre}</option>`;
        }

        jefeInfo.innerHTML += `
            <div class="jefe-item">
                <div class="jefe-header">
                    <span class="jefe-nombre"
                          onmouseover="mostrarTooltip(this, 'jefe', ${index})"
                          onmouseout="ocultarTooltip()">
                        <strong>${jefe.nombre}</strong>
                    </span>
                    <button onclick="toggleBotonesJefe(${index})" class="btn-toggle">
                        Mostrar/Ocultar
                    </button>
                </div>
                <div id="botones-jefe-${index}" class="jefe-buttons" style="display: none;">
                    <button onclick="verVentasJefe(${index}, 'dia')">Ver Ventas Día</button>
                    <button onclick="verVentasJefe(${index}, 'noche')">Ver Ventas Noche</button>
                    <button onclick="crearSelectorFechas(${index})" class="btn-primary">Ver Ventas por Fecha</button>
                    <button onclick="editarJefe(${index})">Editar</button>
                    <button onclick="eliminarJefe(${index})" class="btn-danger">Eliminar</button>
                </div>
            </div>
        `;
    });

    // Estilos para los elementos de jefe (mantenemos estos estilos)
    if (!document.getElementById('tooltip-jefe-styles')) {
        const style = document.createElement('style');
        style.id = 'tooltip-jefe-styles';
        style.textContent = `
            .jefe-nombre {
                cursor: help;
                position: relative;
            }
            
            .jefe-item {
                background-color: #f5f5f5;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 4px;
            }
            
            .dark-mode .jefe-item {
                background-color: #444;
            }
            
            .jefe-buttons {
                margin-top: 10px;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
        `;
        document.head.appendChild(style);
    }
}
function actualizarSelectJefes() {
    const jefeVendedorSelect = document.getElementById('jefeVendedorSelect');
    if (!jefeVendedorSelect) return;

    jefeVendedorSelect.innerHTML = '';
    jefes.forEach((jefe, index) => {
        jefeVendedorSelect.innerHTML += `<option value="${index}">${jefe.nombre}</option>`;
    });
}

function updateJefeInfo() {
    const jefeSelect = document.getElementById('jefeSelect');
    const jefeInfo = document.getElementById('jefeInfo');

    if (!jefeSelect || !jefeInfo || jefes.length === 0) {
        jefeInfo.innerHTML = '<p>No hay jefes registrados</p>';
        return;
    }

    const jefeIndex = jefeSelect.value;
    const jefe = jefes[jefeIndex];

    if (!jefe) return;

    // Crear el tooltip con la información del jefe
    const tooltipInfo = `
        Precio de Venta: ${jefe.precioVenta}
        Porcentaje: ${jefe.porcentaje}%
    `;

    jefeInfo.innerHTML = `
        <div class="jefe-item">
            <div class="jefe-header">
                <span class="jefe-nombre"
                      title="${tooltipInfo.replace(/\n/g, ' - ')}"
                      onmouseover="mostrarTooltipJefe(this, ${jefeIndex})"
                      onmouseout="ocultarTooltipJefe(this)">
                    <strong>${jefe.nombre}</strong>
                </span>
                <div class="jefe-tooltip" id="tooltip-jefe-${jefeIndex}">
                    <div class="tooltip-content">
                        <p><strong>Precio de Venta:</strong> ${jefe.precioVenta}</p>
                        <p><strong>Porcentaje:</strong> ${jefe.porcentaje}%</p>
                    </div>
                </div>
                <button onclick="toggleBotonesJefe(${jefeIndex})" class="btn-toggle">
                    Mostrar/Ocultar
                </button>
            </div>
            <div id="botones-jefe-${jefeIndex}" class="jefe-buttons" style="display: none;">
                <button onclick="verVentasJefe(${jefeIndex}, 'dia')">Ver Ventas Día</button>
                <button onclick="verVentasJefe(${jefeIndex}, 'noche')">Ver Ventas Noche</button>
                <button onclick="editarJefe(${jefeIndex})">Editar</button>
                <button onclick="eliminarJefe(${jefeIndex})" class="btn-danger">Eliminar</button>
            </div>
        </div>
    `;
}

function editarJefe(jefeIndex) {
    const jefe = jefes[jefeIndex];
    if (!jefe) {
        alert('Error: Jefe no encontrado');
        return;
    }

    const nuevoPrecioVenta = parseFloat(prompt(`Precio de Venta actual: ${jefe.precioVenta}\nIngrese el nuevo Precio de Venta:`));
    const nuevoPorcentaje = parseFloat(prompt(`Porcentaje actual: ${jefe.porcentaje}%\nIngrese el nuevo Porcentaje:`));

    if (!isNaN(nuevoPrecioVenta)) {
        jefe.precioVenta = nuevoPrecioVenta;
    }
    if (!isNaN(nuevoPorcentaje)) {
        jefe.porcentaje = nuevoPorcentaje;
    }

    actualizarListaJefes();
    updateJefeInfo();
    mostrarMensaje('Jefe actualizado exitosamente', 'success');
}

function editarJefesVendedor(index) {
    const vendedor = vendedores[index];

    // Crear el modal para editar jefes
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Editar Jefes para ${vendedor.nombre}</h3>
            <select multiple id="editJefesSelect" style="width: 100%; height: 200px;">
                ${jefes.map(jefe => `
                    <option value="${jefe.nombre}" ${vendedor.jefes.includes(jefe.nombre) ? 'selected' : ''}>
                        ${jefe.nombre}
                    </option>
                `).join('')}
            </select>
            <div class="modal-buttons">
                <button onclick="guardarJefesVendedor(${index})" class="btn-primary">Guardar</button>
                <button onclick="cerrarModal()" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function editarJefesVendedor(index) {
    const vendedor = vendedores[index];

    // Crear el modal para editar jefes
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Editar Jefes para ${vendedor.nombre}</h3>
            <select multiple id="editJefesSelect" style="width: 100%; height: 200px;">
                ${jefes.map(jefe => `
                    <option value="${jefe.nombre}" ${vendedor.jefes.includes(jefe.nombre) ? 'selected' : ''}>
                        ${jefe.nombre}
                    </option>
                `).join('')}
            </select>
            <div class="modal-buttons">
                <button onclick="guardarJefesVendedor(${index})" class="btn-primary">Guardar</button>
                <button onclick="cerrarModal()" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function eliminarJefe(index) {
    eliminarJefeCompleto(index, true);
}
        
/**
 * Elimina completamente un jefe del sistema junto con todas sus referencias
 * @param {number} jefeIndex - Índice del jefe en el array jefes
 * @param {boolean} confirmar - Si es true, pedirá confirmación al usuario
 * @returns {boolean} - true si se eliminó con éxito, false si se canceló
 */
function eliminarJefeCompleto(jefeIndex, confirmar = true) {
    try {
        // Obtener el jefe
        const jefe = jefes[jefeIndex];
        if (!jefe) {
            mostrarMensaje('Error: Jefe no encontrado', 'error');
            return false;
        }

        // Pedir confirmación al usuario si es necesario
        if (confirmar) {
            let mensaje = `¿Está seguro de eliminar completamente al jefe ${jefe.nombre}?\n\n`;
            
            // Contar cuántos vendedores tienen asignado a este jefe
            const vendedoresAsignados = vendedores.filter(v => v.jefes.includes(jefe.nombre));
            if (vendedoresAsignados.length > 0) {
                mensaje += `Este jefe está asignado a ${vendedoresAsignados.length} vendedor(es).\n`;
                mensaje += `Se eliminarán todas las referencias a este jefe de esos vendedores.\n\n`;
            }
            
            mensaje += "Esta acción no se puede deshacer.";
            
            if (!confirm(mensaje)) {
                mostrarMensaje('Operación cancelada por el usuario', 'info');
                return false;
            }
        }

        // 1. Eliminar referencias a este jefe en los vendedores
        vendedores.forEach(vendedor => {
            // Filtrar las referencias al jefe de la lista de jefes de cada vendedor
            if (vendedor.jefes && Array.isArray(vendedor.jefes)) {
                vendedor.jefes = vendedor.jefes.filter(j => j !== jefe.nombre);
            }
        });

        // 2. Eliminar el jefe del array principal
        jefes.splice(jefeIndex, 1);

        // 3. Actualizar localStorage
        localStorage.setItem('vendedores', JSON.stringify(vendedores));
        localStorage.setItem('jefes', JSON.stringify(jefes));

        // 4. Eliminar del historial
        if (window.historialDatos && window.historialDatos.fechas) {
            // Recorrer todas las fechas en el historial
            Object.keys(window.historialDatos.fechas).forEach(fecha => {
                const datosHistoricos = window.historialDatos.fechas[fecha];
                
                // Si existen datos de jefes para esa fecha
                if (datosHistoricos && datosHistoricos.jefes) {
                    // Eliminar el jefe del historial
                    datosHistoricos.jefes = datosHistoricos.jefes.filter(j => 
                        j.nombre !== jefe.nombre
                    );
                }
            });
            
            // Guardar el historial actualizado
            localStorage.setItem('historialLoteria', JSON.stringify(window.historialDatos));
        }

        // 5. Actualizar la UI
        actualizarListaJefes();
        actualizarSelectJefes();
        actualizarListaVendedores(); // Para reflejar cambios en vendedores que tenían este jefe

        mostrarMensaje(`Jefe ${jefe.nombre} eliminado completamente del sistema`, 'success');
        return true;

    } catch (error) {
        console.error('Error al eliminar jefe completamente:', error);
        mostrarMensaje('Error al eliminar el jefe: ' + error.message, 'error');
        return false;
    }
}

function toggleBotonesJefe(index) {
    const botonesDiv = document.getElementById(`botones-jefe-${index}`);
    if (botonesDiv) {
        botonesDiv.style.display = botonesDiv.style.display === 'none' ? 'flex' : 'none';
    }
}

/**
 * Muestra el tooltip de un jefe
 * @param {HTMLElement} elemento - El elemento que disparó el evento
 * @param {number} jefeIndex - Índice del jefe en el array
 */
function mostrarTooltipJefe(elemento, jefeIndex) {
    const tooltip = document.getElementById(`tooltip-jefe-${jefeIndex}`);
    if (tooltip) {
        tooltip.style.display = 'block';
        
        // Posicionar el tooltip cerca del elemento
        const rect = elemento.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + window.scrollY}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
    }
}

/**
 * Oculta el tooltip de un jefe
 * @param {HTMLElement} elemento - El elemento que disparó el evento
 */
function ocultarTooltipJefe(elemento) {
    // Buscar el tooltip basado en el elemento padre
    const jefeItem = elemento.closest('.jefe-item');
    if (jefeItem) {
        const tooltip = jefeItem.querySelector('.jefe-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
}

function verVentasJefe(jefeIndex, horario) {
    console.log("=== INICIO DEPURACIÓN verVentasJefe ===");
    console.log("Parámetros recibidos - jefeIndex:", jefeIndex, "horario:", horario);
    const jefe = jefes[jefeIndex];
    console.log("Jefe seleccionado:", jefe);
    const fechaString = obtenerFechaFormateada();
    console.log("Fecha actual formateada:", fechaString);
    // Declarar la variable reporte al inicio de la función
    let reporte = "";
    
    // Obtener todas las ventas recientes para este horario, sin filtrar por fecha
    const ventasRecientes = vendedores
        .flatMap(v => v.ventas)
        .filter(v => v.horario === horario && v.numeroGanador !== null)
        .sort((a, b) => {
            // Ordenar por fecha de más reciente a más antigua
            // Intentar convertir las fechas a objetos Date para una comparación correcta
            let dateA, dateB;
            
            // Primero intentar con formato DD/MM/YYYY
            if (a.fecha.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                const [diaA, mesA, anioA] = a.fecha.split('/');
                dateA = new Date(anioA, mesA - 1, diaA);
            } 
            // Después intentar con formato YYYY-MM-DD
            else if (a.fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
                dateA = new Date(a.fecha);
            }
            
            if (b.fecha.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                const [diaB, mesB, anioB] = b.fecha.split('/');
                dateB = new Date(anioB, mesB - 1, diaB);
            } else if (b.fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
                dateB = new Date(b.fecha);
            }
            
            // Si las fechas son válidas, compararlas
            if (dateA && dateB) {
                return dateB - dateA;
            }
            
            // Si no se pudieron convertir, comparar como strings (menos fiable)
            return b.fecha.localeCompare(a.fecha);
        });

    // Obtener el número ganador de la venta más reciente
    const numeroGanador = ventasRecientes.length > 0 ? ventasRecientes[0].numeroGanador : null;
    
    // Obtener la fecha de la venta más reciente para mostrarla en el reporte
    const fechaVentaReciente = ventasRecientes.length > 0 ? ventasRecientes[0].fecha : fechaString;
    
    // Formatear la fecha para mostrarla en DD/MM/YYYY
    let fechaMostrar = fechaVentaReciente;
    if (fechaVentaReciente.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [anio, mes, dia] = fechaVentaReciente.split('-');
        fechaMostrar = `${dia}/${mes}/${anio}`;
    }

    // Ahora construir el reporte
    reporte = `Reporte Ventas: ${jefe.nombre} ${horario === 'dia' ? 'Día' : 'Noche'} ${numeroAEmoji(numeroGanador)}\n`;
    reporte += ` Fecha: ${fechaMostrar}`;

    reporte += '\n----------------------------------\n';

    let totalVenta = 0;
    let totalPremios = 0;
    let totalPagoPremios = 0;
    let totalEntrega = 0;

    const vendedoresDelJefe = vendedores.filter(v => v.jefes.includes(jefe.nombre));

    if (vendedoresDelJefe.length === 0) {
        reporte += 'No hay vendedores asignados a este jefe.\n';
    } else {
        // Procesar cada vendedor individualmente
        vendedoresDelJefe.forEach(vendedor => {
            // Obtener solo las ventas de este vendedor para el horario especificado
            // y para la misma fecha que la venta más reciente encontrada
            const ventasHorario = vendedor.ventas.filter(v => 
                v.horario === horario && v.fecha === fechaVentaReciente
            );
            
            // Calcular totales para este vendedor específico
            let ventaVendedor = 0;
            let premiosVendedor = 0;
            
            ventasHorario.forEach(venta => {
                ventaVendedor += venta.totalVenta;
                premiosVendedor += venta.premio;
            });
            
            // Sumar a los totales generales
            totalVenta += ventaVendedor;
            totalPremios += premiosVendedor;
            
            // Aplicar el precio de venta del jefe o del vendedor
            const precioVentaAplicar = jefe.precioVenta || vendedor.precioVenta;
            const pagoPremios = premiosVendedor * precioVentaAplicar;
            
            // Calcular la ganancia y entrega usando el porcentaje del jefe o del vendedor
            const porcentajeAplicar = jefe.porcentaje || vendedor.porcentaje;
            const gananciaVendedor = ventaVendedor * (porcentajeAplicar / 100);
            const entregaVendedor = ventaVendedor - gananciaVendedor;
            
            // Actualizar totales
            totalPagoPremios += pagoPremios;
            totalEntrega += entregaVendedor;
        });

        // Encuentra la parte del código donde se definen las etiquetas y valores
if (totalVenta > 0) {
    // Calcular la ganancia o pérdida
    const resultado = totalEntrega - totalPagoPremios;
    const esGanancia = resultado >= 0;
    
    // Usar espacios para alinear como una tabla
    const etiquetas = [
        'Venta Total:', 
        'Premio Total:', 
        'Pago Total:', 
        'Entrega Total:', 
        esGanancia ? 'Ganancia:' : 'Pérdida:'  // Cambia la etiqueta según el valor
    ];
    
    // Formatear el valor del resultado (sin signo negativo para la pérdida)
    const resultadoFormateado = Math.round(Math.abs(resultado)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    const valores = [
        Math.round(totalVenta).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        Math.round(totalPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        Math.round(totalPagoPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        Math.round(totalEntrega).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        resultadoFormateado,  // Usar el valor formateado con el signo correspondiente
    ];
    
    // Encontrar la etiqueta más larga para calcular el padding
    const longitudMaxima = Math.max(...etiquetas.map(e => e.length));
    
    // Crear cada línea con alineación
    etiquetas.forEach((etiqueta, index) => {
        // Padding a la derecha para alinear etiquetas
        const espacios = ' '.repeat(longitudMaxima - etiqueta.length + 5);
        
        // Si es el último índice (ganancia/pérdida)
        if (index === etiquetas.length - 1) {
            const valor = valores[index];
            if (esGanancia) {
                // Si es ganancia, solo mostrar el valor
                reporte += `${etiqueta}${espacios}${valor}\n`;
            } else {
                // Si es pérdida, mostrar signo negativo a la izquierda
                // pero manteniendo la alineación del número
                reporte += `${etiqueta}${espacios.substring(0, espacios.length - 2)}${'-'} ${valor}\n`;
            }
        } else {
            // Para el resto de las líneas, mantener el formato original
            reporte += `${etiqueta}${espacios}${valores[index]}\n`;
        }
    });
} else {
    reporte += `No hay ventas registradas para este horario y fecha.\n`;
}
    }

    // Crear un modal personalizado en lugar de usar alert
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
        background-color: ${document.body.classList.contains('dark-mode') ? '#333' : '#fff'};
        color: ${document.body.classList.contains('dark-mode') ? '#fff' : '#000'};
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    const preElement = document.createElement('pre');
    preElement.style.cssText = `
        margin: 0;
        white-space: pre-wrap;
        font-family: monospace;
    `;
    preElement.textContent = reporte;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

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
    // Solo reemplaza la función onclick del botón existente
copyButton.onclick = async () => {
    try {
        // Copiar como Texto primero
        await navigator.clipboard.writeText(reporte);
        
        // Crear imagen en canvas con tamaño dinámico basado en el contenido
        const lines = reporte.split('\n');
        const lineHeight = 25; // Altura de cada línea en píxeles
        const padding = 40; // Padding alrededor del texto
        
        // Calcular dimensiones basadas en el contenido
        const canvasWidth = 600; // Ancho fijo más amplio
        const canvasHeight = (lines.length * lineHeight) + (padding * 2);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Fondo blanco o gris claro según el modo
        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#333' : '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Texto con mejor contraste
        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
        ctx.font = '16px monospace'; // Usar fuente monoespaciada para alineación
        
        // Dibujar cada línea del reporte
        lines.forEach((line, i) => {
            ctx.fillText(line, padding, padding + (i * lineHeight));
        });
        
        // Convertir canvas a Blob
        canvas.toBlob(async (blobImage) => {
            if (blobImage) {
                try {
                    // Intentar primero con navigator.clipboard.write
                    if (typeof ClipboardItem !== 'undefined') {
                        const clipboardItems = [
                            new ClipboardItem({
                                'text/plain': new Blob([reporte], {type: 'text/plain'}),
                                'image/png': blobImage
                            })
                        ];
                        await navigator.clipboard.write(clipboardItems);
                    } else {
                        // Alternativa: solo copiar la imagen en navegadores que no soportan ClipboardItem
                        const img = canvas.toDataURL('image/png');
                        const tempLink = document.createElement('a');
                        tempLink.href = img;
                        tempLink.download = `Reporte_${jefe.nombre}_${horario}.png`;
                        tempLink.click();
                        
                        // Ya hemos copiado el texto, así que informamos al usuario
                        alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                    }
                } catch (clipErr) {
                    console.error('Error al copiar imagen:', clipErr);
                    // Si falla, ofrecer descargar la imagen
                    const img = canvas.toDataURL('image/png');
                    const tempLink = document.createElement('a');
                    tempLink.href = img;
                    tempLink.download = `Reporte_${jefe.nombre}_${horario}.png`;
                    tempLink.click();
                    alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                }
            }
        }, 'image/png');
        
        copyButton.textContent = 'Copiado!';
        setTimeout(() => copyButton.textContent = 'Copiar', 2000);
    } catch (err) {
        console.error('Error al copiar:', err);
        alert('Ocurrió un error al copiar: ' + err.message);
    }
};

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

    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(preElement);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

function verVentasJefePorFecha(jefeIndex, fechaInicio, fechaFin, horario = null) {
    const jefe = jefes[jefeIndex];
    if (!jefe) {
        alert('Error: Jefe no encontrado');
        return;
    }
    
    console.log("Diagnóstico de fechas:");
    console.log("- fechaInicio original:", fechaInicio);
    console.log("- fechaFin original:", fechaFin);
    console.log("- horario seleccionado:", horario);

    // Usar la función global obtenerFechaFormateada
    const fechaInicioNormalizada = obtenerFechaFormateada(fechaInicio);
    const fechaFinNormalizada = obtenerFechaFormateada(fechaFin);

    console.log("- fechaInicio normalizada:", fechaInicioNormalizada);
    console.log("- fechaFin normalizada:", fechaFinNormalizada);

    if (!horario) {
        alert('Por favor seleccione un horario (Día o Noche)');
        return;
    }

    // Declarar la variable reporte al inicio de la función
    let reporte = "";
    
    // Buscar todas las ventas para encontrar número ganador del período seleccionado
    const vendedoresDelJefe = vendedores.filter(v => v.jefes.includes(jefe.nombre));
    
    // Función para verificar si una fecha está en el rango
    function esFechaEnRango(fechaVenta) {
        const fechaVentaNormalizada = obtenerFechaFormateada(fechaVenta);
        
        // Si las fechas de inicio y fin son iguales, solo verificar que coincida exactamente
        if (fechaInicioNormalizada === fechaFinNormalizada) {
            return fechaVentaNormalizada === fechaInicioNormalizada;
        }
        
        // Para comparar correctamente, convertir a objetos Date
        function convertirADate(fechaStr) {
            const [dia, mes, anio] = fechaStr.split('/').map(Number);
            return new Date(anio, mes - 1, dia);
        }
        
        const dateVenta = convertirADate(fechaVentaNormalizada);
        const dateInicio = convertirADate(fechaInicioNormalizada);
        const dateFin = convertirADate(fechaFinNormalizada);
        
        // Verificar si la fecha está en el rango
        return dateVenta >= dateInicio && dateVenta <= dateFin;
    }
    
    // Añadir depuración adicional para verificar el filtrado
    console.log("Verificando filtrado por horario:");
    console.log("- Horario buscado:", horario);
    
    // Obtener todas las ventas recientes para este horario
    const ventasRecientes = vendedoresDelJefe
        .flatMap(v => v.ventas)
        .filter(v => {
            const fechaCorrecta = esFechaEnRango(v.fecha);
            
            // Depuración para ver qué horarios están en los datos
            console.log(`Venta con horario: ${v.horario}, comparando con ${horario}`);
            
            // Asegurarse de que la comparación sea exacta
            const horarioCorrecto = v.horario === horario;
            
            // Si no coincide, mostrar más información para depuración
            if (fechaCorrecta && !horarioCorrecto) {
                console.log(`Fecha correcta pero horario incorrecto. Venta horario: "${v.horario}" vs buscado: "${horario}"`);
            }
            
            return fechaCorrecta && horarioCorrecto;
        })
        .sort((a, b) => {
            // Ordenar por fecha de más reciente a más antigua
            const fechaA = obtenerFechaFormateada(a.fecha);
            const fechaB = obtenerFechaFormateada(b.fecha);
            
            function convertirADate(fechaStr) {
                const [dia, mes, anio] = fechaStr.split('/').map(Number);
                return new Date(anio, mes - 1, dia);
            }
            
            const dateA = convertirADate(fechaA);
            const dateB = convertirADate(fechaB);
            
            return dateB - dateA;
        });

    console.log(`Se encontraron ${ventasRecientes.length} ventas para horario "${horario}"`);

    // Obtener el número ganador de la venta más reciente
    const numeroGanador = ventasRecientes.length > 0 ? ventasRecientes[0].numeroGanador : null;
    
    // Obtener la fecha más reciente para mostrar
    const fechaMostrar = fechaInicioNormalizada === fechaFinNormalizada ? 
        fechaInicioNormalizada : `${fechaInicioNormalizada} al ${fechaFinNormalizada}`;
    
    // Crear el encabezado del reporte
    reporte = `Reporte de Ventas - ${jefe.nombre}\n`;
    reporte += `Horario: ${horario === 'dia' ? 'Día' : (horario === 'noche' ? 'Noche' : 'No especificado')}`;
    reporte += ` | Fecha: ${fechaMostrar}`;

    if (numeroGanador !== null) {
        // Convertir a número entero para asegurar que no haya decimales
        const numeroGanadorEntero = parseInt(numeroGanador);
        // Verificar que sea un número entre 0 y 99 (números de la lotería tradicional)
        if (!isNaN(numeroGanadorEntero) && numeroGanadorEntero >= 0 && numeroGanadorEntero <= 99) {
            reporte += ` | Número: ${numeroAEmoji(numeroGanadorEntero)}`;
        } else {
            // Si no está en el formato esperado, mostrar el valor original
            reporte += ` | Número: ${numeroGanador}`;
        }
    }

    reporte += '\n----------------------------------------\n\n';

    let totalVenta = 0;
    let totalPremios = 0;
    let totalPagoPremios = 0;
    let totalEntrega = 0;

    if (vendedoresDelJefe.length === 0) {
        reporte += 'No hay vendedores asignados a este jefe.\n';
    } else {
        // Procesar cada vendedor individualmente
        vendedoresDelJefe.forEach(vendedor => {
            // Obtener solo las ventas de este vendedor para el horario y fecha especificados
            const ventasHorario = vendedor.ventas.filter(v => {
                const fechaCorrecta = esFechaEnRango(v.fecha);
                const horarioCorrecto = v.horario === horario;
                return fechaCorrecta && horarioCorrecto;
            });
            
            console.log(`Vendedor ${vendedor.nombre}: ${ventasHorario.length} ventas encontradas con horario ${horario}`);
            
            // Calcular totales para este vendedor específico
            let ventaVendedor = 0;
            let premiosVendedor = 0;
            
            ventasHorario.forEach(venta => {
                ventaVendedor += venta.totalVenta;
                premiosVendedor += venta.premio;
            });
            
            // Sumar a los totales generales
            totalVenta += ventaVendedor;
            totalPremios += premiosVendedor;
            
            // Aplicar el precio de venta del jefe o del vendedor
            const precioVentaAplicar = jefe.precioVenta || vendedor.precioVenta;
            const pagoPremios = premiosVendedor * precioVentaAplicar;
            
            // Calcular la ganancia y entrega usando el porcentaje del jefe o del vendedor
            const porcentajeAplicar = jefe.porcentaje || vendedor.porcentaje;
            const gananciaVendedor = ventaVendedor * (porcentajeAplicar / 100);
            const entregaVendedor = ventaVendedor - gananciaVendedor;
            
            // Actualizar totales
            totalPagoPremios += pagoPremios;
            totalEntrega += entregaVendedor;
        });

        if (totalVenta > 0) {
            // Usar espacios para alinear como una tabla
            // Calcular la ganancia o pérdida
const gananciaFinal = totalEntrega - totalPagoPremios;
const esGanancia = gananciaFinal >= 0;

// Usar espacios para alinear como una tabla
const etiquetas = [
    'Venta Total:', 
    'Premio Total:', 
    'Pago Total:', 
    'Entrega Total:', 
    esGanancia ? 'Ganancia:' : 'Pérdidas:'
];

const valores = [
    Math.round(totalVenta).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    Math.round(totalPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    Math.round(totalPagoPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    Math.round(totalEntrega).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    Math.abs(Math.round(gananciaFinal)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaxima = Math.max(...etiquetas.map(e => e.length));
            
            /// Crear cada línea con alineación
etiquetas.forEach((etiqueta, index) => {
    // Padding a la derecha para alinear valores
    const espacios = ' '.repeat(longitudMaxima - etiqueta.length + 5);
    
    // Verificar si es la última línea (ganancia o pérdidas) y aplicar formato especial
    if (index === etiquetas.length - 1 && !esGanancia) {
        // Para pérdidas, añadir el signo negativo
        reporte += `${etiqueta}${espacios}-${valores[index]}\n`;
    } else {
        reporte += `${etiqueta}${espacios}${valores[index]}\n`;
    }
});
        } else {
            reporte += `No hay ventas registradas para este horario y fecha.\n`;
        }
    }

    // Crear un modal personalizado
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
        background-color: ${document.body.classList.contains('dark-mode') ? '#333' : '#fff'};
        color: ${document.body.classList.contains('dark-mode') ? '#fff' : '#000'};
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    const preElement = document.createElement('pre');
preElement.style.cssText = `
    margin: 0;
    white-space: pre-wrap;
    font-family: monospace;
`;

// Verificar si hay pérdidas para aplicar formato HTML
if (reporte.includes('Pérdidas:')) {
    // Convertir el reporte a HTML para poder colorear las pérdidas
    const reporteHTML = reporte.split('\n').map(line => {
        if (line.includes('Pérdidas:')) {
            return `<span style="color: red;">${line}</span>`;
        }
        return line;
    }).join('\n');
    
    preElement.innerHTML = reporteHTML;
} else {
    preElement.textContent = reporte;
}

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

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
            // Copiar como Texto
            await navigator.clipboard.writeText(reporte);

            // Crear imagen en canvas con tamaño dinámico basado en el contenido
            const lines = reporte.split('\n');
            const lineHeight = 25; // Altura de cada línea en píxeles
            const padding = 40; // Padding alrededor del texto
            
            // Calcular dimensiones basadas en el contenido
            const canvasWidth = 600; // Ancho fijo más amplio
            const canvasHeight = (lines.length * lineHeight) + (padding * 2);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Fondo apropiado según modo
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#333' : '#f5f5f5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Texto con mejor contraste
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
            ctx.font = '16px monospace'; // Usar fuente monoespaciada para alineación
            
            // Dibujar cada línea del reporte
lines.forEach((line, i) => {
    // Verificar si es una línea de pérdidas para aplicar color rojo
    if (line.includes('Pérdidas:')) {
        ctx.fillStyle = '#FF0000'; // Color rojo para pérdidas
        ctx.fillText(line, padding, padding + (i * lineHeight));
        // Restaurar el color normal para las siguientes líneas
        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
    } else {
        ctx.fillText(line, padding, padding + (i * lineHeight));
    }
});
            
            // Convertir canvas a Blob
            canvas.toBlob(async (blobImage) => {
                if (blobImage) {
                    try {
                        // Intentar primero con navigator.clipboard.write
                        if (typeof ClipboardItem !== 'undefined') {
                            const clipboardItems = [
                                new ClipboardItem({
                                    'text/plain': new Blob([reporte], {type: 'text/plain'}),
                                    'image/png': blobImage
                                })
                            ];
                            await navigator.clipboard.write(clipboardItems);
                        } else {
                            // Alternativa: descargar la imagen
                            const img = canvas.toDataURL('image/png');
                            const tempLink = document.createElement('a');
                            tempLink.href = img;
                            tempLink.download = `Reporte_${jefe.nombre}_${fechaMostrar}.png`;
                            tempLink.click();
                            
                            // Ya hemos copiado el texto, así que informamos al usuario
                            alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                        }
                    } catch (clipErr) {
                        console.error('Error al copiar imagen:', clipErr);
                        // Si falla, ofrecer descargar la imagen
                        const img = canvas.toDataURL('image/png');
                        const tempLink = document.createElement('a');
                        tempLink.href = img;
                        tempLink.download = `Reporte_${jefe.nombre}_${fechaMostrar}.png`;
                        tempLink.click();
                        alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                    }
                }
            }, 'image/png');
            
            copyButton.textContent = 'Copiado!';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            alert('Ocurrió un error al copiar: ' + err.message);
        }
    };

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

    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(preElement);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

function crearSelectorFechas(jefeIndex) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Obtener la fecha actual para el valor predeterminado
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Seleccionar Período</h3>
            <div class="fecha-inputs">
                <div>
                    <label for="fechaSeleccionada">Fecha:</label>
                    <input type="date" id="fechaSeleccionada" value="${fechaFormateada}" required>
                </div>
                <div style="margin-top: 15px;">
                    <label>Horario:</label>
                    <div class="radio-group" style="display: flex; gap: 15px; margin-top: 8px;">
                        <label style="display: flex; align-items: center;">
                            <input type="radio" name="horarioRadio" value="todos" checked>
                            <span style="margin-left: 5px;">Todos</span>
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="radio" name="horarioRadio" value="dia">
                            <span style="margin-left: 5px;">Día</span>
                        </label>
                        <label style="display: flex; align-items: center;">
                            <input type="radio" name="horarioRadio" value="noche">
                            <span style="margin-left: 5px;">Noche</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="modal-buttons">
                <button onclick="verReporteSimplificado(${jefeIndex})" class="btn-primary">Ver Reporte</button>
                <button onclick="cerrarModal()" class="btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Estilos como antes...
    const style = document.createElement('style');
    style.textContent = `
        .fecha-inputs {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 20px 0;
        }
        .fecha-inputs div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .fecha-inputs input[type="date"] {
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            width: 60%;
        }
        .dark-mode .fecha-inputs input[type="date"] {
            background-color: #333;
            color: white;
            border-color: #666;
        }
        .fecha-inputs label {
            width: 35%;
        }
    `;
    document.head.appendChild(style);
}

// Función para procesar el reporte simplificado
function verReporteSimplificado(jefeIndex) {
    const fechaSeleccionada = document.getElementById('fechaSeleccionada').value;
    
    // Obtener el valor seleccionado de los radio buttons
    const radioButtons = document.getElementsByName('horarioRadio');
    let horarioSeleccionado = "todos"; // valor por defecto
    
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            horarioSeleccionado = radioButton.value;
            break;
        }
    }
    
    console.log("FECHA SELECCIONADA:", fechaSeleccionada);
    console.log("HORARIO SELECCIONADO:", horarioSeleccionado);
    
    if (!fechaSeleccionada) {
        mostrarMensaje('Por favor seleccione una fecha', 'error');
        return;
    }

    // Si seleccionó "todos", mostrar resumen mensual
    if (horarioSeleccionado === "todos") {
        // Calcular el primer día del mes actual
        const fecha = new Date(fechaSeleccionada);
        const primerDiaDelMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        const primerDiaFormateado = primerDiaDelMes.toISOString().split('T')[0];
        
        // Usar la fecha seleccionada como fecha final
        verVentasJefeConResumenMensual(jefeIndex, primerDiaFormateado, fechaSeleccionada, horarioSeleccionado);
    } else {
        // Si seleccionó día o noche, mostrar solo esa fecha específica
        verVentasJefePorFecha(jefeIndex, fechaSeleccionada, fechaSeleccionada, horarioSeleccionado);
    }
    
    cerrarModal();
}

// Nueva función para mostrar el resumen mensual
function verVentasJefeConResumenMensual(jefeIndex, fechaInicio, fechaFin, horario) {
    const jefe = jefes[jefeIndex];
    if (!jefe) {
        alert('Error: Jefe no encontrado');
        return;
    }
    
    console.log("Diagnóstico de fechas para resumen mensual:");
    console.log("- fechaInicio (primer día del mes):", fechaInicio);
    console.log("- fechaFin (fecha seleccionada):", fechaFin);
    console.log("- horario seleccionado:", horario);

    // Usar la función global obtenerFechaFormateada
    const fechaInicioNormalizada = obtenerFechaFormateada(fechaInicio);
    const fechaFinNormalizada = obtenerFechaFormateada(fechaFin);

    console.log("- fechaInicio normalizada:", fechaInicioNormalizada);
    console.log("- fechaFin normalizada:", fechaFinNormalizada);

    // Extraer el mes y año para mostrar en el título
    const fechaParaMostrar = new Date(fechaFin);
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const nombreMes = nombresMeses[fechaParaMostrar.getMonth()];
    const anio = fechaParaMostrar.getFullYear();

    // Declarar la variable reporte al inicio de la función
    let reporte = "";
    
    // Buscar todas las ventas para encontrar número ganador del período seleccionado
    const vendedoresDelJefe = vendedores.filter(v => v.jefes.includes(jefe.nombre));
    
    // Función para verificar si una fecha está en el rango
    function esFechaEnRango(fechaVenta) {
        const fechaVentaNormalizada = obtenerFechaFormateada(fechaVenta);
        
        // Para comparar correctamente, convertir a objetos Date
        function convertirADate(fechaStr) {
            const [dia, mes, anio] = fechaStr.split('/').map(Number);
            return new Date(anio, mes - 1, dia);
        }
        
        const dateVenta = convertirADate(fechaVentaNormalizada);
        const dateInicio = convertirADate(fechaInicioNormalizada);
        const dateFin = convertirADate(fechaFinNormalizada);
        
        // Verificar si la fecha está en el rango
        return dateVenta >= dateInicio && dateVenta <= dateFin;
    }
    
    // Función limpia para verificar si el horario coincide (como en verVentasJefePorFecha)
    function coincideHorario(horarioVenta, horarioBuscado) {
        // Si se seleccionó "todos", siempre devuelve true
        if (horarioBuscado === "todos") {
            return true;
        }
        
        // Normalizar ambos horarios para comparación (eliminar posibles números anexados)
        const normalizado1 = horarioVenta.replace(/\s*\d+$/, ""); // Elimina cualquier número al final
        const normalizado2 = horarioBuscado.replace(/\s*\d+$/, "");
        
        return (
            normalizado1 === normalizado2 ||
            (normalizado1 === "dia" && normalizado2 === "día") ||
            (normalizado1 === "día" && normalizado2 === "dia") ||
            (normalizado1 === "noche" && normalizado2 === "noche")
        );
    }
    
    // Variables para el resumen
    let ventasDia = 0;
    let premiosDia = 0;
    let pagoPremiosDia = 0;
    let entregaDia = 0;
    
    let ventasNoche = 0;
    let premiosNoche = 0;
    let pagoPremiosNoche = 0;
    let entregaNoche = 0;
    
    // Procesar cada vendedor individualmente
    vendedoresDelJefe.forEach(vendedor => {
        // Filtrar las ventas en el rango de fechas especificado
        const ventasEnRango = vendedor.ventas.filter(v => esFechaEnRango(v.fecha));
        
        // Separar por horario
        const ventasHorarioDia = ventasEnRango.filter(v => coincideHorario(v.horario, "dia"));
        const ventasHorarioNoche = ventasEnRango.filter(v => coincideHorario(v.horario, "noche"));
        
        // Calcular totales para día
        let ventaVendedorDia = 0;
        let premiosVendedorDia = 0;
        ventasHorarioDia.forEach(venta => {
            ventaVendedorDia += venta.totalVenta;
            premiosVendedorDia += venta.premio;
        });
        
        // Aplicar el precio de venta del jefe o del vendedor para día
        const precioVentaAplicarDia = jefe.precioVenta || vendedor.precioVenta;
        const pagoPremiosDiaVendedor = premiosVendedorDia * precioVentaAplicarDia;
        
        // Calcular la ganancia y entrega usando el porcentaje del jefe o del vendedor para día
        const porcentajeAplicarDia = jefe.porcentaje || vendedor.porcentaje;
        const gananciaVendedorDia = ventaVendedorDia * (porcentajeAplicarDia / 100);
        const entregaVendedorDia = ventaVendedorDia - gananciaVendedorDia;
        
        // Acumular totales día
        ventasDia += ventaVendedorDia;
        premiosDia += premiosVendedorDia;
        pagoPremiosDia += pagoPremiosDiaVendedor;
        entregaDia += entregaVendedorDia;
        
        // Calcular totales para noche
        let ventaVendedorNoche = 0;
        let premiosVendedorNoche = 0;
        ventasHorarioNoche.forEach(venta => {
            ventaVendedorNoche += venta.totalVenta;
            premiosVendedorNoche += venta.premio;
        });
        
        // Aplicar el precio de venta del jefe o del vendedor para noche
        const precioVentaAplicarNoche = jefe.precioVenta || vendedor.precioVenta;
        const pagoPremiosNocheVendedor = premiosVendedorNoche * precioVentaAplicarNoche;
        
        // Calcular la ganancia y entrega usando el porcentaje del jefe o del vendedor para noche
        const porcentajeAplicarNoche = jefe.porcentaje || vendedor.porcentaje;
        const gananciaVendedorNoche = ventaVendedorNoche * (porcentajeAplicarNoche / 100);
        const entregaVendedorNoche = ventaVendedorNoche - gananciaVendedorNoche;
        
        // Acumular totales noche
        ventasNoche += ventaVendedorNoche;
        premiosNoche += premiosVendedorNoche;
        pagoPremiosNoche += pagoPremiosNocheVendedor;
        entregaNoche += entregaVendedorNoche;
    });

    // Crear el encabezado del reporte
    reporte = `Resumen Mensual - ${jefe.nombre}\n`;
    reporte += `Período: ${nombreMes} ${anio}\n`;
    reporte += `Fecha: ${fechaInicioNormalizada} al ${fechaFinNormalizada}\n`;
    reporte += '----------------------------------------\n\n';

    if (vendedoresDelJefe.length === 0) {
        reporte += 'No hay vendedores asignados a este jefe.\n';
    } else {
        // Calcular totales generales
        const totalVentas = ventasDia + ventasNoche;
        const totalPremios = premiosDia + premiosNoche;
        const totalPagoPremios = pagoPremiosDia + pagoPremiosNoche;
        const totalEntrega = entregaDia + entregaNoche;
        
        // Calcular ganancias/pérdidas
        const gananciaDia = entregaDia - pagoPremiosDia;
        const gananciaNoche = entregaNoche - pagoPremiosNoche;
        const gananciaTotal = gananciaDia + gananciaNoche;
        
        const esGananciaDia = gananciaDia >= 0;
        const esGananciaNoche = gananciaNoche >= 0;
        const esGananciaTotal = gananciaTotal >= 0;

        if (totalVentas > 0) {
            // Sección del Día
            reporte += `HORARIO: DÍA\n`;
            reporte += `----------------------------------------\n`;
            const etiquetasDia = [
                'Venta Total:', 
                'Premio Total:', 
                'Pago Total:', 
                'Entrega Total:', 
                esGananciaDia ? 'Ganancia:' : 'Pérdidas:'
            ];

            const valoresDia = [
                Math.round(ventasDia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(premiosDia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(pagoPremiosDia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(entregaDia).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.abs(Math.round(gananciaDia)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            ];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaximaDia = Math.max(...etiquetasDia.map(e => e.length));
            
            // Crear cada línea con alineación para día
            etiquetasDia.forEach((etiqueta, index) => {
                const espacios = ' '.repeat(longitudMaximaDia - etiqueta.length + 5);
                
                if (index === etiquetasDia.length - 1 && !esGananciaDia) {
                    reporte += `${etiqueta}${espacios}-${valoresDia[index]}\n`;
                } else {
                    reporte += `${etiqueta}${espacios}${valoresDia[index]}\n`;
                }
            });
            
            // Sección de la Noche
            reporte += `\nHORARIO: NOCHE\n`;
            reporte += `----------------------------------------\n`;
            const etiquetasNoche = [
                'Venta Total:', 
                'Premio Total:', 
                'Pago Total:', 
                'Entrega Total:', 
                esGananciaNoche ? 'Ganancia:' : 'Pérdidas:'
            ];

            const valoresNoche = [
                Math.round(ventasNoche).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(premiosNoche).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(pagoPremiosNoche).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(entregaNoche).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.abs(Math.round(gananciaNoche)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            ];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaximaNoche = Math.max(...etiquetasNoche.map(e => e.length));
            
            // Crear cada línea con alineación para noche
            etiquetasNoche.forEach((etiqueta, index) => {
                const espacios = ' '.repeat(longitudMaximaNoche - etiqueta.length + 5);
                
                if (index === etiquetasNoche.length - 1 && !esGananciaNoche) {
                    reporte += `${etiqueta}${espacios}-${valoresNoche[index]}\n`;
                } else {
                    reporte += `${etiqueta}${espacios}${valoresNoche[index]}\n`;
                }
            });
            
            // Sección del Total
            reporte += `\nRESUMEN TOTAL DEL MES\n`;
            reporte += `----------------------------------------\n`;
            const etiquetasTotal = [
                'Venta Total:', 
                'Premio Total:', 
                'Pago Total:', 
                'Entrega Total:', 
                esGananciaTotal ? 'Ganancia:' : 'Pérdidas:'
            ];

            const valoresTotal = [
                Math.round(totalVentas).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalPagoPremios).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.round(totalEntrega).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                Math.abs(Math.round(gananciaTotal)).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            ];
            
            // Encontrar la etiqueta más larga para calcular el padding
            const longitudMaximaTotal = Math.max(...etiquetasTotal.map(e => e.length));
            
            // Crear cada línea con alineación para el total
            etiquetasTotal.forEach((etiqueta, index) => {
                const espacios = ' '.repeat(longitudMaximaTotal - etiqueta.length + 5);
                
                if (index === etiquetasTotal.length - 1 && !esGananciaTotal) {
                    reporte += `${etiqueta}${espacios}-${valoresTotal[index]}\n`;
                } else {
                    reporte += `${etiqueta}${espacios}${valoresTotal[index]}\n`;
                }
            });
        } else {
            reporte += `No hay ventas registradas para este período.\n`;
        }
    }

    // Crear un modal personalizado (reutilizando código existente)
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
        background-color: ${document.body.classList.contains('dark-mode') ? '#333' : '#fff'};
        color: ${document.body.classList.contains('dark-mode') ? '#fff' : '#000'};
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;

    const preElement = document.createElement('pre');
    preElement.style.cssText = `
        margin: 0;
        white-space: pre-wrap;
        font-family: monospace;
    `;

    // Verificar si hay pérdidas para aplicar formato HTML
    if (reporte.includes('Pérdidas:')) {
        // Convertir el reporte a HTML para poder colorear las pérdidas
        const reporteHTML = reporte.split('\n').map(line => {
            if (line.includes('Pérdidas:')) {
                return `<span style="color: red;">${line}</span>`;
            }
            return line;
        }).join('\n');
        
        preElement.innerHTML = reporteHTML;
    } else {
        preElement.textContent = reporte;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    `;

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
    
    // El manejo del botón de copiar sería el mismo que en la función original
    copyButton.onclick = async () => {
        try {
            // Código de copiar (mantener igual que en la función original)
            await navigator.clipboard.writeText(reporte);
            
            // Crear imagen en canvas...
            const lines = reporte.split('\n');
            const lineHeight = 25;
            const padding = 40;
            const canvasWidth = 600;
            const canvasHeight = (lines.length * lineHeight) + (padding * 2);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#333' : '#f5f5f5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
            ctx.font = '16px monospace';
            
            lines.forEach((line, i) => {
                if (line.includes('Pérdidas:')) {
                    ctx.fillStyle = '#FF0000';
                    ctx.fillText(line, padding, padding + (i * lineHeight));
                    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
                } else {
                    ctx.fillText(line, padding, padding + (i * lineHeight));
                }
            });
            
            // El resto del código para el manejo de la imagen (igual que en la función original)
            canvas.toBlob(async (blobImage) => {
                if (blobImage) {
                    try {
                        if (typeof ClipboardItem !== 'undefined') {
                            const clipboardItems = [
                                new ClipboardItem({
                                    'text/plain': new Blob([reporte], {type: 'text/plain'}),
                                    'image/png': blobImage
                                })
                            ];
                            await navigator.clipboard.write(clipboardItems);
                        } else {
                            const img = canvas.toDataURL('image/png');
                            const tempLink = document.createElement('a');
                            tempLink.href = img;
                            tempLink.download = `Resumen_Mensual_${jefe.nombre}_${nombreMes}_${anio}.png`;
                            tempLink.click();
                            alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                        }
                    } catch (clipErr) {
                        console.error('Error al copiar imagen:', clipErr);
                        const img = canvas.toDataURL('image/png');
                        const tempLink = document.createElement('a');
                        tempLink.href = img;
                        tempLink.download = `Resumen_Mensual_${jefe.nombre}_${nombreMes}_${anio}.png`;
                        tempLink.click();
                        alert('El texto se ha copiado al portapapeles. La imagen se descargará automáticamente.');
                    }
                }
            }, 'image/png');
            
            copyButton.textContent = 'Copiado!';
            setTimeout(() => copyButton.textContent = 'Copiar', 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
            alert('Ocurrió un error al copiar: ' + err.message);
        }
    };

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

    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(acceptButton);
    modalContent.appendChild(preElement);
    modalContent.appendChild(buttonContainer);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}

function verReporteFechas(jefeIndex) {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const horario = document.getElementById('horarioSelect').value;
    
    // Depuración para verificar el valor exacto seleccionado
    console.log("Valor del selector de horario:", horario);
    console.log("Tipo de dato:", typeof horario);
    
    if (!fechaInicio || !fechaFin) {
        mostrarMensaje('Por favor seleccione ambas fechas', 'error');
        return;
    }

    // Solo pasar el horario si realmente hay una selección
    const horarioSeleccionado = horario ? horario : null;
    
    verVentasJefePorFecha(jefeIndex, fechaInicio, fechaFin, horarioSeleccionado);
    cerrarModal();
}

function numeroAEmoji(numero) {
    const numStr = numero.toString().padStart(2, '0'); // Convierte el número en string
    const emojiNumeros = {
        '0': '0️⃣',
        '1': '1️⃣',
        '2': '2️⃣',
        '3': '3️⃣',
        '4': '4️⃣',
        '5': '5️⃣',
        '6': '6️⃣',
        '7': '7️⃣',
        '8': '8️⃣',
        '9': '9️⃣'
    };
    return numStr.split('').map(digito => emojiNumeros[digito]).join('');
}

function cerrarModal() {
    document.querySelector('.modal').remove();
}

// Exportar funciones para acceso global
window.agregarJefe = agregarJefe;
window.actualizarListaJefes = actualizarListaJefes;
window.actualizarSelectJefes = actualizarSelectJefes;
window.updateJefeInfo = updateJefeInfo;
window.editarJefe = editarJefe;
window.eliminarJefe = eliminarJefe;
window.eliminarJefeCompleto = eliminarJefeCompleto;
window.toggleBotonesJefe = toggleBotonesJefe;
window.mostrarTooltipJefe = mostrarTooltipJefe;
window.ocultarTooltipJefe = ocultarTooltipJefe;
window.verVentasJefe = verVentasJefe;
window.verVentasJefePorFecha = verVentasJefePorFecha;
window.verVentasJefeConResumenMensual = verVentasJefeConResumenMensual;
window.crearSelectorFechas = crearSelectorFechas;
window.verReporteSimplificado = verReporteSimplificado;
window.verReporteFechas = verReporteFechas;
window.numeroAEmoji = numeroAEmoji;
