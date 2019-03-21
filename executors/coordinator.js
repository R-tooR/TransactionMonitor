const Contributor = require('./contributor');

class Coordinator {
    constructor() {
        this.Contributors = {};
    }

    /**
     *
     * @param data Object containing pairs key-value, where key is id of set database, and value is an array of queries to be executed
     * @param transactionId ID of Transaction
     * @returns {Promise<void>} Nothing, if transaction succeed, throws an error in case of problems with commit otherwise
     */
    async executeTransaction(data, transactionId) {
         await this.execute(data, transactionId)
             .then(() => this.commit(data, transactionId),
                   (err) => {console.log(err);this.rollback(data, transactionId); throw err;});
    }

    /**
     *
     * @param data Object containing pairs key-value, where key is id of set database, and value is an array of queries to be executed
     * @param transactionId ID of Transaction
     * @returns {Promise<void>} Nothing, if transaction succeed, throws an error in case of problems with executing a branch of transaction
     */
    async execute(data, transactionId){
        const handl = this.Contributors;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                for(let queryObj in data[key]) {
                    if(data[key].hasOwnProperty(queryObj))
                        await handl[key].execute(data[key][queryObj], transactionId)
                            .catch((err) => {
                                throw err
                            });
                }
            }
        }
    }

    async commit(data, transactionId){
        const handl = this.Contributors;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                for(let queryObj in data[key])
                    if(data[key].hasOwnProperty(queryObj))
                await handl[key].record(transactionId, data[key][queryObj], true)
                    .catch((err) => {throw err});
            }
        }
    }

    rollback(data, transactionId){
        const handl = this.Contributors;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                for(let queryObj in data[key])
                    if(data[key].hasOwnProperty(queryObj))
                         handl[key].record(transactionId, data[key][queryObj], false)
                            .then(() => {handl[key].restoreData(data[key][queryObj])})
                             .catch((err) => {console.log("No restoring in unavailable database")});
            }
        }
    }

    addDatabase(databaseId, connection, dbtype, entity) {
            let newContributor = Contributor(dbtype, entity);
            newContributor.activeRecord.setConnection(connection);
            this.Contributors[databaseId] = newContributor;
    }


}

module.exports = function(){
    return new Coordinator();
};
