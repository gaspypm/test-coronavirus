let correcta = false;
let seleccionada = false;
let dificultades = [];
const body = document.getElementById("body");
const pregunta = document.getElementById("pregunta");
const respuesta1 = document.getElementById("respuesta1");
const respuesta2 = document.getElementById("respuesta2");
const respuesta3 = document.getElementById("respuesta3");
const indiceRespuestaCorrecta = document.getElementById("indiceRespuestaCorrecta");
const respuestas_span = [respuesta1, respuesta2, respuesta3];
const pdf = document.getElementById("pdf");
const nivel = document.getElementById("nivel");
const selectQuestion = document.getElementById("selectQuestion");
localStorage.setItem("numPregunta", 1);
const id = localStorage.getItem("id");
let cantPreguntas;
const categoria = (id).slice(0, -3);

document.getElementById("fuente").style.display = 'block';
document.getElementById("fuente").style.opacity = '1';


console.log("ID:", id);

switch (categoria) {
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
    cantPreguntas = 33;
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

for (let i = 1; i <= cantPreguntas; i++) {
  const option = document.createElement("option");
  option.text = "Question " + i;
  option.value = i;
  selectQuestion.add(option);
}

document.getElementById("prevQuestion").addEventListener('click', function () {
  let currentQuestion = parseInt(localStorage.getItem("numPregunta"));
  if (currentQuestion > 1) {
    localStorage.setItem("numPregunta", currentQuestion - 1);
    selectQuestion.value = (currentQuestion - 1).toString();
    main();
  }
  else if (currentQuestion - 1 == 0) {
    localStorage.setItem("numPregunta", cantPreguntas);
    selectQuestion.value = (cantPreguntas).toString();
    main();
  }
});

document.getElementById("nextQuestion").addEventListener('click', function () {
  let currentQuestion = parseInt(localStorage.getItem("numPregunta"));
  if (currentQuestion < cantPreguntas) {
    localStorage.setItem("numPregunta", currentQuestion + 1);
    selectQuestion.value = (currentQuestion + 1).toString();
    main();
  }
  else if (currentQuestion == cantPreguntas) {
    localStorage.setItem("numPregunta", 1);
    selectQuestion.value = 1;
    main();
  }
});

selectQuestion.addEventListener("change", function () {
  const selectedQuestion = this.value;
  localStorage.setItem("numPregunta", selectedQuestion);
  main();
});

async function obtenerArchivo(id) {
  const archivo = await fetch("/questions/" + id.toString() + ".csv"); // Recibo el archivo con las preguntas y respuestas
  const datos = await archivo.text(); // Convierto el archivo a texto
  const tabla = datos.split("\n"); // Separo las preguntas
  return Promise.resolve(tabla);
}

function obtenerPreguntas(tabla) {
  let preguntas = [];

  tabla.forEach(columna => {
    const fila = columna.split(";"); // Separo las preguntas de las respuestas
    const pregunta = fila[0];
    // const dificultad = fila[1];    // Agrego dificultad a la pregunta
    preguntas.push(pregunta.slice(0, -1)); // Agrego al array 'preguntas' cada pregunta
    dificultades.push(pregunta.slice(-1));
  });
  preguntas.pop(); // Elimino el último elemento que debe estar vacío

  return preguntas; // Retorno el array modificado
}

/*

function obtenerDificultad(tabla){
  let dificultades = [];

  tabla.forEach(columna => {
    const fila = columna.split(";"); // Separo preguntas, dificultades y respuestas
    const dificultad = fila[1];    
    dificultades.push(pregunta.slice(-1));
  });

  return dificultades;
}

*/

function obtenerRespuestas(tabla) {
  let respuestas = [];

  tabla.forEach(columna => {
    const fila = columna.split(";"); // Separo las preguntas de las respuestas

    for (let i = 1; i < 5; i++) { // Separo las respuestas
      if (fila[i] != undefined) {
        const respuesta = fila[i];
        respuestas.push(respuesta);
      }
    }
  });
  //console.log(respuestas);
  return respuestas;
}

function aleatorizarRespuestas(opciones) {
  let seed = 42;
  Math.seedrandom(seed);

  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
  }

  return opciones;
}

