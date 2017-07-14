import React from 'react';
import { equals } from '../../../support/jasmine_utils';

import ReactMatcherUtils from '../../lib/ReactMatcherUtils.js';
import toMatchElement from '../../lib/toMatchElement.js';

describe('ReactMatchers', () => {
  describe('#toMatchElement', () => {
    let matcherContext = { equals };

    it('should pass if elements match', () => {
      const actual = <div />;
      const expected = <div />;

      const result = toMatchElement.call(matcherContext, actual, expected);
      
      expect(result.pass).toBe(true)
    });

    it('should be negatable', () => {
      const actual = <div />;
      const expected = <span />;

      const result = toMatchElement.call(matcherContext, actual, expected);
      
      expect(result.pass).toBe(false)
    });

    it('should describe a failed match', () => {
      const result = toMatchElement.call(matcherContext, <div />, <span />);      
      expect(result.message).toMatchSnapshot();
    });

    it('should describe a failed negated match', () => {
      const result = toMatchElement.call(matcherContext, <div />, <div />);      
      expect(result.message).toMatchSnapshot();
    });
  });
});