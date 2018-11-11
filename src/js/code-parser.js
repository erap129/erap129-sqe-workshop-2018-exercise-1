import {parseCode} from './code-analyzer';

class Row{
    constructor(line, type, name, condition, value){
        this.line = line;
        this.type = type;
        this.name = name;
        this.condition = condition;
        this.value = value;
    }
}


var rows = []
var start = true;
function parseFunction(ast) {
    if(start){
        ast = parseCode(ast);
        start = false;
    }
    console.log(ast.type);
    rows.push(new Row(ast.type));
    if(ast.type == 'Program'){
        for(var row in ast.body[0]){
            parseFunction(row);
        }
        // ast.body.forEach ((row, index) => {
        //     parseFunction(row);
        // });
    }


    // if(stop < 2)
    //     parseFunction(ast.body);
    // console.log(ast.body)
}

export {parseFunction};