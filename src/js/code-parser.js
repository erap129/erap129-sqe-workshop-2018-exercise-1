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
function activateStart(){
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
    for(var decl in ast.declarations)
        parseFunction(ast.declarations[decl]);
}

function parseWhileStatement(ast){
    let line = ast.loc.start.line;
    rows.push(new Row(line, 'while statement', '', escodegen.generate(ast.test), ''));
}

function parseForStatement(ast){
    let line = ast.loc.start.line;
    rows.push(new Row(line, 'for statement', '', escodegen.generate(ast.init) + ';' + escodegen.generate(ast.test) + ';' + escodegen.generate(ast.update), ''));
}

function parseIfStatement(ast, isElse){
    let line = ast.loc.start.line;
    let ifStr = 'if statement';
    if(isElse)
        ifStr = 'else if statement';
    rows.push(new Row(line, ifStr, '', escodegen.generate(ast.test), ''));
    parseFunction(ast.consequent);
    parseFunction(ast.alternate, true);
}

function parseExpressionStatement(ast){
    let line = ast.loc.start.line;
    // if(ast.expression.type == 'AssignmentExpression')
    rows.push(new Row(line, 'assignment expression', ast.expression.left.name, '', escodegen.generate(ast.expression.right)));
}

function parseReturnStatement(ast){
    let line = ast.loc.start.line;
    rows.push(new Row(line, 'return statement', '', '', escodegen.generate(ast.argument)));
}

function parseBody(ast, rows){
    if(ast.body.constructor === Array){
        for(var row in ast.body)
            parseFunction(ast.body[row]);
        if(ast.type == 'Program')
            return rows;
    }
    else
        parseFunction(ast.body);
}

function checkString(ast){
    if(typeof ast == 'string'){
        ast = esprima.parseScript(ast, {loc:true});
        rows = [];
    }
    return ast;
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
};

function parseFunction(ast, isElse=false){
    if(ast == null)
        return;
    ast = checkString(ast);
    if(parseFunctions.hasOwnProperty(ast.type))
        parseFunctions[ast.type](ast, isElse);
    if(ast.hasOwnProperty('body')){
        let res = parseBody(ast, rows);
        if(ast.type == 'Program')
            return res;
    }
}

export {parseFunction};
export {activateStart};
export {Row};
export {rows};

