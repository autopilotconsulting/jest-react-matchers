import React from 'react';
import { equals } from '../../../support/jasmine_utils';

import toHaveMatchingChildren from '../../lib/toHaveMatchingChildren.js';

describe('ReactMatchers', () => {
  describe('#toHaveMatchingChildren', () => {
    let matcherContext;
    
    const actual = (
      <div>
        <li>Pippy</li>
        <li>Hatch</li>
        <li data-tis-wife={true}>Lu</li>
      </div>
    );

    beforeEach(() => {
      matcherContext = { equals, isNot: false };
    });

    it('should pass if all expected children are present', () => {
      let result = toHaveMatchingChildren.call(matcherContext, actual, <li />);
      expect(result.pass).toBe(true);

      result = toHaveMatchingChildren.call(matcherContext, actual, [<li>Pippy</li>, <li>Hatch</li>]);
      expect(result.pass).toBe(true);

      result = toHaveMatchingChildren.call(matcherContext, actual, <li>Pippy</li>, <li>Hatch</li>);
      expect(result.pass).toBe(true);
    });

    it('should not pass if any expected children are missing', () => {
      let result = toHaveMatchingChildren.call(matcherContext, actual, [<li>Pippy</li>, <span />]);
      expect(result.pass).toBe(false);
    });

    describe('when negated', () => {
      it('should not "pass" if all unexpected elements are missing', () => {
        matcherContext.isNot = true;
        let result = toHaveMatchingChildren.call(matcherContext, actual, [<marquee />, <span />]);
        expect(result.pass).toBe(false);
      });

      it('should "pass" if any unexpected children are present', () => {
        matcherContext.isNot = true;
        let result = toHaveMatchingChildren.call(matcherContext, actual, [<li>Pippy</li>, <span />]);
        expect(result.pass).toBe(true);
      });
    })

    it('should fail if the actual element has no children', () => {
      let actual = <div />;

      const result = toHaveMatchingChildren.call(matcherContext, actual, <h1 />);
      expect(result.pass).toBe(false);
      expect(result.message).toMatchSnapshot();
    });

    it('should describe a failure appropriately', () => {
      const expected = [
        <li data-tis-wife={true} />,
        <li>Lu</li>,
        <div data-awesome={true}>An awesome div!!</div>,
        <span>Lame Span</span>
      ];

      const result = toHaveMatchingChildren.call(matcherContext, actual, expected);      
      expect(result.message).toMatchSnapshot();
    });

    it('should describe a negated failure appropriately', () => {
      const unexpected = [
        <li data-tis-wife={true} />,
        <li>Lu</li>,
        <div data-awesome={true}>An awesome div!!</div>,
        <span>Lame Span</span>
      ];

      matcherContext.isNot = true;
      const result = toHaveMatchingChildren.call(matcherContext, actual, unexpected);
      expect(result.message).toMatchSnapshot();
    });
  });
});