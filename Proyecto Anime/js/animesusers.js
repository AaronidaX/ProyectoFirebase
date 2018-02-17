window.onload = inicializar;
var refAnimes;
var storageRef;
var imagenesRef;
var imagen;
const AGREGAR = "1";
const EDITAR = "2";
var modo = AGREGAR;
var refAnimesAEditar;
var comp;
var url;
var Nombre_de_la_Imagen;


function inicializar() {
  inicializarFirebase();
  var formulario = document.getElementById("formulario");
  formulario.addEventListener("submit", enviarAnime);
  imagen = document.getElementById("imagen");
  imagen.addEventListener("change", subirImagen);
  storageRef = firebase.storage().ref();
  imagenesRef = firebase.database().ref().child("Imagenes");
  document.getElementById("formulario").style.display = "none";


  mostrarAnimes();
}

function subirImagen(snapshot) {
  var imagenParaSubir = imagen.files[0];

  var uploadTask = storageRef.child('imagenes/' + imagenParaSubir.name).put(imagenParaSubir);

  document.getElementById("progreso").className = "";
  //Se va mostrando el progreso de subida
  uploadTask.on('state_changed',
    function(snapshot){
      //Si se produce un error
      var barraProgreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById("barra-de-progreso").style.width = barraProgreso + "%";
    }, function(error) {
      alert("Ha habido un error en el proceso");
    }, function() {
      //Si se sube con exito
      alert("Se ha subido con exito")
      var downloadURL = uploadTask.snapshot.downloadURL;
      url = downloadURL;
      document.getElementById("progreso").className = "hidden";
    });
}


function ObtenerNombreImagen(snapshot) {
  var datos = snapshot.val();
  console.log(datos);
  Nombre_de_la_Imagen = datos.nombreImagen;
}

function enviarAnime(event) {
  console.log(url);
  var comp = 0;
  var formulario = event.target;
  if(formulario.imagen.value == "") {
    event.preventDefault();
    document.getElementById("error-image").style.display = "block";
  } else if(formulario.imagen.value != "") {
    comp++;
    document.getElementById("error-image").style.display = "none";
  }
    if(formulario.anime.value == "") {
    event.preventDefault();
    document.getElementById("error-anime").style.display = "block";
  } else if(formulario.anime.value != "") {
    comp++;
    document.getElementById("error-anime").style.display = "none";
  } if(formulario.autor.value == "") {
    event.preventDefault();
    document.getElementById("error-autor").style.display = "block";
  } else if(formulario.autor.value != "") {
    comp++;
    document.getElementById("error-autor").style.display = "none";
  } if(formulario.description.value == "") {
    event.preventDefault();
    document.getElementById("error-des").style.display = "block";
  } else if(formulario.description.value != "") {
    comp++;
    document.getElementById("error-des").style.display = "none";
  } if(formulario.email.value == "") {
    event.preventDefault();
    document.getElementById("error-email").style.display = "block";
  } else if(formulario.email.value != "") {
    comp++;
    document.getElementById("error-email").style.display = "none";
  } if(formulario.fecha.value <=1863 || formulario.fecha.value >2020) {
    event.preventDefault();
    document.getElementById("error-fecha").style.display = "block";
  } else if(formulario.fecha.value != "") {
    comp++;
    document.getElementById("error-fecha").style.display = "none";
  } if(formulario.genero.value == "") {
    event.preventDefault();
    document.getElementById("error-genero").style.display = "block";
  } else if(formulario.genero.value != "") {
    comp++;
    document.getElementById("error-genero").style.display = "none";
  } if (formulario.recomendado.checked == false && formulario.norecomendado.checked == false) {
    event.preventDefault();
    document.getElementById("error-rec").style.display = "block";
  } else if (formulario.recomendado.checked == true | formulario.norecomendado.checked == true) {
    comp++;
    document.getElementById("error-rec").style.display = "none";
  }
  if (comp == 8) {

    var nombreImagen = document.getElementById("imagen").value;
    nombreImagen = nombreImagen.replace(/^.*[\\\/]/, '');

    if(modo == AGREGAR){

      refAnimes.push(
        {
          nombreImagen: nombreImagen,
          Portada: url,
          Anime: formulario.anime.value,
          Autor: formulario.autor.value,
          Descripcion: formulario.description.value,
          Email: formulario.email.value,
          Fecha: formulario.fecha.value,
          Genero: formulario.genero.value,
          Recomendado: formulario.radio.value
        }
      );
    } else {
      refAnimesAEditar.update({
        nombreImagen: nombreImagen,
        Portada: url,
        Anime: formulario.anime.value,
        Autor: formulario.autor.value,
        Descripcion: formulario.description.value,
        Email: formulario.email.value,
        Fecha: formulario.fecha.value,
        Genero: formulario.genero.value,
        Recomendado: formulario.radio.value
      });
      modo = AGREGAR;
    }
  }
}

function mostrarAnimes() {
  refAnimes = firebase.database().ref().child("Animes");
  refAnimes.on("value", mostrarDatos);
}

function mostrarDatos(snapshot) {
  var datos = snapshot.val();
  var tableBody = document.getElementById("tabla");
  var todosLosAnimes = "";
  for (var key in datos){
    todosLosAnimes += '<tr><td>' + '<img width="150" class="img-thumbnail" src="' + datos[key].Portada  + '"/>' + "</td><td>" + datos[key].Anime + "</td><td>" + datos[key].Autor + "</td><td>" + datos[key].Descripcion +
    "</td><td>" + datos[key].Email + "</td><td>" + datos[key].Fecha + "</td><td>" + datos[key].Genero + "</td><td>" + datos[key].Recomendado + "</td></tr>";
  }
  document.getElementById("tabla").innerHTML = todosLosAnimes;
  var imagenes = document.getElementsByClassName("borrar");
  for(var i = 0; i < imagenes.length; i++) {
    imagenes[i].addEventListener("click", borrarAnime);
  }
  var imagenes = document.getElementsByClassName("editar");
  for(var i = 0; i < imagenes.length; i++) {
    imagenes[i].addEventListener("click", editarAnime);
  }
}




function inicializarFirebase() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCnHhFYPTlmWPjm8WQYr_z0ZIRCQ8LeO_c",
    authDomain: "animes-8ad09.firebaseapp.com",
    databaseURL: "https://animes-8ad09.firebaseio.com",
    projectId: "animes-8ad09",
    storageBucket: "animes-8ad09.appspot.com",
    messagingSenderId: "203817166204"
  };
  firebase.initializeApp(config);
}
