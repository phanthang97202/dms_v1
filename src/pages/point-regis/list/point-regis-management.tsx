import { useEffect, useMemo, useRef, useState } from "react";

import { PageHeaderLayout } from "@layouts/page-header-layout";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { BaseGridView, ColumnOptions } from "@packages/ui/base-gridview";
import { StatusButton } from "@/packages/ui/status-button";
import {
  District,
  FlagActiveEnum,
  PointRegis,
  Province,
  SearchParam,
} from "@/packages/types";
import { useI18n } from "@/i18n/useI18n";
import { useConfiguration } from "@/packages/hooks";
import { logger } from "@/packages/logger";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { toast } from "react-toastify";
import { useAtomValue, useSetAtom } from "jotai";
import { HeaderPart } from "./header-part";
import {
  keywordAtom,
  selectedItemsAtom,
} from "@/pages/province/components/screen-atom";

export const PointRegisManagementPage = () => {
  const { t } = useI18n("PointRegis");
  const api = useClientgateApi();
  // console.log("===api", api);
  const config = useConfiguration(); // lấy ra số lượng trang page
  let gridRef: any = useRef(null);
  const keyword = useAtomValue(keywordAtom);

  const showError = useSetAtom(showErrorAtom);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  // load all data
  const { data, isLoading, refetch } = useQuery(
    ["pointregis", keyword],
    () =>
      api.getPointRegis({
        KeyWord: keyword,
        FlagActive: FlagActiveEnum.All,
        Ft_PageIndex: 0,
        Ft_PageSize: config.MAX_PAGE_ITEMS,
      } as SearchParam),
    {}
  );

  // console.log("{ data, isLoading, refetch }", { data, isLoading, refetch });
  logger.debug("isLoading", isLoading, data);
  useEffect(() => {
    if (!!data && !data.isSuccess) {
      showError({
        message: t(data.errorCode),
        debugInfo: data.debugInfo,
        errorInfo: data.errorInfo,
      });
    }
  }, [data]);

  const onCreate = async (data: Partial<PointRegis>) => {
    const resp = await api.createPointRegis({
      ...data,
    });
    // console.log("===resp create", resp);
    if (resp.isSuccess) {
      toast.success(t("Create Successfully"));
      await refetch();
      return true;
    }
    showError({
      message: t(resp.errorCode),
      debugInfo: resp.debugInfo,
      errorInfo: resp.errorInfo,
    });
    throw new Error(resp.errorCode);
  };
  const onUpdate = async (key: string, data: Partial<PointRegis>) => {
    const resp = await api.updatePointRegis(key, data);
    if (resp.isSuccess) {
      toast.success(t("Update Successfully"));
      await refetch();
      return true;
    }
    showError({
      message: t(resp.errorCode),
      debugInfo: resp.debugInfo,
      errorInfo: resp.errorInfo,
    });
    throw new Error(resp.errorCode);
  };
  const onDelete = async (key: {
    PointRegisCode: string;
    DealerCode: string;
  }) => {
    const resp = await api.deletePointRegis(key);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
      return true;
    }
    showError({
      message: t(resp.errorCode),
      debugInfo: resp.debugInfo,
      errorInfo: resp.errorInfo,
    });
    throw new Error(resp.errorCode);
  };

  // tránh lặp lại hàm areCodeFileter khi component rerender trừ khi dependence thay đổi

  const flagActiveFilter = useMemo(() => {
    if (data?.isSuccess) {
      return data.DataList?.reduce((acc, cur) => {
        const value = cur.FlagActive;
        const existingItem = acc.find((item) => item.FlagActive === value);
        if (!existingItem) {
          acc.push({ FlagActive: value, count: 1 });
        } else {
          existingItem.count++;
        }
        return acc;
      }, [] as { FlagActive: string; count: number }[])
        .sort((a, b) => a.FlagActive?.localeCompare(b.FlagActive))
        .map((item) => ({
          text: `${t(`FlagActive.${item.FlagActive}`)} (${item.count})`,
          value: item.FlagActive,
        }));
    }
  }, [data]);

  const columns: ColumnOptions[] = [
    {
      dataField: "PointRegisCode",
      caption: t("PointRegisCode"),
      editorType: "dxTextBox",
      // allowEditing: false,
      visible: true,
      allowFiltering: false, // cho phép lọc theo cái popup
      editorOptions: {
        placeholder: t("Input"),
      },
      validationRules: [
        {
          type: "required",
        },
        {
          type: "pattern",
          pattern: /[a-zA-Z0-9]/,
        },
      ],
    },
    {
      dataField: "DealerCode",
      caption: t("DealerCode"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {},

      validationRules: [
        {
          type: "required",
        },
        {
          type: "pattern",
          pattern: /[a-zA-Z0-9]/,
        },
      ],
    },

    {
      dataField: "PointRegisName",
      caption: t("PointRegisName"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {},
      validationRules: [
        {
          type: "required",
        },
        {
          type: "pattern",
          pattern: /[a-zA-Z0-9]/,
        },
      ],
    },
    {
      dataField: "MapLongitude",
      caption: t("MapLongitude"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {},
      validationRules: [
        {
          type: "required",
        },
        {
          type: "pattern",
          pattern: /[0-9]/,
        },
      ],
    },
    {
      dataField: "MapLatitude",
      caption: t("MapLatitude"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {},
      validationRules: [
        {
          type: "required",
        },
        {
          type: "pattern",
          pattern: /[0-9]/,
        },
      ],
    },
    {
      dataField: "Radius",
      caption: t("Radius"),
      editorType: "dxTextBox",
      visible: true,
      editorOptions: {},
      validationRules: [
        {
          type: "required",
        },
        {
          type: "pattern",
          pattern: /[0-9]/,
        },
      ],
    },
    {
      dataField: "FlagActive",
      caption: t("Flag Active"),
      editorType: "dxSwitch",
      visible: true,
      alignment: "center",
      width: 120,
      cellRender: ({ data }: any) => {
        return <StatusButton isActive={data.FlagActive === "1"} />;
      },
      headerFilter: {
        dataSource: flagActiveFilter,
      },
    },
  ];

  const handleAddNew = () => {
    if (gridRef.instance) {
      gridRef.instance.addRow();
    }
  };

  const handleEditorPreparing = (e: EditorPreparingEvent<any, any>) => {
    if (e.dataField === "PointRegisCode") {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    } else if (e.dataField === "FlagActive") {
      e.editorOptions.value = false;
    } else if (e.dataField === "DealerCode") {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    }
  };
  const handleDeleteRows = async (rows: any) => {
    const resp = await api.deletePointRegiss(rows);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      await refetch();
    } else {
      showError({
        message: t(resp.errorCode),
        debugInfo: resp.debugInfo,
        errorInfo: resp.errorInfo,
      });
    }
  };

  const handleSavingRow = async (e: any) => {
    console.log("===e", e);
    logger.debug("e:", e);
    // stop grid behaviour
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "remove") {
        const id = e.changes[0].key;
        e.promise = onDelete(id);
      } else if (type === "insert") {
        const data: PointRegis = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onUpdate(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
    logger.debug("e after:", e);
  };

  const handleUploadFile = async (file: File, progressCallback?: Function) => {
    const resp = await api.uploadPointRegis(file);
    if (resp.isSuccess) {
      toast.success(t("Upload Successfully"));
      await refetch();
    } else {
      showError({
        message: t(resp.errorCode),
        debugInfo: resp.debugInfo,
        errorInfo: resp.errorInfo,
      });
    }
  };
  const handleDownloadTemplate = async () => {
    const resp = await api.downloadPointRegis();
    if (resp.isSuccess) {
      toast.success(t("Download Successfully"));
      window.location.href = resp.Data;
    } else {
      showError({
        message: t(resp.errorCode),
        debugInfo: resp.debugInfo,
        errorInfo: resp.errorInfo,
      });
    }
  };
  const handleSelectionChanged = (rowKeys: string[]) => {
    setSelectedItems(rowKeys);
  };
  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="font-bold dx-font-m">
              {t("Point Regis Management")}
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <HeaderPart
              onAddNew={handleAddNew}
              onUploadFile={handleUploadFile}
              onDownloadTemplate={handleDownloadTemplate}
            />
          </PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <BaseGridView
          isLoading={isLoading}
          defaultPageSize={config.PAGE_SIZE}
          dataSource={data?.DataList ?? []}
          columns={columns}
          keyExpr={["PointRegisCode", "DealerCode"]}
          allowSelection={true}
          allowInlineEdit={true}
          onReady={(ref) => (gridRef = ref)}
          onEditorPreparing={handleEditorPreparing}
          onSelectionChanged={handleSelectionChanged}
          onSaveRow={handleSavingRow}
          inlineEditMode={"row"}
          onDeleteRows={handleDeleteRows}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
