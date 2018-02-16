window.onload = inicializar;
var fichero;
var storageRef;
var imagenesFBRef;
var formPeliculas;
var refPeliculas;
var tbodyTablaCambios;
var CREATE ="A馻dir cambio de pelicula";
var UPDATE = "Modificar cambio de pelicula";
var modo = CREATE;
var refPeliculaAEditar;


function inicializar() {

  fichero = document.getElementById("fichero");
  fichero.addEventListener("change", subirImagenAFirebase, false);

  storageRef = firebase.storage().ref();
  imagenesFBRef = firebase.database().ref().child("imagenesFB");

  mostrarImagenesDeFirebase();

   formPeliculas = document.getElementById("form-cambios");
  formPeliculas.addEventListener("submit", validar, false);

  tbodyTablaCambios = document.getElementById("tbody-tabla-cambios");

  refPeliculas = firebase.database().ref().child("peliculasCambiadas");

  mostrarPersonajesDeFirebase();
}


function mostrarImagenesDeFirebase(){
  imagenesFBRef.on("value", function(snapshot){
    var datos = snapshot.val();
    var result = "";
    for (var key in datos) {
      result += '<img width="200" class="img-thumbail" src="' + datos[key].url + '"/>';
    }
    document.getElementById("imagenes-de-firebase").innerHTML = result;
  });
}


function subirImagenAFirebase(){
var imagenASubir = fichero.files[0];

var uploadTask = storageRef.child('Imagenes/' + imagenASubir.name).put(imagenASubir);

document.getElementById("progreso").className = "";

uploadTask.on('state_changed',
function(snapshot){
// Se va mostrando el progreso de la subida de la imagen
 var progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
 document.getElementById("barra-de-progreso").style.width = progreso + "%";


}, function(error) {
// Gestionar el error si se produce
alert ("Hubo un error");

}, function() {
// Cuando se ha subido exit髎amente la imagen

var downloadURL = uploadTask.snapshot.downloadURL;
crearNodoEnBDFirebase(imagenASubir.name, downloadURL);
document.getElementById("progreso").className = "hidden";
});

}

function crearNodoEnBDFirebase(nombreImagen, downloadURL){
imagenesFBRef.push({ nombre: nombreImagen, url: downloadURL});

}


function mostrarPersonajesDeFirebase() {
refPeliculas.on("value", function(snap){
  var datos = snap.val();
  var filasAMostrar ="";
  for(var key in datos){
    filasAMostrar += "<tr>" +
              "<td>" + datos[key].peliculaACambiar + "</td>" +
              "<td>" +
              "<td>" + datos[key].creacion + "</td>" +
              "<td>" +
              "<td>" + datos[key].duracionACambiar + "</td>" +
              "<td>"+
              "<td>" + datos[key].personajeACambiar + "</td>" +
              "<td>"+
                '<button class="btn btn-default editar" data-pelicula = "'+ key +'">' +
                '<span class="glyphicon glyphicon-pencil"></span>' +
                '</button>' +
              "</td>" +
              '<td>' +
               '<button class="btn btn-danger borrar" data-pelicula = "'+ key +'">' +
                '<span class="glyphicon glyphicon-trash"></span>' +
                '</button>' +
               '</td>' +
             "</tr>";
  }

  tbodyTablaCambios.innerHTML = filasAMostrar;
  if (filasAMostrar != "") {
    var elementosEditables = document.getElementsByClassName("editar");
    for (var i = 0; i < elementosEditables.length; i++){
      elementosEditables[i].addEventListener("click", editarPeliculaDeFirebase, false);
    }

    var elementosBorrables = document.getElementsByClassName("borrar");
    for (var i = 0; i < elementosBorrables.length; i++){
      elementosBorrables[i].addEventListener("click", borrarPeliculaDeFirebase, false);
    }
  }
});
}



function editarPeliculaDeFirebase(){
var keyDePeliculasAEditar = this.getAttribute("data-pelicula");
  refPeliculaAEditar = refPeliculas.child(keyDePeliculasAEditar);
refPeliculaAEditar.once("value", function(snap){
  var datos = snap.val();
  document.getElementById("pelicula-a-cambiar").value = datos.peliculaACambiar;
  document.getElementById("creacion").value = datos.creacion;
  document.getElementById("duracion-a-cambiar").value = datos.duracionACambiar;
  document.getElementById("personaje-a-cambiar").value = datos.personajeACambiar;


});

document.getElementById("boton-enviar-cambio").value = UPDATE;
modo = UPDATE;
}



function borrarPeliculaDeFirebase() {
var keyDePeliculasABorrar = this.getAttribute("data-pelicula");
  refPeliculasABorrar = refPeliculas.child(keyDePeliculasABorrar);
refPeliculasABorrar.remove();
}



function enviarPeliculaAFirebase(event) {

event.preventDefault();
switch(modo){
  case CREATE:
  refPeliculas.push({
  peliculaACambiar: event.target.peliculaACambiar.value,
  creacion: event.target.creacion.value,
  duracionACambiar: event.target.duracionACambiar.value,
   personajeACambiar: event.target.personajeACambiar.value


});
  break;

  case UPDATE:
  refPeliculaAEditar.update({
    peliculaACambiar: event.target.peliculaACambiar.value,
    creacion: event.target.creacion.value,
  duracionACambiar: event.target.duracionACambiar.value,
  personajeACambiar: event.target.personajeACambiar.value

  })
  document.getElementById("boton-enviar-cambio").value = CREATE;
  modo = CREATE;
  break;
}

formPeliculas.reset();

}


function validar(event){

var creacion = event.target.creacion.value;
var huboUnError = false;

event.preventDefault();


var peliculaACambiar=event.target.peliculaACambiar.value;
if (peliculaACambiar ==undefined||peliculaACambiar=="") {
  document.getElementById("error-pelicula").style.visibility="visible";
  var huboUnError = true;
}
    else
  {
    document.getElementById("error-pelicula").style.visibility="hidden";
  }



  var duracionACambiar=event.target.duracionACambiar.value;
if (duracionACambiar ==undefined||duracionACambiar=="") {
  document.getElementById("error-duracion").style.visibility="visible";
  var huboUnError = true;
}
    else
  {
    document.getElementById("error-duracion").style.visibility="hidden";
  }



if (creacion == "") {
document.getElementById("error-creacion2").style.visibility ="visible";
huboUnError = true;

}else{
document.getElementById("error-creacion2").style.visibility ="hidden";
}

if (creacion<1 || creacion>2017){
if (creacion != ""){
document.getElementById("error-creacion1").style.visibility ="visible";
}

}else{
document.getElementById("error-creacion1").style.visibility ="hidden";
}



var personajeACambiar=event.target.personajeACambiar.value;
if (personajeACambiar ==undefined||personajeACambiar=="") {
  document.getElementById("error-personaje").style.visibility="visible";
  huboUnError = true;
}
    else
  {
    document.getElementById("error-personaje").style.visibility="hidden";
  }


  if(huboUnError == false){
    enviarPeliculaAFirebase(event);
  }
}
