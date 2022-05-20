import mysql.connector
from load_preferences import getPreferences
import json

def connect_database ():
    file = 'db_conf.yaml'
    params = getPreferences(file)

    mydb = mysql.connector.connect(
        host = params["dbhost"],
        user = params["dbuser"],
        password = params["dbpassword"],
        database = params["dbdatabase"]
    )
    return mydb

def measurements_retriever():
    mydb = connect_database()
    r = []
    with mydb.cursor() as mycursor:
        mycursor.execute("SELECT temperature, humidity, time, device FROM sensor_data ORDER BY id DESC;")
        myresult = mycursor.fetchall()
        for temperature, humidity, time, device in myresult:
            r.append({"temperature": temperature, "humidity": humidity, "time": time, "device": device})
        mydb.commit()
        result = json.dumps(r, sort_keys=True)
    return result

def measurements_register(params):
    mydb = connect_database()
    with mydb.cursor() as mycursor:
        sql = "INSERT INTO sensor_data (temperature, humidity, time, device) VALUES (%s, %s, %s, %s)"
        val = (params["temperature"], params["humidity"], params["time"], params["device"])
        mycursor.execute(sql, val)
        mydb.commit()
        print(mycursor.rowcount, "record inserted.")
