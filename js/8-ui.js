/**
 * 8-ui.js - Funciones de UI general e inicialización
 * Este archivo contiene las funciones relacionadas con la interfaz de usuario
 * y la inicialización de la aplicación.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Esperar un momento para asegurar que todos los scripts se han ejecutado
    setTimeout(inicializarAplicacion, 10);
});

// Función mejorada de inicialización
function inicializarAplicacion() {

    // Asegurarse que las variables globales estén definidas
    if (typeof vendedores === 'undefined') vendedores = [];
    if (typeof jefes === 'undefined') jefes = [];
    if (typeof mensajesNoProcesados === 'undefined') mensajesNoProcesados = [];
    if (typeof mensajesInvalidos === 'undefined') mensajesInvalidos = [];
    if (typeof ventaYaRegistrada === 'undefined') ventaYaRegistrada = false;

    // Cargar datos guardados
    cargarDatos();

    // Inicializar elementos UI
    document.getElementById('Bienvenida').style.display = 'block';
    agregarEstilosMensajes();
    actualizarSelectJefes();
    updateToggleDarkModeButton();

    // Configurar event listeners
    const numeroGanadorInput = document.getElementById('numeroGanador');
    if (numeroGanadorInput) {
        numeroGanadorInput.addEventListener('input', function (e) {
            validarNumero(this);
        });
    }

    // Configurar el botón de agregar mensaje
    const btnAgregarMensaje = document.querySelector('.button-group .btn-success');

    if (btnAgregarMensaje) {
        btnAgregarMensaje.addEventListener('click', function (e) {
            agregarMensaje();
        });
    } else {
        //console.error('No se encontró el botón de agregar mensaje');
    }

    // Agregar el listener de resize para el manejo móvil
    window.addEventListener('resize', function () {
        const activeTab = document.querySelector('.nav-button.active');
        if (activeTab) {
            const tabName = activeTab.getAttribute('onclick').match(/'([^']+)'/)[1];
            const tabContent = document.getElementById(tabName);
            if (tabContent && window.innerWidth <= 768) {
                tabContent.scrollIntoView({behavior: 'smooth'});
            }
        }
    });

}

// Asegurarse de que la inicialización se ejecute cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

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

// Agregar el nuevo botón al DOM
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

    // Agregar el nuevo botón de pre-procesamiento
    const botonesContainer = document.querySelector('.button-container');
    if (botonesContainer) {
        const reprocesarBtn = botonesContainer.querySelector('button');
        if (reprocesarBtn) {
            const preBtn = document.createElement('button');
            preBtn.textContent = '🔄 Pre-procesar';
            preBtn.onclick = preProcesarPatrones;
            preBtn.className = 'btn btn-secondary';
            preBtn.style.marginRight = '10px';

            botonesContainer.insertBefore(preBtn, reprocesarBtn);
        }
    }
});

// Event listener único para el botón de procesar
document.addEventListener('DOMContentLoaded', function () {
    const btnProcesar = document.querySelector('.btn-procesar');
    if (btnProcesar) {
        btnProcesar.addEventListener('click', procesarTextoCompleto);
    }
});

// 1. Primero, agregar un event listener cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {

    // 2. Buscar el botón y agregar el event listener
    const btnAgregarMensaje = document.querySelector('button[onclick="agregarMensaje()"]');

    if (btnAgregarMensaje) {
        // 3. Agregar un nuevo event listener además del onclick
        btnAgregarMensaje.addEventListener('click', function (e) {
            // La función original se ejecutará por el onclick
        });
    } else {
        console.error('No se encontró el botón de agregar mensaje');
    }
});

// Al cargar la página, asegurarnos de que el botón use la nueva función
document.addEventListener('DOMContentLoaded', function () {
    const btnAgregarMensaje = document.querySelector('.button-group .btn-success');
    if (btnAgregarMensaje) {
        // Remover el onclick del HTML
        btnAgregarMensaje.removeAttribute('onclick');
        // Agregar el nuevo event listener
        btnAgregarMensaje.addEventListener('click', window.agregarMensaje);
    }
});

// Inicialización de elementos DOM
document.addEventListener('DOMContentLoaded', function () {
    const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
    if (mensajesNoProcesadosSection) {
        mensajesNoProcesadosSection.style.display = 'none';
    }
    agregarEstilosMensajes();
});

// Agregar botones al DOM
document.addEventListener('DOMContentLoaded', function () {
    const botonesContainer = document.querySelector('.actions');
    if (botonesContainer) {
        // Botón de exportación selectiva
        const btnExportSelectivo = document.createElement('button');
        btnExportSelectivo.textContent = 'Exportar por Fecha';
        btnExportSelectivo.className = 'export-button';
        btnExportSelectivo.onclick = exportarVentasSelectivas;
        botonesContainer.appendChild(btnExportSelectivo);

        // Input para importación selectiva (oculto)
        const inputImportSelectivo = document.createElement('input');
        inputImportSelectivo.type = 'file';
        inputImportSelectivo.id = 'importSelectiveFile';
        inputImportSelectivo.style.display = 'none';
        inputImportSelectivo.accept = '.json';
        inputImportSelectivo.onchange = importarVentasSelectivas;
        botonesContainer.appendChild(inputImportSelectivo);

        // Botón para activar la importación selectiva
        const btnImportSelectivo = document.createElement('button');
        btnImportSelectivo.textContent = 'Importar por Fecha';
        btnImportSelectivo.className = 'btn-secondary';
        btnImportSelectivo.onclick = () => document.getElementById('importSelectiveFile').click();
        botonesContainer.appendChild(btnImportSelectivo);
    }
});

// Agregar el event listener para el botón de generar reporte
document.addEventListener('DOMContentLoaded', function () {
    const btnGenerarReporte = document.querySelector('.btn-generar-reporte');
    if (btnGenerarReporte) {
        btnGenerarReporte.addEventListener('click', generarReportePorFecha);
    }
});

// Usar un event listener DOMContentLoaded para asegurarnos de que CONFIG está definido
document.addEventListener('DOMContentLoaded', function () {
    // Configurar el backup automático después de que CONFIG esté disponible
    setInterval(() => {
        guardarDatos();
    }, window.CONFIG.BACKUP_INTERVAL);
});

document.addEventListener('DOMContentLoaded', function () {
    const btnMostrarAnalisis = document.getElementById('btnMostrarAnalisis');
    const mensajeVenta = document.getElementById('mensajeVenta');
    const analisisContainer = document.createElement('div');
    const filtroJugadas = document.createElement('input');
    analisisContainer.style.display = 'none';
    let analisisVisible = false;
    let contadorSMS = 1;  // Contador para numerar los SMS
    let todasLasJugadas = []; // Array para guardar todas las jugadas

    // Crear y configurar el input de filtro
    filtroJugadas.setAttribute('type', 'text');
    filtroJugadas.setAttribute('placeholder', 'Filtrar jugadas...');
    filtroJugadas.style.marginBottom = '10px';
    filtroJugadas.style.width = '100%';
    filtroJugadas.style.padding = '5px';

    // Modificar la función de filtrado
    function filtrarJugadas() {
        const filtro = filtroJugadas.value.trim();
        const analisisContainer = document.getElementById('analisis-container');
        
        // Obtener todas las jugadas-container
        const todasLasJugadasElements = document.querySelectorAll('.jugada-container');
        
        // Si no hay filtro, mostrar todas
        if (!filtro) {
            todasLasJugadasElements.forEach(elem => {
                elem.style.display = 'block';
            });
            return;
        }
        
        // Filtrar las jugadas
        todasLasJugadasElements.forEach(elem => {
            // Obtener los números de la jugada del atributo data
            const numerosJugada = elem.getAttribute('data-numeros');
            const tipoJugada = elem.getAttribute('data-tipo');
            const textoJugada = elem.textContent;
            
            // Crear el número con formato de dos dígitos para la búsqueda
            const numeroFiltro = filtro.padStart(2, '0');
            
            // Verificar si el número está en la jugada
            const coincide = numerosJugada.includes(numeroFiltro) || 
                            textoJugada.includes(`${filtro} con`) ||
                            textoJugada.includes(`${numeroFiltro} con`);
            
            // Mostrar u ocultar según corresponda
            elem.style.display = coincide ? 'block' : 'none';
        });
        
        // Verificar si hay jugadas visibles
        const jugadasVisibles = document.querySelectorAll('.jugada-container[style="display: block"]');
        if (jugadasVisibles.length === 0) {
            // Si no hay coincidencias, mostrar mensaje
            const noResults = document.createElement('div');
            noResults.className = 'mensaje-error';
            noResults.textContent = 'No se encontraron jugadas que coincidan con el filtro';
            analisisContainer.appendChild(noResults);
        }
    }
    
    // Asegurarse de que el filtro se actualice en tiempo real
    filtroJugadas.addEventListener('input', function() {
        filtrarJugadas();
    });

// Reemplaza la conexión del evento por esta
filtroJugadas.addEventListener('input', function() {
    console.log("Evento input detectado");
    filtrarJugadas();
});

// Añade esta línea para verificar que el evento se está conectando correctamente
console.log("Evento input conectado al campo de filtro");

    // Modificar la función formatearJugadas para aceptar el color
    function formatearJugadas(tipo, linea, jugadas, totalVenta, premioTotal, index, color) {
        let premio = premioTotal > 0 ? `<strong style="color: red">Premio: ${premioTotal}</strong>`: "";
        
        // Crear un atributo data con los números de la jugada para facilitar el filtrado
        const numerosJugada = Object.keys(jugadas).join(',');
    
        // Función auxiliar para formatear números
        const formatearNumero = (num) => {
            // Convertir a número por si acaso viene como string
            num = parseInt(num);
            // Asegurarse de que sea un número de dos dígitos
            return num < 10 ? `0${num}` : num.toString();
        };
    
        // Obtener el número ganador
        const numeroGanador = obtenerNumeroGanador();
    
        // Función para formatear la jugada con resaltado del número ganador
        const formatearJugadaConResaltado = (jugada, cantidad) => {
            const numFormateado = formatearNumero(jugada);
            if (numeroGanador && parseInt(jugada) === parseInt(numeroGanador)) {
                return ` <span style="color: white; background-color: ${color}; padding: 2px 4px; border-radius: 3px;">${numFormateado}</span> con ${cantidad}`;
            }
            return ` ${numFormateado} con ${cantidad}`;
        };
    
        return `
            <div class="jugada-container" id="jugada-${index}" data-numeros="${numerosJugada}" data-tipo="${tipo}">
                <div class="jugada-original">
                    <span class="jugada-texto" style="color: ${color}">${linea} =></span>
                    <span class="jugada-resultados" style="color: ${color}">${
                        Object.entries(jugadas)
                            .map(([jugada, cantidad]) => formatearJugadaConResaltado(jugada, cantidad))
                            .join(',')
                    }</span>
                </div>
                <div class="jugada-tipo" style="color: ${color}">${tipo}</div>
                <div class="jugada-detalles">
                    <div class="venta-total">Venta: ${totalVenta} ${premio}</div>
                </div>
            </div>
        `;
    }

    // Función principal para analizar una jugada
    function analizarJugada(linea, index) {
        if (!linea || typeof linea !== 'string') {
            return {
                tipo: 'Error',
                html: '<div class="mensaje-error">Jugada inválida</div>',
                venta: 0,
                premio: 0
            };
        }

        const numeroGanador = obtenerNumeroGanador();
        linea = linea.trim();
        if (linea === '') {
            return {
                tipo: 'Error',
                html: '<div class="mensaje-error">Jugada vacía</div>',
                venta: 0,
                premio: 0
            };
        }

        try {
            // Verificar si la línea contiene SOLO "sms" al inicio
            if (/^sms\s*$/i.test(linea)) {
                const numeroSMS = contadorSMS++;
                return {
                    tipo: 'SMS',
                    html: `
                        <div class="jugada-container" id="jugada-${index}">
                            <div class="jugada-original" style="color: #808080;">SMS ${numeroSMS}: ${linea}</div>
                        </div>
                    `,
                    venta: 0,
                    premio: 0
                };
            }
            // Si tiene "sms" al inicio pero con contenido adicional, mostrar error
            else if (/^sms\s+.+/i.test(linea)) {
                return {
                    tipo: 'Error',
                    html: `
                        <div class="jugada-container jugada-invalida" id="jugada-${index}">
                            <div class="jugada-original">${linea}</div>
                            <div class="mensaje-error">Formato SMS inválido</div>
                        </div>
                    `,
                    venta: 0,
                    premio: 0
                };
            }
            // Verificar si es una jugada de "Línea"
            if (patrones.linea.test(linea)) {
                const resultado = procesarLineaConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Línea',
                        html: formatearJugadas('Línea', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#4CAF50'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.lineaConY.test(linea)) {
                const resultado = procesarLineaConYGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'LíneaConY',
                        html: formatearJugadas('LíneaConY', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#2196F3'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.decena.test(linea)) {
                const resultado = procesarDecenaConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Decena',
                        html: formatearJugadas('Decena', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#E91E63'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.decenaConY.test(linea)) {
                const resultado = procesarDecenaConYGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'DecenaConY',
                        html: formatearJugadas('Decena con Y', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.terminal.test(linea) || patrones.terminalMultiple.test(linea)) {
                const resultado = procesarTerminalesConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Terminal',
                        html: formatearJugadas('Terminal', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#9C27B0'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.terminalAl.test(linea)) {
                const resultado = procesarTerminalAl(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Terminal Al',
                        html: formatearJugadas('Terminal Al', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#FF9800'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.pareja.test(linea)) {
                const resultado = procesarParejasConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Pareja',
                        html: formatearJugadas('Pareja', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#795548'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.parejasAl.test(linea)) {
                const resultado = procesarParejasAlConGanador(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Pareja Al',
                        html: formatearJugadas('Pareja Al', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#FFC107'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else if (patrones.numeroAlNumero.test(linea)) {
                const resultado = procesarNumeroAlNumero(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Numero Al',
                        html: formatearJugadas('Numero Al', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#009688'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            } else {
                const resultado = procesarGenerica(linea, numeroGanador);
                if (resultado) {
                    return {
                        tipo: 'Generica',
                        html: formatearJugadas('Generica', linea, resultado.jugadas, resultado.totalVenta, resultado.premioEncontrado, index, '#673AB7'),
                        venta: resultado.totalVenta,
                        premio: resultado.premioEncontrado
                    };
                }
            }

            // Si no coincide con ningún patrón conocido
            return {
                tipo: 'Error',
                html: `<div class="mensaje-error">Formato de jugada no reconocido: ${linea}</div>`,
                venta: 0,
                premio: 0
            };

        } catch (error) {
            console.error('Error procesando jugada:', error);
            return {
                tipo: 'Error',
                html: `<div class="mensaje-error">Error procesando jugada: ${linea}</div>`,
                venta: 0,
                premio: 0
            };
        }
    }

    // Event listener para el botón
    btnMostrarAnalisis.addEventListener('click', function () {
        const mensaje = mensajeVenta.value.trim();
    
        if (mensaje) {
            let resultadoHTML = '';
            if (!analisisVisible) {
                // Limpiar el contenedor de análisis y reiniciar el array de jugadas
                todasLasJugadas = [];
                analisisContainer.classList.add('analisis-container');
                
                // Agregar el input de filtro
                analisisContainer.innerHTML = '';
                analisisContainer.appendChild(filtroJugadas);

                const lineas = mensaje.split('\n').filter(linea => linea.trim());
    
                // Reiniciar contador de SMS y totales
                contadorSMS = 1;
                let ventaTotal = 0;
                let premioTotal = 0;
                let subtotalVenta = 0;
                let subtotalPremio = 0;
    
                lineas.forEach((linea, index) => {
                    // Si se detecta un SMS (y no es la primera línea), mostrar el subtotal del bloque actual
                    if (/^sms\s*$/i.test(linea) && index !== 0) {
                        const subtotalHTML = `
                            <div class="jugada-container subtotal">
                                <div class="jugada-original">
                                    <strong>Subtotal: Venta ${subtotalVenta}, Premio ${subtotalPremio}</strong>
                                </div>
                            </div>
                        `;
                        resultadoHTML += subtotalHTML;
                        todasLasJugadas.push(subtotalHTML);
                        
                        // Reiniciar los subtotales sin afectar el total general
                        subtotalVenta = 0;
                        subtotalPremio = 0;
                    }
    
                    // Procesar la jugada
                    const analisis = analizarJugada(linea, index);
                    resultadoHTML += analisis.html;
                    todasLasJugadas.push(analisis.html);
    
                    // Sumar ventas y premios devueltos por analizarJugada
                    subtotalVenta += analisis.venta || 0;
                    subtotalPremio += analisis.premio || 0;
                    
                    // Acumular en el total general (solo una vez)
                    ventaTotal += analisis.venta || 0;
                    premioTotal += analisis.premio || 0;
                });
    
                // Mostrar el último subtotal si el mensaje no termina con "sms"
                if (subtotalVenta > 0 || subtotalPremio > 0) {
                    const subtotalHTML = `
                        <div class="jugada-container subtotal">
                            <div class="jugada-original">
                                <strong>Subtotal: Venta ${subtotalVenta}, Premio ${subtotalPremio}</strong>
                            </div>
                        </div>
                    `;
                    resultadoHTML += subtotalHTML;
                    todasLasJugadas.push(subtotalHTML);
                }
    
                // Mostrar el total final
                const totalHTML = `
                    <div class="jugada-container">
                        <div class="jugada-original">
                            <strong>Venta total: ${ventaTotal}, Premio total: ${premioTotal}</strong>
                        </div>
                    </div>
                `;
                resultadoHTML += totalHTML;
                todasLasJugadas.push(totalHTML);
    
                // Imprimir todo el contenido, incluyendo el input de filtro
                analisisContainer.innerHTML += resultadoHTML;
                btnMostrarAnalisis.parentNode.insertBefore(analisisContainer, btnMostrarAnalisis.nextSibling);
                analisisContainer.style.display = 'block';
            } else {
                analisisContainer.style.display = 'none';
            }
    
            analisisVisible = !analisisVisible;
            btnMostrarAnalisis.textContent = analisisVisible ? 'Ocultar Análisis' : 'Mostrar Análisis';
        } else {
            alert("Por favor ingrese un mensaje para analizar.");
        }
    });
    
    // Desplazar hacia la jugada correspondiente al hacer clic
    analisisContainer.addEventListener('click', function (event) {
        // Ignorar clics en el input de filtro
        if (event.target === filtroJugadas) return;

        if (event.target.closest('.jugada-container')) {
            const id = event.target.closest('.jugada-container').id;
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

function mostrarTooltip(elemento, tipo, index) {
    const tooltip = document.getElementById('tooltip-system');
    if (!tooltip) return;

    // Obtener datos según el tipo
    let data;
    if (tipo === 'vendedor') {
        const vendedor = vendedores[index];
        data = `
            <div class="tooltip-content">
                <p><strong>Precio de Venta:</strong> ${vendedor.precioVenta}</p>
                <p><strong>Porcentaje:</strong> ${vendedor.porcentaje}%</p>
                <p><strong>Fondo:</strong> ${vendedor.fondo.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                <p><strong>Jefes:</strong> ${vendedor.jefes.join(', ')}</p>
            </div>
        `;
    } else if (tipo === 'jefe') {
        const jefe = jefes[index];
        data = `
            <div class="tooltip-content">
                <p><strong>Precio de Venta:</strong> ${jefe.precioVenta}</p>
                <p><strong>Porcentaje:</strong> ${jefe.porcentaje}%</p>
            </div>
        `;
    }

    // Posicionar y mostrar tooltip
    const rect = elemento.getBoundingClientRect();
    tooltip.innerHTML = data;
    tooltip.style.display = 'block';

    // Calcular posición
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = rect.right + window.scrollX + 8;
    let top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2);

    // Ajustar si se sale de la pantalla
    if (left + tooltipRect.width > window.innerWidth) {
        left = rect.left - tooltipRect.width - 8;
        tooltip.classList.add('left');
        tooltip.classList.remove('right');
    } else {
        tooltip.classList.add('right');
        tooltip.classList.remove('left');
    }

    // Ajustar posición vertical
    if (top + tooltipRect.height > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height - 8;
    }
    if (top < 0) {
        top = 8;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

function ocultarTooltip() {
    const tooltip = document.getElementById('tooltip-system');
    if (tooltip) {
        tooltip.style.display = 'none';
        tooltip.innerHTML = '';
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
// Agregar después de la función mostrarMensaje()
function resaltarMensaje(mensaje) {
    const textarea = document.getElementById('mensajeVenta');
    const texto = textarea.value;
    const indice = texto.indexOf(mensaje);

    if (indice !== -1) {
        // Hacer scroll al textarea principal
        textarea.focus();

        // Seleccionar el texto específico
        textarea.setSelectionRange(indice, indice + mensaje.length);

        // Asegurar que el texto seleccionado es visible
        const lineHeight = 20; // altura aproximada de línea
        const lineas = texto.substr(0, indice).split('\n').length;
        textarea.scrollTop = (lineas - 1) * lineHeight;
    }
}

function guardarMensajesNoProcesados() {
    const mensajesCorregidos = document.getElementById('mensajesNoProcesadosTextarea').value.trim().split('\n');

    // Limpiar los mensajes corregidos de la lista de inválidos
    mensajesInvalidos = mensajesInvalidos.filter(mensaje => !mensajesCorregidos.includes(mensaje));

    // Actualizar la visualización
    const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
    if (mensajesInvalidos.length > 0) {
        const mensajesFormateados = mensajesInvalidos.map(linea => {
            const numeros = linea.split(/[\s\-\/\*\+,;:._¨\^=]+/).slice(0, -1)
                .map(n => parseInt(n))
                .filter(n => !isNaN(n));

            const numerosMayores = numeros.filter(n => n > 100);

            if (numerosMayores.length > 0) {
                let mensajeError = `${linea}\n`;
                mensajeError += `⚠️ Números mayores a 100 encontrados: `;
                mensajeError += numerosMayores.map(num =>
                    `${num} (posición ${numeros.indexOf(num) + 1})`
                ).join(', ');
                return mensajeError;
            }
            return linea;
        });

        mensajesNoProcesadosSection.style.display = 'block';
        document.getElementById('mensajesNoProcesadosTextarea').value = mensajesFormateados.join('\n\n'); // Agregar línea extra entre mensajes

        // Actualizar mensajes interactivos
        const mensajesInteractivosExistente = mensajesNoProcesadosSection.querySelector('.mensajes-interactivos');
        if (mensajesInteractivosExistente) {
            mensajesInteractivosExistente.remove();
        }
        const mensajesInteractivos = crearMensajesInteractivos(mensajesFormateados);
        mensajesNoProcesadosSection.appendChild(mensajesInteractivos);
    } else {
        mensajesNoProcesadosSection.style.display = 'none';
        document.getElementById('mensajesNoProcesadosTextarea').value = '';
    }
}

// También agregar esta función de limpieza
function limpiarMensajesInvalidos() {
    mensajesInvalidos = [];
    const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
    mensajesNoProcesadosSection.style.display = 'none';
    document.getElementById('mensajesNoProcesadosTextarea').value = '';

    const mensajesInteractivosExistente = mensajesNoProcesadosSection.querySelector('.mensajes-interactivos');
    if (mensajesInteractivosExistente) {
        mensajesInteractivosExistente.remove();
    }
}

// También agregar esta función de limpieza
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

function updateVendedorInfo() {
    // Esta línea permanece igual porque crearSelectConFiltro() mantiene el mismo ID
    const vendedorIndex = document.getElementById('vendedorSelect').value;
    
    // Validaciones sin cambios
    if (vendedorIndex === null || vendedorIndex === undefined) return;
    
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) return;
    
    // Estas líneas permanecen sin cambios
    document.getElementById('precioVenta').value = vendedor.precioVenta;
    document.getElementById('porcentaje').value = vendedor.porcentaje;
    document.getElementById('fondo').value = vendedor.fondo;
}

function crearSelectConFiltro() {
    // Obtener o crear el contenedor para el nuevo selector con filtro
    let container = document.getElementById('vendedorSelectContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'vendedorSelectContainer';
      // Reemplazar el select original con este contenedor
      const originalSelect = document.getElementById('vendedorSelect');
      if (originalSelect && originalSelect.parentNode) {
        originalSelect.parentNode.replaceChild(container, originalSelect);
      }
    }
    
    // Estilos para el contenedor
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.maxWidth = '300px';
    
    // Crear el campo de búsqueda
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar vendedor...';
    searchInput.className = 'vendedor-search';
    searchInput.style.width = '100%';
    searchInput.style.padding = '8px';
    searchInput.style.marginBottom = '5px';
    searchInput.style.boxSizing = 'border-box';
    
    // Crear el contenedor de los resultados
    const dropdown = document.createElement('div');
    dropdown.className = 'vendedor-dropdown';
    dropdown.style.display = 'none';
    dropdown.style.position = 'absolute';
    dropdown.style.width = '100%';
    dropdown.style.maxHeight = '200px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.border = '1px solid #ddd';
    dropdown.style.backgroundColor = '#fff';
    dropdown.style.zIndex = '1000';
    dropdown.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    
    // Crear el input oculto que mantendrá el valor seleccionado
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = 'vendedorSelect';
    
    // Añadir elementos al contenedor
    container.appendChild(searchInput);
    container.appendChild(dropdown);
    container.appendChild(hiddenInput);
    
    // Variable para seguir el elemento seleccionado con las flechas
    let selectedIndex = -1;
    
    // Función para actualizar el resaltado de elementos
    function updateHighlight(items) {
      // Primero, quitar el resaltado de todos los elementos
      items.forEach((item) => {
        item.style.backgroundColor = '';
        item.style.color = '';
      });
      
      // Resaltar el elemento seleccionado
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        items[selectedIndex].style.backgroundColor = '#007bff';
        items[selectedIndex].style.color = '#fff';
        
        // Hacer scroll si es necesario
        const activeItem = items[selectedIndex];
        if (activeItem) {
          const dropdownRect = dropdown.getBoundingClientRect();
          const activeItemRect = activeItem.getBoundingClientRect();
          
          // Si el elemento está fuera de la vista visible del dropdown
          if (activeItemRect.bottom > dropdownRect.bottom) {
            dropdown.scrollTop += (activeItemRect.bottom - dropdownRect.bottom);
          } else if (activeItemRect.top < dropdownRect.top) {
            dropdown.scrollTop -= (dropdownRect.top - activeItemRect.top);
          }
        }
      }
    }
    
    // Función para poblar los resultados
    function populateResults(filter = '') {
      dropdown.innerHTML = '';
      dropdown.style.display = 'block';
      
      // Resetear el índice seleccionado
      selectedIndex = -1;
      
      const filterLower = filter.toLowerCase();
      
      // Filtrar vendedores que coincidan con el texto de búsqueda
      Object.keys(vendedores).forEach(id => {
        const vendedor = vendedores[id];
        // Asumiendo que el vendedor tiene un nombre
        const nombre = vendedor.nombre || `Vendedor ${id}`;
        
        if (nombre.toLowerCase().includes(filterLower)) {
          const item = document.createElement('div');
          item.className = 'vendedor-item';
          item.textContent = nombre;
          item.dataset.id = id;
          item.style.padding = '8px';
          item.style.cursor = 'pointer';
          
          // Resaltar el texto de búsqueda
          if (filter) {
            const regex = new RegExp(`(${filter})`, 'gi');
            item.innerHTML = nombre.replace(regex, '<strong>$1</strong>');
          }
          
          // Agregar efectos hover
          item.addEventListener('mouseover', () => {
            if (selectedIndex === -1 || item !== dropdown.children[selectedIndex]) {
              item.style.backgroundColor = '#f0f0f0';
            }
          });
          
          item.addEventListener('mouseout', () => {
            if (selectedIndex === -1 || item !== dropdown.children[selectedIndex]) {
              item.style.backgroundColor = '';
            }
          });
          
          // Manejar la selección de un vendedor
          item.addEventListener('click', () => {
            searchInput.value = nombre;
            hiddenInput.value = id;
            dropdown.style.display = 'none';
            
            // Actualizar la información del vendedor seleccionado
            updateVendedorInfo();
            
            // Disparar un evento para notificar del cambio
            const changeEvent = new Event('change');
            hiddenInput.dispatchEvent(changeEvent);
          });
          
          dropdown.appendChild(item);
        }
      });
      
      // Si no hay resultados, mostrar un mensaje
      if (dropdown.children.length === 0) {
        const noResults = document.createElement('div');
        noResults.textContent = 'No se encontraron vendedores';
        noResults.style.padding = '8px';
        noResults.style.fontStyle = 'italic';
        noResults.style.color = '#666';
        dropdown.appendChild(noResults);
      }
    }
    
    // Manejo de eventos de teclado para navegación
    searchInput.addEventListener('keydown', function(e) {
      // Si el dropdown no está visible, mostrarlo al presionar flecha abajo
      if (dropdown.style.display === 'none') {
        if (e.key === 'ArrowDown') {
          populateResults(searchInput.value);
          e.preventDefault();
        }
        return;
      }
      
      const items = dropdown.querySelectorAll('.vendedor-item');
      if (items.length === 0) return;
      
      // Navegación con flechas
      if (e.key === 'ArrowDown') {
        selectedIndex = (selectedIndex + 1) % items.length;
        updateHighlight(items);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateHighlight(items);
        e.preventDefault();
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        // Seleccionar el elemento actual al presionar Enter
        e.preventDefault();
        items[selectedIndex].click();
      } else if (e.key === 'Escape') {
        // Cerrar el dropdown al presionar Escape
        dropdown.style.display = 'none';
        e.preventDefault();
      }
    });
    
    // Evento para detectar cambios en el campo de búsqueda
    searchInput.addEventListener('input', () => {
      populateResults(searchInput.value);
    });
    
    // Mostrar todos los vendedores al enfocar el campo
    searchInput.addEventListener('focus', () => {
      populateResults(searchInput.value);
    });
    
    // Ocultar el dropdown cuando se hace clic fuera
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
    
    // Inicializar con todos los vendedores
    populateResults();
    
    // Si hay un vendedor seleccionado por defecto, mostrarlo
    if (hiddenInput.value) {
      const vendedorId = hiddenInput.value;
      const vendedor = vendedores[vendedorId];
      if (vendedor && vendedor.nombre) {
        searchInput.value = vendedor.nombre;
      }
    }
    
    return hiddenInput; // Devolvemos el elemento que contiene el valor seleccionado
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Crear el selector con filtro
    crearSelectConFiltro();
    
    // El resto de tu código de inicialización...
    const mensajesNoProcesadosSection = document.getElementById('mensajesNoProcesadosSection');
    if (mensajesNoProcesadosSection) {
        mensajesNoProcesadosSection.style.display = 'none';
    }
    agregarEstilosMensajes();
  });
  
function limpiarSistemaCompleto(confirmar = true) {
    if (confirmar) {
        const mensaje = 
            "⚠️ ADVERTENCIA ⚠️\n\n" +
            "Esta acción eliminará TODOS los datos del sistema:\n" +
            "- Todos los vendedores\n" +
            "- Todos los jefes\n" +
            "- Todas las ventas\n" +
            "- Todo el historial\n\n" +
            "Esta acción NO SE PUEDE DESHACER.\n\n" +
            "¿Está COMPLETAMENTE SEGURO de que desea continuar?";
        
        if (!confirm(mensaje)) {
            mostrarMensaje('Operación cancelada por el usuario', 'info');
            return false;
        }
        
        // Segunda confirmación para estar seguros
        if (!confirm("Esta es su última oportunidad para cancelar.\n¿Realmente desea eliminar TODOS los datos del sistema?")) {
            mostrarMensaje('Operación cancelada por el usuario', 'info');
            return false;
        }
    }
    
    try {
        // 1. Limpiar arrays en memoria
        vendedores = [];
        jefes = [];
        
        if (window.historialDatos) {
            window.historialDatos = {
                fechas: {},
                ultimaActualizacion: null
            };
        }
        
        // 2. Limpiar localStorage completamente
        localStorage.clear();
        
        // 3. Reinicializar datos básicos
        localStorage.setItem('vendedores', JSON.stringify([]));
        localStorage.setItem('jefes', JSON.stringify([]));
        localStorage.setItem('historialLoteria', JSON.stringify({
            fechas: {},
            ultimaActualizacion: null
        }));
        
        // 4. Actualizar UI
        actualizarListaVendedores();
        actualizarListaJefes();
        actualizarSelectVendedores();
        actualizarSelectJefes();
        
        mostrarMensaje('Sistema limpiado completamente. Todos los datos han sido eliminados.', 'success');
        return true;
    } catch (error) {
        console.error('Error al limpiar el sistema:', error);
        mostrarMensaje('Error al limpiar el sistema: ' + error.message, 'error');
        return false;
    }
}

// 3. Función para configurar el autoguardado
function configurarAutoguardado() {
    // Guardar datos cuando se agregue un vendedor
    const btnAgregarVendedor = document.querySelector('button[onclick="agregarVendedor()"]');
    if (btnAgregarVendedor) {
        const originalAgregarVendedor = window.agregarVendedor;
        window.agregarVendedor = function () {
            originalAgregarVendedor();
            guardarDatos();
        };
    }

    // Guardar datos cuando se agregue un jefe
    const btnAgregarJefe = document.querySelector('button[onclick="agregarJefe()"]');
    if (btnAgregarJefe) {
        const originalAgregarJefe = window.agregarJefe;
        window.agregarJefe = function () {
            originalAgregarJefe();
            guardarDatos();
        };
    }

    // Guardar datos cuando se elimine un vendedor o jefe
    const originalEliminarVendedor = window.eliminarVendedor;
    window.eliminarVendedor = function (index) {
        originalEliminarVendedor(index);
        guardarDatos();
    };

    const originalEliminarJefe = window.eliminarJefe;
    window.eliminarJefe = function (index) {
        originalEliminarJefe(index);
        guardarDatos();
    };
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

// Configurar el backup automático
document.addEventListener('DOMContentLoaded', function() {
  // Configurar el backup automático después de que CONFIG esté disponible
  setInterval(() => {
    if (typeof guardarDatos === 'function') {
      guardarDatos();
    }
  }, window.CONFIG.BACKUP_INTERVAL || 60000);
});

// Configurar los event listeners para las pestañas
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.nav-button');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        const tabName = this.getAttribute('data-tab');
        if (typeof window.openTab === 'function') {
          window.openTab(event, tabName);
        } else {
          console.error('La función openTab no está definida');
        }
      });
    });
  });

// Código potencialmente problemático en 8-ui.js
document.addEventListener('DOMContentLoaded', function() {
    const activeTab = localStorage.getItem('activeTab');
    // Si activeTab es null, causará el error
    if (activeTab) {
        // Encuentra el botón correcto para simular un clic
        const tabButton = document.querySelector(`.nav-button[onclick*="${activeTab}"]`);
        if (tabButton) {
            tabButton.click();
        } else {
            // Si no encuentra el botón, abre una pestaña predeterminada
            openTab(null, 'Bienvenida'); // ← Problema cuando se pasa 'null' como primer parámetro
        }
    } else {
        // Abre la pestaña predeterminada
        document.querySelector('.nav-button').click();
    }
});

// Agregar soporte específico para dispositivos móviles
document.addEventListener('DOMContentLoaded', function() {
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
            e.preventDefault(); // Prevenir comportamiento táctil por defecto
            reprocesarPatrones();
        });
    }
});

// Boton Movil
// Asegurar que el botón responda en dispositivos móviles
document.addEventListener('DOMContentLoaded', function() {
    const btnMovil = document.querySelector('button.movil');
    if (btnMovil) {
        // Eliminar onclick existente para evitar duplicación
        btnMovil.removeAttribute('onclick');
        
        // Añadir eventos para click y touch
        btnMovil.addEventListener('click', function(e) {
            movil();
        });
        
        btnMovil.addEventListener('touchend', function(e) {
            e.preventDefault();
            movil();
        });
    }
});

// Modificar la función formatearJugadas para aceptar el color
function formatearJugadas(tipo, linea, jugadas, totalVenta, premioTotal, index, color) {
    let premio = premioTotal > 0 ? `<strong style="color: red">Premio: ${premioTotal}</strong>`: "";
    return `
        <div class="jugada-container" id="jugada-${index}">
            <div class="jugada-original">
                <span class="jugada-texto" style="color: ${color}">${linea} =></span>
                <span class="jugada-resultados" style="color: ${color}">${
                    Object.keys(jugadas).map((jugada) => ` ${jugada} con ${jugadas[jugada]}`)
                }</span>
            </div>
            <div class="jugada-tipo" style="color: ${color}">${tipo}</div>
            <div class="jugada-detalles">
                <div class="venta-total">Venta: ${totalVenta} ${premio}</div>
            </div>
        </div>
    `;
}

// Exportar funciones para acceso global
window.inicializarAplicacion = inicializarAplicacion;
window.mostrarTooltip = mostrarTooltip;
window.ocultarTooltip = ocultarTooltip;
window.crearMensajesInteractivos = crearMensajesInteractivos;
window.resaltarMensaje = resaltarMensaje;
window.guardarMensajesNoProcesados = guardarMensajesNoProcesados;
window.limpiarMensajesInvalidos = limpiarMensajesInvalidos;
window.updateVendedorInfo = updateVendedorInfo;
window.crearSelectConFiltro = crearSelectConFiltro;
window.limpiarSistemaCompleto = limpiarSistemaCompleto;
window.configurarAutoguardado = configurarAutoguardado;
window.formatearJugadas = formatearJugadas;