import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './state/store'
import { ThemeProvider } from '@context/ThemeContext'
interface GlobalStateProps {
    children: ReactNode
}

const GlobalState: React.FC<GlobalStateProps> = ({ children }) => (
    <ThemeProvider>

        <Provider store={store}>
            {children}
        </Provider>
    </ThemeProvider>
)

export default GlobalState
