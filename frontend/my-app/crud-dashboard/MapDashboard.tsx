// import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createHashRouter, RouterProvider } from 'react-router';
import DashboardLayout from './components/DashboardLayout';
import MapList from './components/MapList';
// import MapShow from './components/MapShow';
import MapCreate from './components/MapCreate';
//import MapEdit from './components/MapEdit';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import AppTheme from '../shared-theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from './theme/customizations';

const router = createHashRouter([
  {
    Component: DashboardLayout,
    children: [
      {
        path: '/maps',
        Component: MapList,
      },
      // {
      //   path: '/maps/:mapId',
      //   Component: MapShow,
      // },
      {
        path: '/maps/new',
        Component: MapCreate,
      },
      // {
      //   path: '/maps/:mapId/edit',
      //   Component: MapEdit,
      // },
      // Fallback route for the example routes in dashboard sidebar items
      {
        path: '*',
        Component: MapList,
      },
    ],
  },
]);

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function MapDashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <RouterProvider router={router} />
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
