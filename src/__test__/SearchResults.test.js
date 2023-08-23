import React from 'react'
import { cleanup, fireEvent, render, queryByTestId, getByTestId } from '@testing-library/react';
/*
import {
  SearchResults
} from "../components/SearchResults";
*/
afterEach(cleanup);

it.skip('check if search results rendered', () => {
  const { queryByText } = render(<SearchResults
                          data={[]}
                          visibility={true}
                        />);
  

  expect(queryByText("No results found")).toBeTruthy(); 

});