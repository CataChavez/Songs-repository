//Imports
const http = require('http')
const fs = require('fs')
const url = require('url')
const db = require('./db/index')
const PORT = process.env.PORT || 5000


//Server
const server = http.createServer(async (req, res) => {
  //Routes
  //Home
  if (req.url == '/' && req.method == 'GET') {
    fs.readFile('index.html', (err, file) => {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(file, 'utf8')
      res.end()
    })
  }
  
  if (req.url == '/cancion' && req.method == 'POST') {
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
  }

  if (req.url == '/canciones' && req.method == 'GET') {
    const result = await db.getSong();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(result.rows));
    res.end();
  }

  if (req.url.startsWith('/cancion') && req.method == 'PUT') {
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
  }
  if (req.url.startsWith('/cancion') && req.method == 'DELETE') {
    const id = url.parse(req.url, true).query.id;
    const result = await db.eliminateSong(id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(result));
    res.end();
  }

})

.listen(PORT, () => console.log(`Listening on ${ PORT }`))

console.log(process.env)