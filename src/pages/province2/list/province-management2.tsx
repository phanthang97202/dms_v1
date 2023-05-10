import { useI18n } from "@/i18n/useI18n";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";

import React, { useEffect, useMemo, useRef } from "react";
import HeaderPart from "./header-part";
import { BaseGridView, ColumnOptions } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import {
  keywordAtom,
  selectedItemsAtom,
} from "@/pages/province/components/screen-atom";
import { useAtomValue, useSetAtom } from "jotai";
import { useClientgateApi } from "@/packages/api";
import { FlagActiveEnum, Province, SearchParam } from "@/packages/types";
import { useConfiguration } from "@/packages/hooks";
import { StatusButton } from "@/packages/ui/status-button";
import { showErrorAtom } from "@/packages/store";
import { toast } from "react-toastify";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { logger } from "@/packages/logger";

const ProvinceManagementPage2 = () => {
  const { t } = useI18n("Province2");
  let gridRef: any = useRef(null);
  const api = useClientgateApi();
  const config = useConfiguration(); // lấy ra số lượng page
  const keyword = useAtomValue(keywordAtom);
  const showError = useSetAtom(showErrorAtom);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  //   get all data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["provinces", keyword],
    queryFn: () => {
      return api.getProvinces({
        KeyWord: keyword,
        FlagActive: FlagActiveEnum.All,
        Ft_PageIndex: 0,
        Ft_PageSize: config.MAX_PAGE_ITEMS,
      } as SearchParam);
    },
  });

  // lấy toàn bộ data areasData
  const { data: areasData } = useQuery(["areas"], () => {
    return api.getAreas({
      KeyWord: "",
      FlagActive: FlagActiveEnum.All,
      Ft_PageIndex: 0,
      Ft_PageSize: config.MAX_PAGE_ITEMS,
    } as SearchParam);
  });
  //   console.log("===data", data);
  const areaCodeFilter = useMemo(() => {
    if (data?.isSuccess) {
      return data.DataList?.reduce((acc, cur) => {
        const value = cur.AreaCode;
        const existingItem = acc.find((item: any) => item.AreaCode === value);
        if (!existingItem) {
          acc.push({ AreaCode: value, count: 1 });
        } else {
          existingItem.count++;
        }
        return acc;
      }, [] as { AreaCode: string; count: number }[])
        .sort((a: any, b: any) => a.AreaCode.localeCompare(b.AreaCode))
        .map((item: any) => ({
          text: `${item.AreaCode} (${item.count}) `,
          value: item.AreaCode,
        }));
    } else {
      return [];
    }
  }, [data]);

  //   lấy ra danh sách filter flag active
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
  useEffect(() => {
    if (!!data && !data.isSuccess) {
      showError({
        message: t(data.errorCode),
        debugInfo: data.debugInfo,
        errorInfo: data.errorInfo,
      });
    }
  }, [data]);

  const columns: ColumnOptions[] = [
    {
      dataField: "ProvinceCode",
      caption: t("Province Code"),
      editorType: "dxTextBox",
      visible: true,
      allowFiltering: false,
      editorOptions: {
        placeholder: t("Input"),
      },
      validationRules: [
        { type: "required" },
        {
          type: "pattern",
          pattern: /[a-zA-Z0-9]/,
        },
      ],
    },
    {
      dataField: "AreaCode",
      caption: t("Area Code"),
      editorType: "dxSelectBox",
      visible: true,
      headerFilter: {
        dataSource: areaCodeFilter,
      },
      editorOptions: {
        dataSource: areasData?.DataList ?? [],
        displayExpr: "AreaCode",
        valueExpr: "AreaCode",
      },
    },
    {
      dataField: "ProvinceName",
      caption: t("Province Name"),
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

  // phần crud
  const onCreate = async (data: Partial<Province>) => {
    console.log("data create", data);
    const resp = await api.createProvince({
      ...data,
      // nếu data.FlagActive được convert thành truethy (khác not undefined, null, false, 0, NaN, or an empty string) thì nó sẽ: ....
      FlagActive: !!data.FlagActive ? (data.FlagActive ? "1" : "0") : "0",
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
  const onUpdate = async (key: string, data: Partial<Province>) => {
    const condition = {
      ...data,
      FlagActive: data.FlagActive === true ? "1" : "0",
    };
    const resp = await api.updateProvince(key, condition);
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
    const resp = await api.deleteProvince(key);
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

  // phần chức năng
  const handleUploadFile = async (file: File, progressCallback?: Function) => {
    const resp = await api.uploadProvinceFile(file);
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
    const resp = await api.downloadTemplateProvinceFile();
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

  const handleEditorPreparing = (e: EditorPreparingEvent<any, any>) => {
    if (e.dataField === "ProvinceCode") {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    } else if (e.dataField === "FlagActive") {
      e.editorOptions.value = false;
    }
  };

  const handleSavingRow = async (e: any) => {
    console.log("id của row nè", e);
    logger.debug("e:", e);
    // stop grid behaviour
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "remove") {
        const id = e.changes[0].key;
        e.promise = onDelete(id);
      } else if (type === "insert") {
        const data: Province = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onUpdate(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
    logger.debug("e after:", e);
  };

  const handleDeleteRows = async (rows: string[]) => {
    const resp = await api.deleteProvinces(rows);
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

  //   show giao diện add
  const handleAddNew = () => {
    if (gridRef.instance) gridRef.instance.addRow();
  };
  const handleSelectionChanged = (rowKeys: string[]) => {
    setSelectedItems(rowKeys);
  };

  return (
    <React.Fragment>
      <AdminContentLayout className={"province-management"}>
        <AdminContentLayout.Slot name={"Header"}>
          <PageHeaderLayout>
            <PageHeaderLayout.Slot name={"Before"}>
              <div className="font-bold dx-font-m">
                {t("Province Management")}
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
            keyExpr="ProvinceCode"
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
    </React.Fragment>
  );
};

export default ProvinceManagementPage2;
