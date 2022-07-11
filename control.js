const { each } = require("lodash");

function findSpec(dataJson, qArr){

    let tempQ = [null, null , null];
    for( let i in qArr){
        if(typeof(qArr[i]) != "undefined"){
            tempQ[i] = qArr[i];
            console.log(qArr[i].toLowerCase());
        }
    }

    let tempArr = dataJson.filter(
        (e) => {
            let showPass = true;
            const eArr = [e.name,  e.reading , e.finished];
            for(let j in tempQ){
                if(tempQ[j] != null ){
                    if(tempQ[j] == eArr[j]){
                        
                         showPass = true;
                    }
                    else if(typeof(tempQ[j]) == "string" && typeof(eArr[j]) == "string"){
                        showPass =  eArr[j].toLowerCase().indexOf(tempQ[j].toLowerCase()) != -1 ? true : false;
                    }
                    else{
                        showPass = false;
                        console.log(e.reading);
                    }
                }
            }
            {
            }

            return showPass;
        }
    );
    
    
    
     

    if(isAllNull(tempQ)){
        
        return dataJson.map(e => 
            {   
                return {
                    "id" : e.id,
                    "name" : e.name,
                    "publisher" : e.publisher
                }
            });
    }
    else{
        console.log(tempQ); 
        tempArr =   tempArr.map(e => 
            {   
                return {
                    "id" : e.id,
                    "name" : e.name,
                    "publisher" : e.publisher
                }
            });

        return tempArr;
    }
        
}

function isAllNull(data){
    let boolIsAllNull = true;
    for(let i  in data){
        if(data[i] == null){

        }
        else{
            return false
        }  
    }
    return boolIsAllNull;
}

module.exports = findSpec;