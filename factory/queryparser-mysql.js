class QueryParserMySQL {
    constructor() {
        this.syntax = {
            insertBegin : "INSERT INTO ",
            insertVal : " VALUES('",

            updateBegin : "UPDATE ",
            updateSet : " SET ",
            updateWhere : " WHERE ",

        }
    }

    /**
     * Parses data for transaction branch into SQL query, that performs transaction branch
     * @param query Data used to perform operation on database
     * @returns {string} SQL Query to perform one of a transaction branch
     */
    parseIntoQuery(query){
        let queryString = "";
        if(query.hasOwnProperty("operation")){
            if(query["operation"] === "insert"){
                queryString = this.syntax.insertBegin + query["table"] + this.syntax.insertVal;

                for(let key in query["values"])
                    queryString += query["values"][key] + "','";

                queryString = queryString.slice(0, queryString.length - 2);
                queryString += ");";


            }
            else if(query["operation"] === "update"){
                queryString = this.syntax.updateBegin + query["table"] + this.syntax.updateSet;

                for(let key in query["values"])
                    queryString += (key + "='" + query["values"][key] + "',");

                queryString = queryString.slice(0, queryString.length - 1);
                queryString += this.syntax.updateWhere + query[0] + "=" + query["values"][query[0]] + ";";
            }


            return queryString;
        }

    }

    /**
     * Parses data for transaction branch into SQL query, that copy previous state
     * @param query Data used to perform operation on database
     * @returns {string} SQL Query with copied row, which will be modified in transaction
     */
    createQueryForCopy(query){
        return "SELECT * FROM " + query["table"] + " WHERE " + query[0] + "=" + query["values"][query[0]]; //query[0] na query["idcolumn"]
    }

    /**
     * Parses data for transaction branch into SQL query, that restores if transaction is rejected
     * @param copy Data copied before modification by transaction
     * @param data Data used to perform operation on database
     * @returns {string} SQL Query with proper data to restore after rejected transaction
     */
    createQueryForRestore(copy, data){
        if(data.hasOwnProperty("operation") && data.hasOwnProperty("table"))
            if(data["operation"] === "update"){
                let restoreQuery = "UPDATE "+data["table"]+" SET ";
                for(let key in copy)
                    if(key !== data[0])
                    restoreQuery += (key+"='"+copy[key]+"',");
                restoreQuery = restoreQuery.slice(0, restoreQuery.length-1) + "WHERE "+data["idcolumn"]+"="+copy[data["idcolumn"]]+";";
                return restoreQuery;
            } else if (data["operation"] === "insert" && copy["insertId"]){
                return "DELETE FROM "+ data["table"] + " WHERE "+data["idcolumn"]+"="+copy["insertId"]+";"; //taka jest informacja po zwróceniu informacji z INSERT
            }

    }

    createQueryForFindAll(query){
        return "SELECT * FROM "+ query["table"];
    }

}

module.exports = new QueryParserMySQL();