import paho.mqtt.client as mqtt
import time
def on_connect(client, userdata, flags,rc):
    if rc == 0:
        print("Connected success")
    else:
        print("Connected fail with code", {rc})

client = mqtt.Client()
def make_connection():
    client.username_pw_set(username="dso_server", password="dso_password")
    client.on_connect = on_connect
    client.will_set('/uc3m/classrooms/leganes/gr83/device_state', 'Inactivo')
    client.connect("34.89.211.37",1883,60)

def send_temperature(temperature):
    client.publish('/uc3m/classrooms/leganes/gr83/temperature', payload=temperature,qos=0,retain=False)
    time.sleep(1)

def send_humidity(humidity):
    client.publish('/uc3m/classrooms/leganes/gr83/humidity', payload=humidity,qos=0,retain=False)
    time.sleep(1)

def send_id(id):
    client.publish('/uc3m/classrooms/leganes/gr83/device_info', payload=id,qos=0,retain=False)
    time.sleep(1)

def send_state(state):
    client.publish('/uc3m/classrooms/leganes/gr83/device_state', payload=state, qos=0, retain=False)
    time.sleep(1)

def send_ubication(ubication):
    client.publish('/uc3m/classrooms/leganes/gr83/device_ubication', payload=ubication, qos=0, retain=False)
    time.sleep(1)
