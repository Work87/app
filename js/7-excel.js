/**
 * 7-excel.js - Calculadora tipo Excel
 * Este archivo contiene la implementación de la calculadora tipo Excel
 * para procesar y registrar ventas.
 */

/**
 * Función para abrir la calculadora
 * Point of entry principal
 */
function abrirCalculadora() {
    const calculadora = new Calculadora();
    calculadora.init();
}
// Agregar estilos para la ganancia/pérdida
const style = document.createElement('style');
style.textContent = `
    .calc-ganancia-perdida {
        padding: 5px 10px;
        font-size: 16px;
        margin-top: 10px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    .dark-mode .calc-ganancia-perdida {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

/**
 * Clase para manejar las funcionalidades de la calculadora
 */
class Calculadora {
    constructor() {
        this.modal = null;
        this.excelRows = null;
        this.totalSpan = null;
        this.premioTotalSpan = null;
        this.premioCountSpan = null;
        this.addRowBtn = null;
        this.messageDiv = null;
        this.activeRow = null;
        this.escapeHandler = null;
    }

    /**
     * Inicializa la calculadora
     */
    init() {
        this.modal = document.getElementById('calculadora-template');
        this.renderModal();
        this.setupEventListeners();
        this.actualizarInfoVendedor();
        this.agregarPrimeraFila();
        this.setupEscapeHandler();
        this.setupTouchSupport();
        this.agregarEstilosFormula();
    }
    
    /**
     * Configura soporte mejorado para dispositivos táctiles
     */
    setupTouchSupport() {
        // Asegurarse de que los botones sean lo suficientemente grandes para táctil
        const addRowBtn = document.getElementById('calc-addRowBtn');
        const closeBtn = document.getElementById('calc-close-btn');
        
        if (addRowBtn) {
            addRowBtn.style.minHeight = '44px'; // Tamaño mínimo recomendado para táctil
            addRowBtn.style.fontSize = '16px';   // Texto legible
        }
        
        if (closeBtn) {
            closeBtn.style.minHeight = '44px';
            closeBtn.style.fontSize = '16px';
        }
        
        // Agregar botón flotante para dispositivos móviles que siempre permita agregar filas
        const mobileContainer = document.querySelector('.calc-main-container');
        if (mobileContainer && window.innerWidth <= 768) {
            const floatingBtn = document.createElement('button');
            floatingBtn.id = 'calc-floating-add';
            floatingBtn.innerHTML = '+';
            floatingBtn.style.position = 'fixed';
            floatingBtn.style.bottom = '80px';
            floatingBtn.style.right = '20px';
            floatingBtn.style.width = '50px';
            floatingBtn.style.height = '50px';
            floatingBtn.style.borderRadius = '50%';
            floatingBtn.style.backgroundColor = '#4CAF50';
            floatingBtn.style.color = 'white';
            floatingBtn.style.fontSize = '24px';
            floatingBtn.style.border = 'none';
            floatingBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            floatingBtn.style.zIndex = '1000';
            floatingBtn.style.display = 'flex';
            floatingBtn.style.justifyContent = 'center';
            floatingBtn.style.alignItems = 'center';
            
            floatingBtn.addEventListener('click', () => {
                this.agregarNuevaFila();
            });
            
            mobileContainer.appendChild(floatingBtn);
        }
    }
    
    /**
     * Renderiza el contenido del modal
     */
    renderModal() {
        const calculadoraHTML = `
            <div class="calculadora-content">
                <h3>Calculadora de Números</h3>
                
                <div id="calc-info-vendedor" class="calc-info-vendedor">
                    <span id="calc-vendedor-nombre">-- Seleccione un vendedor --</span>
                    <span id="calc-numero-ganador">Número Ganador: </span>
                </div>
                
                <div id="calc-message" class="calc-message"></div>
                
                <!-- Contenedor principal con desplazamiento controlado -->
                <div class="calc-main-container">
                    <!-- Sección de tabla con desplazamiento -->
                    <div class="calc-scroll-container">
                        <div class="calc-excel-container">
                            <div class="calc-excel-header">
                                <div class="calc-excel-cell">Valor</div>
                                <div class="calc-excel-cell calc-premio">Premio</div>
                            </div>
                            <div id="calc-excelRows">
                                <!-- Las filas se agregarán aquí dinámicamente -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sección fija inferior -->
                    <div class="calc-fixed-footer">
                        <div class="calc-excel-footer">
                            <div class="calc-excel-cell">Total: <span id="calc-total">0</span></div>
                            <div class="calc-excel-cell calc-premio">
                                Premio Total: <span id="calc-premioTotal">0</span>
                                (Cantidad: <span id="calc-premioCount">0</span>)
                            </div>
                        </div>
                        
                        <div class="calc-actions">
                            <button id="calc-addRowBtn" class="calc-primary-btn">Transferir Venta</button>
                            <button id="calc-close-btn" class="calc-secondary-btn">Cerrar Calculadora</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.modal.innerHTML = calculadoraHTML;
        this.modal.style.display = 'flex';
        
        // Obtener referencias a elementos DOM
        this.excelRows = document.getElementById('calc-excelRows');
        this.totalSpan = document.getElementById('calc-total');
        this.premioTotalSpan = document.getElementById('calc-premioTotal');
        this.premioCountSpan = document.getElementById('calc-premioCount');
        this.addRowBtn = document.getElementById('calc-addRowBtn');
        this.messageDiv = document.getElementById('calc-message');
        this.closeBtn = document.getElementById('calc-close-btn');
    }

    /**
     * Configura los event listeners principales
     */
    setupEventListeners() {
        // Event listener para el botón de cerrar
        this.closeBtn.addEventListener('click', () => this.cerrar());
        
        // Event listener para el botón de agregar fila (transferir venta)
        this.addRowBtn.addEventListener('click', () => this.transferirVenta());
        
        // Event listener para teclas Delete/Backspace
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    /**
     * Configura el manejador de la tecla Escape
     */
    setupEscapeHandler() {
        // Eliminar cualquier handler de Escape existente
        if (window.escapeHandler) {
            document.removeEventListener('keydown', window.escapeHandler);
        }
        
        // Crear nuevo handler para Escape
        window.escapeHandler = (event) => {
            if (event.key === 'Escape') {
                this.cerrar();
            }
        };
        
        // Agregar nuevo event listener
        document.addEventListener('keydown', window.escapeHandler);
    }

    /**
     * Actualiza la información del vendedor y número ganador
     */
    actualizarInfoVendedor() {
        const vendedorSelect = document.getElementById('vendedorSelect');
        const searchInput = document.querySelector('#vendedorSelectContainer input.vendedor-search');
        const numeroGanadorInput = document.getElementById('numeroGanador');
        const calcVendedorNombre = document.getElementById('calc-vendedor-nombre');
        const calcNumeroGanador = document.getElementById('calc-numero-ganador');
        
        if (calcVendedorNombre && calcNumeroGanador) {
            let vendedorText = '-- Seleccione un vendedor --';
            
            // Obtener nombre del vendedor del nuevo selector con filtro
            if (vendedorSelect && vendedorSelect.value) {
                const vendedorId = vendedorSelect.value;
                if (window.vendedores && window.vendedores[vendedorId]) {
                    vendedorText = window.vendedores[vendedorId].nombre;
                } else if (searchInput && searchInput.value) {
                    vendedorText = searchInput.value;
                }
            }
            
            calcVendedorNombre.textContent = vendedorText;
            
            const numeroGanador = numeroGanadorInput ? numeroGanadorInput.value : '';
            calcNumeroGanador.textContent = `Número Ganador: ${numeroAEmoji ? numeroAEmoji(numeroGanador) : numeroGanador}`;
        }
    }

    /**
     * Agrega la primera fila al inicializar
     */
    agregarPrimeraFila() {
        this.agregarNuevaFila();
    }

    /**
     * Maneja eventos de teclado
     * @param {KeyboardEvent} event - Evento de teclado
     */
    handleKeyDown(event) {
        // Manejar teclas Delete/Backspace para eliminar filas
        if ((event.key === 'Delete' || event.key === 'Backspace') && this.activeRow) {
            this.intentarEliminarFila();
        }
    }

    /**
     * Intenta eliminar la fila activa si está vacía
     */
    intentarEliminarFila() {
        // Solo borrar si la fila está vacía
        const valorInput = this.activeRow.querySelector('.calc-excel-input.valor-input');
        const premioInput = this.activeRow.querySelector('.calc-excel-input.premio-input');
        
        if (!valorInput.value && !premioInput.value) {
            // No borrar si solo hay una fila
            const allRows = document.querySelectorAll('.calc-excel-row');
            if (allRows.length > 1) {
                // Determinar qué fila enfocar después de borrar
                const nextRow = this.activeRow.nextElementSibling;
                const prevRow = this.activeRow.previousElementSibling;
                
                // Eliminar la fila activa
                this.activeRow.remove();
                
                // Enfocar la siguiente fila o la anterior si no hay siguiente
                if (nextRow && nextRow.classList.contains('calc-excel-row')) {
                    nextRow.querySelector('.valor-input').focus();
                    this.setActiveRow(nextRow);
                } else if (prevRow && prevRow.classList.contains('calc-excel-row')) {
                    prevRow.querySelector('.valor-input').focus();
                    this.setActiveRow(prevRow);
                }
                
                this.calcularTotal();
                this.mostrarMensaje(CONFIG.MENSAJES.FILA_ELIMINADA);
            } else {
                this.mostrarMensaje(CONFIG.MENSAJES.NO_ELIMINAR_UNICA);
            }
        } else {
            this.mostrarMensaje(CONFIG.MENSAJES.FILA_NO_VACIA);
        }
    }

    /**
     * Establece la fila activa
     * @param {HTMLElement} row - Elemento DOM de la fila
     */
    setActiveRow(row) {
        // Quitar clase active-row de todas las filas
        document.querySelectorAll('.calc-excel-row').forEach(r => {
            r.classList.remove('calc-active-row');
        });
        
        // Agregar clase active-row a la fila actual
        row.classList.add('calc-active-row');
        
        // Actualizar referencia a la fila activa
        this.activeRow = row;
    }

    /**
     * Agrega una nueva fila a la calculadora
     * @returns {HTMLElement} - El elemento DOM de la nueva fila
     */
    // Modifica el método agregarNuevaFila para cambiar el tipo de input a "text"
    agregarNuevaFila() {
        const newRow = document.createElement('div');
        newRow.className = 'calc-excel-row';
        newRow.innerHTML = `
        <div class="calc-excel-cell">
            <input type="text" class="calc-excel-input valor-input" placeholder="Ingresa un número...">
        </div>
        <div class="calc-excel-cell calc-premio">
            <input type="text" class="calc-excel-input premio-input calc-premio-input" placeholder="Premio...">
        </div>
    `;
    this.excelRows.appendChild(newRow);
    
    // Obtener los inputs de la nueva fila
    const valorInput = newRow.querySelector('.valor-input');
    const premioInput = newRow.querySelector('.premio-input');
    
    // Configurar event listeners para la fila
    this.setupRowEventListeners(newRow, valorInput, premioInput);
    
    // Enfocar automáticamente el input de valor
    valorInput.focus();
    this.setActiveRow(newRow);
    
    // Desplazar la vista para asegurar que la nueva fila sea visible
    setTimeout(() => {
        const scrollContainer = document.querySelector('.calc-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }, 100);
    
    return newRow;
}

    /**
     * Maneja eventos de teclado en el input de valor
     * @param {KeyboardEvent} event - Evento de teclado
     * @param {HTMLElement} row - Elemento DOM de la fila actual
     */
    handleValorInputKeyDown(event, row) {
        if (event.key === 'Enter') {
            event.preventDefault();
            // Crear nueva fila y enfocar su valor-input
            const newRowElement = this.agregarNuevaFila();
            newRowElement.querySelector('.valor-input').focus();
            this.calcularTotal();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            // Navegar a la fila anterior
            const prevRow = row.previousElementSibling;
            if (prevRow && prevRow.classList.contains('calc-excel-row')) {
                prevRow.querySelector('.valor-input').focus();
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            // Navegar a la fila siguiente
            const nextRow = row.nextElementSibling;
            if (nextRow) {
                nextRow.querySelector('.valor-input').focus();
            }
        } else if (event.key === 'Tab' && !event.shiftKey) {
            // Permitir la navegación natural con Tab hacia el campo de premio
        }
    }

    /**
     * Maneja eventos de teclado en el input de premio
     * @param {KeyboardEvent} event - Evento de teclado
     * @param {HTMLElement} row - Elemento DOM de la fila actual
     */
    handlePremioInputKeyDown(event, row) {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevRow = row.previousElementSibling;
            if (prevRow && prevRow.classList.contains('calc-excel-row')) {
                prevRow.querySelector('.premio-input').focus();
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextRow = row.nextElementSibling;
            if (nextRow) {
                nextRow.querySelector('.premio-input').focus();
            }
        } else if (event.key === 'Enter') {
            event.preventDefault();
            // Crear nueva fila y enfocar su valor-input (comportamiento consistente)
            const newRowElement = this.agregarNuevaFila();
            newRowElement.querySelector('.valor-input').focus();
            this.calcularTotal();
        }
    }

    // Agrega esta función dentro de la clase Calculadora

/**
 * Procesa el texto ingresado para determinar si es una fórmula
 * @param {HTMLInputElement} input - El input donde se está escribiendo
 * @param {Event} event - El evento de input
 */
procesarFormula(input, event) {
    // Obtener el valor actual
    const valor = input.value;
    
    // Comprobar si comienza con "="
    if (valor.startsWith('=')) {
        input.classList.add('calc-formula-mode');
        
        // Si es un evento keydown y la tecla es Enter
        if (event && event.key === 'Enter') {
            event.preventDefault(); // Detener el comportamiento predeterminado
            
            try {
                // Extraer la fórmula sin el "="
                const formula = valor.substring(1);
                console.log("Evaluando fórmula:", formula);
                
                // Evaluar la fórmula
                const resultado = this.evaluarFormula(formula);
                console.log("Resultado obtenido:", resultado);
                
                // Actualizar el valor del input
                input.value = resultado;
                input.classList.remove('calc-formula-mode');
                
                // Actualizar totales
                this.calcularTotal();
                
                // Si estamos en el input de valor, crear nueva fila
                if (input.classList.contains('valor-input')) {
                    // Crear nueva fila y enfocar su primer input
                    const newRowElement = this.agregarNuevaFila();
                    newRowElement.querySelector('.valor-input').focus();
                } else {
                    // Si estamos en el premio, ir a la siguiente fila
                    const newRowElement = this.agregarNuevaFila();
                    newRowElement.querySelector('.valor-input').focus();
                }
                
                return true; // Indicar que procesamos la fórmula
            } catch (error) {
                console.error('Error al evaluar fórmula:', error);
                this.mostrarMensaje(`Error en fórmula: ${error.message}`, 3000);
                return false;
            }
        }
    } else {
        input.classList.remove('calc-formula-mode');
    }
    
    return false; // No se procesó ninguna fórmula
}

/**
 * Evalúa una fórmula matemática de forma segura
 * @param {string} formula - La fórmula a evaluar
 * @returns {number} - El resultado de la evaluación
 */
evaluarFormula(formula) {
    // Esta es una implementación BÁSICA y limitada
    // En un entorno de producción, usar una biblioteca como math.js
    
    // Reemplazar operadores de Excel con sus equivalentes en JavaScript
    formula = formula.replace(/\^/g, '**'); // Exponente
    
    // Lista blanca de caracteres permitidos (números, operadores básicos)
    if (!/^[0-9+\-*/().%\s]*$/.test(formula)) {
        throw new Error('La fórmula contiene caracteres no permitidos');
    }
    
    // Evaluar la expresión
    try {
        // ADVERTENCIA: eval() puede ser peligroso si no se sanitiza la entrada
        // Esta implementación es solo para demostración
        const resultado = Function('"use strict"; return (' + formula + ')')();
        
        // Verificar que el resultado sea un número
        if (typeof resultado !== 'number' || isNaN(resultado)) {
            throw new Error('El resultado no es un número válido');
        }
        
        return resultado;
    } catch (error) {
        throw new Error('Fórmula inválida');
    }
}

// Modifica setupRowEventListeners para incluir el procesamiento de fórmulas
setupRowEventListeners(row, valorInput, premioInput) {
    // Marcar fila como activa
    row.addEventListener('click', () => this.setActiveRow(row));
    valorInput.addEventListener('focus', () => this.setActiveRow(row));
    premioInput.addEventListener('focus', () => this.setActiveRow(row));
    
    // Event listeners para cambios en los valores
    valorInput.addEventListener('input', () => {
        // Comprobar si está en modo fórmula
        this.procesarFormula(valorInput, null);
        this.calcularTotal();
    });
    
    premioInput.addEventListener('input', () => {
        // Comprobar si está en modo fórmula
        this.procesarFormula(premioInput, null);
        this.calcularTotal();
    });
    
    // Manejar eventos de teclado en los inputs
    valorInput.addEventListener('keydown', (event) => {
        // Intentar procesar como fórmula primero
        if (valorInput.value.startsWith('=') && event.key === 'Enter') {
            if (this.procesarFormula(valorInput, event)) {
                return; // Si se procesa como fórmula, no hacer nada más
            }
        }
        
        // Si no es una fórmula o no se procesó, manejar como normal
        this.handleValorInputKeyDown(event, row);
    });
    
    premioInput.addEventListener('keydown', (event) => {
        // Intentar procesar como fórmula primero
        if (premioInput.value.startsWith('=') && event.key === 'Enter') {
            if (this.procesarFormula(premioInput, event)) {
                return; // Si se procesa como fórmula, no hacer nada más
            }
        }
        
        // Si no es una fórmula o no se procesó, manejar como normal
        this.handlePremioInputKeyDown(event, row);
    });
}

// Agregar estilos CSS para el modo fórmula
// Añade esto al final de renderModal() o en la inicialización
agregarEstilosFormula() {
    const estiloFormula = document.createElement('style');
    estiloFormula.textContent = `
        .calc-formula-mode {
            background-color: #e6f7ff !important;
            color: #0066cc !important;
            font-family: monospace !important;
        }
        
        .dark-mode .calc-formula-mode {
            background-color: #001529 !important;
            color: #1890ff !important;
        }
    `;
    document.head.appendChild(estiloFormula);
}

    /**
    * Transfiere la venta al registro
    */
    transferirVenta() {
    // Validar campos necesarios
        if (!this.validarCampos()) return;
    
        // Obtener datos para la venta
        const totalVenta = parseFloat(this.totalSpan.textContent);
        const totalPremio = parseFloat(this.premioTotalSpan.textContent);
        const cantidadPremios = parseInt(this.premioCountSpan.textContent);
        
        const vendedorSelect = document.getElementById('vendedorSelect');
        const horarioSelect = document.getElementById('horarioSelect');
        const numeroGanadorInput = document.getElementById('numeroGanador');
        const fechaVentaInput = document.getElementById('fechaVenta');
    
        // Obtener vendedor seleccionado
        const vendedorId = vendedorSelect.value;
        const vendedor = window.vendedores ? window.vendedores[vendedorId] : null;
    
    if (!vendedor) {
        this.mostrarMensajeExterno("Debe seleccionar un vendedor", 'error');
        return;
    }
    
    // Obtener horario y número ganador
    const horario = horarioSelect.value;
    
    // SOLUCIÓN: Manejar adecuadamente el número ganador
    let numeroGanador = null; // Inicializar como null por defecto
    if (numeroGanadorInput.value.trim() !== '') {
        // Solo hacer parseInt si el campo no está vacío
        const parsedNum = parseInt(numeroGanadorInput.value);
        // Verificar que sea un número válido y no NaN
        if (!isNaN(parsedNum)) {
            numeroGanador = parsedNum;
        }
    }
    
    // Log para depuración
    console.log("Número ganador procesado:", numeroGanador, "tipo:", typeof numeroGanador);
    
    // Obtener fecha formateada
    const fechaActual = window.obtenerFechaFormateada ? window.obtenerFechaFormateada() : new Date().toISOString();
    const fechaVenta = fechaVentaInput?.value || fechaActual;
    const fechaFormateada = window.obtenerFechaFormateada ? window.obtenerFechaFormateada(fechaVenta) : fechaVenta;
    
    console.log("Excel: Registrando venta con:", {
        fecha: fechaFormateada,
        horario,
        totalVenta,
        premio: totalPremio,
        numeroGanador
    });
    
    // USAR EL MISMO MÉTODO QUE EL BOTÓN AGREGAR
    // En lugar de crear manualmente el objeto de venta, usar procesarVentaDirecta
    if (window.procesarVentaDirecta) {
        try {
            // Crear un mensaje de tipo TOTAL: que procesarVentaDirecta pueda entender
            const mensajeVenta = `TOTAL: ${totalVenta}`;
            
            // CAMBIO AQUÍ: Pasar el número ganador como quinto parámetro
            window.procesarVentaDirecta(
                vendedor,
                mensajeVenta,
                horario,
                fechaVenta,
                numeroGanador,
                totalPremio  // Agregar el premio como sexto parámetro
            );
            
            // Mostrar mensaje de éxito
            this.mostrarMensajeExterno(`Venta registrada para ${vendedor.nombre}`, 'success');
            
            // Cerrar calculadora
            this.cerrar();
            
            // Actualizar lista de vendedores si existe la función
            if (window.actualizarListaVendedores) {
                window.actualizarListaVendedores();
            }
            
            return;
        } catch (error) {
            console.error("Error al usar procesarVentaDirecta:", error);
            // Si falla, continuar con el método alternativo
        }
    }
    
    // Método alternativo (código original) por si falla el método principal
    // Esto garantiza que la funcionalidad siga funcionando
    const venta = {
        fecha: fechaFormateada, // Usa la fecha normalizada
        horario: horario,
        totalVenta: totalVenta,
        premio: totalPremio,
        numeroGanador: numeroGanador, // Ya está procesado correctamente
        cantidadPremios: cantidadPremios
    };
    
    // Agregar venta al vendedor
    if (!vendedor.ventas) vendedor.ventas = [];
    vendedor.ventas.push(venta);
    
    // IMPORTANTE: Propagar la venta a los jefes asignados
    if (vendedor.jefes && vendedor.jefes.length > 0) {
        vendedor.jefes.forEach(jefeNombre => {
            // Buscar el jefe por nombre en el array global de jefes
            const jefe = window.jefes ? window.jefes.find(j => j.nombre === jefeNombre) : null;
            
            if (jefe) {
                // Inicializar el array de ventas si no existe
                if (!jefe.ventas) jefe.ventas = [];
                
                // Agregar una COPIA de la venta para evitar referencias cruzadas
                jefe.ventas.push({...venta});
                console.log(`Excel: Venta propagada al jefe ${jefeNombre}`);
            }
        });
    }
    
    // Guardar datos si existe la función
    if (window.guardarDatos) {
        window.guardarDatos();
    }
    
    // Mostrar mensaje de éxito
    this.mostrarMensajeExterno(`Venta registrada para ${vendedor.nombre}`, 'success');
    
    // Cerrar calculadora
    this.cerrar();
    
    // Actualizar lista de vendedores si existe la función
    if (window.actualizarListaVendedores) {
        window.actualizarListaVendedores();
    }
}

    /**
     * Valida que los campos necesarios estén completos
     * @returns {boolean} - true si todos los campos son válidos, false en caso contrario
     */
    validarCampos() {
        const vendedorSelect = document.getElementById('vendedorSelect');
        const horarioSelect = document.getElementById('horarioSelect');
        const numeroGanadorInput = document.getElementById('numeroGanador');
        
        // Verificar vendedor
        if (!vendedorSelect || !vendedorSelect.value) {
            this.mostrarMensajeExterno(CONFIG.MENSAJES.SELECCIONAR_VENDEDOR, 'error');
            return false;
        }
        
        // Verificar horario
        if (!horarioSelect || !horarioSelect.value) {
            this.mostrarMensajeExterno(CONFIG.MENSAJES.SELECCIONAR_HORARIO, 'error');
            return false;
        }
        
        // Verificar número ganador
        if (!numeroGanadorInput || !numeroGanadorInput.value) {
            this.mostrarMensajeExterno(CONFIG.MENSAJES.INGRESAR_NUMERO, 'error');
            return false;
        }
        
        return true;
    }

    /**
 * Calcula el total de valores y premios
 */
calcularTotal() {
    try {
        const valores = document.querySelectorAll('.calc-excel-row .valor-input');
        const premios = document.querySelectorAll('.calc-excel-row .premio-input');
        
        let total = 0;
        let premioTotal = 0;
        let cantidadPremios = 0;
        
        // Sumar valores
        valores.forEach((input) => {
            if (input.value) {
                const valor = parseFloat(input.value);
                if (!isNaN(valor)) {
                    total += valor;
                }
            }
        });
        
        // Sumar premios
        premios.forEach((input) => {
            if (input.value) {
                const premio = parseFloat(input.value);
                if (!isNaN(premio)) {
                    premioTotal += premio;
                    cantidadPremios++;
                }
            }
        });
        
        // Actualizar los totales en la interfaz
        this.totalSpan.textContent = total.toFixed(2);
        this.premioTotalSpan.textContent = premioTotal.toFixed(2);
        this.premioCountSpan.textContent = cantidadPremios;
        
        // Añadir cálculo de ganancia/pérdida
        const vendedorSelect = document.getElementById('vendedorSelect');
        let porcentajeVendedor = 10; // Valor por defecto
        let precioVenta = 1000; // Valor por defecto
        
        // Obtener valores del vendedor seleccionado si existe
        if (vendedorSelect && vendedorSelect.value && window.vendedores && window.vendedores[vendedorSelect.value]) {
            porcentajeVendedor = window.vendedores[vendedorSelect.value].porcentaje || 10;
            precioVenta = window.vendedores[vendedorSelect.value].precioVenta || 1000;
        }
        
        // Calcular ganancia/pérdida
        const gananciaVendedor = total * (porcentajeVendedor / 100);
        const pagoPremios = premioTotal * precioVenta;
        const entrega = total - gananciaVendedor;
        const diferencia = entrega - pagoPremios;
        const esGanancia = diferencia >= 0;
        
        // Actualizar o crear el elemento de ganancia/pérdida
        let gananciaPerdidaElement = document.getElementById('calc-ganancia-perdida');
        if (!gananciaPerdidaElement) {
            gananciaPerdidaElement = document.createElement('div');
            gananciaPerdidaElement.id = 'calc-ganancia-perdida';
            gananciaPerdidaElement.className = 'calc-ganancia-perdida';
            gananciaPerdidaElement.style.fontWeight = 'bold';
            gananciaPerdidaElement.style.marginTop = '10px';
            gananciaPerdidaElement.style.textAlign = 'right';
            
            // Insertar después del elemento premioCount
            const footerElement = document.querySelector('.calc-excel-footer');
            if (footerElement) {
                footerElement.parentNode.insertBefore(gananciaPerdidaElement, footerElement.nextSibling);
            }
        }
        
        // Actualizar el texto y color
        gananciaPerdidaElement.textContent = `${esGanancia ? 'Ganancia' : 'Pérdida'}: ${Math.round(Math.abs(diferencia)).toLocaleString()}`;
        gananciaPerdidaElement.style.color = esGanancia ? 'green' : 'red';
        
    } catch (error) {
        console.error('Error al calcular totales:', error);
    }
}

    /**
     * Muestra un mensaje temporal en la calculadora
     * @param {string} text - Texto del mensaje
     * @param {number} duration - Duración en milisegundos
     */
    mostrarMensaje(text, duration = CONFIG.MENSAJE_DURACION) {
        if (this.messageDiv) {
            this.messageDiv.textContent = text;
            this.messageDiv.style.display = 'block';
            setTimeout(() => {
                this.messageDiv.style.display = 'none';
            }, duration);
        }
    }

    /**
     * Muestra un mensaje en el sistema principal (fuera de la calculadora)
     * @param {string} texto - Texto del mensaje
     * @param {string} tipo - Tipo de mensaje ('success', 'error', etc.)
     */
    mostrarMensajeExterno(texto, tipo) {
        if (window.mostrarMensaje) {
            window.mostrarMensaje(texto, tipo);
        } else {
            console.log(`${tipo}: ${texto}`);
        }
    }

    /**
     * Cierra la calculadora
     */
    cerrar() {
        if (this.modal) {
            // Limpiar el selector con filtro antes de cerrar
            const searchInput = document.querySelector('#vendedorSelectContainer input.vendedor-search');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Limpiar el valor seleccionado
            const vendedorSelect = document.getElementById('vendedorSelect');
            if (vendedorSelect) {
                vendedorSelect.value = '';
            }
            
            this.modal.style.display = 'none';
        }
    }
}

/**
 * Función para cerrar la calculadora (mantiene compatibilidad con código existente)
 */
function cerrarCalculadora() {
    const calculadoraModal = document.getElementById('calculadora-template');
    if (calculadoraModal) {
        // Limpiar el selector con filtro antes de cerrar
        const searchInput = document.querySelector('#vendedorSelectContainer input.vendedor-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Limpiar el valor seleccionado
        const vendedorSelect = document.getElementById('vendedorSelect');
        if (vendedorSelect) {
            vendedorSelect.value = '';
        }
        
        calculadoraModal.style.display = 'none';
    }
}

// Exportar funciones para acceso global
window.abrirCalculadora = abrirCalculadora;
window.cerrarCalculadora = cerrarCalculadora;
