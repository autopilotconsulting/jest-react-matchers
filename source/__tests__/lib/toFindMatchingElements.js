import React from 'react';
import { equals } from '../../../support/jasmine_utils';

import ReactMatcherUtils from '../../lib/ReactMatcherUtils.js';
import toFindMatchingElements from '../../lib/toFindMatchingElements.js';

describe('ReactMatchers', () => {
  describe('#toFindMatchingElements', () => {
    let matcherContext;
    
    const actual = (
      <div>
        <div>
          <span>Pippy</span>
        </div>
        <li>Hatch</li>
        <div>
          <p>
            <li data-tis-wife={true}>Lu</li>
          </p>
        </div>
      </div>
    );

    beforeEach(() => {
      matcherContext = { equals, isNot: false };
    });

    it('should pass if all expected elements are present', () => {
      let result = toFindMatchingElements.call(matcherContext, actual, <li />);
      expect(result.pass).toBe(true);

      result = toFindMatchingElements.call(matcherContext, actual, [<span>Pippy</span>, <li>Hatch</li>]);
      expect(result.pass).toBe(true);

      result = toFindMatchingElements.call(matcherContext, actual, <span>Pippy</span>, <li>Hatch</li>);
      expect(result.pass).toBe(true);
    });

    it('should not pass if any expected elements are missing', () => {
      let result = toFindMatchingElements.call(matcherContext, actual, [<span>Pippy</span>, <marquee />]);
      expect(result.pass).toBe(false);
    });

    describe('when negated', () => {
      it('should "pass" if any unexpected elements are present', () => {
        matcherContext.isNot = true;
        let result = toFindMatchingElements.call(matcherContext, actual, [<span>Pippy</span>, <marquee />]);
        expect(result.pass).toBe(true);
      });

      it('should not "pass" if all unexpected elements are absent', () => {
        matcherContext.isNot = true;
        let result = toFindMatchingElements.call(matcherContext, actual, [<table />, <marquee />]);
        expect(result.pass).toBe(false);
      });
    });

    it('should describe a failure appropriately', () => {
      const expected = [
        <li data-tis-wife={true} />,
        <li>Lu</li>,
        'Pippy',
        <div data-awesome={true}>An awesome div!!</div>,
        <span>Lame Span</span>
      ];

      const result = toFindMatchingElements.call(matcherContext, actual, expected);      
      expect(result.message).toMatchSnapshot();
    });

    it('should describe a negated failure appropriately', () => {
      const unexpected = [
        <li data-tis-wife={true} />,
        <li>Lu</li>,
        'Pippy',
        <div data-awesome={true}>An awesome div!!</div>,
        <span>Lame Span</span>
      ];

      matcherContext.isNot = true;
      const result = toFindMatchingElements.call(matcherContext, actual, unexpected);
      expect(result.message).toMatchSnapshot();
    });
  });
});