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

function browserRefresh() {
    var html = fs.readFileSync('./notes');
    var $ = cheerio.load(html);
    $('body').append(`<script src="${process.env.BROWSER_REFRESH_URL}"></script>`);
    return $.html();
  }
  
  // get api notes
  app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for tips`);
    readFromFile(dataBase).then((data) => res.json(JSON.parse(data)));
  })
  
  const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

  const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };
  
  // post api notes
  app.post('/api/notes', (req, res) => {
    // Let the client know that their POST request was received
    res.json(`${req.method} request received`);
    
      // deconstruct assignment for the req.body
      const { title, text } = req.body;
      // review object
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
          title,
          text,
          noteId: uniqid()
        };
    
        readAndAppend(newNote, '../db/db.json');
        console.log(`Note added successfully 🚀`);
      } else {
        res.error('Error in adding note');
      }
  })
  
  
  // server listen
  app.listen(PORT, () => {
      console.log(`listening on ${PORT}`)
  })