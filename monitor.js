const coordinator = require('./coordinator');

class Monitor{
    constructor(){
        this.coordinator = coordinator;
        this.mapper = {};
    }

    generateTID(){
        return Date.now();
    }

    async executeTransaction(data){
        await coordinator.executeTransaction(data, this.generateTID()).then(()=> {}, (err) => {throw err;})
        //create object with data
        //pass it to coordinator

    }

    setMapper(entity){
        this.mapper = entity;
        //map field to column and database name?
    }

    mapToEntity(data){

    }

    addDatabase(databaseId, connection, dbtype, entity){
        coordinator.addDatabase(databaseId, connection, dbtype, entity);
    }
}

module.exports = new Monitor();