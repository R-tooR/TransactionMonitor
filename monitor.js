const Coordinator = require('./coordinator');

class Monitor{
    constructor(){
        this.coordinator = Coordinator();
    }

    generateTID(){
        return Date.now();
    }

    async executeTransaction(data){
        await this.coordinator.executeTransaction(data, this.generateTID()).then(()=> {}, (err) => {throw err;})
    }


    addDatabase(databaseId, connection, dbtype, entity){
        this.coordinator.addDatabase(databaseId, connection, dbtype, entity);
    }
}

module.exports = new Monitor();