import { generarId } from "./funciones.js";

//Crear objeto de cita - Unicamente para tomar los valores del formulario y asi poder validar
export const citaObj = {
    id: generarId(),
    paciente: '',
    propietario: '',
    telefono: '',
    email: '',
    fecha: '',
    sintomas: ''
}

//export let editando = false; //bandera para ver si estamos editando o creando una cita nueva
//La variable anterior para que se tome como global en modulos tenemos que utilizarla como un objeto
export let editando = {
    value: false //Ahora debemos cambiarlo en donde estamos utilizando esta variable, y usarla como editando.value
}

export let dB = {
    value: null
}