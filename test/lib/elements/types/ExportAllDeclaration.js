import {parseAndGetStatement} from '../../../utils';
import Token from '../../../../src/elements/Token';
import {expect} from 'chai';

describe('ExportAllDeclaration', () => {
    it('should return correct type', () => {
        expect(parseAndGetStatement('export * from "a";').type).to.equal('ExportAllDeclaration');
    });

    it('should accept export', () => {
        var statement = parseAndGetStatement('export * from "a";');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('a');
    });

    it('should accept export with relative path', () => {
        var statement = parseAndGetStatement('export * from "./a";');
        expect(statement.source.type).to.equal('Literal');
        expect(statement.source.value).to.equal('./a');
    });

    it('should not accept trailing whitespace', () => {
        var statement = parseAndGetStatement('export * from "./a";');
        expect(() => {
            statement.appendChild(new Token('Whitespace', '   '));
        }).to.throw('Expected end of node list but "Whitespace" found');
    });
});
