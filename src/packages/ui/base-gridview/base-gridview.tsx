import {
  Button as DxButton,
  ColumnChooser,
  ColumnFixing,
  Editing,
  HeaderFilter,
  IColumnProps,
  Item as ToolbarItem,
  Paging,
  Selection,
  Toolbar,
  Texts,
  Column,
} from "devextreme-react/data-grid";
import { DataGrid, LoadPanel, Button } from "devextreme-react";

import CustomStore from "devextreme/data/custom_store";
import { PageSize } from "@packages/ui/page-size";
import { PagerSummary } from "@packages/ui/pager-summary";
import { PageNavigator } from "@packages/ui/page-navigator";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useReducer,
  useRef,
  useState,
} from "react";

import "./base-gridview.scss";
import ScrollView from "devextreme-react/scroll-view";

import CustomColumnChooser from "@packages/ui/column-toggler/custom-column-chooser";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import { useI18n } from "@/i18n/useI18n";
import {
  EditingStartEvent,
  EditorPreparingEvent,
} from "devextreme/ui/data_grid";
import { logger } from "@/packages/logger";
import { DeleteConfirmationBox, ExportConfirmBox } from "../modal";
import { useVisibilityControl } from "@packages/hooks";

export interface ColumnOptions extends IColumnProps {
  editorType?: string;
}

interface GridViewProps {
  defaultPageSize?: number;
  dataSource: CustomStore | Array<any>;
  columns: ColumnOptions[];
  allowSelection: boolean;
  ref: ForwardedRef<any>;
  onReady?: (ref: any) => void;
  allowInlineEdit?: boolean;
  inlineEditMode?: "row" | "popup" | "form";
  onEditorPreparing?: (e: EditorPreparingEvent<any, any>) => void;
  onSaveRow?: (option: any) => void;
  isLoading?: boolean;
  keyExpr?: string | string[];
  onDeleteRows?: (rows: string[]) => void;
  onSelectionChanged: (rowKeys: string[]) => void;
}

