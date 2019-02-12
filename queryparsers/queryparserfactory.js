const mysql = require('../factory/queryparser-mysql');

function QueryParserFactory() {
    let queryParser;
    this.createQueryParser = function (type) {
        switch (type) {
            case 'mysql' || 'MySQL':
                queryParser = mysql;
                break;
            case 'postgres' || 'PostgreSQL':
                queryParser = postgres;
                break;
            default:
                queryParser = mysql;
                break;
        }
        return queryParser;
    }
}

module.exports = new QueryParserFactory();