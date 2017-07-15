# Jest React Matchers

React element matching the way it should be.  Make your tests clean, simple, and easy to read.  This is a non-intrusive addition to your existing testing frameworks.

These matchers are totally pre-beta.  Feedback is absolutely welcome.  As are contributions.  I'm releasing a 0.1.0 with the element matcher and the children matcher.  I'm also going to write a recursive search matcher too in the next few weeks, but I think this is a decent start.

## Background

Learning to test ReactJS components was a harrowing experience.  It's easy to find yourself with a test suite full of things like this:

```javascript
const component = renderedElement.props.children.props.children[0];
expect(component.type).toEqual(MyComponent);
// ...
```

Then, you update your structure and now suddenly `rendered.props.children` is an array instead!  All your tests are broken and you have to go back and update them:

```javascript
const component = renderedElement.props.children[0].props.children[0];
expect(component.type).toEqual(MyComponent);
// ...
```

And you probably at some point end up with dozens of lines like this:

```javascript
const component = renderedElement.props.children;
expect(component.props.firstName).toEqual('pippy');
expect(component.props.lastName).toEqual('dippy');
expect(component.props.age).toEqual(5);
expect(component.props.className).toEqual('kiddo');
// ...
```

So, you look at [Enzyme](https://github.com/airbnb/enzyme), which is totally awesome!  So now you can write things like:

```javascript
const wrapper = mount((
  <ul>
    <li>Pippy</li>
    <li>Hatch</li>
    <li>Lu</li>
  </div>
));

expect(wrapper.containsAllMatchingElements([
  <li>Pippy</li>,
  <li>Hatch</li>
])).to.equal(true);
```

This is super great!  But, when it fails unexpectedly, it doesn't tell you anything beyond, "expected true but got false."  Bah!

Enter jest react matchers.  Now, you can write:

```javascript
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
```

Pass a varargs, an array, or a single instance and get what you expect.  Match on children and other properties.  It's an asymetric matcher.  Be as generic or specific as you want.  When something doesn't match, get meaningful output.

```
Expected to find children:
  <div data-awesome='true'>
    An awesome div!!
  </div>
  <span>
    Lame Span
  </span>

in:
  <div>
    <li>
      Pippy
    </li>
    <li>
      Hatch
    </li>
    <li data-tis-wife='true'>
      Lu
    </li>
  </div>

Expected not to find children:
  <li data-tis-wife='true' />
  <li>
    Lu
  </li>

in:
  <div>
    <li>
      Pippy
    </li>
    <li>
      Hatch
    </li>
    <li data-tis-wife='true'>
      Lu
    </li>
  </div>
```

## Installation

```
npm install jest-react-matchers --save
```

## Usage

```javascript
import jestReactMatchers from 'jest-react-matchers';
expect.extend(jestReactMatchers);

const element = (
  <div name='pip' adorbs={true}>
    <h1>Permanent Excitement!!</h1>
    <h2 />
  </div>
);

expect(element).matchElement(<div name='pip' />);
expect(element).matchElement(<div name='pip'><h1 /></div>);

expect(element).toHaveMatchingChildren(<h1 />, <h2 />);
expect(element).toHaveMatchingChildren(element.props.children);
```

## License

MIT
