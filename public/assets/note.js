const express = require('express')
const path = require('path')
const uniqid = require('uniqid')
const fs = require('fs')

let db = require('./db/db.json')

// port for local host
const PORT = process.env.PORT || 6999;

// turn into a function
const app = express()

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gain access to public folder
app.use(express.static('public'));

// Route for index html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

// Route for notes html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// Route for api/notes 
app.get('/api/notes', (req, res) => {
  res.json(db)
})