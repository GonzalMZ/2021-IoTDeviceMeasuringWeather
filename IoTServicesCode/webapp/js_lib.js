/*
 * Javascript file to implement client side usability for 
 * Operating Systems Desing exercises.
 */
var server_address = "http://35.246.225.47:5000/"

var actual_device;

var paramstr = window.location.search.substr(1);
var paramarr = paramstr.split ("&");
var params = {};

for ( var i = 0; i < paramarr.length; i++) {
    var tmparr = paramarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
}

var medidas = [];

var get_current_sensor_data = function() {
	$.getJSON( server_address+"dso/measurements/", function( data ) {
		var tabla_meassures=document.getElementById("tabla_meassures");
		var tblBody = tabla_meassures.getElementsByTagName("tbody");
		for(var i=0;i<data.length;i++) {
			if (data[i].device == actual_device) {
				var tabla = [data[i].time, data[i].temperature, data[i].humidity];
				medidas.push(tabla);
				var fila = document.createElement("tr");
				var fecha = document.createElement("td");
				var textoFecha = document.createTextNode(data[i].time);
				var temperatura = document.createElement("td");
				var textoTemp = document.createTextNode(data[i].temperature);
				var humedad = document.createElement("td");
				var textoHumedad = document.createTextNode(data[i].humidity);

				fecha.appendChild(textoFecha);
				temperatura.appendChild(textoTemp);
				humedad.appendChild(textoHumedad);

				fila.appendChild(fecha);
				fila.appendChild(temperatura);
				fila.appendChild(humedad);

				tblBody[0].appendChild(fila);
			}
		}

	});
}

var get_device_list = function(){
	$.getJSON( server_address+"dso/devices/", function( data ) {
		var tabla_devices=document.getElementById("tabla_devices");
		var tblBody = tabla_devices.getElementsByTagName("tbody");
	for(var i=0;i<data.length;i++){
		var fila=document.createElement("tr");
		var id = document.createElement("td");
		var textoId = document.createTextNode(data[i].device_id);
		var estado = document.createElement("td");
		var textoEstado = document.createTextNode(data[i].estado);
		var ubicacion = document.createElement("td");
		var textoUbi = document.createTextNode(data[i].ubicacion);
		var fecha = document.createElement("td");
		var textoFecha = document.createTextNode(data[i].time);
		var celdaBoton = document.createElement("td");
		var boton = document.createElement("button");
		var textoBoton = document.createTextNode("Medidas");
		id.appendChild(textoId);
		estado.appendChild(textoEstado);
		ubicacion.appendChild(textoUbi);
		fecha.appendChild(textoFecha);
		boton.appendChild(textoBoton);
		boton.addEventListener("click", function(event){
			var device1 =this.parentElement.parentElement.firstChild.innerHTML;
			location.href='pag_measures.html?actual_device='+device1;
		});
		celdaBoton.appendChild(boton);

		fila.appendChild(id);
		fila.appendChild(estado);
		fila.appendChild(ubicacion);
		fila.appendChild(fecha);
		fila.appendChild(celdaBoton);

		tblBody[0].appendChild(fila);
	}
	});
}

function filtrar(){
	var fechaIni= document.getElementById("fechaIni").value;
	var fechaFin= document.getElementById("fechaFin").value;
	if (fechaIni=="" || fechaFin == "")
		alert("Debes introducir las fechas de inicio y fin!");
	else{
		var inputAnioIni=parseInt(fechaIni.substring(0,4));
		var inputMesIni=parseInt(fechaIni.substring(5,7));
		var inputDiaIni=parseInt(fechaIni.substring(8,10));
		var inputAnioFin=parseInt(fechaFin.substring(0,4));
		var inputMesFin=parseInt(fechaFin.substring(5,7));
		var inputDiaFin=parseInt(fechaFin.substring(8,10));
		if(inputAnioIni>inputAnioFin)
			alert("La fecha de Inicio debe ser anterior a la de fin! año");
		else if(inputAnioIni==inputAnioFin && inputMesIni>inputMesFin)
			alert("La fecha de Inicio debe ser anterior a la de fin! mes");
		else if(inputAnioIni==inputAnioFin && inputMesIni==inputMesFin
		&& inputDiaIni>inputDiaFin)
			alert("La fecha de Inicio debe ser anterior a la de fin! dia");
		else{
			var impar=false;
			for(var i=0; i<medidas.length;i++){
				$("#tabla_meassures tr:nth-child("+(i+2)+")").css("display", "table-row");
				var anio = parseInt(medidas[i][0].substring(6,10));
				var mes = parseInt(medidas[i][0].substring(3,5));
				var dia = parseInt(medidas[i][0].substring(0,2));
				var iniValido=false;
				var finValido=false;
				if(inputAnioIni<anio || (inputAnioIni == anio && inputMesIni <mes) || (inputAnioIni==anio && inputMesIni==mes && inputDiaIni<=dia))
					iniValido=true;
				if(inputAnioFin>anio || (inputAnioFin == anio && inputMesFin >mes) || (inputAnioFin==anio && inputMesFin==mes && inputDiaFin>=dia))
					finValido=true;
				if(!iniValido || !finValido)
					$("#tabla_meassures tr:nth-child("+(i+2)+")").css("display", "none");
				else{
					impar=!impar;
					if(impar)
						$("#tabla_meassures tr:nth-child("+(i+2)+")").css("background-color","white");
					else{
						$("#tabla_meassures tr:nth-child("+(i+2)+")").css("background-color","#e0e8f0");
					}
				}
			}
		}
	}
}

$(document).ready(function(){
	if(window.location.pathname.endsWith("/"))
		setInterval(get_device_list(),2000);
	else{
		actual_device = params["actual_device"].replaceAll("%20"," ");
		setInterval(get_current_sensor_data(),2000);
		console.log(actual_device);
		document.getElementById("h2").innerText=actual_device;
	}
});


