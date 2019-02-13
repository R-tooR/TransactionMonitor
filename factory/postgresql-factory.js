const postgres = require('./active-record-postgres');
const postgresParser = require('./queryparser-postgres');

function PostgreSQLFactory(){
    this.createActiveRecord = function(entity){
        return postgres(entity);
    };

    this.createQueryParser = function () {
        return postgresParser;
    };
}

module.exports = new PostgreSQLFactory();