const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://jvdgmaaklzropg:a07975a87d6140993195484852c45bb25db52135d53de31f09e82bf82cbb6e76@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d1qttojp2t6sab',
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