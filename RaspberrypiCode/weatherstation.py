import Adafruit_DHT
from publisher import *
import uuid
import threading
from signal import signal, SIGTERM, SIGHUP
import signal
from rpi_lcd import LCD
import time
import RPi.GPIO as GPIO
import sys
import serial
import pynmea2

lcd = LCD()
BUTTON_GPIO = 16
temperatura = False

def temperatureSensor():
    DHT_SENSOR = Adafruit_DHT.DHT11
    DHT_PIN = 4

    newtemperature = 0
    while True:
        humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
        if temperature is not None:
            if (newtemperature != temperature):
                newtemperature = temperature
                send_temperature(temperature)
            print("Temp={0:0.1f}C ".format(temperature))
            if temperatura:
                lcd.text("{0:0.1f}C ".format(temperature), 2)
        else:
            print("Sensore failure. Check wiring.")
            if temperatura:
                lcd.text("Failure", 2)
        time.sleep(60)


def humiditySensor():
    DHT_SENSOR = Adafruit_DHT.DHT11
    DHT_PIN = 4
    newhumidity = 0
    while True:
        humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
        if humidity is not None:
            if (newhumidity != humidity):
                newhumidity = humidity
                send_humidity(humidity)
            print("Hum={0:0.1f}% ".format(humidity))
            if not temperatura:
                lcd.text("{0:0.1f}% ".format(humidity), 2)
        else:
            print("Sensore failure. Check wiring.")
            if not temperatura:
                lcd.text("Failure", 2)

        time.sleep(60)

def getPosition():
    while True:
        port = "/dev/ttyAMA0"
        ser = serial.Serial(port, baudrate=9600, timeout=0.5)
        dataout = pynmea2.NMEAStreamReader()
        newdata = ser.readline()

        if str(newdata[0:5]) == "b'$GPRM'":
            maxsize = newdata.__len__()
            msg = pynmea2.parse(str(newdata)[2:maxsize])
            lat = msg.latitude
            lng = msg.longitude
            gps = str(lat)+ " ; " +str(lng)
            return str(gps)

def weatherSensor():
    make_connection()
    id = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff)
                   for ele in range(0,8*6,8)][::-1])
    print (id)
    print(getPosition())
    send_id(id+" - Raspberry 1")
    send_state("Activo")
    send_ubication(getPosition())

def safe_exit(signum, frame):
    lcd.clear()
    GPIO.cleanup()
    sys.exit(0)

def button_released_callback(channel):
    global temperatura
    lcd.clear()
    temperatura = not temperatura
    if temperatura:
        lcd.text("Temperature:", 1)
    else:
        lcd.text("Humidity:", 1)

def signal_handler(sig, frame):
    GPIO.cleanup()
    sys.exit(0)
    lcd.clear()

def lcdStart():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(BUTTON_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.add_event_detect(BUTTON_GPIO, GPIO.RISING, callback=button_released_callback, bouncetime=300)
    signal.signal(signal.SIGINT, signal_handler)


if __name__== "__main__":
    weatherSensor()
    lcdStart()
    temperature = threading.Thread(target=temperatureSensor)
    humidity = threading.Thread(target=humiditySensor)
    temperature.start()
    humidity.start()
