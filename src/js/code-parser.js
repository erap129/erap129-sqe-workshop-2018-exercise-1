import {parseCode} from './code-analyzer';
import * as escodegen from 'escodegen';
import * as esprima from 'esprima';

class Row{
    constructor(line, type, name, condition, value){
        this.line = line;
        this.type = type;
        this.name = name;
        this.condition = condition;
        this.value = value;
    }
}

function createTable(){
    var table = document.createElement('table');
    for (var i in rows){
        console.log('blabla');
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');

        var text1 = document.createTextNode(rows[i].line);
        var text2 = document.createTextNode(rows[i].type);
        var text3 = document.createTextNode(rows[i].name);
        var text4 = document.createTextNode(rows[i].condition);
        var text5 = document.createTextNode(rows[i].value);

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        td4.appendChild(text4);
        td5.appendChild(text5);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        table.appendChild(tr);
    }
    document.body.appendChild(table);
}

var rows = [];
var start = true;
function activateStart(){
    start = true;
    rows = [];
}
function parseFunction(ast, isElse=false){
    if(start){
        ast = esprima.parseScript(ast, {loc:true});
        start = false;
    }
    let line = ast.loc.start.line;
    switch(ast.type){
        case 'FunctionDeclaration':
            rows.push(new Row(line, 'function declaration', ast.id.name, null, null));
            for(var param in ast.params)
                parseFunction(ast.params[param]);
            break;
        case 'Identifier':
            rows.push(new Row(line, 'variable declaration', ast.name, null, null));
            break;
        case 'VariableDeclaration':
            for(var decl in ast.declarations)
                parseFunction(ast.declarations[decl])
            break;
        case 'VariableDeclarator':
            rows.push(new Row(line, 'variable declaration', ast.id.name, null, null));
            break;
        case 'WhileStatement':
            // rows.push(new Row(line, 'while statement', null, stringifyTest(ast), null));
            rows.push(new Row(line, 'while statement', null, escodegen.generate(ast.test), null));
            break;
        case 'IfStatement':
            // rows.push(new Row(line, 'if statement', null, ast.test.left.name + ast.test.operator + ast.test.right.name))
            let ifStr = 'if statement';
            if(isElse)
                ifStr = 'else if statement';
            rows.push(new Row(line, ifStr, null, escodegen.generate(ast.test), null));
            parseFunction(ast.consequent);
            if(ast.hasOwnProperty('alternate')){
                parseFunction(ast.alternate, isElse=true);
            }
            break;
        case 'ExpressionStatement':
            if(ast.expression.type == 'AssignmentExpression')
                rows.push(new Row(line, 'assignment expression', ast.expression.left.name, null, escodegen.generate(ast.expression.right)));
            break;
        case 'ReturnStatement':
            rows.push(new Row(line, 'return statement', null, null, escodegen.generate(ast.argument)));
            break;
    }
    if(ast.hasOwnProperty('body')){
        if(ast.body.constructor === Array){
            for(var row in ast.body){
                parseFunction(ast.body[row]);

            }
            if(ast.type == 'Program')
                return rows;
        }
        else{
            parseFunction(ast.body);
        }
    }
}

export {parseFunction};
export {activateStart};
export {createTable};
