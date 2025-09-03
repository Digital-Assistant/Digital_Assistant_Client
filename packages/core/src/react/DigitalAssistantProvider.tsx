import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

interface DigitalAssistantProviderProps {
    children: React.ReactNode;
}

export const DigitalAssistantProvider: React.FC<DigitalAssistantProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default DigitalAssistantProvider;
