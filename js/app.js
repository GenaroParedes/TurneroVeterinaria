//Variables/Selectores
const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const emailInput = document.querySelector('#email');
const fechaAltaInput = document.querySelector('#fecha');
const sintomasTextarea = document.querySelector('#sintomas');

const formulario = document.querySelector('#formulario-cita');
const formularioInput = document.querySelector('#formulario-cita input[type="submit"]');

const divCitas = document.querySelector('#citas');

//Eventos
pacienteInput.addEventListener('change', datosCita);
propietarioInput.addEventListener('change', datosCita);
telefonoInput.addEventListener('change', datosCita);
emailInput.addEventListener('change', datosCita);
fechaAltaInput.addEventListener('change', datosCita);
sintomasTextarea.addEventListener('change', datosCita);

formulario.addEventListener('submit', submitCita);

let editando = false; //bandera para ver si estamos editando o creando una cita nueva

/* IMPORTANTEEE!!!!!!!!! Cuando creamos nuevos elementos en el DOM, no es tan facil como llamarlos y luego aplicarle eventos.
Una vez que registramos una cita este boton ya lo podemos seleccionar, lo identificamos para cuando lo apretamos rellenar los campos automaticamente.
const btnEditar = document.querySelector('.btn-editar');
Evento para el btn editar - Solo si existe ejecuta el evento, ya que se crea el btn cuando registramos al menos una cita
Esto no se va a ejecutar porque JavaScript ejecuta todo, y como a la primera no lo encuentra luego no vuelve a buscar ese evento.
btnEditar?.addEventListener('click', () => {
})

En estos caso en vez de utilizar un eventListener, utilizamos eventHandler que se utiliza seguido a la creacion del objeto (en el codigo)
un eventHandler puede ser... btnEditar.onclick, btnEditar.onsubmit, btnEditar.onchange, etc... arranca siempre con on y seguido un evento
*/    

