function Gateway(){

    this.dataForDBPoolAreValid = obj => {
        if (obj !== undefined && obj["connectionLimit"] !== undefined && obj["user"] !== undefined && obj["password"] !== undefined
            && obj["host"] !== undefined && obj["database"] !== undefined)
            return true;
        else
            return false;
    };

    this.dataForDBAreValid = obj => {
        if (obj !== undefined && obj["user"] !== undefined && obj["password"] !== undefined
            && obj["host"] !== undefined && obj["database"] !== undefined)
            return true;
        else
            return false;
    };

    this.isEmpty = obj => {
        Object.keys(obj).forEach(function(key, index){
            if(obj.hasOwnProperty(key)) return false;
            else return true;
        })
    };//TODO test it!
}

module.exports = Gateway;