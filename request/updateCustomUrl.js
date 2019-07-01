const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

var conn = null;

function update(data, callback) {

    pool.connect((err, client) => {
        if (err) throw err;
        client.query(`SELECT * FROM url WHERE url = '${data.input}'`, (err, response) => {
            if (err) throw err;
            if (response.rows.length === 0) {
                client.query(`UPDATE url SET url = '#${data.input}' WHERE url = '#${data.url}'`, (err) => {
                    if (err) throw err;
                    client.release()
                    callback(true)
                })
            } else {
                callback(false)
            }
        })
    })
}

function main(data, callback) {
    update(data, (bool) => {
        callback(bool)
    })

}

module.exports = main;