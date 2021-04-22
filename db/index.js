const { Pool } = require('pg');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const client  = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionString: process.env.DATABASE_URL,

})

client.connect()

async function createSong(paramsArray){
    const qryObj = {
        text: 'INSERT INTO repertorio (cancion, artista, tono) VALUES ($1, $2, $3)',
        values: paramsArray
    }        
    try {
        const result = await pool.query(qryObj);
        return result;
    } catch (error) {
        console.log(error)
        return error;
    }    
}

async function getSong(){
    try {
        const result = await pool.query('SELECT * FROM repertorio');
        return result;
    } catch (error) {
        console.log(error)
        return error;
    }   
}

async function updateSong(paramsArray){
    const qryObj = {
        text: "UPDATE repertorio SET cancion = $2, artista = $3, tono = $4 WHERE id = $1 RETURNING *",
        values: paramsArray
    }
    try {
        const result = await pool.query(qryObj);
        return result;
    } catch (error) {
        console.log(error)
        return error;
    }   
}

async function eliminateSong(id){
    const result = await pool.query('DELETE FROM repertorio WHERE id = $1 RETURNING *');
    try {
        return result;    
    } catch (error) {
        console.log(error)
        return error;
    }
}

module.exports = {
    createSong,
    getSong,
    updateSong,
    eliminateSong
}