import AdminPage from "@/pages/admin-page/admin-page";
import AdminPage2 from "@/pages/admin-page2/admin-page2";
import { ProvinceManagementPage } from "@/pages/province/list/province-management";

export const topBarItems = [
  {
    key: "sales",
    path: "/sales",
    element: AdminPage,
  },
  {
    key: "payment",
    path: "/payment",
    element: AdminPage,
  },
  {
    key: "contract",
    path: "/contract",
    element: AdminPage,
  },
  {
    key: "logistic",
    path: "/logistic",
    element: AdminPage,
  },
  {
    path: "/admin",
    key: "admin",
    element: AdminPage,
    children: [
      {
        key: "cityManagement",
        path: "city",
        element: ProvinceManagementPage,
      },
    ],
  },
  {
    path: "/cloneadmin",
    key: "cloneadmin",
    element: AdminPage2,
  },
];

export const adminSideBarItems = [
  {
    key: "cityManagement",
    path: "/admin/city",
    element: ProvinceManagementPage,
  },
];
