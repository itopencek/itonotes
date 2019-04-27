const {
    Client
} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://jvdgmaaklzropg:a07975a87d6140993195484852c45bb25db52135d53de31f09e82bf82cbb6e76@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d1qttojp2t6sab',
    ssl: true,
});

var conn = null;

function getData(url, callback){
    console.log('ach jaj');
    
    client.query(`SELECT * FROM url WHERE url = '${url}'`, (err, response) => {
        if(err) throw err;
        if(response.rowCount == 0){
            client.query(`SELECT * FROM url WHERE custom = '${url}'`, (error, responses) => {
                if(error) throw error;
                if(responses.rowCount == 0){
                    callback(false, '')
                }else{
                    callback(true, responses.rows[0])
                }
            })
        }else if(response.rows[0].url === url){
            callback(true, response.rows[0])
        } else {
            callback(false, '')
        }
    })
}

function main(url, callback){
    client.connect();
    if(!conn){
        getData(url, (bool, data) => {
            client.end((err) => {
                if(err) throw err;
                console.log('preco')
                callback(bool, data)
            });
        })
    }else{
        callback(false, conn)
    }
}

module.exports = main;