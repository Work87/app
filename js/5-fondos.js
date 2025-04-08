/**
 * 5-fondos.js - Gestión de fondos
 * Este archivo contiene todas las funciones relacionadas con
 * la administración de fondos de vendedores y operaciones financieras.
 */

function modificarSaldo(index) {
    const vendedor = vendedores[index];
    
    // Crear modal para agregar/quitar fondo
    const movimientoModal = document.createElement('div');
    movimientoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    `;

    const movimientoContent = document.createElement('div');
    movimientoContent.style.cssText = `
        background-color: #a9a9a9;
        color: black;
        padding: 20px;
        border-radius: 8px;
        width: 300px;
        position: relative;
    `;

    // Título
    const title = document.createElement('h3');
    title.textContent = 'Movimiento de Fondo';
    title.style.cssText = `
        margin-top: 0;
        text-align: center;
    `;
    movimientoContent.appendChild(title);

    // Formulario
    const form = document.createElement('form');
    form.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    // Campo de tipo (agregar/quitar)
    const tipoContainer = document.createElement('div');
    tipoContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const tipoLabel = document.createElement('label');
    tipoLabel.textContent = 'Tipo:';
    tipoContainer.appendChild(tipoLabel);

    const tipoSelect = document.createElement('select');
    tipoSelect.style.cssText = `
        width: 70%;
        padding: 5px;
    `;

    const optionAgregar = document.createElement('option');
    optionAgregar.value = 'agregar';
    optionAgregar.textContent = 'Agregar Fondo';
    tipoSelect.appendChild(optionAgregar);

    const optionQuitar = document.createElement('option');
    optionQuitar.value = 'quitar';
    optionQuitar.textContent = 'Quitar Fondo';
    tipoSelect.appendChild(optionQuitar);

    tipoContainer.appendChild(tipoSelect);
    form.appendChild(tipoContainer);

    // Campo de cantidad
    const cantidadContainer = document.createElement('div');
    cantidadContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const cantidadLabel = document.createElement('label');
    cantidadLabel.textContent = 'Cantidad:';
    cantidadContainer.appendChild(cantidadLabel);

    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.min = '1';
    cantidadInput.value = '0';
    cantidadInput.style.cssText = `
        width: 70%;
        padding: 5px;
    `;
    cantidadContainer.appendChild(cantidadInput);
    form.appendChild(cantidadContainer);

    // Campo de fecha
    const fechaContainer = document.createElement('div');
    fechaContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const fechaLabel = document.createElement('label');
    fechaLabel.textContent = 'Fecha:';
    fechaContainer.appendChild(fechaLabel);

    const fechaInput = document.createElement('input');
    fechaInput.type = 'date';
    
    // Establecer la fecha actual como valor predeterminado
    const hoy = new Date();
    const año = hoy.getFullYear();
    let mes = hoy.getMonth() + 1;
    let dia = hoy.getDate();
    
    // Asegurar formato de dos dígitos
    mes = mes < 10 ? '0' + mes : mes;
    dia = dia < 10 ? '0' + dia : dia;
    
    fechaInput.value = `${año}-${mes}-${dia}`;
    fechaInput.style.cssText = `
        width: 70%;
        padding: 5px;
    `;
    fechaContainer.appendChild(fechaInput);
    form.appendChild(fechaContainer);

    // Campo de horario
    const horarioContainer = document.createElement('div');
    horarioContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    const horarioLabel = document.createElement('label');
    horarioLabel.textContent = 'Horario:';
    horarioContainer.appendChild(horarioLabel);

    const horarioSelect = document.createElement('select');
    horarioSelect.style.cssText = `
        width: 70%;
        padding: 5px;
    `;

    const optionDia = document.createElement('option');
    optionDia.value = 'dia';
    optionDia.textContent = 'Día';
    horarioSelect.appendChild(optionDia);

    const optionNoche = document.createElement('option');
    optionNoche.value = 'noche';
    optionNoche.textContent = 'Noche';
    horarioSelect.appendChild(optionNoche);

    horarioContainer.appendChild(horarioSelect);
    form.appendChild(horarioContainer);

    // Botones
    const formButtons = document.createElement('div');
    formButtons.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    `;

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancelar';
    cancelButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #F44336;
        color: white;
        cursor: pointer;
    `;
    cancelButton.onclick = () => {
        document.body.removeChild(movimientoModal);
    };
    formButtons.appendChild(cancelButton);

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Guardar';
    saveButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
    `;
    
    saveButton.onclick = () => {
        // Validar cantidad
        const cantidad = parseFloat(cantidadInput.value);
        if (isNaN(cantidad) || cantidad <= 0) {
            alert('Por favor, ingresa una cantidad válida.');
            return;
        }
    
        // CAMBIO IMPORTANTE: Usar obtenerFechaFormateada() en lugar de formatear manualmente
        // Obtener la fecha formateada usando tu función existente
        const fechaInputValue = fechaInput.value;
        
        // Convertir la fecha del formato YYYY-MM-DD al formato DD/MM/YYYY
        const partesFecha = fechaInputValue.split('-');
        const fechaSeleccionada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
        console.log("Fecha seleccionada por el usuario:", fechaSeleccionada);

        const tipo = tipoSelect.value;
        const horarioSel = horarioSelect.value;
        
        // Crear el movimiento
        const nuevoMovimiento = {
            tipo: tipo,
            cantidad: cantidad,
            fecha: fechaSeleccionada, // Usar la fecha formateada de tu función
            horario: horarioSel
        };
        
        // Inicializar el array de movimientos si no existe
        if (!vendedor.movimientos) {
            vendedor.movimientos = [];
        }
        
        // Añadir el movimiento
        vendedor.movimientos.push(nuevoMovimiento);
        
        // Obtener el fondo actual del horario seleccionado
        const fondoHorarioSel = obtenerFondoActual(vendedor, horarioSel);
        
        // Guardar el fondo anterior original antes de cualquier cambio
        const fondoAnteriorOriginal = obtenerFondoAnterior(vendedor, horarioSel);
        
        console.log("Fondo actual obtenido correctamente:", fondoHorarioSel);
        console.log("Fondo anterior original:", fondoAnteriorOriginal);
        
        // Verificar si la cantidad es válida
        if (cantidad <= 0) {
            alert("Por favor, ingresa una cantidad válida mayor que cero.");
            return; // Detener la ejecución si la cantidad no es válida
        }
    
        // Calcular el nuevo fondo
        let nuevoFondo;
        if (tipo === 'agregar') {
            nuevoFondo = fondoHorarioSel + cantidad;
            console.log(`Agregando ${cantidad} al fondo actual ${fondoHorarioSel}. Nuevo fondo: ${nuevoFondo}`);
        } else if (tipo === 'quitar') {
            nuevoFondo = fondoHorarioSel - cantidad;
            console.log(`Quitando ${cantidad} del fondo actual ${fondoHorarioSel}. Nuevo fondo: ${nuevoFondo}`);
            
            // Permite fondos negativos pero muestra una advertencia
            if (nuevoFondo < 0 && !confirm(`Esta operación dejará el fondo en ${nuevoFondo}. ¿Estás seguro de continuar?`)) {
                return; // Cancelar si el usuario no confirma
            }
        }
    
        // Verificar que el resultado sea un número válido
        if (isNaN(nuevoFondo)) {
            console.error("Error al calcular el nuevo fondo");
            alert("Ha ocurrido un error al calcular el nuevo fondo. Por favor, intenta nuevamente.");
            return;
        }
    
        console.log("Operación de fondo:", {
            tipo,
            fondoHorarioSel,
            cantidad,
            nuevoFondo,
            fondoAnteriorOriginal
        });
        
        // Registrar el cambio
        registrarActualizacionFondo(
            index,
            fondoHorarioSel,
            nuevoFondo,
            tipo === 'agregar' ? cantidad : -cantidad,
            fechaSeleccionada, // Usar la fecha formateada de tu función
            horarioSel
        );
        
        // Inicializar la estructura de fondos por horario si no existe
        if (!vendedor.fondosPorHorario) {
            vendedor.fondosPorHorario = {};
        }
        
        // Asegurarse de que ambos horarios estén inicializados
        if (!vendedor.fondosPorHorario.dia) {
            vendedor.fondosPorHorario.dia = {
                actual: vendedor.fondo || 0,
                anterior: vendedor.fondo || 0
            };
        }
        
        if (!vendedor.fondosPorHorario.noche) {
            vendedor.fondosPorHorario.noche = {
                actual: vendedor.fondo || 0,
                anterior: vendedor.fondo || 0
            };
        }
        
        // CASO ESPECIAL: Si el fondo anterior es 0 (vendedor nuevo) o no hay ventas,
        // actualizar también el fondo anterior al mismo valor que el actual
        const esVendedorNuevo = fondoAnteriorOriginal === 0;
        const tieneVentas = vendedor.ventas && vendedor.ventas.filter(v => v.horario === horarioSel).length > 0;
        
        if (esVendedorNuevo && !tieneVentas) {
            console.log("Vendedor nuevo detectado: actualizando tanto el fondo actual como el anterior");
            
            // Actualizar tanto el fondo actual como el anterior para ambos horarios
            vendedor.fondosPorHorario[horarioSel].actual = nuevoFondo;
            vendedor.fondosPorHorario[horarioSel].anterior = nuevoFondo;
            
            const otroHorario = horarioSel === 'dia' ? 'noche' : 'dia';
            vendedor.fondosPorHorario[otroHorario].actual = nuevoFondo;
            vendedor.fondosPorHorario[otroHorario].anterior = nuevoFondo;
        } else {
            // Comportamiento normal: Actualizar SOLO el fondo actual, manteniendo el anterior intacto
            vendedor.fondosPorHorario[horarioSel].actual = nuevoFondo;
            
            // Actualizar también el fondo actual del otro horario para mantener sincronía
            const otroHorario = horarioSel === 'dia' ? 'noche' : 'dia';
            vendedor.fondosPorHorario[otroHorario].actual = nuevoFondo;
        }
        
        // Guardar en localStorage
        localStorage.setItem(`fondoVendedor_${index}_dia`, JSON.stringify(vendedor.fondosPorHorario.dia));
        localStorage.setItem(`fondoVendedor_${index}_noche`, JSON.stringify(vendedor.fondosPorHorario.noche));
        
        // Guardar los cambios
        guardarVendedores(vendedores);
        
        console.log("Fondos actualizados:", {
            dia: vendedor.fondosPorHorario.dia,
            noche: vendedor.fondosPorHorario.noche
        });
        
        alert('Movimiento registrado correctamente');
        document.body.removeChild(movimientoModal);
        
        // Actualizar la interfaz - reemplazar por una llamada a tu función existente
        verVentasVendedorPorHorario(index, horarioSel);
    };
    formButtons.appendChild(saveButton);

    form.appendChild(formButtons);
    movimientoContent.appendChild(form);
    movimientoModal.appendChild(movimientoContent);
    document.body.appendChild(movimientoModal);
}

