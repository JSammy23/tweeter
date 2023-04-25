import React from "react";
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from "./LoginPage";

test('renders login page with email and pasword inputs', () => {
    render(
        <Router>
            <LoginPage />
        </Router>
    );
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});

test('allows user to log in with valid credentials', async () => {
    render(
        <Router>
            <LoginPage />
        </Router>
    );
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Log In');
  
    fireEvent.change(emailInput, { target: { value: 'testman@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test123' } });
    fireEvent.click(loginButton);
  
    // Wait for Firebase to log in user
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    expect(window.location.pathname).toEqual('/');
});

test('displays error message with invalid credentials', async () => {
    render(
        <Router>
            <LoginPage />
        </Router>
    );
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Log In');
  
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
  
    // Wait for Firebase to reject login
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    const errorMessage = screen.getByText('Firebase: Error (auth/user-not-found).');
    expect(errorMessage).toBeInTheDocument();
});