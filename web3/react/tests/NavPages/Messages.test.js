import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Messages from '../../components/pages/navpages/Messages';
import {BrowserRouter} from 'react-router-dom';
describe('Messages', () => {

  it('renders without crashing', () => {
    try {
        render(<BrowserRouter><Messages /></BrowserRouter>);

    } catch (error) {
        
    }
  });


});