// Función para obtener el fondo actual de forma segura
function actualizarFondo(vendedor, horario, nuevoFondo, vendedorIndex) {
    // Asegurar que nuevoFondo sea un número válido
    nuevoFondo = asegurarNumero(nuevoFondo);
    
    // Obtener el fondo actual (que pasará a ser el anterior)
    const fondoActual = obtenerFondoActual(vendedor, horario);
    
    console.log(`Actualizando fondo para ${vendedor.nombre}:`);
    console.log(`- Horario: ${horario}`);
    console.log(`- Fondo actual: ${fondoActual} → Nuevo fondo: ${nuevoFondo}`);
    
    // Asegurarse de que fondosPorHorario esté inicializado
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {};
    }
    
    // Asegurarse de que ambos horarios estén inicializados
    if (!vendedor.fondosPorHorario.dia) {
        vendedor.fondosPorHorario.dia = {
            actual: vendedor.fondo || 0,
            anterior: vendedor.fondo || 0
        };
    }
    
    if (!vendedor.fondosPorHorario.noche) {
        vendedor.fondosPorHorario.noche = {
            actual: vendedor.fondo || 0,
            anterior: vendedor.fondo || 0
        };
    }
    
    // Convertir cualquier valor que no sea objeto a formato de objeto
    if (typeof vendedor.fondosPorHorario.dia !== 'object') {
        const valor = vendedor.fondosPorHorario.dia;
        vendedor.fondosPorHorario.dia = {
            actual: asegurarNumero(valor),
            anterior: asegurarNumero(valor)
        };
    }
    
    if (typeof vendedor.fondosPorHorario.noche !== 'object') {
        const valor = vendedor.fondosPorHorario.noche;
        vendedor.fondosPorHorario.noche = {
            actual: asegurarNumero(valor),
            anterior: asegurarNumero(valor)
        };
    }
    
    // Actualizar el fondo del horario actual
    vendedor.fondosPorHorario[horario] = {
        actual: nuevoFondo,
        anterior: fondoActual
    };
    
    // IMPORTANTE: Actualizar el "actual" del otro horario también
    const otroHorario = (horario === 'dia') ? 'noche' : 'dia';
    vendedor.fondosPorHorario[otroHorario].actual = nuevoFondo;
    
    // Guardar en localStorage para ambos horarios
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_dia`, JSON.stringify(vendedor.fondosPorHorario.dia));
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_noche`, JSON.stringify(vendedor.fondosPorHorario.noche));
    
    // Guardar los cambios
    guardarVendedores(vendedores);
    
    console.log("Fondos actualizados:", {
        dia: vendedor.fondosPorHorario.dia,
        noche: vendedor.fondosPorHorario.noche
    });
    
    return {
        actual: nuevoFondo,
        anterior: fondoActual
    };
}

