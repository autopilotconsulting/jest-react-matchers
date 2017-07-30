import React from 'react';
import ReactMatcherUtils from '../../lib/ReactMatcherUtils';
import { equals } from '../../../support/jasmine_utils';

describe('ReactMatcherUtils', () => {
  describe('#elementsMatch', () => {
    let mockCollectionHasMatchForAllElements;

    beforeEach(() => {
      mockCollectionHasMatchForAllElements = jest.spyOn(ReactMatcherUtils, 'collectionHasMatchForAllElements');
      mockCollectionHasMatchForAllElements.mockImplementation(() => true);
    });

    afterEach(() => {
      mockCollectionHasMatchForAllElements.mockRestore();
    })

    it('should return true if the elements have matching types', () => {
      const result = ReactMatcherUtils.elementsMatch(equals, <div />, <div />);
      expect(result).toBe(true);
    });

    it('should return false if the elements have mismatched types', () => {
      const result = ReactMatcherUtils.elementsMatch(equals, <div />, <span />);
      expect(result).toBe(false);
    });

    it('should return false if there is no actual element', () => {
      let result = ReactMatcherUtils.elementsMatch(equals, null, <div />);
      expect(result).toBe(false);

      result = ReactMatcherUtils.elementsMatch(equals, undefined, <div />);
      expect(result).toBe(false);      
    });

    it('should match string elements', () => {
      let result = ReactMatcherUtils.elementsMatch(equals, 'expected', 'expected');
      expect(result).toBe(true);    

      result = ReactMatcherUtils.elementsMatch(equals, 'actual', 'expected');
      expect(result).toBe(false);    
    });

    it('should require that the properties match asymmetrically', () => {
      let result = ReactMatcherUtils.elementsMatch(equals, <div id='test' data-extra='true' />, <div id='test' />);
      expect(result).toBe(true)

      result = ReactMatcherUtils.elementsMatch(equals, <div id='test' />, <div id='nope' />);
      expect(result).toBe(false)
    });

    it('should require that the children match asymmetrically', () => {
      const actual = (
        <div>
          <h1 />
          <h2 />
          Hiyo!!
        </div>
      );

      const expected = (
        <div>
          <h1 />
          <h2 />
        </div>
      );

      let result = ReactMatcherUtils.elementsMatch(equals, actual, <div><h1 />Hiyo!!</div>);
      expect(result).toBe(true);

      result = ReactMatcherUtils.elementsMatch(equals, actual, <div />);
      expect(result).toBe(true);

      mockCollectionHasMatchForAllElements.mockImplementation(() => false);
      result = ReactMatcherUtils.elementsMatch(equals, actual, <div><h3 /></div>);
      expect(result).toBe(false);

      expect(mockCollectionHasMatchForAllElements).toHaveBeenCalledWith(
        equals, [<h1 />, <h2 />, 'Hiyo!!'], undefined
      );

      expect(mockCollectionHasMatchForAllElements).toHaveBeenCalledWith(
        equals, [<h1 />, <h2 />, 'Hiyo!!'], [<h1 />, 'Hiyo!!']
      );

      expect(mockCollectionHasMatchForAllElements).toHaveBeenCalledWith(
        equals, [<h1 />, <h2 />, 'Hiyo!!'], <h3 />
      );
    });
  });

  describe('#collectionHasMatchForElement', () => {
    let mockElementsMatch;
    const actualCollection = [406, 217, 1118];

    beforeEach(() => {
      mockElementsMatch = jest.spyOn(ReactMatcherUtils, 'elementsMatch');
      mockElementsMatch.mockImplementation((equals, actual, expected) => {
        return actual === expected;
      });
    });

    afterEach(() => {
      mockElementsMatch.mockRestore();
    });

    it('should return true if the element matches any element in the collection', () => {
      const result = ReactMatcherUtils.collectionHasMatchForElement(equals, actualCollection, 217);
      expect(result).toBe(true);
      expect(mockElementsMatch).toHaveBeenCalledWith(equals, 217, 217);
      expect(mockElementsMatch).toHaveBeenCalledWith(equals, 406, 217);
      expect(mockElementsMatch).toHaveBeenCalledTimes(2);
    });

    it('should return false if the element is not found in the collection', () => {      
      const result = ReactMatcherUtils.collectionHasMatchForElement(equals, actualCollection, 419);
      expect(result).toBe(false);
      expect(mockElementsMatch).toHaveBeenCalledWith(equals, 217, 419);
      expect(mockElementsMatch).toHaveBeenCalledWith(equals, 406, 419);
      expect(mockElementsMatch).toHaveBeenCalledWith(equals, 1118, 419);
    });
  });

  describe('#collectionHasMatchForAllElements', () => {
    let mockCollectionHasMatchForElement;
    const actualCollection = [406, 217, 1118];

    beforeEach(() => {
      mockCollectionHasMatchForElement = jest.spyOn(ReactMatcherUtils, 'collectionHasMatchForElement');
      mockCollectionHasMatchForElement.mockImplementation((equals, actual, expected) => {
        return actual.indexOf(expected) > -1;
      });
    });

    afterEach(() => {
      mockCollectionHasMatchForElement.mockRestore();
    });

    it('should return true if all elements match an element in the collection', () => {
      const result = ReactMatcherUtils.collectionHasMatchForAllElements(equals, actualCollection, [217, 1118]);
      expect(result).toBe(true);
      expect(mockCollectionHasMatchForElement).toHaveBeenCalledWith(equals, actualCollection, 217);
      expect(mockCollectionHasMatchForElement).toHaveBeenCalledWith(equals, actualCollection, 1118);
    });

    it('should return false if any element is not found in the collection', () => {      
      const result = ReactMatcherUtils.collectionHasMatchForAllElements(equals, actualCollection, [217, 419, 1118]);
      expect(result).toBe(false);
      expect(mockCollectionHasMatchForElement).toHaveBeenCalledWith(equals, actualCollection, 217);
      expect(mockCollectionHasMatchForElement).toHaveBeenCalledWith(equals, actualCollection, 419);
      expect(mockCollectionHasMatchForElement).toHaveBeenCalledTimes(2);
    });

    it('should return true if the expected element list is undefined', () => {
      const result = ReactMatcherUtils.collectionHasMatchForAllElements(equals, actualCollection, undefined);
      expect(result).toBe(true);
    });

    it('should convert individual items into collections', () => {
      const result = ReactMatcherUtils.collectionHasMatchForAllElements(equals, 1118, 1118);
      expect(result).toBe(true);
    });
  });

  describe('findMatchingElement', () => {
    const pippyDiv = (
      <div>
        <span>Pippy</span>
      </div>
    );

    const actualHierarchy = (
      <div>
        {pippyDiv}
        <li>Hatch</li>
        <div>
          <p>
            <li data-tis-wife={true}>Lu</li>
            <table />
          </p>
        </div>
      </div>
    );

    it('should return a collection of matched elements from any level in the hierarchy', () => {
      let result = ReactMatcherUtils.findMatchingElement(equals, actualHierarchy, <div />);
      expect(result).toContain(actualHierarchy);
      expect(result).toContain(pippyDiv);
      expect(result.length).toBe(3);

      result = ReactMatcherUtils.findMatchingElement(equals, actualHierarchy, <li />);
      expect(result).toEqual([<li>Hatch</li>, <li data-tis-wife={true}>Lu</li>]);  
    });

    it('should return undefined if the actual element is undefined', () => {
      const result = ReactMatcherUtils.findMatchingElement(equals, undefined, <div />);
      expect(result).toEqual(undefined);
    });

    it('should return undefined if the element is not found', () => {
      let result = ReactMatcherUtils.findMatchingElement(equals, actualHierarchy, <marquee />);
      expect(result).toEqual(undefined);
    });

    it('should return one element if only one element matches', () => {
      let result = ReactMatcherUtils.findMatchingElement(equals, actualHierarchy, <li>Hatch</li>);
      expect(result).toEqual(<li>Hatch</li>);

      result = ReactMatcherUtils.findMatchingElement(equals, actualHierarchy, 'Pippy');
      expect(result).toBe('Pippy');

      result = ReactMatcherUtils.findMatchingElement(equals, actualHierarchy, <div><p /></div>);
      const expected = (        
        <div>
          <p>
            <li data-tis-wife={true}>Lu</li>
            <table />
          </p>
      </div>
      );
      expect(result).toEqual(expected);
    });
  });
});