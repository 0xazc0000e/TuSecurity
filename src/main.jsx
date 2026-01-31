import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import { AnalyticsProvider } from './context/AnalyticsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <AnalyticsProvider>
                <App />
            </AnalyticsProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
