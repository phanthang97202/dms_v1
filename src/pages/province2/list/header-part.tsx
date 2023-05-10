import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { HeaderForm } from "@/packages/ui/header-form/header-form";
import {
  keywordAtom,
  selectedItemsAtom,
} from "@/pages/province/components/screen-atom";
import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { toast } from "react-toastify";
interface HeaderPartProps {
  onAddNew?: () => void;
  onUploadFile?: (file: File, progressCallback?: Function) => void;
  onDownloadTemplate: () => void;
}
const HeaderPart = ({
  onUploadFile,
  onDownloadTemplate,
  onAddNew,
}: HeaderPartProps) => {
  const { t } = useI18n("Common");

  const selectedItems = useAtomValue(selectedItemsAtom); // mảng string[]
  const keyword = useAtomValue(keywordAtom); // string
  const setKeyword = useSetAtom(keywordAtom); // set string vào atom . setKeyword là 1 hàm sử dụng như useState
  // console.log("setKeyword ", setKeyword);
  // -------------------
  // const handleSetKeyword = () => {
  //   setKeyword("thang");
  // };
  // useEffect(() => {
  //   handleSetKeyword();
  //   console.log("===keyword", keyword);
  // }, []);
  // -------------------

  const showError = useSetAtom(showErrorAtom);
  const api = useClientgateApi(); // lấy ra các hàm call api
  // console.log("===api", api);
  const handleSearch = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleExportExcel = async (selectedOnly: boolean) => {
    const resp = await api.exportProvinceFile(selectedItems, keyword || "");
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

  return (
    <HeaderForm
      onSearch={handleSearch}
      onAddNew={onAddNew}
      onUploadFile={onUploadFile}
      onExportExcel={handleExportExcel}
      onDownloadTemplate={onDownloadTemplate}
      selectedItems={selectedItems}
    />
  );
};

export default HeaderPart;
