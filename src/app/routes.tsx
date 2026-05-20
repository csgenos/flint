import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Dashboard } from '../pages/Dashboard';
import { Budget } from '../pages/Budget';
import { Transactions } from '../pages/Transactions';
import { Projections } from '../pages/Projections';
import { MonteCarlo } from '../pages/MonteCarlo';
import { Taxes } from '../pages/Taxes';
import { Scenarios } from '../pages/Scenarios';
import { Settings } from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'budget', element: <Budget /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'projections', element: <Projections /> },
      { path: 'monte-carlo', element: <MonteCarlo /> },
      { path: 'taxes', element: <Taxes /> },
      { path: 'scenarios', element: <Scenarios /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