// Función que puedes llamar después de registrar una venta
function actualizarFondoAutomaticamente(vendedorIndex, horario, fechaActual) {
    // Obtener el vendedor
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) {
        console.error("Vendedor no encontrado");
        return;
    }
    
    // Obtener el fondo actual (que pasará a ser el fondo anterior)
    const fondoActual = parseFloat(localStorage.getItem(`fondoActual_${vendedorIndex}_${horario}`)) || 0;
    
    // Calcular el fondo recomendado basado en la venta más reciente
    const fondoRecomendado = calcularFondoRecomendado(vendedorIndex, horario);
    
    // Registrar el cambio, el fondo actual pasa a ser el anterior
    registrarActualizacionFondo(
        vendedorIndex,
        fondoActual,         // Fondo anterior (el que era actual)
        fondoRecomendado,    // Nuevo fondo actual (el recomendado)
        fondoRecomendado - fondoActual, // Diferencia
        fechaActual,
        horario,
        true // Es automático
    );
    
    // Actualizar el fondo actual al recomendado
    localStorage.setItem(`fondoActual_${vendedorIndex}_${horario}`, fondoRecomendado.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    
    // Mantener un registro del fondo anterior
    localStorage.setItem(`fondoAnterior_${vendedorIndex}_${horario}`, fondoActual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    
    // Actualizar el objeto vendedor
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {};
    }
    vendedor.fondosPorHorario[horario] = {
        actual: fondoRecomendado,
        anterior: fondoActual
    };
    
    guardarVendedores(vendedores);
    
    // Actualizar la UI si es necesario
    actualizarInterfazFondos(vendedorIndex, horario);
    
    console.log('Fondo actualizado: Anterior =', fondoActual, 'Nuevo =', fondoRecomendado);
}

// Función para inicializar correctamente los fondos por horario
function inicializarFondosPorHorario(vendedor) {
    // Crear el objeto si no existe
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {};
    }
   
    // Inicializar día si no existe o si es un objeto vacío
    if (!vendedor.fondosPorHorario.dia ||
        (typeof vendedor.fondosPorHorario.dia === 'object' &&
         Object.keys(vendedor.fondosPorHorario.dia).length === 0)) {
        // Si noche existe y es un número, usar ese valor
        if (vendedor.fondosPorHorario.noche && typeof vendedor.fondosPorHorario.noche === 'number') {
            vendedor.fondosPorHorario.dia = {
                actual: vendedor.fondosPorHorario.noche,
                anterior: vendedor.fondosPorHorario.noche
            };
        } else {
            // Si no, usar el fondo general
            vendedor.fondosPorHorario.dia = {
                actual: vendedor.fondo || 0,
                anterior: vendedor.fondo || 0
            };
        }
    }
   
    // Inicializar noche si no existe
    if (!vendedor.fondosPorHorario.noche) {
        // Si día existe y tiene estructura correcta, usar ese valor
        if (vendedor.fondosPorHorario.dia &&
            typeof vendedor.fondosPorHorario.dia === 'object' &&
            'actual' in vendedor.fondosPorHorario.dia) {
            vendedor.fondosPorHorario.noche = {
                actual: vendedor.fondosPorHorario.dia.actual,
                anterior: vendedor.fondosPorHorario.dia.actual
            };
        } else {
            // Si no, usar el fondo general
            vendedor.fondosPorHorario.noche = {
                actual: vendedor.fondo || 0,
                anterior: vendedor.fondo || 0
            };
        }
    }
   
    // Convertir noche a objeto si es un número
    if (typeof vendedor.fondosPorHorario.noche === 'number') {
        const valorNoche = vendedor.fondosPorHorario.noche;
        vendedor.fondosPorHorario.noche = {
            actual: valorNoche,
            anterior: valorNoche
        };
    }
   
    // Guardar cambios
    guardarVendedores(vendedores);
   
    return vendedor.fondosPorHorario;
}

// Calcular el fondo recomendado sin modificar los valores actuales
function calcularFondoRecomendado(vendedorIndex, horario) {
    const vendedor = vendedores[vendedorIndex];
    
    // Filtrar ventas por horario
    const ventasHorario = vendedor.ventas.filter(v => v.horario === horario);
    
    if (ventasHorario.length === 0) {
        // Si no hay ventas, el fondo recomendado es el mismo que el actual
        return obtenerFondoActual(vendedor, horario);
    }
    
    // Inicializar variables
    let totalVenta = 0;
    let totalPremios = 0;
    
    // Calcular totales
    ventasHorario.forEach(venta => {
        totalVenta += venta.totalVenta;
        totalPremios += venta.premio;
    });
    
    // Calcular resultados
    const pagoPremios = Math.round(totalPremios * vendedor.precioVenta);
    const gananciaVendedor = Math.round(totalVenta * (vendedor.porcentaje / 100));
    const entrega = Math.round(totalVenta - gananciaVendedor);
    const diferencia = Math.round(entrega - pagoPremios);
    
    // Obtener fondo actual
    const fondoActual = obtenerFondoActual(vendedor, horario);
    
    // Calcular fondo recomendado
    const fondoRecomendado = Math.round(fondoActual + diferencia);
    
    return fondoRecomendado;
}    

