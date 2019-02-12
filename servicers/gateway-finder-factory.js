const mysql = require('../factory/active-record-mysql');

function GatewayFinderFactory(){
    let servicer;
    this.createGateway = function(type, entity){
        switch(type){
            case 'mysql' || 'MySQL':
                servicer = mysql;
                mysql.setEntity(entity);
                break;
            case 'postgres' ||'PostgreSQL':
                servicer = postgres;
                postgres.setEntity(entity);
                break;
            default:
                servicer = mysql;
                break;
        }
        return servicer;
    }

    this.createFinder = function(type, entity){
        switch(type){
            case 'mysql' || 'MySQL':
                servicer = mysql;
                mysql.setEntity(entity);
                break;
            case 'postgres' ||'PostgreSQL':
                servicer = postgres;
                postgres.setEntity(entity);
                break;
            default:
                servicer = mysql;
                break;
        }
        return servicer;
    }


}//do użycia jako factory.createGateway('mysql');

module.exports = new GatewayFinderFactory();