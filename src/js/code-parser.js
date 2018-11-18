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

var rows = [];
var start = true;
function activateStart(){
    start = true;
    rows = [];
}

function parseFunctionDeclaration(ast){
    let line = ast.loc.start.line;
    rows.push(new Row(line, 'function declaration', ast.id.name, '', ''));
    for(var param in ast.params)
        parseFunction(ast.params[param]);
}

function parseIdentifier(ast){
    let line = ast.loc.start.line;
    rows.push(new Row(line, 'variable declaration', ast.name, '', ''));
}

function parseVariableDeclaration(ast){
    let line = ast.loc.start.line;
    for(var decl in ast.declarations)
        parseFunction(ast.declarations[decl])
}

function parseWhileStatement(ast){
    let line = ast.loc.start.line;
    rows.push(new Row(line, 'while statement', '', escodegen.generate(ast.test), ''));
}

function parseForStatement(ast){
    let line = ast.loc.start.line;
    rows.push(new Row(line, 'for statement', '', escodegen.generate(ast.init) + ';' + escodegen.generate(ast.test) + ';' + escodegen.generate(ast.update), ''));
}

function parseIfStatement(ast, isElse=false){
    let line = ast.loc.start.line;
    let ifStr = 'if statement';
    if(isElse)
        ifStr = 'else if statement';
    rows.push(new Row(line, ifStr, '', escodegen.generate(ast.test), ''));
    parseFunction(ast.consequent);
    if(ast.hasOwnProperty('alternate')){
        parseFunction(ast.alternate, isElse=true);
    }
}

function parseExpressionStatement(ast){
    let line = ast.loc.start.line;
    if(ast.expression.type == 'AssignmentExpression')
        rows.push(new Row(line, 'assignment expression', ast.expression.left.name, '', escodegen.generate(ast.expression.right)));
}

function parseReturnStatement(ast){
    let line = ast.loc.start.line;
    rows.push(new Row(line, 'return statement', '', '', escodegen.generate(ast.argument)));
}

var parseFunctions = {
    'FunctionDeclaration': parseFunctionDeclaration,
    'Identifier': parseIdentifier,
    'VariableDeclaration': parseVariableDeclaration,
    'WhileStatement': parseWhileStatement,
    'IfStatement': parseIfStatement,
    'ExpressionStatement': parseExpressionStatement,
    'ReturnStatement': parseReturnStatement,
    'ForStatement': parseForStatement
}

function parseFunction(ast, isElse=false){
    if(ast == null)
        return;
    if(typeof ast == "string"){
        ast = esprima.parseScript(ast, {loc:true});
        rows = [];
    }
    if(parseFunctions.hasOwnProperty(ast.type)){
        parseFunctions[ast.type](ast, isElse);
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
export {Row};

