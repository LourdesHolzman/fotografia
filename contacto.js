//Declaramos la url que vamos a usar para el GET
const URLPOSTS = 'https://jsonplaceholder.typicode.com/posts';
//Declaramos la información a enviar
const formEl = $('#formulario');

//Escuchamos el evento click del botón agregado
$('#enviar').click(() => {
  //extraer los datos de cada campo del formulario
  const formData = [].concat(formEl.serializeArray());
  //objeto con todos los datos para mandarlos al request
  const parsedForm = formData.reduce((prev, curr) => {
    return { ...prev, [curr.name]: curr.value };
  }, {});
  $.post(URLPOSTS, parsedForm, (respuesta, estado) => {
    if (estado === 'success') {
      console.log(respuesta);
    }
  });
});