// Función para obtener el fondo actual con más diagnóstico
function obtenerFondoActual(vendedor, horario) {
    console.log(`Obteniendo fondo actual para ${vendedor.nombre}, horario: ${horario}`);
    console.log("fondosPorHorario:", vendedor.fondosPorHorario);
    
    // Valor predeterminado si no hay datos
    if (!vendedor || !horario) {
        console.log("No hay vendedor o horario definido");
        return 0;
    }
    
    // Si no existe fondosPorHorario
    if (!vendedor.fondosPorHorario) {
        console.log("No existe fondosPorHorario, usando fondo general:", vendedor.fondo);
        return Number(vendedor.fondo) || 0;
    }
    
    // Si no existe el horario específico
    if (!vendedor.fondosPorHorario[horario]) {
        console.log(`No existe fondosPorHorario[${horario}], usando fondo general:`, vendedor.fondo);
        return Number(vendedor.fondo) || 0;
    }
    
    console.log(`Tipo de fondosPorHorario[${horario}]:`, typeof vendedor.fondosPorHorario[horario]);
    console.log(`Valor de fondosPorHorario[${horario}]:`, vendedor.fondosPorHorario[horario]);
    
    // Si es un objeto con propiedad 'actual'
    if (typeof vendedor.fondosPorHorario[horario] === 'object' && 
        vendedor.fondosPorHorario[horario] !== null) {
        if ('actual' in vendedor.fondosPorHorario[horario]) {
            console.log(`Encontrado fondo actual:`, vendedor.fondosPorHorario[horario].actual);
            return Number(vendedor.fondosPorHorario[horario].actual) || 0;
        } else {
            console.log(`Objeto sin propiedad 'actual'`);
            return 0;
        }
    } 
    
    // Si es un número directo
    if (typeof vendedor.fondosPorHorario[horario] === 'number') {
        console.log(`Encontrado fondo como número directo:`, vendedor.fondosPorHorario[horario]);
        return vendedor.fondosPorHorario[horario];
    }
    
    // Cualquier otro caso
    console.log(`Tipo de dato no esperado:`, typeof vendedor.fondosPorHorario[horario]);
    return 0;
}

// Función para obtener el fondo anterior de forma segura
function obtenerFondoAnterior(vendedor, horario) {
    // Verificar si existe el objeto fondosPorHorario
    if (!vendedor.fondosPorHorario) {
        return vendedor.fondo || 0;
    }
    
    // Verificar si existe el valor para el horario específico
    if (!vendedor.fondosPorHorario[horario]) {
        return vendedor.fondo || 0;
    }
    
    // Si es un objeto completo con la propiedad anterior
    if (typeof vendedor.fondosPorHorario[horario] === 'object' && 
        vendedor.fondosPorHorario[horario] !== null && 
        'anterior' in vendedor.fondosPorHorario[horario]) {
        return vendedor.fondosPorHorario[horario].anterior;
    } 
    // Si es un número directo (usamos el mismo valor como anterior)
    else if (typeof vendedor.fondosPorHorario[horario] === 'number') {
        return vendedor.fondosPorHorario[horario];
    }
    // Si es un objeto vacío u otro tipo
    else {
        return 0;
    }
}

// Función para sincronizar fondos entre horarios y días
function sincronizarFondosEntreHorarios(vendedor, vendedorIndex) {
    // Asegurarse de que la estructura existe
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {
            dia: { anterior: 0, actual: 0 },
            noche: { anterior: 0, actual: 0 }
        };
    }
    
    // Obtener la hora actual para determinar qué horario es
    const ahora = new Date();
    const hora = ahora.getHours();
    const esHorarioDia = hora >= 6 && hora < 18; // De 6am a 6pm es horario de día
    
    // Si estamos en horario de día
    if (esHorarioDia) {
        // El fondo actual de la noche anterior se convierte en el fondo anterior del día
        const fondoNocheAnterior = vendedor.fondosPorHorario.noche.actual;
        
        if (fondoNocheAnterior !== undefined && fondoNocheAnterior !== null) {
            vendedor.fondosPorHorario.dia.anterior = fondoNocheAnterior;
            console.log(`Sincronizado: Fondo actual noche (${fondoNocheAnterior}) -> Fondo anterior día`);
        }
    } 
    // Si estamos en horario de noche
    else {
        // El fondo actual del día se convierte en el fondo anterior de la noche
        const fondoDiaActual = vendedor.fondosPorHorario.dia.actual;
        
        if (fondoDiaActual !== undefined && fondoDiaActual !== null) {
            vendedor.fondosPorHorario.noche.anterior = fondoDiaActual;
            console.log(`Sincronizado: Fondo actual día (${fondoDiaActual}) -> Fondo anterior noche`);
        }
    }
    
    // Guardar los cambios
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_dia`, JSON.stringify(vendedor.fondosPorHorario.dia));
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_noche`, JSON.stringify(vendedor.fondosPorHorario.noche));
    guardarVendedores(vendedores);
    
    return vendedor.fondosPorHorario;
}

