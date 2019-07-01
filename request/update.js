const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

var conn = null;

function updateDatabase(data, hash, callback) {
    let dataOut = JSON.stringify(data)
    pool.connect((err, client) => {
        if(err) throw err;
        client.query(`UPDATE url SET data = '${dataOut}' WHERE url = '${hash}'`, (err, res) => {
            if (err) throw err;
            client.release()
            callback(true)
        })
    })
}

function main(data, hash, callback) {
    if (!conn) {
        updateDatabase(data, hash, (res) => {
            callback(res)
        })
    } else {
        callback(conn)
    }
}

module.exports = main;