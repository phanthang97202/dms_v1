import AdminPage2 from "@/pages/admin-page2/admin-page2";
import { AmplitudeApprOrdManagementPage } from "@/pages/amplitude-appr-ord/list";
import { AreaManagementPage } from "@/pages/area/list";
import { CabinCertificateManagementPage } from "@/pages/cabin-certificate/list";
import { CarModelManagementPage } from "@/pages/carmodel/list";
import { DirCAManagementPage } from "@/pages/dir-ca/list/dir-ca-management";
import { DistrictManagementPage } from "@/pages/district/list";
import { InsuranceTypeManagementPage } from "@/pages/insurance-type/list/insurance-type-management";
import { MngQuotaManagementPage } from "@/pages/mng-quota/list";
import { PaymentManagementPage } from "@/pages/payment/list";
import { PointRegisManagementPage } from "@/pages/point-regis/list/point-regis-management";
import { PortManagementPage } from "@/pages/port/list";
import { PortsManagementPage } from "@/pages/ports/list/ports-management";
import ProvinceManagementPage2 from "@/pages/province2/list/province-management2";
import { TransporterDriverManagementPage } from "@/pages/transporter/list/transporter-driver-management";
import { UnitPriceGPSManagementPage } from "@/pages/unit-price-gps/list";
import { RouteItem } from "@/types";
export const adminRoutes2: RouteItem[] = [
  {
    key: "cloneadmin",
    path: "cloneadmin",
    mainMenuTitle: "cloneadmin",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <AdminPage2 />,
  },
  {
    key: "provinceManagement2",
    path: "cloneadmin/province",
    subMenuTitle: "provinceManagement2",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <ProvinceManagementPage2 />,
  },
  {
    key: "districtManagement2",
    path: "cloneadmin/district",
    subMenuTitle: "districtManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <DistrictManagementPage />,
  },
  {
    key: "paymentManagement2",
    path: "cloneadmin/payment",
    subMenuTitle: "paymentManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <PaymentManagementPage />,
  },
  {
    key: "portManagement2",
    path: "cloneadmin/port",
    subMenuTitle: "portManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <PortManagementPage />,
  },
  {
    key: "portsManagement2",
    path: "cloneadmin/ports",
    subMenuTitle: "portsManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <PortsManagementPage />,
  },
  {
    key: "areasManagement2",
    path: "cloneadmin/areas",
    subMenuTitle: "areasManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <AreaManagementPage />,
  },
  {
    key: "carModelManagement2",
    path: "cloneadmin/carmodel",
    subMenuTitle: "carModelManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <CarModelManagementPage />,
  },
  {
    key: "transporterDriverManagement2",
    path: "cloneadmin/transporterdriver",
    subMenuTitle: "transporterDriverManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <TransporterDriverManagementPage />,
  },
  {
    key: "unitPriceGPSManagement2",
    path: "cloneadmin/unitpricegps",
    subMenuTitle: "unitPriceGPSManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <UnitPriceGPSManagementPage />,
  },
  {
    key: "insuranceTypeManagement2",
    path: "cloneadmin/insurancetype",
    subMenuTitle: "insuranceTypeManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <InsuranceTypeManagementPage />,
  },
  {
    key: "pointRegisManagement2",
    path: "cloneadmin/pointregis",
    subMenuTitle: "pointRegisManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <PointRegisManagementPage />,
  },
  {
    key: "dirCAManagement2",
    path: "cloneadmin/dirca",
    subMenuTitle: "dirCAManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <DirCAManagementPage />,
  },
  {
    key: "cabinCertificateManagement2",
    path: "cloneadmin/cabincertificate",
    subMenuTitle: "cabinCertificateManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <CabinCertificateManagementPage />,
  },
  {
    key: "mngQuotaManagement2",
    path: "cloneadmin/mngquota",
    subMenuTitle: "mngQuotaManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <MngQuotaManagementPage />,
  },
  {
    key: "amplitudeApprOrdManagement2",
    path: "cloneadmin/amplitudeapprord",
    subMenuTitle: "amplitudeApprOrdManagement",
    mainMenuKey: "cloneadmin",
    getPageElement: () => <AmplitudeApprOrdManagementPage />,
  },
];
