/* jshint ignore:start */

import Expression from '../Expression';

export default class Literal extends Expression {
    constructor(childNodes) {
        super('Literal', childNodes);
    }

    _acceptChildren(children) {
        children.assertToken();
        let value = children.currentElement.value;
        let rawValue = children.currentElement.sourceCode;

        children.moveNext();
        children.assertEnd();

        this._value = value;
        this._raw = rawValue;
    }

    get value() {
        return this._value;
    }

    get raw() {
        return this._raw;
    }
}
