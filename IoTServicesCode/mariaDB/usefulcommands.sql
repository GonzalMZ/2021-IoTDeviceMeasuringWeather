# create database
create database iot_data;

# create a new user and grant privileges to this user on the database
grant all privileges on iot_data.* TO 'iot_user'@'%' identified by '9R[-RP#64nY7*E*H';

# After modifying the MariaDB grant tables, execute the following command
flush privileges;

use iot_data;

# create table for sensor data
CREATE TABLE sensor_data (
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    humidity float NOT NULL,
    temperature float NOT NULL,
    time varchar(50),
    device varchar(50) NOT NULL,
    PRIMARY KEY(id)
);

# query over table
SELECT temperature, humidity FROM sensor_data ORDER BY id DESC LIMIT 1;

# create table for storing device IDs
CREATE TABLE devices (
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    device_id varchar(50) NOT NULL,
    UNIQUE (device_id),
    estado varchar(20),
    ubicacion varchar(50),
    time varchar(50),
    PRIMARY KEY (id)
);

# query over table
SELECT device_id FROM devices ORDER BY id DESC LIMIT 1;
