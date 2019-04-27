const {
    Client
} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://jvdgmaaklzropg:a07975a87d6140993195484852c45bb25db52135d53de31f09e82bf82cbb6e76@ec2-54-228-252-67.eu-west-1.compute.amazonaws.com:5432/d1qttojp2t6sab',
    ssl: true,
});

var conn = null;

function main(data, callback){
    if(!conn){
        callback('test')
    }else{
        callback(conn)
    }
}

module.exports = main;