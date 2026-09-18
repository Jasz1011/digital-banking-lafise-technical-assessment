import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '../layouts/AppShell'
import { Skeleton } from '../components/ui/Skeleton'

const OverviewPage = lazy(() =>
  import('../pages/OverviewPage').then((module) => ({ default: module.OverviewPage })),
)
const CreateCustomerPage = lazy(() =>
  import('../pages/CreateCustomerPage').then((module) => ({ default: module.CreateCustomerPage })),
)
const FindAccountPage = lazy(() =>
  import('../pages/FindAccountPage').then((module) => ({ default: module.FindAccountPage })),
)
const CreateAccountPage = lazy(() =>
  import('../pages/CreateAccountPage').then((module) => ({ default: module.CreateAccountPage })),
)
const AccountDetailPage = lazy(() =>
  import('../pages/AccountDetailPage').then((module) => ({ default: module.AccountDetailPage })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

function RouteFallback() {
  return (
    <div aria-label="Cargando página" className="grid gap-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-full max-w-lg" />
      <Skeleton className="h-56 w-full rounded-[var(--radius-xl)]" />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="clientes/nuevo" element={<CreateCustomerPage />} />
            <Route path="cuentas/buscar" element={<FindAccountPage />} />
            <Route path="cuentas/nueva" element={<CreateAccountPage />} />
            <Route path="cuentas/:accountNumber" element={<AccountDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
