const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://jvdgmaaklzropg:a07975a87d6140993195484852c45bb25db52135d53de31f09e82bf82cbb6e76@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d1qttojp2t6sab',
    ssl: true,
});
var conn = null;

function randomNumber(callback) {
    let i = 0;
    let url = '';
    let number = Math.floor(Math.random() * 1000) + 1;
    number = number.toString(16);
    randomCheck(number, (realNumber) => {
        i = 2;
        url = realNumber;
        callback(url)
    })


}

function randomCheck(number, callback) {
    pool.connect((error, client) => {
        client.query(`SELECT * FROM url WHERE url = '${number}'`, (err, response) => {
            if (err) throw err;
            client.release()
            if (response.rows.length === 0) {
                callback(number)
            } else {
                console.log('err in randomCheck in start.js ');
                console.log(response)
            }
        })
    })
}

function addToDatabase(url, callback) {
    let isoDate = new Date().toISOString();
    let newUrl = '#' + url;
    pool.query(`INSERT INTO url VALUES(((SELECT max(id) FROM url)+1), '${newUrl}', '${isoDate}', '', '')`, (err) => {
        if (err) throw err;
        callback(url);
    })
}

function main(callback) {
    if (!conn) {
        randomNumber((url) => {
            addToDatabase(url, (url) => {
                /*
                    warning - not ending pool
                    not optimal
                */
                callback(url);
            })
        })
    } else {
        callback(conn)
    }
}

module.exports = main;