const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid')

let db = require('./db/db.json')

// port for local host
const PORT = process.env.PORT || 6999;

// turn into a function
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gain access to public folder
app.use(express.static('public'));

// Route for index html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})

// Route for notes html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// Route for api/notes 
app.get('/api/notes', (req, res) => {
  res.json(db)
})

app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a note`);

 
  const { title, text } = req.body

  if(title && text) {
      const newNote = {
          title,
          text,
          id: uniqid()
      };

      // get existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
          if(err) {
              console.log(err)
          } else {
              // converts string to json obj
              const parsedNotes = JSON.parse(data)

              // add new note
              parsedNotes.push(newNote)

              // push new notes to db
              fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), null, (err) => {
                  if(err) {
                      console.log(err)
                  } else {
                      console.log('write file success!')
                  }
              })
          }
      })

      const response = {
          status: 'success',
          body: newNote
      }

      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  }
)
// alert for the server start
app.listen(PORT, () => {
  console.log(`Server is live on ${PORT} 🥶`)
})