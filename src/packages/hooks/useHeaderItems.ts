import { useMemo } from "react";
import { MenuBarItem } from "@/types";
import { useI18n } from "@/i18n/useI18n";

export const useHeaderItems = () => {
  const { t } = useI18n("Common");
  const menuBarItems = useMemo<MenuBarItem[]>(
    () => [
      {
        text: t("sales"),
        path: `/sales`,
      },
      {
        text: t("payment"),
        path: `/payment`,
      },
      {
        text: t("contract"),
        path: `/contract`,
      },
      {
        text: t("logistic"),
        path: `/logistic`,
      },
      {
        text: t("report"),
        path: `/report`,
      },
      {
        text: t("admin"),
        path: `/admin`,
      },
      {
        text: t("admin2"),
        path: `/cloneadmin`,
      },
    ],
    [t]
  );

  return { items: menuBarItems };
};
