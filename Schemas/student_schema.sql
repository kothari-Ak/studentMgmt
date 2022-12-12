create database Student_Management;

CREATE TABLE systemlogs(
    id SERIAL PRIMARY KEY,
    userName varchar(55) ,
    password varchar(55) ,
);


ALTER TABLE studenttable ALTER Name TYPE text;

ALTER TABLE logindatabase
ADD CONSTRAINT uniq
unique (userName);

ALTER TABLE systemlogs
RENAME COLUMN Date TO Event_Date;

