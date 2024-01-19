import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RadioButtonGroup from '../../components/widgets/RadioButtonGroup';

describe('RadioButtonGroup', () => {
  const options = ['Option1', 'Option2', 'Option3'];
  const mockOnChange = jest.fn();

  it('renders without crashing', () => {
    render(<RadioButtonGroup label="Test Label" options={options} name="test-name" />);
  });

  it('displays the provided label', () => {
    render(<RadioButtonGroup label="Test Label" options={options} name="test-name" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders the correct number of radio buttons', () => {
    render(<RadioButtonGroup label="Test Label" options={options} name="test-name" />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(options.length);
  });

  it('selects the radio button corresponding to the provided value', () => {
    render(<RadioButtonGroup label="Test Label" options={options} value="Option2" name="test-name" />);
    const selectedRadio = screen.getByDisplayValue('Option2');
    expect(selectedRadio).toBeChecked();
  });

  it('triggers onChange when a radio button is selected', () => {
    render(<RadioButtonGroup label="Test Label" options={options} name="test-name" onChange={mockOnChange} />);
    const radioToClick = screen.getByDisplayValue('Option3');
    fireEvent.click(radioToClick);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
