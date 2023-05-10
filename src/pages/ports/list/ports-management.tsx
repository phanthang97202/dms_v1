import { useEffect, useMemo, useRef, useState } from "react";

import { PageHeaderLayout } from "@layouts/page-header-layout";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { BaseGridView, ColumnOptions } from "@packages/ui/base-gridview";
import { StatusButton } from "@/packages/ui/status-button";
import {
  FlagActiveEnum,
  Payment,
  Ports,
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
import { keywordAtom, selectedItemsAtom } from "../components/screen-atom";
import { HeaderPart } from "./header-part";

export const PortsManagementPage = () => {
  const { t } = useI18n("Ports");
  const api = useClientgateApi();
  const config = useConfiguration(); // lấy ra số lượng trang page
  let gridRef: any = useRef(null);
  const keyword = useAtomValue(keywordAtom);

  const showError = useSetAtom(showErrorAtom);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  // load all data
  const { data, isLoading, refetch } = useQuery(
    ["portss", keyword],
    () =>
      api.getPorts({
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

  // lấy ra loại cảng
  const { data: portsTypeData } = useQuery(["typePorts"], () =>
    api.getPort({
      KeyWord: "",
      FlagActive: FlagActiveEnum.All,
      Ft_PageIndex: 0,
      Ft_PageSize: config.MAX_PAGE_ITEMS,
    } as SearchParam)
  );

  const onCreate = async (data: Partial<Ports>) => {
    const resp = await api.createPorts({
      ...data,
    });
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
  const onUpdate = async (key: string, data: Partial<Ports>) => {
    const resp = await api.updatePorts(key, data);
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
  const onDelete = async (key: string) => {
    const resp = await api.deletePorts(key);
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
  const portsCodeFilter = useMemo(() => {
    console.log("data.DataList", data?.DataList);
    if (data?.isSuccess) {
      return data.DataList?.reduce((acc, cur) => {
        const value = cur.PortCode;
        const existingItem = acc.find((item: any) => item.PortCode === value);
        if (!existingItem) {
          acc.push({ PortCode: value, count: 1 });
        } else {
          existingItem.count++;
        }
        return acc;
      }, [] as { PortCode: string; count: number }[])
        .sort((a: any, b: any) => a.PortCode.localeCompare(b.PortCode))
        .map((item: any) => ({
          text: `${item.PortCode} (${item.count})`,
          value: item.PortCode,
        }));
    } else {
      return [];
    }
  }, [data]);
  const columns: ColumnOptions[] = [
    {
      dataField: "PortCode",
      caption: t("PortCode"),
      editorType: "dxTextBox",
      visible: true,
      // allowFiltering: false, // cho phép lọc theo cái popup
      headerFilter: {
        dataSource: portsCodeFilter,
      },
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
      dataField: "PortName",
      caption: t("PortName"),
      defaultSortOrder: "asc",
      editorType: "dxTextBox",
      visible: true,
      allowFiltering: false,
      editorOptions: {
        placeholder: t("Input"),
      },
      validationRules: [
        {
          type: "required",
        },
      ],
    },
    {
      dataField: "ProvinceCode",
      caption: t("ProvinceCode "),
      // defaultSortOrder: "asc",
      editorType: "dxTextBox",
      visible: true,
      allowFiltering: false,
      editorOptions: {
        placeholder: t("Input"),
      },
      validationRules: [
        {
          type: "required",
        },
      ],
    },
    {
      dataField: "PortAddress",
      caption: t("PortAddress "),
      // defaultSortOrder: "asc",
      editorType: "dxTextBox",
      visible: true,
      allowFiltering: false,
      editorOptions: {
        placeholder: t("Input"),
      },
      validationRules: [
        {
          type: "required",
        },
      ],
    },
    {
      dataField: "PortType",
      caption: t("PortType "),
      // defaultSortOrder: "asc",
      editorType: "dxSelectBox",
      visible: true,
      allowFiltering: false,
      editorOptions: {
        // placeholder: t("Input"),
        dataSource: portsTypeData?.DataList ?? [],
        displayExpr: "PortType",
        valueExpr: "PortType",
      },
      validationRules: [
        {
          type: "required",
        },
      ],
    },
  ];

  const handleAddNew = () => {
    if (gridRef.instance) {
      gridRef.instance.addRow();
    }
  };

  const handleEditorPreparing = (e: EditorPreparingEvent<any, any>) => {
    if (e.dataField === "PortCode") {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    }
    // if (e.dataField === "PaymentTypeName") {
    //   e.editorOptions.readOnly = !e.row?.isNewRow;
    // }
  };
  const handleDeleteRows = async (rows: string[]) => {
    console.log("delete nhiều", rows);
    const resp = await api.deleteMultiPorts(rows);
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
    logger.debug("e:", e);
    // stop grid behaviour
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "remove") {
        const id = e.changes[0].key;
        e.promise = onDelete(id);
      } else if (type === "insert") {
        const data: Ports = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onUpdate(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
    logger.debug("e after:", e);
  };

  const handleUploadFile = async (file: File, progressCallback?: Function) => {
    const resp = await api.uploadPortsFile(file);
    // console.log("resp upload file", resp);

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
    const resp = await api.downloadTemplatePortsFile();
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
            <div className="font-bold dx-font-m">{t("Port Management")}</div>
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
          keyExpr="PortCode"
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
