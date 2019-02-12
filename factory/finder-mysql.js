const mysql = require('promise-mysql');
const Gateway = require('../servicers/gateway');
const queryparser = require('./queryparser-mysql');

class FinderMysql extends Gateway {
    constructor() {
        super();
        this.connectionPool = {};
        console.log('Created MySQL servicer');
        this.copyOfResult = {};
        this.queryParser = queryparser;
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


    async find(queryObj) {

        try {
            const conn = await this.connectionPool.getConnection();
            const query = this.queryParser.createQueryForCopy(queryObj);

            try {
                const result = await conn.query(query);
                console.log(this.copyOfResult);
                //throw "ExecuteQuery!";
            } finally {
                this.connectionPool.releaseConnection(conn);
            }
        } catch (err) {
            throw err;
        }
    }

    async findAll(queryObj){
        try {
            const conn = await this.connectionPool.getConnection();
            const query = this.queryParser.createQueryForFindAll(queryObj);

            try {
                const result = await conn.query(query);
                console.log(this.copyOfResult);
                //throw "ExecuteQuery!";
            } finally {
                this.connectionPool.releaseConnection(conn);
            }
        } catch (err) {
            throw err;
        }
    }
}