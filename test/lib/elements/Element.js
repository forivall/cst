import {parseAndGetProgram} from '../../utils';
import Token from '../../../src/elements/Token';
import {expect} from 'chai';

describe('Element', () => {
    it('should get previous token', () => {
        let program = parseAndGetProgram('var first = 1; var second = 2;');
        let secondVar = program.selectTokensByType('Keyword')[1];

        expect(secondVar.previousToken.previousToken.sourceCode).to.equal(';');
    });

    describe('Element#removeChild', () => {
        it('should remove child', () => {
            let program = parseAndGetProgram('var first = 1; var second = 2;');

            program.removeChild(program.firstChild);

            expect(program.sourceCode).to.equal(' var second = 2;');
        });

        it('should remove child through parent', () => {
            let program = parseAndGetProgram('var first = 1; var second = 2;');

            program.firstChild.parentElement.removeChild(program.firstChild);

            expect(program.sourceCode).to.equal(' var second = 2;');
        });

        it('should remove whitespace child', () => {
            let program = parseAndGetProgram('\n\n\nvar first = 1; var second = 2;');

            program.removeChild(program.firstChild);

            expect(program.sourceCode).to.equal('var first = 1; var second = 2;');
        });

        it('should remove child through sibling', () => {
            let program = parseAndGetProgram('\n\n\nvar first = 1; var second = 2;');

            program.removeChild(program.firstChild.nextSibling);

            expect(program.sourceCode).to.equal('\n\n\n var second = 2;');
        });

        it('should remove whitespace child through parent element', () => {
            let program = parseAndGetProgram('\n\n\nvar first = 1; var second = 2;');

            program.firstChild.parentElement.removeChild(program.firstChild);

            expect(program.sourceCode).to.equal('var first = 1; var second = 2;');
        });

        it('should remove element references', () => {
            let program = parseAndGetProgram('var first = 1;');
            let firstVar = program.selectNodesByType('VariableDeclaration')[0];

            program.removeChild(firstVar);

            expect(firstVar.parentElement).to.not.equal(program);

            expect(program.childElements.length).to.equal(1);
            expect(program.childElements[0].type).to.equal('EOF');
        });
    });

    describe('Element#replaceChild', () => {
        it('should replace child', () => {
            let program = parseAndGetProgram('var first = 1; var second = 2;');
            let firstVar = program.selectNodesByType('VariableDeclaration')[0];

            program.replaceChild(new Token('Whitespace', ';'), firstVar);

            expect(program.sourceCode).to.equal('; var second = 2;');
        });

        it('should replace child with existing one', () => {
            let program = parseAndGetProgram('var first = 1; var second = 2;');
            let firstVar = program.selectNodesByType('VariableDeclaration')[0];
            let secondVar = program.selectNodesByType('VariableDeclaration')[1];

            program.removeChild(firstVar);
            program.replaceChild(firstVar, secondVar);

            expect(program.sourceCode).to.equal(' var first = 1;');
        });
    });

    describe('range property', () => {
        it('should return range property for VariableDeclarator', () => {
            var program = parseAndGetProgram('var answer = 1;');
            var node = program.selectNodesByType('VariableDeclarator')[0];

            expect(node.range).to.include(4, 10);
        });

        it('should return range property for VariableDeclaration', () => {
            var program = parseAndGetProgram('var answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.range).to.include(0, 15);
        });

        it('should return range property for second VariableDeclarators', () => {
            var program = parseAndGetProgram('var first = 1; var second = 2;');
            var node = program.selectNodesByType('VariableDeclarator')[1];

            expect(node.range).to.include(19, 29);
        });
    });

    describe('loc property', () => {
        it('should return loc property for oneliner', () => {
            var program = parseAndGetProgram('var answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 1,
                    'column': 15
                }
            });
        });

        it('should return loc property for oneliner first node with additional space', () => {
            var program = parseAndGetProgram(' var answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 1,
                    'column': 1
                },
                'end': {
                    'line': 1,
                    'column': 16
                }
            });
        });

        it('should return loc property for oneliner first node with space and newline', () => {
            var program = parseAndGetProgram('\n var answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 2,
                    'column': 1
                },
                'end': {
                    'line': 2,
                    'column': 16
                }
            });
        });

        it('should return loc property for multiple line breaks', () => {
            var program = parseAndGetProgram('\n\n\nvar answer = 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 4,
                    'column': 0
                },
                'end': {
                    'line': 4,
                    'column': 15
                }
            });
        });

        it('should return loc property with tricky end', () => {
            var program = parseAndGetProgram('\n\n\n var answer = \n1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 4,
                    'column': 1
                },
                'end': {
                    'line': 5,
                    'column': 2
                }
            });
        });

        it('should return loc property with space tricky end', () => {
            var program = parseAndGetProgram('\n\n\n var answer = \n 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 4,
                    'column': 1
                },
                'end': {
                    'line': 5,
                    'column': 3
                }
            });
        });

        it('should return loc property with spaces tricky end', () => {
            var program = parseAndGetProgram('var answer = \n\n\n  1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 4,
                    'column': 4
                }
            });
        });

        it('should return loc property with spaces & symbol tricky end', () => {
            var program = parseAndGetProgram('var answer = \n\n2\n 1;');
            var node = program.selectNodesByType('VariableDeclaration')[0];

            expect(node.loc).to.deep.equal({
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 3,
                    'column': 1
                }
            });
        });
    });
});
