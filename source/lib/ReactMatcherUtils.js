import { propertiesForElement } from 'describe-react-element';
import flatten from 'array-flatten';

const ReactMatcherUtils = {
  elementsMatch: function(equals, actualElement, expected) {
    if (actualElement === null || typeof(actualElement) === 'undefined') { return false; }
    if (typeof(actualElement) === 'string') { return expected === actualElement; }
    if (expected.type !== actualElement.type) { return false; }

    const { children: expectedChildren, ...expectedProps } = propertiesForElement(expected);
    const { children: actualChildren, ...actualProps } = propertiesForElement(actualElement);

    const propertiesMatcher = jasmine.objectContaining(expectedProps);
    const propertiesMatch = equals(actualProps, propertiesMatcher);

    if (!propertiesMatch) { return false; }

    const expectedChildrenMatch = this.collectionHasMatchForAllElements(equals, actualChildren, expectedChildren);
    return expectedChildrenMatch;
  },

  collectionHasMatchForElement: function(equals, actualCollection, expected) {
    const test = (actualElement) => this.elementsMatch(equals, actualElement, expected);
    return actualCollection.some(test);
  },

  collectionHasMatchForAllElements: function(equals, actualCollection, expectedCollection) {
    if(typeof(expectedCollection) === 'undefined') { return true; }

    expectedCollection = flatten([expectedCollection]);
    actualCollection = flatten([actualCollection]);

    const test = (expectedElement) => this.collectionHasMatchForElement(equals, actualCollection, expectedElement);
    return expectedCollection.every(test);
  },

  findMatchingElement: function(equals, actualElement, expectedElement) {
    const matches = [];

    if(typeof(actualElement) === 'undefined') { return; }

    if(this.elementsMatch(equals, actualElement, expectedElement)) {
      matches.push(actualElement);
    }

    if (actualElement.props) {
      const children = flatten([actualElement.props.children]);
      const matchesFromChildren = children.map((child) => {
        return this.findMatchingElement(equals, child, expectedElement);
      });

      const matchCollection = flatten(matchesFromChildren).filter(element => element);
      matches.push(...matchCollection);
    }

    if(matches.length === 0) { return; }
    return matches.length === 1 ? matches[0] : matches;
  }
};

export default ReactMatcherUtils;