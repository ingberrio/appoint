import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Header from './Header';
import { logout } from '../slices/authSlice';

const mockStore = configureStore([]);

/* eslint-disable no-undef */
describe('Header', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            // Aquí puedes agregar el estado inicial necesario para tu prueba
        });
    });

    test('should dispatch logout action when logout button is clicked', () => {
        store.dispatch = jest.fn();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText('Logout'));

        expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
});
