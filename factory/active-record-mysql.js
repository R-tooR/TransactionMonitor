const mysql = require('promise-mysql');
const ActiveRecord = require('./active-record');
const queryparser = require('./queryparser-mysql');

class ActiveRecordMysql extends ActiveRecord {
    constructor(entity) {
        super();
        this.connectionPool = {};
        console.log('Created MySQL ActiveRecord');
        this.copyOfResult = {};
        this.queryParser = queryparser;
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

    async update(queryObj){
        try{
            if(this.areColumnsConsistent(queryObj)) {
                const conn = await this.connectionPool.getConnection();
                const query = this.queryParser.parseIntoQuery(queryObj);
                const copy = this.queryParser.createQueryForCopy(queryObj);
                try {

                    this.copyOfResult = await conn.query(copy);
                    const result = await conn.query(query);
                    console.log(result);

                } finally {
                    this.connectionPool.releaseConnection(conn);
                }
            }
        }catch(err){
            throw err;
        }
    }

    async insert(queryObj){
        try{
            if(this.areColumnsConsistent(queryObj)) {
                const conn = await this.connectionPool.getConnection();
                const query = this.queryParser.parseIntoQuery(queryObj);

                try {

                    this.copyOfResult = await conn.query(query);
                    const result = await conn.query(query);
                    console.log(result);

                } finally {
                    this.connectionPool.releaseConnection(conn);
                }
            }
        }catch(err){
            throw err;
        }
    }

    async delete(queryObj){
        try{
            if(this.areColumnsConsistent(queryObj)) {
                const conn = await this.connectionPool.getConnection();
                const query = this.queryParser.parseIntoQuery(queryObj);
                const copy = this.queryParser.createQueryForCopy(queryObj);
                try {

                    this.copyOfResult = await conn.query(copy);
                    const result = await conn.query(query);
                    console.log(result);

                } finally {
                    this.connectionPool.releaseConnection(conn);
                }
            }
        }catch(err){
            throw err;
        }
    }

    async find(queryObj) {

        try {
            const conn = await this.connectionPool.getConnection();
            const query = this.queryParser.createQueryForCopy(queryObj);

            try {
                const result = await conn.query(query);
                console.log(this.copyOfResult);
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
            } finally {
                this.connectionPool.releaseConnection(conn);
            }
        } catch (err) {
            throw err;
        }
    }

    restore(copy){
        let connection = {};
        this.connectionPool.getConnection().then((conn) => {connection = conn; return connection.query(copy)})
            .catch((err) => {console.log("No need to restore because of lack of changes in this database")})
            .then(() => {this.connectionPool.releaseConnection(connection)});
    }

}

module.exports = function(entity){
    return new ActiveRecordMysql(entity);
};


