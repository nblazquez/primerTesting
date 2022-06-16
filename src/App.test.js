import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from './App';

jest.mock('axios');

const getFakeResponse = ({expectedDefinition}) => ({
  data: [{
    meanings: [{
      definitions: [{
        definition: expectedDefinition
      }]
    }]
  }]
});

beforeEach(() => {
  render(<App />);
  axios.get.mockClear();
});

const fillFormAndSubmit = () => {
  const inputEl = screen.getByLabelText(/word/i);
  const btnEl = screen.getByRole('button', { name: /consult/i});

  fireEvent.change(inputEl, {target: {value: 'house'}});
  fireEvent.click(btnEl);
}

test('renders Free Dictionary title', () => {
  const title = screen.getByText(/free dictionary/i);
  expect(title).toBeInTheDocument();
});

test('should render the form elements', () => {
  const inputEl = screen.getByLabelText(/word/i);
  const btnEl = screen.getByRole('button', { name: /consult/i});

  expect(inputEl).toBeInTheDocument();
  expect(btnEl).toBeInTheDocument();
});

test('should search a word', async () => {
  const expectedDefinition = 'A structure built or serving as an abode of human beings';
  axios.get.mockReturnValueOnce(getFakeResponse({expectedDefinition}));
  
  fillFormAndSubmit();

  const wordMeaningEl = await screen.findByText(/A structure built or serving as an abode of human beings/i);
  expect(wordMeaningEl).toBeInTheDocument();

  screen.debug();
});

test('should not exist Loading string when search is finished', async () => {
  const expectedDefinition = 'A structure built or serving as an abode of human beings';
  axios.get.mockReturnValueOnce(getFakeResponse({expectedDefinition}));

  fillFormAndSubmit();

  const loadingEl = screen.getByText(/loading/i);

  expect(loadingEl).toBeInTheDocument();

  const wordMeaningEl = await screen.findByText(expectedDefinition);
  
  const loadingElExpectedEl = screen.queryByText(/loading/i);
  expect(loadingElExpectedEl).not.toBeInTheDocument();
  
});
