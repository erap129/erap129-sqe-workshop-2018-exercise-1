import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseFunction} from './code-parser';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let test = parseFunction(codeToParse)
        $('#testlabel').innerText=test;
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});
