const { Pool } = require('pg');

const config = {
    users: 'cata',
    password: '1234',
    host: 'localhost',
    database: 'repertorio',
    port: 5432
}

const pool = new Pool(config);

async function createSong(paramsArray){
    const qryObj = {
        text: 'INSERT INTO repertorio(cancion, artista, tono) VALUES ($1, $2, $3)',
        values: paramsArray
    }

    const result = await pool.query(qryObj);
    return result;
}

async function getSong(){
    const result = await pool.query('SELECT * FROM repertorio');
    return result;
}

async function updateSong(paramsArray){
    const qryObj = {
        text: "UPDATE repertorio SET cancion = $2, artista = $3, tono = $4 WHERE id = $1 RETURNING *",
        values: paramsArray
    }
    const result = await pool.query(qryObj);
    return result;
}

async function eliminateSong(id){
    const result = await pool.query('DELETE FROM repertorio WHERE id = $1 RETURNING *');
    return result;    
}

module.exports = {
    createSong,
    getSong,
    updateSong,
    eliminateSong
}