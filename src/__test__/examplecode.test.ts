import React from 'react';
import { render } from '@testing-library/react';
import Cat from '../components/Cat';
 // Assuming Cat component is in Cat.js file

describe('Cat component', () => {
  it('renders name and color correctly', () => {
    const props = {
      name: 'Whiskers',
      color: 'black'
    };

    const { getByText } = render(<Cat {...props} />);

    expect(getByText(props.name)).toBeInTheDocument();
    expect(getByText(props.color)).toBeInTheDocument();
  });

  it('initializes humor state to "happy"', () => {
    const props = {
      name: 'Whiskers',
      color: 'black'
    };

    const { getByText } = render(<Cat {...props} />);

    expect(getByText('happy')).toBeInTheDocument();
  });
});


