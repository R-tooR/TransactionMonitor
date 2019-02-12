const fs = require('fs');

class Logger{
    constructor(){
        this.path = "C:\\Users\\Artur\\WebStormProjects\\TransactionMonitor\\logs\\db_name";
    }

    setPath(filename){
        this.path = "C:\\Users\\Artur\\WebStormProjects\\TransactionMonitor\\logs\\" + filename;
    }

    recordSuccess(transactionId, dataPrev, dataCurr){
        if(dataCurr.hasOwnProperty("operation") && dataCurr["operation"] === "insert"){
            fs.appendFileSync(this.path, transactionId+"|insert|"+JSON.stringify(dataCurr["values"])+"|true\n");
        } else{
            fs.appendFileSync(this.path, transactionId+"|update|"+JSON.stringify(dataCurr["values"])+"|"
                +JSON.stringify(dataPrev)+"|true\n");
        }
    }

    recordFail(transactionId, dataPrev, dataCurr){
        if(dataCurr.hasOwnProperty("operation") && dataCurr["operation"] === "insert"){
            fs.appendFileSync(this.path, transactionId+"|insert|"+JSON.stringify(dataCurr["values"])+"|false\n");
        } else{
            fs.appendFileSync(this.path, transactionId+"|update|"+JSON.stringify(dataCurr["values"])+"|"
                +JSON.stringify(dataPrev)+"|false\n");
        }
    }

}

module.exports = new Logger();