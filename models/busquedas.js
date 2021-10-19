const fs = require ('fs');

const axios = require('axios');


class Busquedas {

    historial = [];
    bdPath = './BD/database.json';

    constructor() {
        //TODO: leer DB si existe
        this.leerBD();
    }


    get historialCapitalizado(){
        //Poner mayusculas correctamente
        return this.historial.map( lugar =>{

            let palabras = lugar.split(' ');  //Para separa el Arreglo por espacios.
            palabras = palabras.map( palabra => palabra[0].toUpperCase() + palabra.substring(1) );

            return palabras.join( ' ' ); //Para volver a unir el Arraylist
        });
            
            
    }


    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY, 
            //Usamos la variable de entorno MAPBOX despues de añadirla con dotenv.
            'limit': 5,
            'languaje': 'es'
        }
    }


    async ciudad( lugar = '' ) {

        try {
            //peticion http
            //axios.default.create
            const instancia = axios.create({  
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
                //Hacer algo parecido al getp paramsMapbox en la tarea
               
            });

            const respuesta = await instancia.get();
             //console.log(respuesta.data.features); 
            //Para conseguir los datos se usa el .data de lo que nos devuelve axios.get. 
            //El .features es el array con los datos de los diferentes objetos encontrados.
            //return [];  //Por eso devuelve un Array
            return respuesta.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));        
//Metodo map de los Arrays para devolver el objeto que queremos que sea parte del nuevo elemento del array.
//DUDA: Regresar implicitamente un objeto¿?. ({}) Para devolver un objeto de forma implicita-
              
                //Despues escribimos las propiedades que queremos obtener del nuevo elemento.

        } catch (error) {
            console.log('No se encontro información');
            return [];
        }
       
        //return []; //Devolver los lugares que coincidan con la busqueda introducida.
    }


    //Con metodo get
     get paramsOpenweather() {
        return {
            appid: process.env.OPENWEATHER_KEY, 
            //Usamos la variable de entorno MAPBOX despues de añadirla con dotenv.
            units: 'metric',
            lang: 'es'
        }
    } 

     async climaLugar( lat, lon ){

        try {

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,   
                params: { ...this.paramsOpenweather, lat, lon  }
                //Desestructuracion de objeto para añadir a los parametros la lat y lon
            })

            const respuesta = await instance.get();
            
            //Instancia axios.create() mandar argumentos,base del url,parametros
//De la respuesta del axios extraigo la data
            // resp.data
            const { weather, main } = respuesta.data;
            //Los objetos que extraemos de la data del weather

            return { //Retornar la resolucion de la promesa del async
                //Todo viene de postman
                desc: weather[0].description, //weather[0].des
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error)
        }
    }


    agregarHistorial( lugar = ''){

    //TODO: prevenir duplicados
        if (this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return; // return para que no haga nada
        }

        this.historial = this.historial.splice(0,5);//Para que solo guarde 6 posiciones.

        this.historial.unshift( lugar.toLocaleLowerCase() );
        //Para añadir a el Array historial un elemento al principio.

        this.guardarBD();
    }

    //Grabar en BD
    guardarBD(){

        const payload = {
            historial: this.historial
            //Para grabar mas de una propiedad. Ej tiempo: this.tiempo
        };

        fs.writeFileSync( this.bdPath,JSON.stringify(payload) );

    }

    leerBD(){
        //Debe existir
        //Si existe: cargar informacion
        //const info  readfilesync.... path.... {encoding: 'utf-8'}

        //const data = JSON.fhgh( info )

        //this.historial = ...historial

        if ( !fs.existsSync(this.bdPath) ) { //Si no existe return null.
            return;
        }
    
        const info = fs.readFileSync(this.bdPath, { encoding: 'utf-8'}); //utf Para que sea legible
        const data = JSON.parse( info ); //El data pasa a ser un objeto JSON.
        
        this.historial = data.historial;
        //A la variable historial le damos el valor de lo que hay en el archivo JSON

    }
}

module.exports = Busquedas;