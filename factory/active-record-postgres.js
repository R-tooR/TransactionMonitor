const postgresql = require('pg-promise')();
const ActiveRecord = require('./active-record');
const queryparser = require('../queryparsers/queryparser-postgres');

class ActiveRecordPostgresql extends ActiveRecord {
    constructor(entity) {
        super();
        this.connectionPool = {};
        console.log('Created PostgreSQL ActiveRecord');
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
            this.connectionPool = postgresql(connection);
        } else throw "Object or at least one of its fields: 'user', 'password', 'host', 'database' is undefined";
    }

    async update(queryObj){
        try{
            if(this.areColumnsConsistent(queryObj)) {
                const conn = await this.connectionPool.connect();
                const query = this.queryParser.parseIntoUpdateQuery(queryObj);
                const copy = this.queryParser.createQueryForCopy(queryObj);
                try {
                    this.copyOfResult = await conn.one(copy);
                    const result = await conn.none(query);
                    console.log(result);

                } finally {
                    conn.done();
                }
            }
        }catch(err){
            throw err;
        }
    }

    async insert(queryObj){
        try{
            if(this.areColumnsConsistent(queryObj)) {
                const conn = await this.connectionPool.connect();
                const query = this.queryParser.parseIntoInsertQuery(queryObj);

                try {

                    this.copyOfResult = await conn.one(query);
                    console.log(this.copyOfResult);

                } finally {
                    conn.done();
                }
            }
        }catch(err){
            throw err;
        }
    }

    async delete(queryObj){
        try{
            if(this.areColumnsConsistent(queryObj)) {
                const conn = await this.connectionPool.connect();
                const query = this.queryParser.parseIntoDeleteQuery(queryObj);
                const copy = this.queryParser.createQueryForCopy(queryObj);
                try {

                    this.copyOfResult = await conn.one(copy);
                    const result = await conn.none(query);
                    console.log(this.copyOfResult);

                } finally {
                    conn.done();
                }
            }
        }catch(err){
            throw err;
        }
    }

    async find(queryObj) {

        try {
            const conn = await this.connectionPool.connect();
            const query = this.queryParser.createQueryForCopy(queryObj);

            try {
                const result = await conn.query(query);
                console.log(this.copyOfResult);
            } finally {
                conn.done();
            }
        } catch (err) {
            throw err;
        }
    }

    async findAll(queryObj){
        try {
            const conn = await this.connectionPool.connect();
            const query = this.queryParser.createQueryForFindAll(queryObj);

            try {
                const result = await conn.query(query);
                console.log(this.copyOfResult);
            } finally {
                conn.done();
            }
        } catch (err) {
            throw err;
        }
    }

    restore(copy){
        let connection = {};
        this.connectionPool.connect().then((conn) => {connection = conn; return connection.any(copy)})
            .catch((err) => {console.log("No need to restore because of lack of changes in this database " + err)})
            .then(() => {connection.done();});
    }

}

module.exports = function(entity){
    return new ActiveRecordPostgresql(entity);
};


