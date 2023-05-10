import { RouteItem } from "./types";
import { adminRoutes } from "./routes/admin-routes";
import { reportRoutes } from "./routes/report-routes";
import { logisticsRoutes } from "./routes/logistic-routes";
import { contractRoutes } from "./routes/contact-routes";
import { paymentRoutes } from "./routes/payment-routes";
import { salesRoutes } from "./routes/sales-routes";
import { adminRoutes2 } from "./routes/admin-routes2";

export const protectedRoutes: RouteItem[] = [
  ...adminRoutes,
  ...adminRoutes2,
  ...reportRoutes,
  ...logisticsRoutes,
  ...contractRoutes,
  ...paymentRoutes,
  ...salesRoutes,
];
