import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseFunction} from './code-parser';
import {activateStart} from './code-parser';
import {createTable} from './code-parser';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        activateStart();
        let tableArr = parseFunction(codeToParse)
        createTable();
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});
