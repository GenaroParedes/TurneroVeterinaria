import {pacienteInput, propietarioInput, telefonoInput, emailInput, fechaAltaInput, sintomasTextarea, formulario} from './selectores.js';
import { datosCita, submitCita } from "./funciones.js";


//Eventos
pacienteInput.addEventListener('change', datosCita);
propietarioInput.addEventListener('change', datosCita);
telefonoInput.addEventListener('change', datosCita);
emailInput.addEventListener('change', datosCita);
fechaAltaInput.addEventListener('change', datosCita);
sintomasTextarea.addEventListener('change', datosCita);

formulario.addEventListener('submit', submitCita);

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