const GridViewRaw = ({
  ref,
  defaultPageSize = 100,
  onEditorPreparing,
  onSaveRow,
  isLoading = false,
  keyExpr,
  onDeleteRows,
  onSelectionChanged,
  dataSource,
  columns,
  onReady,
  inlineEditMode = "form",
  allowInlineEdit = true,
}: GridViewProps) => {
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [gridRef, setGridRef] = useState<any>(null);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const windowSize = useWindowSize();
  // useLayoutEffect(() => {
  //   if (gridRef) {
  //     logger.debug("force re-render", gridRef.instance.totalCount());
  //     forceUpdate();
  //   }
  // }, [gridRef]);
  const onChangePageSize = (pageSize: number) => {
    gridRef?.instance.pageSize(pageSize);
    setPageSize(pageSize);
  };

  const [visible, setVisible] = useState(false);

  const [realColumns, setColumnsState] = useReducer(
    (state: any, changes: any) => {
      console.log("==state column", state);
      if (Object.keys(changes).length === 0) return state;
      let newState = [...state];
      changes.forEach((change: any) => {
        let column = newState.find((c) => c.dataField === change.dataField);
        Object.keys(change).forEach((key) => {
          column[key] = change[key];
        });
      });
      return newState;
    },
    columns
  );
  const onHiding = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onApply = useCallback(
    (changes: any) => {
      setColumnsState(changes);
      setVisible(false);
    },
    [setColumnsState, setVisible]
  );
  const onToolbarPreparing = useCallback((e: any) => {
    console.log("onToolbarPreparing", e);
    e.toolbarOptions.items.push({
      widget: "dxButton",
      location: "after",
      options: {
        icon: "/public/images/icons/setting.png",
        elementAttr: {
          id: "myColumnChooser",
        },
        onClick: () => setVisible(!visible),
      },
    });
  }, []);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectionKeys, setSelectionKeys] = useState<string[]>([]);
  const handleSelectionChanged = (e: any) => {
    logger.debug("selection change:", e);
    setSelectionKeys(e.selectedRowKeys);
    onSelectionChanged?.(e.selectedRowKeys);
  };
  const [isEditing, setIsEditing] = useState(false);
  const handleEditingStart = (e: EditingStartEvent) => {
    logger.debug("e:", e);
    setIsEditing(true);
  };
  const handleEditCancelled = () => {
    setIsEditing(false);
  };

  const handleSaved = (e: any) => {
    logger.debug("saved event:", e);
    setIsEditing(false);
  };
  const handleAddingNewRow = () => {
    setIsEditing(true);
  };

  const { t } = useI18n("Common");
  let innerGridRef = useRef<DataGrid>(null);

  const setRef = (ref: any) => {
    innerGridRef = ref;
    setGridRef(ref);
  };

  const onCancelDelete = () => {};
  const onDelete = () => {
    onDeleteRows?.(selectionKeys);
  };
  const controlConfirmBoxVisible = useVisibilityControl({
    defaultVisible: false,
  });
  const handleConfirmDelete = () => {
    controlConfirmBoxVisible.open();
  };

  return (
    <div className={"base-gridview bg-white"}>
      <ScrollView showScrollbar={"always"}>
        <LoadPanel visible={isLoading} position={{ of: "#gridContainer" }} />
        <DataGrid
          keyExpr={keyExpr} // nó là cái key trong data như kiểu khóa chính và unique
          errorRowEnabled={false} // ẩn lỗi trên row khi xảy ra lỗi nhưng có thể xem ở console log
          scrolling={{
            mode: "standard",
            rowRenderingMode: "virtual",
            showScrollbar: "always",
            useNative: true,
            renderAsync: true,
          }}
          cacheEnabled={false} // default: true - lưu dữ liệu vào bộ nhớ đệm, tuy nhiễn dữ liệu nào mà thay đổi liên tục thì không nên dùng cái này
          id="gridContainer"
          height={`${windowSize.height - 100}px`}
          width={"100%"}
          ref={(r) => {
            console.log("ref", r);
            return setRef(r);
          }}
          dataSource={dataSource}
          noDataText={t("There is no data")}
          remoteOperations={false} // Thông báo cho DataGrid về các hoạt động xử lý dữ liệu của máy chủ.
          columnAutoWidth={true} // co dãn độ rộng cột
          pager={{
            visible: false,
          }}
          repaintChangesOnly // Specifies whether to repaint only those cells whose data changed.
          showBorders
          onContentReady={() => {
            onReady?.(gridRef);
          }}
          allowColumnResizing // cho phép co dãn cột
          showColumnLines // tương tự
          showRowLines // show đường ngăn cách giữa các hàng với nhau
          // columnResizingMode={"nextColumn"} // thay đổ thì chiều rộng của cột tiếp theo thay đổi
          columnResizingMode={"widget"} // chỉ có tác dụng khi bật resizing column thay đổi thì chiều rộng cả bảng thay đổi
          allowColumnReordering={true} // tùy chỉnh kéo thả order cột
          onToolbarPreparing={onToolbarPreparing} // option ẩn hiện cột
          onSelectionChanged={handleSelectionChanged} // A function that is executed after selecting a row or clearing its selection.
          onEditorPreparing={onEditorPreparing} // validate không cho nhập disable
          onEditingStart={handleEditingStart}
          onEditCanceled={handleEditCancelled}
          onSaved={handleSaved} // một hàm được thực thi khi quá trình change rows hoàn tất
          onInitNewRow={handleAddingNewRow}
          // một hàm được xử lý trong quá trinhg thực thi
          onSaving={(e: any) => {
            console.log("onSaving Frame", e);
            onSaveRow?.(e);
            e.cancel = true;
          }}
        >
          <ColumnChooser enabled={true} allowSearch={true} mode={"select"} />
          <ColumnFixing enabled={true} />
          <Paging pageSize={pageSize} enabled={true} pageIndex={pageIndex} />
          <HeaderFilter visible={!isEditing} dataSource={dataSource} />
          <Toolbar>
            <ToolbarItem location="before">
              <Button
                text={t("Delete")}
                onClick={handleConfirmDelete}
                visible={selectionKeys.length > 1}
                stylingMode="contained"
                type="default"
              />
            </ToolbarItem>
            <ToolbarItem cssClass={"min-w-fit"} location={"after"}>
              <PageSize
                title={t("Showing")}
                onChangePageSize={onChangePageSize}
                allowdPageSizes={[100, 200, 500, 1000]}
                showAllOption={true}
                showAllOptionText={t("Show All")}
                defaultPageSize={pageSize}
              />
            </ToolbarItem>
            <ToolbarItem location={"after"}>
              <PagerSummary
                summaryTemplate={t("{0} - {1} of {2}")}
                currentPage={pageIndex}
                pageSize={pageSize}
                totalCount={
                  dataSource.hasOwnProperty("length")
                    ? (dataSource as any[]).length
                    : gridRef
                    ? gridRef.instance?.totalCount()
                    : 0
                }
              />
            </ToolbarItem>
            <ToolbarItem location={"after"}>
              <PageNavigator
                totalPages={gridRef ? gridRef.instance?.pageCount() : 0}
                currentPage={pageIndex}
                onNextPage={(pageIndex: number) => setPageIndex(pageIndex)}
                onPreviousPage={(pageIndex: number) => setPageIndex(pageIndex)}
              />
            </ToolbarItem>
            <ToolbarItem location={"after"}>
              <CustomColumnChooser
                title={t("Toggle Column")}
                applyText={t("Apply")}
                cancelText={t("Cancel")}
                selectAllText={t("Select All")}
                container={"#gridContainer"}
                button={"#myColumnChooser"}
                visible={visible}
                columns={columns}
                onHiding={onHiding}
                onApply={onApply}
              />
            </ToolbarItem>
          </Toolbar>
          <Editing
            mode={inlineEditMode}
            useIcons={true}
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
          >
            <Texts
              confirmDeleteMessage={t("Are you sure?")}
              ok={t("OK")}
              cancel={t("Cancel")}
            />
          </Editing>
          <Column
            visible={allowInlineEdit}
            type="buttons"
            width={110}
            fixed={false}
            allowResizing={false}
          >
            <DxButton name="edit" />
            <DxButton name="delete" />
          </Column>
          <Selection mode="multiple" selectAllMode="page" />
          {realColumns.map((col: any) => (
            <Column key={col.dataField} {...col} allowSorting={!isEditing} />
          ))}
        </DataGrid>
      </ScrollView>
      <DeleteConfirmationBox
        control={controlConfirmBoxVisible}
        title={t("Delete")}
        onYesClick={onDelete}
        onNoClick={onCancelDelete}
      />
    </div>
  );
};

export const BaseGridView = forwardRef(
  (props: Omit<GridViewProps, "ref">, ref: any) => {
    return <GridViewRaw ref={ref} {...props} />;
  }
);
BaseGridView.displayName = "BaseGridView";
