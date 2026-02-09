/**
 * App Component
 * ACTUALIZADO: Envuelto con ErrorBoundary
 */

import { AppRoutes } from './routes/RoutesIndex'
import ErrorBoundary from './components/error/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    </ErrorBoundary>
  )
}

export default App