import assert from 'assert';
import {parseFunction} from '../src/js/code-parser';
import {Row} from '../src/js/code-parser';

describe('The javascript line detector', () => {

    it('is parsing an empty function correctly', () => {
        assert.deepEqual(
            parseFunction(''),
            []
        );
    });

    it('is parsing a simple function', () => {
        var rows = []
        rows.push(new Row(1, 'function declaration', 'myFunc', '', ''));
        rows.push(new Row(1, 'variable declaration', 'theObject', '', ''));
        rows.push(new Row(2, 'assignment expression', 'theObject', '', '\'Toyota\''));
        assert.deepEqual(
            parseFunction('function myFunc(theObject) {\n' +
                '  theObject = \'Toyota\';\n' +
                '}'),
            rows
        );
    });

    it('is parsing a simple function with a for loop', () => {
        var rows = []
        rows.push(new Row(1, 'function declaration', 'someFunction', '', ''));
        rows.push(new Row(1, 'variable declaration', 'a', '', ''));
        rows.push(new Row(1, 'variable declaration', 'b', '', ''));
        rows.push(new Row(3, 'for statement', '', 'i = 0;i < 3;i++', ''));
        rows.push(new Row(4, 'assignment expression', 'i', '', '4'));
        assert.deepEqual(
            parseFunction('function someFunction(a, b) {\n' +
                '  let i;\n' +
                '  for(i=0; i<3; i++){ \n' +
                '      i=4; \n' +
                '  } \n' +
                '}'),
            rows
        );
    });

    it('is parsing a simple if statement', () => {
        var rows = []
        rows.push(new Row(1, 'if statement', '', 'y < x', ''));
        rows.push(new Row(2, 'assignment expression', 'y', '', 'x'));
        assert.deepEqual(
            parseFunction('if(y < x){\n' +
                '  y = x;\n' +
                '}'),
            rows
        );
    });

});
