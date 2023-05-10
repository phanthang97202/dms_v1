import { Outlet, useLocation } from "react-router-dom";
import { useCallback, useMemo, useRef } from "react";
import { useHeaderItems } from "@packages/hooks/useHeaderItems";
import Drawer from "devextreme-react/drawer";
import { useNetworkNavigate } from "@packages/hooks";
import { useScreenSize } from "@/utils/media-query";
import { useMenuPatch } from "@/utils/patches";
import { ItemClickEvent } from "devextreme/ui/tree_view";
import ScrollView from "devextreme-react/scroll-view";
import { Button, Template } from "devextreme-react";
import { Sidebar } from "@packages/ui/sidebar";
import Toolbar, { Item as ToolbarItem } from "devextreme-react/toolbar";
import { protectedRoutes } from "@/app-routes";

import "./admin-page-layout.scss";
import { MenuBarItem, SidebarItem } from "@/types";
import { Header } from "@packages/ui/header";
import { useAtomValue, useSetAtom } from "jotai";
import { sidebarAtom } from "@packages/store";
import { useI18n } from "@/i18n/useI18n";

export const AdminPageLayout = () => {
  const { t } = useI18n("Common");
  const { items } = useHeaderItems();
  const navigate = useNetworkNavigate();
  const { isXSmall, isLarge } = useScreenSize();
  const [patchCssClass, onMenuReady] = useMenuPatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const location = useLocation();
  const isSidebarOpen = useAtomValue(sidebarAtom);
  const setSidebarOpen = useSetAtom(sidebarAtom);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const openSidebar = () => {
    setSidebarOpen(true);
  };

  // lấy ra các router sidebar
  const sidebarItems = useMemo(() => {
    const mainKey = location.pathname.split("/")[2];
    // console.log("===mainKey", mainKey);
    return protectedRoutes
      .filter((route) => {
        // console.log("===route.key", route.key);
        // console.log("===route.mainMenuKey", route.mainMenuKey);
        // console.log("===route.subMenuTitle", route.subMenuTitle);
        return (
          route.key !== route.mainMenuKey &&
          route.mainMenuKey === mainKey &&
          !!route.subMenuTitle
        );
      })
      .map(
        (route) =>
          ({
            text: route.subMenuTitle,
            path: route.path,
            key: route.key,
          } as SidebarItem)
      );
  }, [location]);

  // [
  //   {
  //     text: "provinceManagement2",
  //     path: "cloneadmin/province",
  //     key: "provinceManagement2",
  //   },
  // ];
  // console.log("===sidebarItems", sidebarItems);

  const onNavigationChanged = useCallback(
    ({ itemData, event, node }: ItemClickEvent) => {
      if (!itemData?.path || node?.selected) {
        event?.preventDefault();
        return;
      }
      navigate(itemData.path);
      scrollViewRef.current?.instance.scrollTo(0);
      toggleSidebar();
    },
    [navigate, isLarge]
  );
  const temporaryOpenMenu = useCallback(() => {}, []);
  const navigateItem = useCallback((item: MenuBarItem) => {
    navigate(item.path);
    openSidebar();
  }, []);

  // memo to avoid re-rendering header
  const header = useMemo(() => {
    return (
      <Header
        logo={true}
        menuToggleEnabled={false}
        title={t("DMS")}
        items={items}
        onMenuItemClick={navigateItem}
      />
    );
  }, [t, navigateItem, items]);

  const sidebarElement = useMemo(() => {
    return (
      <Sidebar
        compactMode={!isSidebarOpen}
        selectedItemChanged={onNavigationChanged}
        openMenu={temporaryOpenMenu}
        onMenuReady={onMenuReady}
        items={sidebarItems}
      >
        <Toolbar id={"navigation-header"}>
          {!isXSmall && (
            <ToolbarItem location={"before"} cssClass={"menu-button"}>
              <Button icon="menu" stylingMode="text" onClick={toggleSidebar} />
            </ToolbarItem>
          )}
        </Toolbar>
      </Sidebar>
    );
  }, [sidebarItems, toggleSidebar]);
  return (
    <div className={"dms w-full h-full"}>
      {header}
      <Drawer
        className={["drawer", patchCssClass].join(" ")}
        position={"before"}
        openedStateMode={isLarge ? "shrink" : "overlap"}
        revealMode={isXSmall ? "slide" : "expand"}
        minSize={0}
        maxSize={250}
        shading={false}
        opened={isSidebarOpen}
        template={"menu"}
      >
        <div className={"w-full h-full"}>
          <Outlet />
        </div>
        <Template name={"menu"}>{sidebarElement}</Template>
      </Drawer>
    </div>
  );
};
