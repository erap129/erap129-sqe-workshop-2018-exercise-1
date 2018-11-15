import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseFunction} from './code-parser';
import {activateStart} from './code-parser';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        activateStart();
        let tableArr = parseFunction(codeToParse);
        createTable(tableArr);
    });
});

function createTable(tableArr){
    var table_body = document.createElement('tbody');
    for (var i in tableArr){
        var tr = document.createElement('tr');
        var tds = [];
        for(var j = 0; j<5; j++)
            tds.push(document.createElement('td'));
        var texts = [];
        for (var property in tableArr[i])
            texts.push(document.createTextNode(tableArr[i][property]));
        for(var j = 0; j<5; j++){
            tds[j].appendChild(texts[j]);
            tr.appendChild(tds[j]);
        }
        table_body.appendChild(tr);
    }
    table_body.setAttribute("id", "table_body");
    document.getElementById("the_table").replaceChild(table_body, document.getElementById('table_body'));
}