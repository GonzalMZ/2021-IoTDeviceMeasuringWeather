import mysql.connector
from load_preferences import getPreferences
import json

def connect_database():
    file = 'db_conf.yaml'
    params = getPreferences(file)

    mydb = mysql.connector.connect(
        host=params["dbhost"],
        user=params["dbuser"],
        password=params["dbpassword"],
        database=params["dbdatabase"]
    )
    return mydb


def devices_retriever():
    mydb = connect_database()
    r = []
    with mydb.cursor() as mycursor:
        mycursor.execute("SELECT device_id, estado, ubicacion, time FROM devices ORDER BY id DESC;")
        myresult = mycursor.fetchall()
        for device_id, estado, ubicacion, time in myresult:
            r.append({"device_id": device_id, "estado": estado, "ubicacion": ubicacion, "time": time})
        mydb.commit()
    result = json.dumps(r, sort_keys=True)
    return result


def devices_regiter(params):
    mydb = connect_database()
    # si quito el update y cambio los parametros de val me funciona bien..... meter update dentro del except
    with mydb.cursor() as mycursor:
        sql = "INSERT INTO devices (device_id, estado, ubicacion, time) VALUES (%s, %s, %s, %s)"
        val = (params["device"], params["estado"], params["ubicacion"], params["time"])
        try:
            mycursor.execute(sql, val)
            mydb.commit()
            print(mycursor.rowcount, "record inserted.")
        except:
            sql = "UPDATE devices SET estado = %s, ubicacion = %s, time = %s  WHERE device_id = %s"
            val = (params["estado"], params["ubicacion"], params["time"], params["device"])
            try:
                mycursor.execute(sql, val)
                mydb.commit()
                print(mycursor.rowcount, "record updated.")
            except:
                print("Error inserting or updating the device")
