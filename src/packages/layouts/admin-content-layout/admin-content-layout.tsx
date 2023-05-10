import { useSlot, withSlot } from "@packages/hooks/useSlot";
import ResponsiveBox, {
  Col,
  Item,
  Location,
  Row,
} from "devextreme-react/responsive-box";
import React from "react";
import { ToggleSidebarButton } from "@packages/ui/toggle-sidebar-button";
import { logger } from "@packages/logger";
import { useAtomValue } from "jotai";
import { permissionAtom } from "@packages/store";

function screen(width: number) {
  return width < 700 ? "sm" : "lg";
}
interface AdminContentLayoutProps {
  className?: string;
}
const Layout = ({
  children,
  className,
}: React.PropsWithChildren<AdminContentLayoutProps>) => {
  const permissions = useAtomValue(permissionAtom);
  const HeaderTemplate = useSlot({
    children,
    name: "Header",
  });
  const ContentTemplate = useSlot({
    children,
    name: "Content",
  });
  return (
    <ResponsiveBox
      className={`w-full ${className}`}
      singleColumnScreen="sm"
      screenByWidth={screen}
    >
      <Row ratio={1}></Row>
      <Row ratio={9}></Row>
      <Row ratio={1}></Row>
      <Col ratio={2} screen="lg"></Col>
      <Item>
        <Location row={0} col={0} />
        <div className={"w-full flex items-center"}>
          <ToggleSidebarButton />
          <HeaderTemplate />
        </div>
      </Item>
      <Item>
        <Location row={1} col={0}></Location>
        <ContentTemplate />
      </Item>
    </ResponsiveBox>
  );
};

export const AdminContentLayout = withSlot(Layout);
