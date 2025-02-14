import { formulario } from '../selectores.js';

//Creamos una clase que nos va a servir para mostrar alertas
export class Notificacion {
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