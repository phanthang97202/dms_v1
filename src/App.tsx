import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import './dx-styles.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginSsoPage, Page404, SelectNetworkPage } from "@/pages";
import { AdminPageLayout } from "@/layouts";
import { protectedRoutes } from "@/app-routes";
import { PrivateRoutes } from '@packages/ui/private-routes';
import { RequireSession } from '@packages/ui/require-session';
import { HomePage } from "@/pages/home-page";
import { useAtom } from 'jotai';
import { localeAtom } from './packages/store/localization-store';
import { AdminDashboardPage } from './pages/admin-dashboard';

export default function Root() {
  const [value] = useAtom(localeAtom);
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<PrivateRoutes />}>
          <Route element={<RequireSession />}>
            <Route path={'/'} element={<HomePage />} />
            <Route path={':networkId'} element={<AdminPageLayout />}>
              <Route path={'/:networkId/'} element={<AdminDashboardPage />} />
              {protectedRoutes.filter(route => route.key === route.mainMenuKey).map(route => {
                return (
                  <Route key={route.key} path={`${route.path}`} element={route.getPageElement()} />
                );
              })}
              {protectedRoutes.filter(route => route.key !== route.mainMenuKey).map(route => {
                return (
                  <Route key={route.key} path={`${route.path}`} element={route.getPageElement()} />
                );
              })}
            </Route>
          </Route>
        </Route>
        <Route path={'/login'} element={<LoginSsoPage />}></Route>
        <Route path={'/select-network'} element={<SelectNetworkPage />}></Route>
        <Route path={'*'} element={<Page404 />} />
      </Routes>
    </Router>
  );
}
