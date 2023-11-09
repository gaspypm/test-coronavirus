let correcta = false;
let seleccionada = false;
let dificultades = [];
const body = document.getElementById("body");
const numeroPregunta = document.getElementById("numeroPregunta");
const pregunta = document.getElementById("pregunta");
const respuesta1 = document.getElementById("respuesta1");
const respuesta2 = document.getElementById("respuesta2");
const respuesta3 = document.getElementById("respuesta3");
const indiceRespuestaCorrecta = document.getElementById("indiceRespuestaCorrecta");
const respuestas_span = [respuesta1, respuesta2, respuesta3];
const nivel = document.getElementById("nivel");
localStorage.setItem("numPregunta", 1);
const id = localStorage.getItem("id");
let cantPreguntas;
const categoria = (id).slice(0, -3);

console.log("ID:", id);

switch (categoria){
  case "home":
    cantPreguntas = 33;
    break;
  case "pharmacy":
    cantPreguntas = 29;
    break;
  case "hospital":
    cantPreguntas = 34;
    break;
  case "supermarket":
    cantPreguntas = 34;
    break;
  case "school":
    cantPreguntas = 34;
    break;
  case "bank":
    cantPreguntas = 30;
    break;
  case "lab":
    cantPreguntas = 34;
    break;
  case "zoo":
    cantPreguntas = 29;
    break;
  default:
    alert("There was an error, try selecting the category again.")
}
document.getElementById("logo").style.display = 'block';

document.getElementById("prevQuestion").addEventListener('click', function(){
  let currentQuestion = parseInt(localStorage.getItem("numPregunta"));
  if (currentQuestion > 1) {
    localStorage.setItem("numPregunta", currentQuestion - 1);
    numeroPregunta.innerHTML = "Question " + (currentQuestion - 1).toString();
    main(); // Update the question content
  }
  if (currentQuestion - 1 == 0) {
    localStorage.setItem("numPregunta", cantPreguntas - 1);
    numeroPregunta.innerHTML = "Question " + (cantPreguntas - 1).toString();
    main(); // Update the question content
  }
});

document.getElementById("nextQuestion").addEventListener('click', function(){
  let currentQuestion = parseInt(localStorage.getItem("numPregunta"));
  if (currentQuestion < cantPreguntas) {
    localStorage.setItem("numPregunta", currentQuestion + 1);
    numeroPregunta.innerHTML = "Question " + (currentQuestion + 1).toString();
    main(); // Update the question content
  }
  if (currentQuestion == cantPreguntas) {
    localStorage.setItem("numPregunta",  1);
    numeroPregunta.innerHTML = "Question 1";
    main(); // Update the question content
  }
});


async function obtenerArchivo(id){
  const archivo = await fetch("/questions/" + id.toString() + ".csv"); // Recibo el archivo con las preguntas y respuestas
  const datos = await archivo.text(); // Convierto el archivo a texto
  const tabla = datos.split("\n"); // Separo las preguntas
  return Promise.resolve(tabla);
}

function obtenerPreguntas(tabla){
  let preguntas = [];

  tabla.forEach(columna => {
    const fila = columna.split(";"); // Separo las preguntas de las respuestas
    const pregunta = fila[0];
    preguntas.push(pregunta.slice(0, -1)); // Agrego al array 'preguntas' cada pregunta
    dificultades.push(pregunta.slice(-1));
  });
  preguntas.pop(); // Elimino el último elemento que debe estar vacío

  return preguntas; // Retorno el array modificado
}

function obtenerRespuestas(tabla){
  let respuestas = [];

  tabla.forEach(columna => {
    const fila = columna.split(";"); // Separo las preguntas de las respuestas

    for(let i = 1; i < 5; i++){ // Separo las respuestas
      if(fila[i] != undefined){
        const respuesta = fila[i];
        respuestas.push(respuesta);
      }
    }
  });
  //console.log(respuestas);
  return respuestas;
}

function aleatorizarPreguntas(cantPreguntas){
  return 0;
}

function aleatorizarRespuestas(opciones){
  let indiceActual = opciones.length, indiceAleatorio;

  // Mientras haya elementos para aleatorizar
  while (0 !== indiceActual){
    // Elegir elemento restante
    indiceAleatorio = Math.floor(Math.random() * indiceActual);
    indiceActual--;

    // Intercambiar ese elemento por un elemento existente
    [opciones[indiceActual], opciones[indiceAleatorio]] = [opciones[indiceAleatorio], opciones[indiceActual]];
  }

  return opciones;
}

