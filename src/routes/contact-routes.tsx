import { AdminPage } from "@/pages";
import { RouteItem } from "@/types";

export const contractRoutes: RouteItem[] = [
  {
    key: 'contract',
    path: 'contract',
    mainMenuTitle: 'contract',
    mainMenuKey: 'contract',
    getPageElement: () => <AdminPage />,
  },
];