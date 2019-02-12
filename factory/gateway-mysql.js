const mysql = require('promise-mysql');
const Gateway = require('../servicers/gateway');
const queryparser = require('./queryparser-mysql');

class GatewayMysql extends Gateway {
    constructor(entity) {
        super();
        this.connectionPool = {};
        console.log('Created MySQL servicer');
        this.copyOfResult = {};
        this.queryParser = queryparser;
        this.entity = entity;
    }

    setEntity(entity){
        this.entity = entity;
    }
    /**
     * Sets connection data used to connect with database
     * @param connection Connection data to database
     */
    setConnection(connection) {
        if (this.dataForDBPoolAreValid(connection)) {
            this.connectionPool = mysql.createPool(connection);
        } else throw "Object or at least one of its fields: 'user', 'password', 'host', 'database' is undefined";
    }


    async executeQuery(query, copy){

        try{
            const conn = await this.connectionPool.getConnection();
            try{
                if(this.isUpdateOperation(query))
                    this.copyOfResult = await conn.query(copy);
                const result = await conn.query(query);
                //console.log(this.copyOfResult);
                //throw "ExecuteQuery!";
            }finally{
                this.connectionPool.releaseConnection(conn);
            }
        }catch(err){
            throw err;
        }
    }

    async update(queryObj){
        try{
            const conn = await this.connectionPool.getConnection();
            if(this.entity.hasOwnProperty("values"))
                for(let key in this.entity["values"])
                    if(this.entity["values"].hasOwnProperty(key) && queryObj.hasOwnProperty(key))
                        this.entity[key] = queryObj[key];
                    else
                        throw "Object columns must agree!";
            //const query = this.queryParser.parseIntoQuery(queryObj);
            //const copy = this.queryParser.createQueryForCopy(queryObj);
            const query = this.queryParser.parseIntoQuery(this.entity["values"]);
            const copy = this.queryParser.createQueryForCopy(this.entity["values"]);
            try{

                this.copyOfResult = await conn.query(copy);//to moze nie działać zbyt OK - ale zostaw to na koniec
                //const result = await conn.query(query);
                //console.log(result);
                //throw "ExecuteQuery!";
            }finally{
                this.connectionPool.releaseConnection(conn);
            }
        }catch(err){
            throw err;
        }
    }

    async insert(queryObj){
        try{
            const conn = await this.connectionPool.getConnection();
            const query = this.queryParser.parseIntoQuery(queryObj);
            try{

                this.copyOfResult = await conn.query(query);
                //const result = await conn.query(query);
                //console.log(result);
                //throw "ExecuteQuery!";
            }finally{
                this.connectionPool.releaseConnection(conn);
            }
        }catch(err){
            throw err;
        }
    }

    restore(copy){
        let connection = {};
        this.connectionPool.getConnection().then((conn) => {connection = conn; return connection.query(copy)})
            .then(() => {this.connectionPool.releaseConnection(connection)});
    }

    isUpdateOperation(query){
        return query.slice(0,6) === "UPDATE";
    }

    isInsertOperation(query){
        return query.slice(0,6) === "INSERT";
    }


}

module.exports = function(entity){return new GatewayMysql(entity);};


