const mysqlfactory = require('./factory/MySQLFactory');
const logger = require('./logger/logger');

class Contributor{//tutaj może metoda wytwórcza
    constructor(dbtype, entity){
        if(dbtype === "mysql") {
            this.activeRecord = mysqlfactory.createActiveRecord(entity);
            this.queryParser = mysqlfactory.createQueryParser();
        } else if (dbtype === "postgres") {
            this.activeRecord = postgresfactory.createGateway(entity);
            this.queryParser = postgresfactory.createQueryParser();
        }

        this.logger = logger();
        this.copyOfResultQuery = '';
    }

    async execute(query){
        if(this.checkDataObjectValidation(query)) {

            const activeRecord = this.activeRecord;
            const parsedQuery = this.queryParser.parseIntoQuery(query);
            const queryForCopy = this.queryParser.createQueryForCopy(query);
            let logFilename = '';

            if (query.hasOwnProperty("table")) {
                logFilename = query["table"].replace('.', '_');
                this.logger.setPath(logFilename);
            }
            if(query.hasOwnProperty("operation"))
                if(query["operation"] === "update")
                    await activeRecord.update(query).then(() => {this.copyOfResultQuery = this.activeRecord.copyOfResult},(err) => {
                        this.copyOfResultQuery = this.activeRecord.copyOfResult;
                        throw err
                    });
                else if(query["operation"] === "insert")
                    await activeRecord.insert(query).then(() => {this.copyOfResultQuery = this.activeRecord.copyOfResult},(err) => {
                        this.copyOfResultQuery = this.activeRecord.copyOfResult;
                        throw err
                    });
        }
    }

    async record(transactionId, data, isAccepted){
        console.log("Dane do rekordu "+JSON.stringify(data));
        if(isAccepted)
            this.logger.recordSuccess(transactionId, this.activeRecord.copyOfResult, data);
        else
            this.logger.recordFail(transactionId, this.activeRecord.copyOfResult, data);
    }

    checkDataObjectValidation(obj){
        if(obj.hasOwnProperty("operation") && obj.hasOwnProperty("table") &&
        obj.hasOwnProperty("values") && obj.hasOwnProperty("idcolumn"))
            return true;
        else throw "Probably one of fields: 'operation', 'table', 'values', 'idcolumn' is missing.";
    }

    restoreData(data){
        console.log("Copied Query: "+JSON.stringify(this.copyOfResultQuery));
        const queryRestore = this.queryParser.createQueryForRestore(this.copyOfResultQuery, data);//było this.copyOfResultQuery[0]
        console.log(queryRestore);
        this.activeRecord.restore(queryRestore);
    }

}

module.exports = function(dbtype, entity){
    return new Contributor(dbtype, entity);
};
