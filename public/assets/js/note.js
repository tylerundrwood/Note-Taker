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
