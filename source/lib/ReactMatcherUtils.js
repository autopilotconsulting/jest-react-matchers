import { propertiesForElement } from 'describe-react-element';
import flatten from 'array-flatten';

const ReactMatcherUtils = {
  elementsMatch: function(equals, actual, expected) {
    if (actual === null || typeof(actual) === 'undefined') { return false; }
    if (typeof(actual) === 'string') { return expected === actual; }
    if (expected.type !== actual.type) { return false; }

    const { children: expectedChildren, ...expectedProps } = propertiesForElement(expected);
    const { children: actualChildren, ...actualProps } = propertiesForElement(actual);

    const propertiesMatcher = jasmine.objectContaining(expectedProps);
    const propertiesMatch = equals(actualProps, propertiesMatcher);

    if (!propertiesMatch) { return false; }

    const expectedChildrenMatch = this.collectionHasMatchForAllElements(equals, actualChildren, expectedChildren);
    return expectedChildrenMatch;
  },

  collectionHasMatchForElement: function(equals, actualCollection, expected) {
    const test = (actual) => this.elementsMatch(equals, actual, expected);
    return actualCollection.some(test);
  },

  collectionHasMatchForAllElements: function(equals, actualCollection, expectedCollection) {
    if(typeof(expectedCollection) === 'undefined') { return true; }

    expectedCollection = flatten([expectedCollection]);
    actualCollection = flatten([actualCollection]);

    const test = (expected) => this.collectionHasMatchForElement(equals, actualCollection, expected);
    return expectedCollection.every(test);
  }
};

export default ReactMatcherUtils;