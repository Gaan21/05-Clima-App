const inquirer = require('inquirer');
require('colors');

//Creacion del Array tal cual lo pide el inquirer. TODO EN LA DOCUMENTACION OFICIAL DE INQUIRER
const preguntas = [
    {
        type: 'list',
        name: 'opt',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,  //El valor con el que el programa trabaja
                name: `${'1.'.green} Buscar ciudad` //Lo que se ve en consola
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    }
];

const inquireMenu = async() => {

    console.clear()
    console.log('========================='.green);
    console.log('  Seleccione una opcion'.white);
    console.log('=========================\n'.green);

    const { opt } = await inquirer.prompt(preguntas);
    //opt = Se recibe un Array con cada una de las preguntas que queremos en el menu
    //DESESTRUCTURACION { OPT }

    return opt;
}


const pausa = async () => { 
    
    const question = 
    [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'enter'.green} para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
    //Espera a que se presione enter para continuar con el programa.
}

const leerInput = async ( mensaje ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message: mensaje,
            validate( value ){  //Funcion que viene en la documentacion oficial del inquirer.
                if (value.length === 0 ) {
                    return 'Por favor ingrese un valor';                    
                }
                    return true; //La validacion paso.
            }
        }
    ];

    const { desc } = await inquirer.prompt(question)
    return desc;
}


const listarLugares = async ( lugares = [] ) => {

    const choices = lugares.map( ( lugar, i ) => {
    //Array con el .map para crear el menu con cada opcion en una posicion del Array.
    const idx = `${i + 1}.`.green;
    
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}` 
        }
    });

    choices.unshift({ //Añade un valor al principio del Array
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices: choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
//Desestructuramos el id. DUDA: el id se convierte en un Array con las preguntas??
    return id;
}

const confirmar = async (mensaje) => {

    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ];
    const { ok } = await inquirer.prompt(pregunta);
    return ok;
}


const mostrarListadoChecklist = async ( tareas = [] ) => {

    const choices = tareas.map( ( tarea, i ) => {
    //Array con el .map para crear el menu con cada opcion en una posicion del Array.
    const idx = `${i + 1}.`.green;
    
        return {
            value: tarea.id,
            name: `${idx} ${tarea.descripcion}`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices: choices
        }
    ]

    const { ids } = await inquirer.prompt(pregunta);
    return ids;
}


module.exports = {
    inquireMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}