function corregirFondosEntreHorarios(vendedor, vendedorIndex) {
    console.log("Corrigiendo fondos entre horarios para", vendedor.nombre);
    console.log("Fondos actuales:", JSON.stringify(vendedor.fondosPorHorario));
    
    // Asegurarse de que la estructura existe
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {
            dia: { anterior: 0, actual: 0 },
            noche: { anterior: 0, actual: 0 }
        };
    }
    
    // IMPORTANTE: Solo sincronizamos el fondo anterior, NO el actual
    // Para el DÍA: El fondo anterior debería ser el último fondo actual guardado de la noche anterior
    // Para la NOCHE: El fondo anterior debería ser el último fondo actual guardado del día actual
    
    // Verificar si están guardados en localStorage
    const fondoDiaGuardado = localStorage.getItem(`fondoVendedor_${vendedorIndex}_dia`);
    const fondoNocheGuardado = localStorage.getItem(`fondoVendedor_${vendedorIndex}_noche`);
    
    let fondoDia = fondoDiaGuardado ? JSON.parse(fondoDiaGuardado) : { anterior: 0, actual: 0 };
    let fondoNoche = fondoNocheGuardado ? JSON.parse(fondoNocheGuardado) : { anterior: 0, actual: 0 };
    
    // Ahora corregimos los valores
    
    // 1. El fondo anterior del día debería ser el fondo actual de la noche anterior
    // (Solo en el cambio de día, que no es este caso)
    
    // 2. El fondo anterior de la noche debería ser el fondo actual del día
    fondoNoche.anterior = fondoDia.actual;
    
    console.log("Después de corregir:", {
        dia: fondoDia,
        noche: fondoNoche
    });
    
    // Guardar los valores corregidos
    vendedor.fondosPorHorario.dia = fondoDia;
    vendedor.fondosPorHorario.noche = fondoNoche;
    
    // Guardar en localStorage
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_dia`, JSON.stringify(fondoDia));
    localStorage.setItem(`fondoVendedor_${vendedorIndex}_noche`, JSON.stringify(fondoNoche));
    
    // Guardar en el array de vendedores
    guardarVendedores(vendedores);
    
    return vendedor.fondosPorHorario;
}

// Función para obtener fondos históricos para una fecha y horario específicos
function obtenerFondosHistoricos(vendedor, fechaConsulta, horarioConsulta) {
    console.log(`Buscando fondos históricos para fecha: ${fechaConsulta}, horario: ${horarioConsulta}`);
    
    if (!vendedor.historialFondos || !Array.isArray(vendedor.historialFondos) || vendedor.historialFondos.length === 0) {
        console.log("No hay historial de fondos disponible");
        return null;
    }
    
    // 1. Primero verificamos si existe un registro exacto para esta fecha y horario
    const registroDirecto = vendedor.historialFondos.find(h => 
        obtenerFechaFormateada(h.fecha) === fechaConsulta && 
        h.horario === horarioConsulta);
        
    if (registroDirecto) {
        console.log("Encontrado registro directo:", registroDirecto);
        return {
            actual: registroDirecto.fondoActual,
            anterior: registroDirecto.fondoAnterior
        };
    }
    
    // 2. Si no hay registro directo, determinamos el fondo anterior según reglas de secuencia natural
    const partesFecha = fechaConsulta.split('/').map(Number); // [día, mes, año]
    
    // Creamos una fecha de referencia para comparaciones
    const fechaRef = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    
    // Filtramos registros cronológicamente ANTERIORES a la fecha de consulta
    const registrosAnteriores = vendedor.historialFondos.filter(h => {
        const fechaRegistro = obtenerFechaFormateada(h.fecha);
        const partesRegistro = fechaRegistro.split('/').map(Number);
        
        // Creamos fecha del registro para comparar
        const fechaReg = new Date(partesRegistro[2], partesRegistro[1] - 1, partesRegistro[0]);
        
        // Si es una fecha anterior, incluir
        if (fechaReg < fechaRef) return true;
        
        // Si es la misma fecha, depende del horario
        if (fechaReg.getTime() === fechaRef.getTime()) {
            if (horarioConsulta === 'noche' && h.horario === 'dia') return true;
            return false; // Cualquier otro caso no se considera anterior
        }
        
        return false; // Fecha posterior
    });
    
    // Si estamos consultando un registro del día
    if (horarioConsulta === 'dia') {
        // Para el día, necesitamos el fondo de la noche anterior como fondo anterior
        
        // Calculamos la fecha anterior
        const fechaAnterior = new Date(fechaRef);
        fechaAnterior.setDate(fechaAnterior.getDate() - 1);
        const fechaAnteriorStr = obtenerFechaFormateada(fechaAnterior);
        
        // Buscamos registro de la noche anterior
        const registroNocheAnterior = vendedor.historialFondos.find(h => 
            obtenerFechaFormateada(h.fecha) === fechaAnteriorStr && 
            h.horario === 'noche');
            
        if (registroNocheAnterior && registroNocheAnterior.fondoActual !== null) {
            console.log("Encontrado registro de noche anterior:", registroNocheAnterior);
            return {
                actual: null, // No sabemos el actual aún
                anterior: registroNocheAnterior.fondoActual
            };
        }
    } 
    // Si estamos consultando un registro de la noche
    else if (horarioConsulta === 'noche') {
        // Para la noche, necesitamos el fondo del día de la misma fecha como fondo anterior
        
        // Buscamos registro del día de la misma fecha
        const registroDiaMismaFecha = vendedor.historialFondos.find(h => 
            obtenerFechaFormateada(h.fecha) === fechaConsulta && 
            h.horario === 'dia');
            
        if (registroDiaMismaFecha && registroDiaMismaFecha.fondoActual !== null) {
            console.log("Encontrado registro del día de la misma fecha:", registroDiaMismaFecha);
            return {
                actual: null, // No sabemos el actual aún
                anterior: registroDiaMismaFecha.fondoActual
            };
        }
    }
    
    // 3. Si no encontramos según reglas específicas, buscamos el registro cronológicamente más reciente
    if (registrosAnteriores.length > 0) {
        // Ordenamos los registros por fecha (más reciente primero)
        registrosAnteriores.sort((a, b) => {
            // Convertir fechas a objetos Date para comparar
            const fechaA = obtenerFechaFormateada(a.fecha).split('/').map(Number);
            const fechaB = obtenerFechaFormateada(b.fecha).split('/').map(Number);
            
            const dateA = new Date(fechaA[2], fechaA[1] - 1, fechaA[0]);
            const dateB = new Date(fechaB[2], fechaB[1] - 1, fechaB[0]);
            
            // Primero comparamos por fecha
            if (dateA.getTime() !== dateB.getTime()) {
                return dateB.getTime() - dateA.getTime();
            }
            
            // Si la fecha es la misma, comparamos por horario (noche es más reciente que día)
            if (a.horario === 'noche' && b.horario === 'dia') return -1;
            if (a.horario === 'dia' && b.horario === 'noche') return 1;
            
            return 0;
        });
        
        // Tomamos el registro más reciente
        const registroMasReciente = registrosAnteriores[0];
        console.log("Usando el registro más reciente encontrado:", registroMasReciente);
        
        // Si el registro más reciente tiene fondoActual, ese es el que necesitamos
        if (registroMasReciente.fondoActual !== null && registroMasReciente.fondoActual !== undefined) {
            return {
                actual: null, // No sabemos el actual aún
                anterior: registroMasReciente.fondoActual
            };
        }
        // Si no tiene fondoActual pero sí fondoAnterior, usamos ese
        else if (registroMasReciente.fondoAnterior !== null && registroMasReciente.fondoAnterior !== undefined) {
            return {
                actual: null,
                anterior: registroMasReciente.fondoAnterior
            };
        }
    }
    
    // 4. Si todo lo anterior falla, volver a los valores por defecto
    console.log("No se encontraron registros históricos adecuados, usando valores actuales");
    return null;
}

// Función para determinar el fondo anterior basado en la secuencia natural de ventas
function determinarFondoAnterior(vendedor, fecha, horario) {
    console.log(`Determinando fondo ANTERIOR para: ${fecha}, ${horario}`);
    
    // 1. Si es horario DÍA, el fondo anterior debe ser:
    //    - El fondo actual de la NOCHE ANTERIOR
    if (horario === 'dia') {
        // Calcular la fecha del día anterior
        const partes = fecha.split('/');
        const fechaObj = new Date(partes[2], partes[1] - 1, partes[0]);
        fechaObj.setDate(fechaObj.getDate() - 1);
        
        // Formatear a DD/MM/YYYY
        const diaAnterior = fechaObj.getDate().toString().padStart(2, '0');
        const mesAnterior = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        const anioAnterior = fechaObj.getFullYear();
        const fechaAnterior = `${diaAnterior}/${mesAnterior}/${anioAnterior}`;
        
        console.log(`Buscando noche de la fecha anterior: ${fechaAnterior}`);
        
        // Buscar en historialFondos un registro de la noche anterior
        if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
            const fondoNocheAnterior = vendedor.historialFondos.find(f => 
                obtenerFechaFormateada(f.fecha) === fechaAnterior && 
                f.horario === 'noche');
                
            if (fondoNocheAnterior && fondoNocheAnterior.fondoActual) {
                console.log(`Encontrado fondo de la noche anterior: ${fondoNocheAnterior.fondoActual}`);
                return fondoNocheAnterior.fondoActual;
            }
        }
    }
    
    // 2. Si es horario NOCHE, el fondo anterior debe ser:
    //    - El fondo actual del DÍA ACTUAL
    else if (horario === 'noche') {
        console.log(`Buscando día de la misma fecha: ${fecha}`);
        
        // Buscar en historialFondos un registro del día de la misma fecha
        if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
            const fondoDiaMismaFecha = vendedor.historialFondos.find(f => 
                obtenerFechaFormateada(f.fecha) === fecha && 
                f.horario === 'dia');
                
            if (fondoDiaMismaFecha && fondoDiaMismaFecha.fondoActual) {
                console.log(`Encontrado fondo del día actual: ${fondoDiaMismaFecha.fondoActual}`);
                return fondoDiaMismaFecha.fondoActual;
            }
        }
    }
    
    // 3. Si no se encontró según las reglas anteriores, buscar el registro más reciente
    // que sea anterior a esta fecha/horario
    console.log("Buscando el registro más reciente anterior a esta fecha/horario");
    
    if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
        // Filtrar registros anteriores a esta fecha/horario
        const registrosAnteriores = vendedor.historialFondos.filter(reg => {
            const fechaReg = obtenerFechaFormateada(reg.fecha);
            
            // Convertir ambas fechas a arrays [día, mes, año]
            const partesActual = fecha.split('/').map(Number);
            const partesReg = fechaReg.split('/').map(Number);
            
            // Si año es menor, es anterior
            if (partesReg[2] < partesActual[2]) return true;
            // Si año es mayor, es posterior
            if (partesReg[2] > partesActual[2]) return false;
            
            // Mismo año, comparar mes
            if (partesReg[1] < partesActual[1]) return true;
            if (partesReg[1] > partesActual[1]) return false;
            
            // Mismo mes, comparar día
            if (partesReg[0] < partesActual[0]) return true;
            if (partesReg[0] > partesActual[0]) return false;
            
            // Misma fecha, comparar horario
            if (fechaReg === fecha) {
                // Si actual es noche y registro es día, registro es anterior
                if (horario === 'noche' && reg.horario === 'dia') return true;
                // En cualquier otro caso, no es anterior
                return false;
            }
            
            return false; // Mismo día pero no cumple las condiciones
        });
        
        // Ordenar por fecha, del más reciente al más antiguo
        registrosAnteriores.sort((a, b) => {
            const fechaA = obtenerFechaFormateada(a.fecha);
            const fechaB = obtenerFechaFormateada(b.fecha);
            
            const partesA = fechaA.split('/').map(Number);
            const partesB = fechaB.split('/').map(Number);
            
            // Comparar año
            if (partesB[2] !== partesA[2]) return partesB[2] - partesA[2];
            
            // Mismo año, comparar mes
            if (partesB[1] !== partesA[1]) return partesB[1] - partesA[1];
            
            // Mismo año y mes, comparar día
            if (partesB[0] !== partesA[0]) return partesB[0] - partesA[0];
            
            // Misma fecha, comparar horario (noche es más reciente que día)
            if (a.horario === 'noche' && b.horario === 'dia') return -1;
            if (a.horario === 'dia' && b.horario === 'noche') return 1;
            
            return 0;
        });
        
        // Si hay registros anteriores, usar el más reciente
        if (registrosAnteriores.length > 0) {
            const registroMasReciente = registrosAnteriores[0];
            
            // Verificar que tenga fondoActual
            if (registroMasReciente.fondoActual !== null && registroMasReciente.fondoActual !== undefined) {
                console.log("Encontrado registro más reciente:", registroMasReciente);
                return registroMasReciente.fondoActual;
            }
            else if (registroMasReciente.fondoAnterior !== null && registroMasReciente.fondoAnterior !== undefined) {
                console.log("Usando fondoAnterior del registro más reciente:", registroMasReciente);
                return registroMasReciente.fondoAnterior;
            }
        }
    }
    
    // 4. Si todo lo anterior falla, usar el fondo guardado en la estructura del vendedor
    console.log("No se encontraron registros históricos, usando valores del vendedor");
    return obtenerFondoAnterior(vendedor, horario);
}

function determinarFondoAnteriorCronologico(vendedor, fechaConsulta, horarioConsulta) {
    console.log(`Determinando fondo ANTERIOR para: ${fechaConsulta}, ${horarioConsulta}`);
    
    // Reglas:
    // 1. Para DÍA: El fondo anterior debe ser el fondo actual de la NOCHE ANTERIOR
    // 2. Para NOCHE: El fondo anterior debe ser el fondo actual del DÍA del MISMO DÍA
    
    const partesFecha = fechaConsulta.split('/').map(Number); // [día, mes, año]
    
    if (horarioConsulta === 'dia') {
        // Calcular la fecha del día anterior
        const fechaAnterior = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
        fechaAnterior.setDate(fechaAnterior.getDate() - 1);
        
        // Formatear a DD/MM/YYYY
        const fechaAnteriorStr = obtenerFechaFormateada(fechaAnterior);
        
        // Buscar un registro de la noche anterior
        if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
            const fondoNocheAnterior = vendedor.historialFondos.find(f => 
                obtenerFechaFormateada(f.fecha) === fechaAnteriorStr && 
                f.horario === 'noche');
                
            if (fondoNocheAnterior && fondoNocheAnterior.fondoActual !== null) {
                return fondoNocheAnterior.fondoActual;
            }
        }
    } 
    else if (horarioConsulta === 'noche') {
        // Buscar un registro del día del mismo día
        if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
            const fondoDiaMismaFecha = vendedor.historialFondos.find(f => 
                obtenerFechaFormateada(f.fecha) === fechaConsulta && 
                f.horario === 'dia');
                
            if (fondoDiaMismaFecha && fondoDiaMismaFecha.fondoActual !== null) {
                return fondoDiaMismaFecha.fondoActual;
            }
        }
    }
    
    // Si no se encontró según las reglas, buscar el registro cronológicamente más reciente
    // pero anterior a la fecha/horario que estamos consultando
    
    if (vendedor.historialFondos && Array.isArray(vendedor.historialFondos)) {
        // Convertir la fecha de consulta a objeto Date para comparaciones
        const fechaConsultaObj = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
        
        // Filtrar registros anteriores a esta fecha/horario
        const registrosAnteriores = vendedor.historialFondos.filter(reg => {
            const fechaReg = obtenerFechaFormateada(reg.fecha);
            const partesReg = fechaReg.split('/').map(Number);
            const fechaRegObj = new Date(partesReg[2], partesReg[1] - 1, partesReg[0]);
            
            // Si la fecha es anterior, incluir
            if (fechaRegObj < fechaConsultaObj) return true;
            
            // Si es la misma fecha, depende del horario
            if (fechaRegObj.getTime() === fechaConsultaObj.getTime()) {
                if (horarioConsulta === 'noche' && reg.horario === 'dia') return true;
                return false;
            }
            
            return false;
        });
        
        // Ordenar por fecha, del más reciente al más antiguo
        registrosAnteriores.sort((a, b) => {
            const fechaA = obtenerFechaFormateada(a.fecha).split('/').map(Number);
            const fechaB = obtenerFechaFormateada(b.fecha).split('/').map(Number);
            
            const dateA = new Date(fechaA[2], fechaA[1] - 1, fechaA[0]);
            const dateB = new Date(fechaB[2], fechaB[1] - 1, fechaB[0]);
            
            // Primero comparamos por fecha
            if (dateA.getTime() !== dateB.getTime()) {
                return dateB.getTime() - dateA.getTime();
            }
            
            // Si la fecha es la misma, noche va después de día
            if (a.horario === 'noche' && b.horario === 'dia') return -1;
            if (a.horario === 'dia' && b.horario === 'noche') return 1;
            
            return 0;
        });
        
        // Si hay registros anteriores, usar el más reciente
        if (registrosAnteriores.length > 0) {
            const registroMasReciente = registrosAnteriores[0];
            
            // Verificar que tenga fondoActual
            if (registroMasReciente.fondoActual !== null && registroMasReciente.fondoActual !== undefined) {
                return registroMasReciente.fondoActual;
            }
            else if (registroMasReciente.fondoAnterior !== null && registroMasReciente.fondoAnterior !== undefined) {
                return registroMasReciente.fondoAnterior;
            }
        }
    }
    
    // Si todo lo anterior falla, usar el fondo por defecto
    return obtenerFondoAnterior(vendedor, horarioConsulta);
}

// Función para registrar actualizaciones de fondo
function registrarActualizacionFondo(vendedorIndex, fondoAnterior, fondoNuevo, diferencia, fecha, horario, automatico = false) {
    // Crear un nuevo registro
    const registro = {
        fecha: fecha,
        hora: new Date().toLocaleTimeString(),
        horario: horario,
        fondoAnterior: fondoAnterior,
        fondoNuevo: fondoNuevo,
        diferencia: diferencia,
        automatico: automatico
    };
   
    // Obtener registros existentes o crear array vacío
    let registrosActualizaciones = JSON.parse(localStorage.getItem('registrosActualizacionesFondo') || '[]');
   
    // Agregar nuevo registro
    registrosActualizaciones.push(registro);
   
    // Guardar en localStorage
    localStorage.setItem('registrosActualizacionesFondo', JSON.stringify(registrosActualizaciones));
   
    console.log('Registro de actualización guardado:', registro);
}

document.getElementById("borrarFondosBtn").addEventListener("click", limpiarFondos);

// Función que puedes llamar después de registrar una venta
function actualizarFondoAutomaticamente(vendedorIndex, horario, fechaActual) {
    // Obtener el vendedor
    const vendedor = vendedores[vendedorIndex];
    if (!vendedor) {
        console.error("Vendedor no encontrado");
        return;
    }
    
    // Obtener el fondo actual (que pasará a ser el fondo anterior)
    const fondoActual = parseFloat(localStorage.getItem(`fondoActual_${vendedorIndex}_${horario}`)) || 0;
    
    // Calcular el fondo recomendado basado en la venta más reciente
    const fondoRecomendado = calcularFondoRecomendado(vendedorIndex, horario);
    
    // Registrar el cambio, el fondo actual pasa a ser el anterior
    registrarActualizacionFondo(
        vendedorIndex,
        fondoActual,         // Fondo anterior (el que era actual)
        fondoRecomendado,    // Nuevo fondo actual (el recomendado)
        fondoRecomendado - fondoActual, // Diferencia
        fechaActual,
        horario,
        true // Es automático
    );
    
    // Actualizar el fondo actual al recomendado
    localStorage.setItem(`fondoActual_${vendedorIndex}_${horario}`, fondoRecomendado.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    
    // Mantener un registro del fondo anterior
    localStorage.setItem(`fondoAnterior_${vendedorIndex}_${horario}`, fondoActual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    
    // Actualizar el objeto vendedor
    if (!vendedor.fondosPorHorario) {
        vendedor.fondosPorHorario = {};
    }
    vendedor.fondosPorHorario[horario] = {
        actual: fondoRecomendado,
        anterior: fondoActual
    };
    
    guardarVendedores(vendedores);
    
    // Actualizar la UI si es necesario
    actualizarInterfazFondos(vendedorIndex, horario);
    
    console.log('Fondo actualizado: Anterior =', fondoActual, 'Nuevo =', fondoRecomendado);
}


// Función para asegurarse de que un valor sea un número
function asegurarNumero(valor) {
    // Si el valor es undefined o null, devolver 0
    if (valor === undefined || valor === null) {
        console.log("Valor indefinido o nulo convertido a 0");
        return 0;
    }
    
    // Intentar convertir a número
    const numero = Number(valor);
    
    // Si es NaN, devolver 0 y registrar
    if (isNaN(numero)) {
        console.log("Valor NaN detectado y convertido a 0:", valor);
        return 0;
    }
    
    // Devolver el número tal cual, sin restricciones de mínimo
    return numero;
}

function agregarFondo(index, horario, fechaSeleccionada) {
    // Obtenemos el fondo actual desde localStorage si existe
    let fondoActual = 0;
    const storedFondo = localStorage.getItem(`fondoVendedor_${index}`);
    if (storedFondo !== null) {
        fondoActual = parseFloat(storedFondo);
    } else {
        fondoActual = vendedores[index].fondo;
    }
    
    const vendedor = vendedores[index];
    
    // Mostramos el fondo actual obtenido del localStorage
    const fondoAgregar = parseFloat(prompt(`Fondo actual: ${fondoActual.toLocaleString()}.\nIngrese la cantidad a agregar:`));
    
    if (isNaN(fondoAgregar) || fondoAgregar <= 0) {
        alert("Por favor, ingrese una cantidad válida mayor que cero.");
        return;
    }
    
    // Actualizar el fondo en localStorage y en el objeto vendedor
    const nuevoFondo = fondoActual + fondoAgregar;
    localStorage.setItem(`fondoVendedor_${index}`, nuevoFondo.toString());
    
    // Actualizar el objeto vendedor en memoria
    vendedor.fondo = nuevoFondo;
    vendedor.bancoEntrego = (vendedor.bancoEntrego || 0) + fondoAgregar;
    
    // Registrar el movimiento
    if (!vendedor.movimientos) vendedor.movimientos = [];
    vendedor.movimientos.push({
        tipo: 'agregar',
        cantidad: fondoAgregar,
        fecha: fechaSeleccionada,
        horario: horario,
        saldoResultante: nuevoFondo,
        timestamp: new Date().toISOString()
    });
    
    // Guardar el vendedor actualizado
    guardarVendedores(vendedores);
    
    alert(`Se agregó ${fondoAgregar.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} al fondo (${horario === 'dia' ? 'Día' : 'Noche'}) en la fecha ${fechaSeleccionada}.\nNuevo saldo: ${nuevoFondo.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
    
    actualizarListaVendedores();
}

