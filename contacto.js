/*const URLGET = 'enviar.php'
var formulario = document.getElementById('formulario')

formulario.addEventListener('submit', function(e){
    e.preventDefault();
    console.log('enviado')

    var datos = new FormData(formulario);

    console.log(datos)
    console.log(datos.get('name'))
    console.log(datos.get('email'))
    console.log(datos.get('asunto'))
    console.log(datos.get('mensaje'))

    fetch('enviar.php', {
        method: 'POST',
        body:datos
    })

        .then(data => {
            console.log(data)
        })
})
*/



//Declaramos la url que vamos a usar para el GET
const URLGET   = "https://jsonplaceholder.typicode.com/posts"
//Declaramos la información a enviar
//const infoPost = document.getElementById('formulario')

const infoPost = {nombre:"nombre",
email:"email",
asunto:"asunto",
mensaje:"mensaje"}

document.getElementById('formulario')

//Escuchamos el evento click del botón agregado
$("#enviar").click(() => { 
    $.post(URLGET, infoPost ,(respuesta, estado) => {
        if(estado === "success"){
            console.log('infoPost');
        }  
    });
});

