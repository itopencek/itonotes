const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://jvdgmaaklzropg:a07975a87d6140993195484852c45bb25db52135d53de31f09e82bf82cbb6e76@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d1qttojp2t6sab',
    ssl: true,
});

var conn = null;

function getData(url, callback) {
    pool.connect((err, client) => {
        client.query(`SELECT * FROM url WHERE url = '${url}'`, (err, response) => {
            if (err) throw err;
            if (response.rowCount == 0) {
                client.release()
                callback(false, '')
            } else if (response.rows[0].url === url) {
                let today = new Date().getTime();
                client.query(`UPDATE url SET date = '${today}' WHERE url = '${url}'`, (err) => {
                    if(err) throw err;
                    client.release()
                    callback(true, response.rows[0])
                })
            } else {
                client.release()
                callback(false, '')
            }

        })

    })
}

function main(url, callback) {
    if (!conn) {
        getData(url, (bool, data) => {
            callback(bool, data)
        })
    } else {
        callback(false, conn)
    }
}
module.exports = main;