function verificarCorrecta(opcion, correcta, respuesta1, respuesta2, respuesta3){
  if(seleccionada == true){
    return;
  }
  if(opcion.innerHTML != correcta){
    document.body.setAttribute('style', 'background-color: #F63E52');
    opcion.style.background = "#D52444";
    console.log("The answer is incorrect.");
  }

  else {
    document.body.setAttribute('style', 'background-color: #00A653');
    opcion.style.background = "#008747";
    console.log("The answer is correct.");
  }

  setTimeout(function(){ // Después de 1 segundo de elegir muestro si las otras opciones son correctas o no
    mostrarOpciones(respuesta1, respuesta2, respuesta3);
    document.getElementById("fuente").style.display = 'block';
    document.getElementById("fuente").style.opacity = '1';
  }, 1000);
}

function mostrarOpciones(respuesta1, respuesta2, respuesta3){
  if(respuesta1.innerHTML == correcta){
    respuesta1.style.background = "#008747";
    respuesta2.style.background = "#D52444";
    respuesta3.style.background = "#D52444";
  } else if(respuesta2.innerHTML == correcta){
    respuesta1.style.background = "#D52444";
    respuesta2.style.background = "#008747";
    respuesta3.style.background = "#D52444";
  } else if(respuesta3.innerHTML == correcta){
    respuesta1.style.background = "#D52444";
    respuesta2.style.background = "#D52444";
    respuesta3.style.background = "#008747";
  } else{
    respuesta1.style.background = "#D52444";
    respuesta2.style.background = "#D52444";
    respuesta3.style.background = "#D52444";
  }
}

async function main(){
  const id = localStorage.getItem("id");
  let numPregunta;
  let cantPreguntas;
  const categoria = (id).slice(0, -3);

  console.log("ID:", id);
  let preguntas = [];
  let respuestas = [];
  let opciones = [];
  let indicesRespuestas = [];
  let j = 0;

  switch (categoria){
    case "home":
      cantPreguntas = 33;
      break;
    case "pharmacy":
      cantPreguntas = 29;
      break;
    case "hospital":
      cantPreguntas = 34;
      break;
    case "supermarket":
      cantPreguntas = 34;
      break;
    case "school":
      cantPreguntas = 34;
      break;
    case "bank":
      cantPreguntas = 30;
      break;
    case "lab":
      cantPreguntas = 34;
      break;
    case "zoo":
      cantPreguntas = 29;
      break;
    default:
      alert("There was an error, try selecting the category again.")
  }

  for(let i = 0; i < cantPreguntas; i++){
    indicesRespuestas[i] = i*3;
  }

  let preguntaAleatoria = localStorage.getItem("numPregunta") - 1;
  let indiceAleatorio = indicesRespuestas[0];

  indiceRespuestaCorrecta.innerHTML = indiceAleatorio;
  numeroPregunta.innerHTML = "Question " + (preguntaAleatoria+1).toString();
  localStorage.setItem("numPregunta", preguntaAleatoria+1);
  console.log("Question number:", preguntaAleatoria+1);
  respuestas_span[0].style.display = 'none';
  respuestas_span[1].style.display = 'none';
  respuestas_span[2].style.display = 'none';

  preguntas = obtenerPreguntas(await obtenerArchivo(id));
  respuestas = obtenerRespuestas(await obtenerArchivo(id));

  pregunta.innerHTML = preguntas[preguntaAleatoria];

  correcta = respuestas[indicesRespuestas[preguntaAleatoria]];

  for (let i = indicesRespuestas[preguntaAleatoria]; i < 105; i++){
    if (respuestas[i].includes("\r")){
      respuestas_span[j].innerHTML = respuestas[i];
      opciones[j] = respuestas[i];
      break;
    }
    else {
      opciones[j] = respuestas[i];
    }
    j++;
  }

  opciones = aleatorizarRespuestas(opciones);

  if (dificultades[preguntaAleatoria] >= 1 && dificultades[preguntaAleatoria] <= 3){
      nivel.innerHTML = "Level " + (dificultades[preguntaAleatoria]).toString();
      console.log("Level:", dificultades[preguntaAleatoria]);
  }
  else{
      nivel.innerHTML = "Level 2";
      console.log("ERROR: Level not found for question " + preguntaAleatoria.toString());
  }

  for (let k = 0; k < opciones.length; k++){
    respuestas_span[k].style.display = 'block';
    respuestas_span[k].innerHTML = opciones[k];
  }

  respuesta1.addEventListener('click', function(){
    verificarCorrecta(respuesta1, respuestas[indicesRespuestas[preguntaAleatoria]], respuesta1, respuesta2, respuesta3);
    seleccionada = true;
  })

  respuesta2.addEventListener('click', function(){
    verificarCorrecta(respuesta2, respuestas[indicesRespuestas[preguntaAleatoria]], respuesta1, respuesta2, respuesta3);
    seleccionada = true;
  })

  respuesta3.addEventListener('click', function(){
    verificarCorrecta(respuesta3, respuestas[indicesRespuestas[preguntaAleatoria]], respuesta1, respuesta2, respuesta3);
    seleccionada = true;
  })

}

document.addEventListener("DOMContentLoaded", function(event){
  main();
});
