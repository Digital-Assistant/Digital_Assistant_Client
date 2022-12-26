import React from 'react'
import { cleanup, fireEvent, render, queryByTestId, getByTestId } from '@testing-library/react';
import {
  RecordButton
} from "../components/RecordButton";


afterEach(cleanup);

it('check if record button enabled', () => {
  const { queryByText } = render(<RecordButton recordButtonVisibility={true} />);
  expect(queryByText("Record")).toBeTruthy(); 
});