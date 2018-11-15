import assert from 'assert';
import {parseFunction} from '../src/js/code-parser';

describe('The javascript line detector', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            parseFunction(''),
            []
        );
    });
});
