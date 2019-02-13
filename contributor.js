const mysqlfactory = require('./factory/MySQLFactory');
const postgresfactory = require('./factory/postgresql-factory');
const logger = require('./logger/logger');

class Contributor{
    constructor(dbtype, entity){
        if(dbtype === "mysql") {
            this.activeRecord = mysqlfactory.createActiveRecord(entity);
            this.queryParser = mysqlfactory.createQueryParser();
        } else if (dbtype === "postgres") {
            this.activeRecord = postgresfactory.createActiveRecord(entity);
            this.queryParser = postgresfactory.createQueryParser();
        }

        this.logger = logger();
        this.copyOfResultQuery = '';
    }

    async execute(query){
        if(this.checkDataObjectValidation(query)) {

            const activeRecord = this.activeRecord;
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
                else if(query["operation"] === "delete")
                    await activeRecord.delete(query).then(() => {this.copyOfResultQuery = this.activeRecord.copyOfResult},(err) => {
                        this.copyOfResultQuery = this.activeRecord.copyOfResult;
                        throw err
                    });
        }
    }

    async record(transactionId, data, isAccepted){
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
        const queryRestore = this.queryParser.createQueryForRestore(this.copyOfResultQuery, data);
        this.activeRecord.restore(queryRestore);
    }

}

module.exports = function(dbtype, entity){
    return new Contributor(dbtype, entity);
};
