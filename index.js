//Imports
const http = require('http')
const fs = require('fs')
const url = require('url-parse')
const db = require('./db/index')
const PORT = process.env.PORT || 5000


//Server
const server = http.createServer(async (req, res) => {
  //Routes
  //Home
  if (req.url == '/' && req.method == 'GET') {
    try {      
      fs.readFile('index.html', (err, file) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(file, 'utf8')
        res.end()
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  if (req.url == '/cancion' && req.method == 'POST') {
    try {
      let params = null;
      req.on('data', body => {
        params = body
      });
      req.on('end', async () => {
        const paramsArray = Object.values(JSON.parse(params));
        const result = await db.createSong(paramsArray);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(result));
        res.end();
      });
    } catch (error) {
      console.log(error)
    }
  }

  if (req.url == '/canciones' && req.method == 'GET') {
    try {
      const result = await db.getSong();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(result.rows));
      res.end();
    } catch (error) {
      console.log(error)
    }   
  }

  if (req.url.startsWith('/cancion') && req.method == 'PUT') {
    try {      
      const id = url.parse(req.url, true).query.id;
      let params = null;
      req.on('data', body => {
        params = body;
      })
      req.on('end', async () => {
        const paramsArray = Object.values(JSON.parse(params));
        paramsArray.unshift(id);
        const result = await db.updateSong(paramsArray);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(result));
        res.end();
      });
    } catch (error) {
      console.log(error)
    }
  }
  if (req.url.startsWith('/cancion') && req.method == 'DELETE') {
    try {
      const id = url.parse(req.url, true).query.id;
      const result = await db.eliminateSong(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(result));
      res.end();        
    } catch (error) {
      console.log(error)
    }
  } 
})

.listen(PORT, () => console.log(`Listening on ${ PORT }`))


