import { useEffect, useMemo, useRef, useState } from "react";

import { PageHeaderLayout } from "@layouts/page-header-layout";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { BaseGridView, ColumnOptions } from "@packages/ui/base-gridview";
import { StatusButton } from "@/packages/ui/status-button";
import {
  FlagActiveEnum,
  InsuranceType,
  Payment,
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

export const AmplitudeApprOrdManagementPage = () => {
  const { t } = useI18n("InsuranceTypeManagementPage");
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
      api.getAmplitudeApprOrd({
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

  const onCreate = async (data: Partial<InsuranceType>) => {
    const resp = await api.createInsuranceType({
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
  const onUpdate = async (key: string, data: Partial<InsuranceType>) => {
    const resp = await api.updateInsuranceTypes(key, {
      ...data,
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
  const onDelete = async (key: {
    InsCompanyCode: string;
    InsTypeCode: string;
    EffectiveDate: string;
  }) => {
    // console.log("===key insurance type", key);
    const resp = await api.deleteInsuranceType(key);
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

  const columns: ColumnOptions[] = [
    {
      dataField: "DealerCode",
      caption: t("DealerCode"),
      editorType: "dxTextBox",
      visible: true,
      // allowFiltering: false, // cho phép lọc theo cái popup
      // headerFilter: {
      //   dataSource: portsCodeFilter,
      // },
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
      dataField: "md_DealerName",
      caption: t("md_DealerName"),
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
        {
          type: "pattern",
          pattern: /[a-zA-Z0-9]/,
        },
      ],
    },
    {
      dataField: "ModelCode",
      caption: t("ModelCode"),
      // defaultSortOrder: "asc",
      editorType: "dxTextBox",
      // visible: true,
      // allowFiltering: false,
      editorOptions: {
        type: "date",
      },
      validationRules: [
        {
          type: "required",
        },
      ],
    },
    {
      dataField: "mcm_ModelName",
      caption: t("mcm_ModelName "),
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
        {
          type: "pattern",
          pattern: /[a-zA-Z0-9]/,
        },
      ],
    },
    {
      dataField: "AmplitudeOrdMax",
      caption: t("AmplitudeOrdMax "),
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
        {
          type: "pattern",
          pattern: /[0-9]/,
        },
      ],
    },
    {
      dataField: "AmplitudePlanMax",
      caption: t("AmplitudePlanMax "),
      editorType: "dxTextBox",
      visible: true,
      allowFiltering: false,
      editorOptions: {
        placeholder: t("Input"),
      },
      validationRules: [{ type: "pattern", pattern: /[a-zA-Z0-9]/ }],
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
  const handleDeleteRows = async (rows: any[]) => {
    const resp = await api.deleteInsuranceTypes(rows);
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
        const data: InsuranceType = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onUpdate(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
    logger.debug("e after:", e);
  };

  const handleUploadFile = async (file: File, progressCallback?: Function) => {
    const resp = await api.uploadInsuranceTypes(file);
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
    const resp = await api.downloadInsuranceTypes();
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
              {t("Insurance Type Management")}
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
          keyExpr={["InsCompanyCode", "InsTypeCode", "EffectiveDate"]}
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
