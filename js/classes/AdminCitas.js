import { divCitas } from "../selectores.js";
import { cargarEdicion } from "../funciones.js";
import { dB } from "../variables.js";

export class AdminCitas { //Este va a ser el contenedor de todas las citas
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
        const transaction = dB.value.transaction(['turnosVeterinaria'], 'readwrite');
        const objectStore = transaction.objectStore('turnosVeterinaria');
        objectStore.delete(id);

        transaction.oncomplete = () =>{
            console.log('Se eliminó el turno con éxito');
            this.mostrar();
        }

        transaction.onerror = () => {
            console.log('Hubo un error al eliminar el turno');
        }
        //this.citas = this.citas.filter(cita => cita.id !== id); //Antes de usar la indexedBD
    }

    mostrar(){
        
        //Limpiar el HTML previo
        this.limpiarHTML();

        //Leer el contenido de la BD
        const objectStore = dB.value.transaction('turnosVeterinaria').objectStore('turnosVeterinaria');
        const total = objectStore.count();
        total.onsuccess = () => {
            if(total.result === 0){
                divCitas.innerHTML = `<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>`;
                return; //Para el codigo de abajo no se ejecute si no hay citas
            }
        }

        objectStore.openCursor().onsuccess = (e) => { //openCursor es una funcion que recorre uno por uno los datos de bd
            const cursor = e.target.result; //Si hay elementos en base de datos entra al if
            if(cursor){
                const { paciente, propietario, telefono, email, fecha, sintomas } = cursor.value;
                const divCita = document.createElement('div');
                divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10' ,'rounded-xl', 'p-3');
            
                const paciente1 = document.createElement('p');
                paciente1.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                paciente1.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${paciente}`;
            
                const propietario1 = document.createElement('p');
                propietario1.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                propietario1.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${propietario}`;
            
                const telefono1 = document.createElement('p');
                telefono1.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                telefono1.innerHTML = `<span class="font-bold uppercase">Telefono: </span> ${telefono}`;
            
                const email1 = document.createElement('p');
                email1.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                email1.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${email}`;
            
                const fecha1 = document.createElement('p');
                fecha1.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                fecha1.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${fecha}`;
            
                const sintomas1 = document.createElement('p');
                sintomas1.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
                sintomas1.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${sintomas}`;

                //Botones de editar y eliminar
                const btnEditar = document.createElement('button');
                btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'btn-editar');
                btnEditar.innerHTML = `Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>`;
                //Cada vez que generemos un btnEditar le damos la posibilidad de reaccionar ante un click al boton
                //Cuando damos click en este boton se ejecuta el eventHandler
                const turno = cursor.value; //Para el caso de INDEXDB tenemos que tomar la referencia cursor.value ya que si lo 
                // pasamos como parametro de una, siempre va a tomar el ultimo elementos de la BD
                btnEditar.onclick = () => cargarEdicion(turno); 

                const btnEliminar = document.createElement('button');
                btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
                btnEliminar.innerHTML = `Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
                //Cuando damos click en este boton se ejecuta el eventHandler
                btnEliminar.onclick = () => {
                    this.eliminar(turno.id);
                }

                const contenedorBotones = document.createElement('DIV');
                contenedorBotones.classList.add('flex', 'mt-10', 'justify-between');
                contenedorBotones.appendChild(btnEditar);
                contenedorBotones.appendChild(btnEliminar);
            
                // Agregar al HTML
                divCita.appendChild(paciente1);
                divCita.appendChild(propietario1);
                divCita.appendChild(telefono1);
                divCita.appendChild(email1);
                divCita.appendChild(fecha1);
                divCita.appendChild(sintomas1);
                divCita.appendChild(contenedorBotones);
                divCitas.appendChild(divCita);

                //Ve al siguiente elemento
                cursor.continue(); //Para que siga agregando los demas objetos en base de datos, hasta que no haya mas
            }
             
        }

        //Generar las citas
        /* Vamos a hacer lo siguiente obteniendo los elementos desde la base de datos
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
        });    */
    }

    limpiarHTML(){
        while(divCitas.firstChild){
            divCitas.firstChild.remove();
        }    
    }
}