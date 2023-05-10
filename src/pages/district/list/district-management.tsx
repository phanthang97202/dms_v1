import { useEffect, useMemo, useRef, useState } from "react";

import { PageHeaderLayout } from "@layouts/page-header-layout";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { BaseGridView, ColumnOptions } from "@packages/ui/base-gridview";
import { StatusButton } from "@/packages/ui/status-button";
import {
  District,
  FlagActiveEnum,
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

export const DistrictManagementPage = () => {
  const { t } = useI18n("District");
  const api = useClientgateApi();
  // console.log("===api", api);
  const config = useConfiguration(); // lấy ra số lượng trang page
  let gridRef: any = useRef(null);
  const keyword = useAtomValue(keywordAtom);

  const showError = useSetAtom(showErrorAtom);
  const setSelectedItems = useSetAtom(selectedItemsAtom);
  // load all data
  const { data, isLoading, refetch } = useQuery(
    ["districts", keyword],
    () =>
      api.getDistrict({
        KeyWord: keyword,
        FlagActive: FlagActiveEnum.All,
        Ft_PageIndex: 0,
        Ft_PageSize: config.MAX_PAGE_ITEMS,
      } as SearchParam),
    {}
  );

  // lấy ra list province code để lookup
  const { data: provinceCodeInDistrict } = useQuery(
    ["provinceCodeInDistrict"],
    () => {
      return api.getAllActiveDistrictProvinceCode();
    }
  );
  // lấy ra list district name để look up
  const { data: districtNameCode } = useQuery(["districtNameCode"], () => {
    return api.getAllActiveDistrictCode();
  });

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

  const onCreate = async (data: Partial<District>) => {
    const resp = await api.createDistrict({
      ...data,
      // nếu data.FlagActive được convert thành truethy (khác not undefined, null, false, 0, NaN, or an empty string) thì nó sẽ: ....
      FlagActive: !!data.FlagActive ? (data.FlagActive ? "1" : "0") : "0",
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
  const onUpdate = async (key: string, data: Partial<District>) => {
    const resp = await api.updateDistrict(key, {
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
    const resp = await api.deleteDistrict(key);
    console.log("onDelete ~ resp:", resp);
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
      dataField: "DistrictCode",
      caption: t("District Code"),
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
      dataField: "ProvinceCode",
      caption: t("ProvinceCode"),
      editorType: "dxSelectBox",
      visible: true,
      // editorOptions: {
      //   dataSource: provinceCodeInDistrict?.DataList || [],
      //   displayExpr: "ProvinceCode",
      //   valueExpr: "ProvinceCode",
      // },
      setCellValue(rowData: any, value: any) {
        rowData.ProvinceCode = value;
        rowData.DistrictName = null;
      },
      lookup: {
        dataSource: provinceCodeInDistrict?.DataList || [],
        valueExpr: "ProvinceCode",
        displayExpr: "ProvinceCode",
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
      dataField: "DistrictName",
      caption: t("DistrictName"),
      editorType: "dxSelectBox",
      visible: true,
      // editorOptions: {
      //   dataSource: districtNameCode?.DataList || [],
      //   displayExpr: "DistrictName",
      //   valueExpr: "ProvinceCode",
      // },
      lookup: {
        dataSource(options: any) {
          return {
            store: districtNameCode?.DataList || [],
            filter: options.data
              ? ["ProvinceCode", "=", options.data.ProvinceCode]
              : null,
            // filter: () => {
            //   console.log(
            //     "options.data.ProvinceCode",
            //     options.data.ProvinceCode
            //   );
            //   return options.data
            //     ? ["ProvinceCode", "=", options.data.ProvinceCode]
            //     : null;
            // },

            //   {
            //     "ProvinceCode": "565656",
            //     "AreaCode": "CODE",
            //     "ProvinceName": "565656",
            //     "FlagActive": "1",
            //     "LogLUDateTime": "2023-05-06 09:56:48",
            //     "LogLUBy": "2700919392@INOS.VN"
            // }

            // {
            //   "DistrictCode": "0",
            //   "ProvinceCode": "18",
            //   "DistrictName": "Hà Giang",
            //   "FlagActive": "1",
            //   "LogLUDTimeUTC": null,
            //   "LogLUBy": "2700919392@INOS.VN"
            // }
          };
        },
        valueExpr: "DistrictName",
        displayExpr: "DistrictName",
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
    if (e.dataField === "DistrictCode") {
      e.editorOptions.readOnly = !e.row?.isNewRow;
    } else if (e.dataField === "FlagActive") {
      e.editorOptions.value = false;
      // } else if (e.dataField === "ProvinceCode") {
      //   e.editorOptions.readOnly = !e.row?.isNewRow;
    }
  };
  const handleDeleteRows = async (rows: string[]) => {
    const resp = await api.deleteDistricts(rows);
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
        const data: District = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onUpdate(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
    logger.debug("e after:", e);
  };

  const handleUploadFile = async (file: File, progressCallback?: Function) => {
    const resp = await api.uploadDistrictFile(file);
    console.log("resp upload file", resp);
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
    const resp = await api.downloadTemplateDistrictFile();
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
              {t("District Management")}
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
          keyExpr="DistrictCode"
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
