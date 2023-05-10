import { useEffect, useMemo, useRef, useState } from "react";

import { PageHeaderLayout } from "@layouts/page-header-layout";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { BaseGridView, ColumnOptions } from "@packages/ui/base-gridview";
import { StatusButton } from "@/packages/ui/status-button";
import {
  FlagActiveEnum,
  SearchParam,
  TransporterDriver,
  UnitPriceGPS,
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
import { DateBox } from "devextreme-react";

export const UnitPriceGPSManagementPage = () => {
  const { t } = useI18n("UnitPriceGPS");
  const api = useClientgateApi();
  const config = useConfiguration(); // lấy ra số lượng trang page
  let gridRef: any = useRef(null);
  const keyword = useAtomValue(keywordAtom);

  const showError = useSetAtom(showErrorAtom);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  // load all data
  const { data, isLoading, refetch } = useQuery(
    ["unitpricegpss", keyword],
    () =>
      api.getUnitPriceGPS({
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

  const onCreate = async (data: Partial<UnitPriceGPS>) => {
    const resp = await api.createUnitPriceGPS({
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
  const onUpdate = async (key: string, data: Partial<UnitPriceGPS>) => {
    const resp = await api.updateUnitPriceGPS(key, {
      ...data,
      FlagActive: data.FlagActive === true ? "1" : "0",
    });
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
    const resp = await api.deleteUnitPriceGPS(key);
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
  const gpsCodeFilter = useMemo(() => {
    // console.log("data.DataList", data?.DataList);
    if (data?.isSuccess) {
      return data.DataList?.reduce((acc, cur) => {
        const value = cur.ContractNo;
        const existingItem = acc.find((item: any) => item.ContractNo === value);
        if (!existingItem) {
          acc.push({ ContractNo: value, count: 1 });
        } else {
          existingItem.count++;
        }
        return acc;
      }, [] as { ContractNo: string; count: number }[])
        .sort((a: any, b: any) => a.ContractNo.localeCompare(b.ContractNo))
        .map((item: any) => ({
          text: `${item.ContractNo} (${item.count})`,
          value: item.ContractNo,
        }));
    } else {
      return [];
    }
  }, [data]);
  const flagActiveFilter = useMemo(() => {
    // console.log("data.DataList", data?.DataList);
    if (data?.isSuccess) {
      return data.DataList?.reduce((acc, cur) => {
        const value = cur.FlagActive;
        const existingItem = acc.find((item: any) => item.FlagActive === value);
        if (!existingItem) {
          acc.push({ FlagActive: value, count: 1 });
        } else {
          existingItem.count++;
        }
        return acc;
      }, [] as { FlagActive: string; count: number }[])
        .sort((a: any, b: any) => a.FlagActive.localeCompare(b.FlagActive))
        .map((item: any) => ({
          text: `${item.FlagActive} (${item.count})`,
          value: item.FlagActive,
        }));
    } else {
      return [];
    }
  }, [data]);
  const columns: ColumnOptions[] = [
    {
      dataField: "ContractNo",
      caption: t("ContractNo"),
      editorType: "dxTextBox",
      visible: true,
      // allowFiltering: false, // cho phép lọc theo cái popup
      headerFilter: {
        dataSource: gpsCodeFilter,
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
      dataField: "UnitPrice",
      caption: t("UnitPrice"),
      editorType: "dxTextBox",
      visible: true,
      // allowFiltering: false, // cho phép lọc theo cái popup

      editorOptions: {
        placeholder: t("Input"),
      },
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
      dataField: "EffStartDate",
      caption: t("EffStartDate"),
      editorType: "dxDateBox",
      width: 500,
      visible: true,
      // allowFiltering: false,
      // cellRender: (data: any) => {
      //   console.log("data cell render", data);
      //   return (
      //     <DateBox
      //       type="date"
      //       placeholder="2021-09-08"
      //       showClearButton={true}
      //       useMaskBehavior={true}
      //     />
      //   );
      // },
      editorOptions: {
        // disabled: true,
        // width: "100%",
        type: "date",
        // value: "2021-04-05",
      },
    },

    {
      dataField: "FlagActive",
      caption: t("Flag Active"),
      editorType: "dxSwitch",
      visible: true,
      alignment: "center",
      width: 120,
      cellRender: ({ data }: any) => {
        // console.log("cell render  data ", data);
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
    console.log("onEditorPreparing", e);
    if (e.dataField === "ContractNo") {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    }
    // if (e.dataField === "EffStartDate") {
    //   e.editorOptions.readOnly = !e.row?.isNewRow;
    // }
  };
  const handleDeleteRows = async (rows: string[]) => {
    console.log("delete nhiều", rows);
    const resp = await api.deleteUnitPriceGPSs(rows);
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

  // cái e này nhận được từ con truyền lên cha
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
        const data: UnitPriceGPS = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onUpdate(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
    logger.debug("e after:", e);
  };

  const handleUploadFile = async (file: File, progressCallback?: Function) => {
    const resp = await api.uploadUnitPriceGPS(file);
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
    const resp = await api.downloadUnitPriceGPS();
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
              {t("Unit Price GPS Management")}
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
          keyExpr={"ContractNo"}
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
