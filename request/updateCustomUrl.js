const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://jvdgmaaklzropg:a07975a87d6140993195484852c45bb25db52135d53de31f09e82bf82cbb6e76@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d1qttojp2t6sab',
    ssl: true,
});

var conn = null;

function update(data, callback) {

    pool.connect((err, client) => {
        if (err) throw err;
        client.query(`SELECT * FROM url WHERE custom = '${data.input}'`, (err, response) => {
            if (err) throw err;
            if (response.rows.length === 0) {
                client.query(`UPDATE url SET custom = '${data.input}' WHERE url = '#${data.url}'`, (err) => {
                    if (err) throw err;
                    client.release()
                    callback(true)
                })
            }else{
                callback(false)
            }
        })
    })
}

function main(data, callback) {
    if (!conn) {
        update(data, (bool) => {
            callback()
        })
    } else {
        callback(conn)
    }
}

module.exports = main;