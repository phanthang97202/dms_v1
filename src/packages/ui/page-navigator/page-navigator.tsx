import { forwardRef } from "react";
import Button from "devextreme-react/button";

import "./page-navigator.scss";
interface PageNavigatorProps {
  totalPages: number;
  currentPage: number;
  onPreviousPage: (pageIndex: number) => void;
  onNextPage: (pageIndex: number) => void;
}

export const PageNavigator = forwardRef(
  (
    { currentPage, totalPages, onPreviousPage, onNextPage }: PageNavigatorProps,
    ref: any
  ) => {
    return (
      <div ref={ref} className={"page-navigator min-w-fit flex items-center"}>
        <div className={"paginator__previous-page"}>
          <Button
            stylingMode={"outlined"}
            className={"border-2"}
            icon={"chevronleft"}
            disabled={currentPage < 1}
            onClick={() => onPreviousPage(currentPage - 1)}
          />
        </div>

        <div
          className={
            "page-navigator__current-page w-full flex items-center justify-between"
          }
        >
          <div
            className={`paginator__page-index 
                                 paginator__current 
                                 flex items-center px-1 cursor-pointer hover:text-emerald-500 hover:font-bold`}
          >
            <span>{currentPage + 1}</span>
          </div>
        </div>
        <div className={"paginator__next-page"}>
          <Button
            stylingMode={"outlined"}
            icon={"chevronright"}
            disabled={currentPage >= totalPages - 1}
            onClick={() => onNextPage(currentPage + 1)}
          />
        </div>
      </div>
    );
  }
);
PageNavigator.displayName = "PageNavigator";
