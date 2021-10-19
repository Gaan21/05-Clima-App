require('dotenv').config();

const { 
    leerInput,
    inquireMenu,
    pausa,
listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const main = async() => {

    const busquedas = new Busquedas();

    let opt;

    do {
        
        opt = await inquireMenu();

        switch (opt) {
            case 1:  //Buscar ciudad.
    //Mostrar mensaje
            const TermBusqueda = await leerInput('Ciudad: ');

    //Buscar los lugares
            //Array de lugares
            const lugares = await busquedas.ciudad( TermBusqueda ); //Si solo puede recibir un string devuelve el 1º que ponemos.
            //DUDA: Se trabaja con promesa y se pone el await para esperar la resolucion positiva de la promesa¿?¿?¿  
    
    //Seleccionar el lugar
            const idSeleccionado = await listarLugares(lugares);
            if ( idSeleccionado === '0' ) continue; //Si el id es 0 que continue a la siguiente iteracion.
            const lugarSeleccionado = lugares.find( lugar => lugar.id === idSeleccionado );

    //Guardar en BD.
            busquedas.agregarHistorial(lugarSeleccionado.nombre);

           
//lugarSeleccionado encuentra el objeto que tiene el id igual que el idSeleccionado
            //console.log(lugarSeleccionado);

                //Datos del clima
            const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng)

                //Mostrar resultados
                console.clear();
                console.log('\n Informacion del lugar \n'.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ', lugarSeleccionado.lng);
                console.log('Temperatura: ',clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log( 'Como está el tiempo: ',clima.desc) //descripcion);
            break;

            case 2:  //historial
                //busquedas.leerBD();
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i+1}`.green;
                    console.log(`${idx} ${lugar}`);
                })
            break;   
        }

        if ( opt !== 0 ) await pausa();
        //Para que pause menos cuando se le da a salir.

     } while( opt !== 0 );
}

main();