function quitarFondo(index, horario, fechaSeleccionada) {
    // Obtenemos el fondo actual desde localStorage si existe
    let fondoActual = 0;
    const storedFondo = localStorage.getItem(`fondoVendedor_${index}`);
    if (storedFondo !== null) {
        fondoActual = parseFloat(storedFondo);
    } else {
        fondoActual = vendedores[index].fondo;
    }
    
    const vendedor = vendedores[index];
    
    // Mostramos el fondo actual obtenido del localStorage
    const fondoQuitar = parseFloat(prompt(`Fondo actual: ${fondoActual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.\nIngrese la cantidad a quitar:`));
    
    if (isNaN(fondoQuitar) || fondoQuitar <= 0) {
        alert("Por favor, ingrese una cantidad válida mayor que cero.");
        return;
    }
    
    if (fondoQuitar > fondoActual) {
        alert(`No puede quitar más del fondo disponible (${fondoActual.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}).`);
        return;
    }
    
    // Actualizar el fondo en localStorage y en el objeto vendedor
    const nuevoFondo = fondoActual - fondoQuitar;
    localStorage.setItem(`fondoVendedor_${index}`, nuevoFondo.toString());
    
    // Actualizar el objeto vendedor en memoria
    vendedor.fondo = nuevoFondo;
    vendedor.bancoRecogio = (vendedor.bancoRecogio || 0) + fondoQuitar;
    
    // Registrar el movimiento
    if (!vendedor.movimientos) vendedor.movimientos = [];
    vendedor.movimientos.push({
        tipo: 'quitar',
        cantidad: fondoQuitar,
        fecha: fechaSeleccionada,
        horario: horario,
        saldoResultante: nuevoFondo,
        timestamp: new Date().toISOString()
    });
    
    // Guardar el vendedor actualizado
    guardarVendedores(vendedores);
    
    alert(`Se quitó ${fondoQuitar.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} del fondo (${horario === 'dia' ? 'Día' : 'Noche'}) en la fecha ${fechaSeleccionada}.\nNuevo saldo: ${nuevoFondo.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
    
    actualizarListaVendedores();
}

// Función para guardar los vendedores en localStorage
function guardarVendedores(vendedores) {
    localStorage.setItem('vendedores', JSON.stringify(vendedores));
}

// Exportar funciones para acceso global
window.modificarSaldo = modificarSaldo;
window.actualizarFondo = actualizarFondo;
window.inicializarFondosPorHorario = inicializarFondosPorHorario;
window.calcularFondoRecomendado = calcularFondoRecomendado;
window.obtenerFondoActual = obtenerFondoActual;
window.obtenerFondoAnterior = obtenerFondoAnterior;
window.sincronizarFondosEntreHorarios = sincronizarFondosEntreHorarios;
window.corregirFondosEntreHorarios = corregirFondosEntreHorarios;
window.obtenerFondosHistoricos = obtenerFondosHistoricos;
window.determinarFondoAnterior = determinarFondoAnterior;
window.determinarFondoAnteriorCronologico = determinarFondoAnteriorCronologico;
window.registrarActualizacionFondo = registrarActualizacionFondo;
window.actualizarFondoAutomaticamente = actualizarFondoAutomaticamente;
window.asegurarNumero = asegurarNumero;
window.agregarFondo = agregarFondo;
window.quitarFondo = quitarFondo;
window.guardarVendedores = guardarVendedores;
