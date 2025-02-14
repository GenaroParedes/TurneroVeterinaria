import { Notificacion } from "./classes/Notificacion.js";
import { AdminCitas } from "./classes/AdminCitas.js";
import { editando, citaObj } from './variables.js';
import {pacienteInput, propietarioInput, telefonoInput, emailInput, fechaAltaInput, sintomasTextarea, formulario, formularioInput} from './selectores.js';


//Como aca creamos las citas, creamos una instancia del adminCitas aca arriba - lo utilizamos en las funciones de agregar, actualizar, etc
const citas = new AdminCitas();

export function datosCita(e){ 
    //Para que esto funcione, el name de cada input debe llamarse igual a su propiedad correspondiente en el objeto citaObj
    citaObj[e.target.name] = e.target.value;
}

export function submitCita(e){
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
    if (editando.value){ //Para verificar si estamos editando o creando una nueva cita
        citas.actualizar({...citaObj}); //Esto se encarga de crear un nuevo objeto citaObj para que los nuevos valores no pisen los anteriores
        new Notificacion('Guardado correctamente', 'exito').mostrarHTML();
        formularioInput.value = 'Registrar Paciente';
        editando.value = false;
    } else {
        citas.agregar({...citaObj}); //Esto se encarga de crear un nuevo objeto citaObj para que los nuevos valores no pisen los anteriores
        new Notificacion('Paciente registrado', 'exito').mostrarHTML();
    }

    formulario.reset();
    reiniciarObjetoCita();
    //Si hubo una edición que nos cambia el nombre del boton, lo volvemos a cambiar al reiniciar el formulario
}

export function cargarEdicion(cita){
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

    editando.value = true; //cambio la bandera a true ya que estoy actualizando una cita y no creando una nueva
    formularioInput.value = 'Guardar Cambios';
}

export function reiniciarObjetoCita(){
    citaObj.id = generarId();
    citaObj.paciente = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.email = '';
    citaObj.fecha = '';
    citaObj.sintomas = '';
}

export function generarId(){
    return Math.random().toString(36).substring(2) + Date.now();
}