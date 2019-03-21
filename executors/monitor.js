const Coordinator = require('./coordinator');

class Monitor{
    constructor(){
        this.coordinator = Coordinator();
    }

    /**
     * Generates Transaction ID according to current time
     * @returns {Date.now()}
     */
    generateTID(){
        return Date.now();
    }

    /**
     *
     * @param data Object containing pairs key-value, where key is id of set database, and value is an array of queries to be executed
     * @returns {Promise<void>} Nothing, if transaction succeed, throws error otherwise.
     */
    async executeTransaction(data){
        await this.coordinator.executeTransaction(data, this.generateTID()).then(()=> {}, (err) => {throw err;})
    }

    /**
     *
     * @param databaseId ID of database, a handle
     * @param connection Object containing params of connection, has to be adapted to chosen type of database
     * @param dbtype type of database: "mysql" or "postgres"
     * @param entity Object containing keys as columns' names in chosen schema
     */
    addDatabase(databaseId, connection, dbtype, entity){
        this.coordinator.addDatabase(databaseId, connection, dbtype, entity);
    }
}

module.exports = new Monitor();