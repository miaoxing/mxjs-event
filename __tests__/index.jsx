import {render} from '@testing-library/react';
import {Event} from '..';

describe('test', () => {
  test('basic', () => {
    const result = render(<Event/>);

    expect(result.container).toMatchSnapshot();
  });
});
