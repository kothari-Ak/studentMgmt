"use strict";
const { Client } = require('pg');
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "@Krishna7",
    database: "Student_Management"
});
module.exports = client;