//Crear objeto de cita - Unicamente para tomar los valores del formulario y asi poder validar
const citaObj = {
    id: generarId(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: ''
}

//Creamos una clase que nos va a servir para mostrar alertas
class Notificacion {
    constructor(texto, tipo){
        this.texto = texto;
        this.tipo = tipo;
    }

    mostrarHTML(){
        //crear la notificacion
        const alerta = document.createElement('div');
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm');

        //Eliminar alertas duplicadas - que se muestre una unica alerta
        const alertaPrevia = document.querySelector('.alert');
        alertaPrevia?.remove(); //Este linea hace lo mismo que el if de abajo, primero pregunta si existe alertaPrevia
        /*if(alertaPrevia){
            alertaPrevia.remove();
        }*/

        //Si es de tipo error, agregar la clase de bg-red
        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500');

        //Mensaje de error
        alerta.textContent = this.texto;

        //Insertar en el DOM - Vamos al elemento padre del form, y luego insertBefore lo va a insertar antes del formulario
        formulario.parentElement.insertBefore(alerta, formulario)

        //Borramos el mensaje despues de cierto intervalo de tiempo
        setTimeout(() => {
            alerta.remove();
        }, 2500);
    }

}

class AdminCitas { //Este va a ser el contenedor de todas las citas
    constructor(){
        this.citas = [];
    }

    agregar(cita){
        this.citas = [...this.citas, cita];
        this.mostrar(); //Cada vez que agrego una cita la muestro
    }

    actualizar(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        this.mostrar();
    }

    eliminar(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
        this.mostrar();
    }

    mostrar(){
        //Limpiar el HTML previo
        this.limpiarHTML();

        //Una vez que limpiamos el HTML, vemos si hay citas en el array de citas, si no las hay ponemos un parrafo de no hay citas
        if(this.citas.length === 0){
            divCitas.innerHTML = `<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>`;
            return; //Para el codigo de abajo no se ejecute si no hay citas
        }

        //Generar las citas
        this.citas.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10' ,'rounded-xl', 'p-3');
        
            const paciente = document.createElement('p');
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;
        
            const propietario = document.createElement('p');
            propietario.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;
        
            const telefono = document.createElement('p');
            telefono.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            telefono.innerHTML = `<span class="font-bold uppercase">Telefono: </span> ${cita.telefono}`;
        
            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;
        
            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;
        
            const sintomas = document.createElement('p');
            sintomas.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

            //Botones de editar y eliminar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'btn-editar');
            btnEditar.innerHTML = `Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>`;
            //Cada vez que generemos un btnEditar le damos la posibilidad de reaccionar ante un click al boton
            //Cuando damos click en este boton se ejecuta el eventHandler
            btnEditar.onclick = () => cargarEdicion(cita); //pasamos como parametro la cita que estamos recorriendo

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = `Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            //Cuando damos click en este boton se ejecuta el eventHandler
            btnEliminar.onclick = () => {
                this.eliminar(cita.id);
            }

            const contenedorBotones = document.createElement('DIV');
            contenedorBotones.classList.add('flex', 'mt-10', 'justify-between');
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);
        
            // Agregar al HTML
            divCita.appendChild(paciente);
            divCita.appendChild(propietario);
            divCita.appendChild(telefono);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(contenedorBotones);
            divCitas.appendChild(divCita);
        });    
    }

    limpiarHTML(){
        while(divCitas.firstChild){
            divCitas.firstChild.remove();
        }    
    }
}

function datosCita(e){ 
    //Para que esto funcione, el name de cada input debe llamarse igual a su propiedad correspondiente en el objeto citaObj
    citaObj[e.target.name] = e.target.value;
}

//Como aca creamos las citas, creamos una instancia del adminCitas aca arriba
const citas = new AdminCitas();
function submitCita(e){
    e.preventDefault();
    
    //Con lo siguiente lo que hacemos es revisar todos los valores de todos los atributos del objeto citaObj,
    // si alguno esta vacío devuelve true
    if(Object.values(citaObj).some(valor => valor.trim() === '')){ 
        new Notificacion('Todos los campos son obligatorios', 'error').mostrarHTML();
        return;
    }
    /*Otra forma de hacerlo //paciente.trim() borra los espacios en blanco si hubiese introducido el usuario, sino va a pasar la validacion
    if(paciente.trim() === '' || propietario.trim() === '' || email.trim() === '' || fechaAlta === '' || sintomas.trim() === ''){ 
        console.log('Todos los campos son obligatorios');
        return;
    }*/


    /*  
        Crear una Copia del Objeto: El spread operator (...) desempaca todas las propiedades del objeto citaObj en un nuevo objeto.
        const nuevaCita = {...citaObj};
        Esto asegura que nuevaCita sea una copia independiente de citaObj, y cualquier cambio posterior en citaObj no afectará a nuevaCita.
    */   
    if (editando){ //Para verificar si estamos editando o creando una nueva cita
        citas.actualizar({...citaObj}); //Esto se encarga de crear un nuevo objeto citaObj para que los nuevos valores no pisen los anteriores
        new Notificacion('Guardado correctamente', 'exito').mostrarHTML();
        formularioInput.value = 'Registrar Paciente';
        editando = false;
    } else {
        citas.agregar({...citaObj}); //Esto se encarga de crear un nuevo objeto citaObj para que los nuevos valores no pisen los anteriores
        new Notificacion('Paciente registrado', 'exito').mostrarHTML();
    }

    formulario.reset();
    reiniciarObjetoCita();
    //Si hubo una edición que nos cambia el nombre del boton, lo volvemos a cambiar al reiniciar el formulario
}

function reiniciarObjetoCita(){
    citaObj.id = generarId();
    citaObj.paciente = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.email = '';
    citaObj.fecha = '';
    citaObj.sintomas = '';
}

function cargarEdicion(cita){
    Object.assign(citaObj, cita); //Esto asigna todos los valores de las propiedades de cita a citaObj
    /*Es como si hicieramos
    citaObj.paciente = cita.paciente;
    citaObj.propietario = cita.propietario;
    etc...
    */

    //Una vez cargado el objeto, debemos cargar todos esos valores de cita al formulario para poder editarlo
    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    telefonoInput.value = cita.telefono;
    emailInput.value = cita.email;
    fechaAltaInput.value = cita.fecha;
    sintomasTextarea.value = cita.sintomas;

    editando = true; //cambio la bandera a true ya que estoy actualizando una cita y no creando una nueva
    formularioInput.value = 'Guardar Cambios';
}

function generarId(){
    return Math.random().toString(36).substring(2) + Date.now();
}