import time
import paho.mqtt.client as paho
from measurement_register_interface import *
from device_register_interface import *
from load_preferences import getPreferences


# global vars definition
current_temperature=0
current_humidity=0
current_device=""
current_state=""
current_ubication=""

def mostrarHora():
    result = time.localtime(time.time())
    dia=result.tm_mday
    mes=result.tm_mon
    anho=result.tm_year
    hora=result.tm_hour + 2
    if hora >= 24:
        hora = hora -24
        dia = dia +1
    minutos=result.tm_min
    segundos=result.tm_sec
    cero_horas=""
    cero_minutos= ""
    cero_segundos=""
    cero_meses=""
    cero_dias = ""
    if dia < 10:
        cero_meses = "0"
    if mes<10:
        cero_meses="0"
    if hora<10:
        cero_horas="0"
    if minutos < 10:
        cero_minutos="0"
    if segundos < 10:
        cero_segundos= "0"
    return cero_dias+str(dia)+'/'+cero_meses+str(mes)+'/'+str(anho)+' '+cero_horas+str(hora)+':'+cero_minutos+str(minutos)+':'+cero_segundos+str(segundos)

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected success")
        client.subscribe("/uc3m/classrooms/leganes/gr83/temperature")
        client.subscribe("/uc3m/classrooms/leganes/gr83/humidity")
        client.subscribe("/uc3m/classrooms/leganes/gr83/device_info")
        client.subscribe("/uc3m/classrooms/leganes/gr83/device_state")
        client.subscribe("/uc3m/classrooms/leganes/gr83/device_ubication")
    else:
        print("Connected fail with code", {rc})


# define mqtt callback
def on_message(client, userdata, message):
    global current_temperature, current_humidity, current_device, current_state, current_ubication
    print("received message =",str(message.payload.decode("utf-8")))
    if message.topic == "/uc3m/classrooms/leganes/gr83/temperature":
        current_temperature = float(message.payload.decode("utf-8"))
        data = {"temperature": current_temperature, "humidity": current_humidity, "time": mostrarHora(), "device": current_device}
        data2 = {"device": current_device, "estado": current_state, "ubicacion": current_ubication, "time": mostrarHora()}
        submit_device_info_to_store(data2)
        submit_data_to_store(data)
        print(data)
    if message.topic == "/uc3m/classrooms/leganes/gr83/humidity":
        current_humidity = float(message.payload.decode("utf-8"))
        data = {"temperature": current_temperature, "humidity": current_humidity, "time": mostrarHora(), "device": current_device}
        data2 = {"device": current_device, "estado": current_state, "ubicacion": current_ubication, "time": mostrarHora()}
        submit_device_info_to_store(data2)
        submit_data_to_store(data)
        print(data)
    if message.topic == "/uc3m/classrooms/leganes/gr83/device_state":
        current_state = message.payload.decode("utf-8")
        data = {"device": current_device, "estado": current_state, "ubicacion": current_ubication, "time": mostrarHora()}
        submit_device_info_to_store(data)
        print(data)

    if message.topic == "/uc3m/classrooms/leganes/gr83/device_info":
        current_device = message.payload.decode("utf-8")
        data = {"device": current_device, "estado": current_state, "ubicacion": current_ubication, "time": mostrarHora()}
        submit_device_info_to_store(data)
        print(data)

    if message.topic == "/uc3m/classrooms/leganes/gr83/device_ubication":
        current_ubication = message.payload.decode("utf-8")
        data = {"device": current_device, "estado": current_state, "ubicacion": current_ubication, "time": mostrarHora()}
        submit_device_info_to_store(data)
        print(data)


# Create client object client1.on_publish = on_publish #assign function to callback client1.connect(broker,port) #establish connection client1.publish("house/bulb1","on")
params = getPreferences("conf.yaml")
client=paho.Client()
client.username_pw_set(username=params["broker_user"], password=params["broker_pwd"])
client.on_connect = on_connect
# Bind function to callback
client.on_message=on_message
# Initializate cursor instance
print("connecting to broker ",params["broker_address"])
client.connect(params["broker_address"], params["broker_port"], params["broker_keep_alive"]) # connect
# Start loop to process received messages
client.loop_forever()
