import { ApiResponse, SearchParam, CabinCertificate } from "@packages/types";
import { AxiosInstance } from "axios";

export const useCabinCertificateApi = (apiBase: AxiosInstance) => {
  return {
    getCabinCertificate: async (
      params: SearchParam
    ): Promise<ApiResponse<CabinCertificate>> => {
      return await apiBase.post<SearchParam, ApiResponse<CabinCertificate>>(
        "/MstCabinCertificate/Search",
        {
          ...params,
        }
      );
    },
    createCabinCertificate: async (
      CabinCertificateNo: Partial<CabinCertificate>
    ): Promise<ApiResponse<CabinCertificate>> => {
      return await apiBase.post<
        Partial<CabinCertificate>,
        ApiResponse<CabinCertificate>
      >("/MstCabinCertificate/Create", {
        strJson: JSON.stringify(CabinCertificateNo),
      });
    },

    deleteCabinCertificate: async (CabinCertificateNo: string) => {
      return await apiBase.post<SearchParam, ApiResponse<CabinCertificate>>(
        "/MstCabinCertificate/Delete",
        {
          CabinCertificateNo: CabinCertificateNo,
        }
      );
    },
    deleteCabinCertificates: async (keys: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<CabinCertificate>>(
        "/MstCabinCertificate/DeleteMultiple",
        {
          strJson: JSON.stringify(
            keys.map((item) => ({
              CabinCertificateNo: item,
            }))
          ),
        }
      );
    },
    updateCabinCertificate: async (
      key: string,
      port: Partial<CabinCertificate>
    ): Promise<ApiResponse<CabinCertificate>> => {
      return await apiBase.post<
        Partial<CabinCertificate>,
        ApiResponse<CabinCertificate>
      >("/MstCabinCertificate/Update", {
        strJson: JSON.stringify({
          CabinCertificateNo: key,
          ...port,
        }),
        ColsUpd: Object.keys(port),
      });
    },
    uploadCabinCertificate: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstCabinCertificate/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadCabinCertificate: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<CabinCertificate>, ApiResponse<string>>(
        "/MstCabinCertificate/ExportTemplate",
        {}
      );
    },
    exportCabinCertificate: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<
          Partial<CabinCertificate>,
          ApiResponse<string>
        >("/MstCabinCertificate/ExportByListCabinCertificateNo", {
          ListCabinCertificateNo: keys.join(","),
        });
      } else {
        return await apiBase.post<
          Partial<CabinCertificate>,
          ApiResponse<string>
        >("/MstCabinCertificate/Export", {
          KeyWord: keyword,
          FlagActive: "",
        });
      }
    },
  };
};
