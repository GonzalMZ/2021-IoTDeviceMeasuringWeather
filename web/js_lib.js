/*
 * Javascript file to implement client side usability for 
 * Operating Systems Desing exercises.
 */
var server_address = "http://34.89.251.39:5000/"

var get_current_sensor_data = function() {
	$.getJSON( server_address+"dso/measurements/", function( data ) {
		$( ".sensor_measures" ).html( "Temperature: " + data.temperature + " C | Humidity " + data.humidity + " %" );
	});
}

var get_device_list = function(){
	$.getJSON( server_address+"dso/devices/", function( data ) {
		$( ".device_list" ).html( "Device Id: " + data.device_id);
	});
}

var devices=[["2.1.C05", "Activo", "40.55; -3.76", "19/05/2021 18:55:04"],
["2.1.C04", "Activo", "40.55; -3.76", "19/05/2021 18:55:04"],
["2.1.C05", "Activo", "40.55; -3.76", "19/05/2021 18:55:04"],
["2.1.C05", "Activo", "40.55; -3.76", "19/05/2021 18:55:04"]];

var meassures = [["13/05/2021 18:55:04", "24", "31.1"],
["19/05/2021 18:55:04", "24", "31.1"],
["19/05/2020 18:55:04", "24", "31.1"],
["19/07/2021 18:55:04", "24", "31.1"]];

function getDevices(){
	var tabla_devices=document.getElementById("tabla_devices");
	var tblBody = tabla_devices.getElementsByTagName("tbody");

	for(var i=0;i<devices.length;i++){
		var fila=document.createElement("tr");
		var id = document.createElement("td");
		var textoId = document.createTextNode(devices[i][0]);
		var estado = document.createElement("td");
		var textoEstado = document.createTextNode(devices[i][1]);
		var ubicacion = document.createElement("td");
		var textoUbi = document.createTextNode(devices[i][2]);
		var fecha = document.createElement("td");
		var textoFecha = document.createTextNode(devices[i][3]);
		var celdaBoton = document.createElement("td");
		var boton = document.createElement("button");
		var textoBoton = document.createTextNode("Medidas");

		id.appendChild(textoId);
		estado.appendChild(textoEstado);
		ubicacion.appendChild(textoUbi);
		fecha.appendChild(textoFecha);
		boton.appendChild(textoBoton);
		boton.addEventListener("click", function(){location.href='pag_meassures.html'});
		celdaBoton.appendChild(boton);

		fila.appendChild(id);
		fila.appendChild(estado);
		fila.appendChild(ubicacion);
		fila.appendChild(fecha);
		fila.appendChild(celdaBoton);

		tblBody[0].appendChild(fila);
	}
}

function getMeassures(){
	var tabla_meassures=document.getElementById("tabla_meassures");
	var tblBody = tabla_meassures.getElementsByTagName("tbody");
	for(var i=0;i<meassures.length;i++){
		var fila=document.createElement("tr");
		var fecha = document.createElement("td");
		var textoFecha = document.createTextNode(meassures[i][0]);
		var temperatura = document.createElement("td");
		var textoTemp = document.createTextNode(meassures[i][1]);
		var humedad = document.createElement("td");
		var textoHumedad = document.createTextNode(meassures[i][2]);

		fecha.appendChild(textoFecha);
		temperatura.appendChild(textoTemp);
		humedad.appendChild(textoHumedad);

		fila.appendChild(fecha);
		fila.appendChild(temperatura);
		fila.appendChild(humedad);

		tblBody[0].appendChild(fila);
	}
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
			for(var i=0; i<meassures.length;i++){
				$("#tabla_meassures tr:nth-child("+(i+2)+")").css("display", "table-row");
				var anio = parseInt(meassures[i][0].substring(6,10));
				var mes = parseInt(meassures[i][0].substring(3,5));
				var dia = parseInt(meassures[i][0].substring(0,2));
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
	if(window.location.pathname.endsWith("pag_devices.html"))
		getDevices();
	else{
		getMeassures();
		var h3 = document.getElementsByTagName("h2");
		h3[0].innerHTML="Dispositivo "+devices[0][0]+" - " + devices[0][1]+" - "+ devices[0][2];
	}
});

get_device_list()
setInterval(get_current_sensor_data,2000)
