const Contributor = require('./Contributor');

class Coordinator {
    constructor() {
        this.Contributors = {};
    }


    async executeTransaction(data, transactionId) {
         await this.execute(data, transactionId)
             .then(() => this.commit(data, transactionId),
                   (err) => {console.log(err);this.rollback(data, transactionId); throw err;});
    }


    async execute(data, transactionId){
        const handl = this.Contributors;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                await handl[key].execute(data[key], transactionId)
                    .catch((err) => {console.log("Coordinator");throw err});
            }
        }
    }

    async commit(data, transactionId){
        const handl = this.Contributors;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                await handl[key].record(transactionId, data[key],true)
                    .catch((err) => {console.log("Coordinator");throw err});
            }
        }
    }

    rollback(data, transactionId){
        const handl = this.Contributors;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                 handl[key].record(transactionId, data[key], false)
                    .then(() => {console.log(key + " : RESTORING");handl[key].restoreData(data[key])}).catch((err) => {console.log("No restoring in unavailable database "+ err)});
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
