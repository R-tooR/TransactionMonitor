const mysql = require('./gateway-mysql');
const mysqlParser = require('./queryparser-mysql');

function MySQLFactory(){
    this.createServicer = function(entity){
        return mysql(entity);
    };

    this.createQueryParser = function () {
        return mysqlParser;
    };
}

module.exports = new MySQLFactory();