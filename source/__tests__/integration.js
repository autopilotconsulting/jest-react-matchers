import React from 'react';
import jestReactMatchers from '../index';

expect.extend(jestReactMatchers);

describe('jest-react-matchers', () => {
  describe('toMatchElement', () => {
    it('should match basic html elements based on the expected properties', () => {
      const actual = <h1 id='foo' data-herring='red'>Hiyo!!</h1>;

      expect(actual).toMatchElement(<h1 />);
      expect(actual).toMatchElement(<h1 id='foo' />);

      expect(actual).not.toMatchElement(<h1 id='bar' />);
      expect(actual).not.toMatchElement(<h1 data-missing='true' />);

      expect(actual).toMatchElement(<h1>Hiyo!!</h1>);
      expect(actual).not.toMatchElement(<h1>Wat!?</h1>);
    });

    it('should match elements with children', () => {
      const actual = (
        <div>
          <span>Hiyo</span>
          World!
        </div>
      );

      expect(actual).toMatchElement(<div />);
      expect(actual).toMatchElement(<div><span /></div>);
      expect(actual).toMatchElement(<div><span>Hiyo</span></div>);
      expect(actual).toMatchElement(<div>World!</div>);
      
      expect(actual).not.toMatchElement(<div><span>Goodbye</span></div>);
      expect(actual).not.toMatchElement(<div>Cruel World!</div>);
      expect(actual).not.toMatchElement(<span />);
    });

    it('should handle elements with one child', () => {
      const actual = (
        <div>
          Hiyo!
        </div>
      );

      expect(actual).toMatchElement(<div />);
      expect(actual).toMatchElement(<div>Hiyo!</div>);
    });

    it('should handle elements with no children', () => {
      const actual = <div />;
      expect(actual).toMatchElement(<div />);
    });
  });

  describe('toHaveMatchingChildren', () => {
    const actual = (
      <ul>
        Why is this here!?
        <li>Pippy</li>
        <li>Hatch</li>
        <li wife={true}>Lu</li>
      </ul>
    );

    it('should match all of the expected children', () => {
      const expected = (
        <ul>
          Why is this here!?
          <li>Pippy</li>
          <li wife={true} />
        </ul>
      );

      expect(actual).toHaveMatchingChildren(<li />, <li>Pippy</li>, <li>Hatch</li>);
      expect(actual).toHaveMatchingChildren('Why is this here!?');
      expect(actual).toHaveMatchingChildren(expected.props.children);

      expect(actual).not.toHaveMatchingChildren(<div />, 'nor this');
    });
  });
});