function verificarCorrecta(respuesta, correcta, respuesta1, respuesta2, respuesta3) {
  if (seleccionada == true) {
    return;
  }
  if (respuesta.innerHTML != correcta) {
    document.body.setAttribute('style', 'background-color: #2f308b');
    respuesta.style.background = "#D52444";
    console.log("The answer is incorrect.");
  }

  else {
    document.body.setAttribute('style', 'background-color: #2f308b');
    respuesta.style.background = "#008747";
    console.log("The answer is correct.");
  }
  mostrarOpciones(respuesta1, respuesta2, respuesta3);
  seleccionada = true;
}

function mostrarOpciones(respuesta1, respuesta2, respuesta3) {
  if (respuesta1.innerHTML == correcta) {
    respuesta1.style.background = "#008747";
    respuesta2.style.background = "#D52444";
    respuesta3.style.background = "#D52444";
  } else if (respuesta2.innerHTML == correcta) {
    respuesta1.style.background = "#D52444";
    respuesta2.style.background = "#008747";
    respuesta3.style.background = "#D52444";
  } else if (respuesta3.innerHTML == correcta) {
    respuesta1.style.background = "#D52444";
    respuesta2.style.background = "#D52444";
    respuesta3.style.background = "#008747";
  } else {
    respuesta1.style.background = "#D52444";
    respuesta2.style.background = "#D52444";
    respuesta3.style.background = "#D52444";
  }
}

async function main() {
  console.log("Entering main function");
  const id = localStorage.getItem("id");

  console.log("ID:", id);
  let preguntas = [];
  let respuestas = [];
  let opciones = [];
  let indicesRespuestas = [];
  let j = 0;

  for (let i = 0; i < cantPreguntas; i++) {
    indicesRespuestas[i] = i * 3;
  }

  selectQuestion.value = localStorage.getItem("numPregunta");

  let preguntaAleatoria = localStorage.getItem("numPregunta") - 1;
  let indiceAleatorio = indicesRespuestas[0];

  pdf.href = "/pdfs/" + (id).slice(0, -3) + "/" + (preguntaAleatoria + 1).toString(); // Redirijo a página de fuente

  indiceRespuestaCorrecta.innerHTML = indiceAleatorio;
  localStorage.setItem("numPregunta", preguntaAleatoria + 1);
  console.log("Question number:", preguntaAleatoria + 1);

  preguntas = obtenerPreguntas(await obtenerArchivo(id));
  respuestas = obtenerRespuestas(await obtenerArchivo(id));

  pregunta.innerHTML = preguntas[preguntaAleatoria];

  correcta = respuestas[indicesRespuestas[preguntaAleatoria]];

  for (let i = indicesRespuestas[preguntaAleatoria]; i < 105; i++) {
    if (respuestas[i].includes("\r")) {
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

  if (dificultades[preguntaAleatoria] >= 1 && dificultades[preguntaAleatoria] <= 3) {
    nivel.innerHTML = "Level " + (dificultades[preguntaAleatoria]).toString();
    console.log("Level:", dificultades[preguntaAleatoria]);
  }
  else {
    nivel.innerHTML = "Level 2";
    console.log("ERROR: Level not found for question " + preguntaAleatoria.toString());
  }

  for (let k = 0; k < opciones.length; k++) {
    respuestas_span[k].style.display = 'block';
    respuestas_span[k].innerHTML = opciones[k];
  }


  verificarCorrecta(respuesta1, respuestas[indicesRespuestas[preguntaAleatoria]], respuesta1, respuesta2, respuesta3);
  verificarCorrecta(respuesta2, respuestas[indicesRespuestas[preguntaAleatoria]], respuesta1, respuesta2, respuesta3);
  verificarCorrecta(respuesta3, respuestas[indicesRespuestas[preguntaAleatoria]], respuesta1, respuesta2, respuesta3);
}

document.addEventListener("DOMContentLoaded", function (event) {
  main();
});
