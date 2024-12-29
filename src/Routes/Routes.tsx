import { Outlet, createBrowserRouter } from 'react-router-dom'

import AuthenticationPage from '@/pages/Auth/AuthenticationPage'
import EmailVerifiedCard from '@/pages/Auth/email-verify'
import PasswordReset from '@/pages/Auth/reset-password'
import Dashboard from '@/pages/Dashboard/Dashboard'
import Portfolio from '@/pages/Portfolio/Portfolio'
import PortfolioStocks from '@/pages/Portfolio/portfolio-stocks'
import Template from '@/pages/Template'

import ProtectedRoutes from './ProtectedRoutes'
import WorkInProgress from './WorkInProgress'

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
              index: true,
              element: (
                <ProtectedRoutes>
                  <Portfolio />
                </ProtectedRoutes>
              ),
            },
            {
              path: '/portfolio/stocks',
              element: (
                <ProtectedRoutes>
                  <Outlet />
                </ProtectedRoutes>
              ),
              children: [
                {
                  path: '/portfolio/stocks',
                  index: true,
                  element: (
                    <ProtectedRoutes>
                      <PortfolioStocks />
                    </ProtectedRoutes>
                  ),
                },
                {
                  path: '/portfolio/stocks/:stockId',
                  element: (
                    <ProtectedRoutes>
                      <PortfolioStocks />
                    </ProtectedRoutes>
                  ),
                },
              ],
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
  ])
}

export { createRoutes }
