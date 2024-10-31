import { createBrowserRouter, Outlet } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import Dashboard from '../pages/Dashboard/Dashboard';
import Template from '../pages/Template';
import WorkInProgress from './WorkInProgress';
import AuthenticationPage from '../pages/Auth/AuthenticationPage';
import Portfolio from '@/pages/Portfolio/Portfolio';
import PortfolioStocks from '@/pages/Portfolio/portfolio-stocks';
import EmailVerifiedCard from '@/pages/Auth/email-verify';
import PasswordReset from '@/pages/Auth/reset-password';

const createRoutes = (isDark: boolean, setIsDark: (value: boolean) => void) => {
  return createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoutes>
          <Template setIsDark={setIsDark} isDark={isDark} />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: '/',
          element: (
            <ProtectedRoutes>
              <Dashboard isDark={isDark} />
            </ProtectedRoutes>
          ),
          index: true,
        },
        {
          path: '/portfolio',
          element: (
            <ProtectedRoutes>
              <Outlet />
            </ProtectedRoutes>
          ),
          children: [
            {
              path: '/portfolio/baskets',
              index: true, // Default child route for "/portfolio"
              element: (
                <ProtectedRoutes>
                  <Portfolio />
                </ProtectedRoutes>
              ),
            },
            {
              path: '/portfolio/stocks',
              index: true, // Default child route for "/portfolio"
              element: (
                <ProtectedRoutes>
                  <PortfolioStocks />
                </ProtectedRoutes>
              ),
            },
          ],
        },
        {
          path: '/p&l',
          element: (
            <ProtectedRoutes>
              <Dashboard isDark={isDark} />
            </ProtectedRoutes>
          ),
          index: true,
        },
        {
          path: '/account',
          element: (
            <ProtectedRoutes>
              <Dashboard isDark={isDark} />
            </ProtectedRoutes>
          ),
          index: true,
        },
      ],
    },
    {
      path: '*',
      element: <WorkInProgress />,
    },
    {
      path: '/login',
      element: <AuthenticationPage setIsDark={setIsDark} isDark={isDark} />,
    },
    {
      path: '/verify-account/:id',
      element: <EmailVerifiedCard />,
    },
    {
      path: '/reset-password/:id',
      element: <PasswordReset />,
    },
  ]);
};

export { createRoutes };
