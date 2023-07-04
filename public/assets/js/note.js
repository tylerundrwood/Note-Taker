const express = require('express')
const path = require('path')
const uniqid = require('uniqid')
const fs = require('fs')
const util = require('util');

//json files
const dataBase = require('../db/db.json')

//port
const PORT = 5501

// express function
const app = express()

// read json data
app.use(express.json())

// url
app.use(express.urlencoded({ extended: true}))

const readFromFile = util.promisify(fs.readFile);

// gain access to public folder
app.use(express.static('./public'));

function browserRefresh(filePath) {
  var html = fs.readFileSync(filePath);
  var $ = cheerio.load(html);
  $('body').append(`<script src="${process.env.BROWSER_REFRESH_URL}"></script>`);
  return $.html();
}
// reflects the home page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '../public/index.html'))
);

// reflects the notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '../public/notes.html'))
);
