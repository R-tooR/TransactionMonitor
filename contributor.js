const mysqlfactory = require('./factory/MySQLFactory');
const logger = require('./logger/logger');

class Contributor{//tutaj może metoda wytwórcza
    constructor(dbtype, entity){
        if(dbtype === "mysql") {
            this.servicer = mysqlfactory.createServicer(entity);
            this.queryParser = mysqlfactory.createQueryParser();
        } else if (dbtype === "postgres") {
            this.servicer = postgresfactory.createGateway(entity);
            this.queryParser = postgresfactory.createQueryParser();
        }

        this.logger = logger;
        this.copyOfResultQuery = '';
    }

    async execute(query){
        if(this.checkDataObjectValidation(query)) {

            const servicer = this.servicer;
            const parsedQuery = this.queryParser.parseIntoQuery(query);
            const queryForCopy = this.queryParser.createQueryForCopy(query);
            let logFilename = '';

            if (query.hasOwnProperty("table")) {
                logFilename = query["table"].replace('.', '_');
                this.logger.setPath(logFilename);
            }
            if(query.hasOwnProperty("operation"))
                if(query["operation"] === "update")
                    await servicer.update(query).then(() => {this.copyOfResultQuery = this.servicer.copyOfResult},(err) => {
                        this.copyOfResultQuery = this.servicer.copyOfResult;
                        throw err
                    });
                else if(query["operation"] === "insert")
                    await servicer.insert(query).then(() => {this.copyOfResultQuery = this.servicer.copyOfResult},(err) => {
                        this.copyOfResultQuery = this.servicer.copyOfResult;
                        throw err
                    });
            //await servicer.executeQuery(parsedQuery, queryForCopy).then(() => {this.copyOfResultQuery = this.servicer.copyOfResult},(err) => {
            //    this.copyOfResultQuery = this.servicer.copyOfResult;
            //    throw err
            //});
        }
    }

    async record(transactionId, data, isAccepted){
        if(isAccepted)
            this.logger.recordSuccess(transactionId, this.servicer.copyOfResult, data);
        else
            this.logger.recordFail(transactionId, this.servicer.copyOfResult, data);
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
        this.servicer.restore(queryRestore);
    }

}

module.exports = function(dbtype, entity){
    return new Contributor(dbtype, entity);
};
