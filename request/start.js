const {
    Pool
} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://jvdgmaaklzropg:a07975a87d6140993195484852c45bb25db52135d53de31f09e82bf82cbb6e76@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d1qttojp2t6sab',
    ssl: true,
});
var conn = null;

function randomCheck(number) {
    //returning promise
    return new Promise((resolve, reject) => {
        pool.connect((err, client) => {
            if (err) throw err;
            //checking database for the same url
            client.query(`SELECT * FROM url WHERE url = '${number}'`, (err, response) => {
                if (err) throw err;
                client.release();
                //resolving promise
                if (response.rows.length === 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        })
    })
}

async function randomNumber(callback) {
    let i = 0

    while (i < 1) {
        //genetrating numbers between 1000 and 11 000
        let number = Math.floor(Math.random() * 10001) + 1000;

        //using 36 numeral system
        number = '#' + number.toString(36);

        // waiting until Promise is resolved
        let checkedNumber = await randomCheck(number);

        //comparing resolved value, possibly ending loop
        if (checkedNumber == true) {
            i += 1;
            callback(number);
        };

    }
}

function addToDatabase(url, callback) {
    let isoDate = new Date().toISOString();
    let newUrl = url;
    pool.query(`INSERT INTO url VALUES(((SELECT max(id) FROM url)+1), '${newUrl}', '${isoDate}', '', '')`, (err) => {
        if (err) throw err;
        callback(url);
    })
}

function main(callback) {
    if (!conn) {
        randomNumber((url) => {
            addToDatabase(url, (url) => {
                callback(url);
            })
        })
    } else {
        callback(conn)
    }
}

module.exports = main;