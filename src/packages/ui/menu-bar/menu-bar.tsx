import { Tabs } from "devextreme-react/tabs";
import {useLocation} from "react-router-dom";
import './menu-bar.scss';
import {logger} from "@packages/logger";
import {MenuBarProps, MenuBarItem} from "@/types";
import {useMemo} from "react";


export const MenuBar = ({ items, onClick }: MenuBarProps) => {
  const location = useLocation()
  const navigateItem = (item: MenuBarItem) => {
    logger.debug('click item:', item)
    onClick?.(item)
  };

  const filterSelectedItem = useMemo(() => items.filter(item => {
    const mainKey = location.pathname.split('/')[2]
    return item.path.startsWith(`/${mainKey}`)
  }).map(item => item.path), [items, location])

  return (
    <div className="menu-bar-container">
      <Tabs
        width={'100%'}
        selectionMode='single'
        items={items}
        keyExpr={'path'}
        selectedItemKeys={filterSelectedItem}
        onItemClick={(e) => navigateItem(e.itemData as MenuBarItem)}
      >
      </Tabs>
    </div >
  );
};