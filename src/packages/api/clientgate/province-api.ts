import {
  ApiResponse,
  CGResponse,
  Province,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useProvinceApi = (apiBase: AxiosInstance) => {
  // export interface Province {
  //   ProvinceCode: string;
  //   AreaCode: string;
  //   ProvinceName: string;
  //   FlagActive: string;
  //   LogLUDateTime: string;
  //   LogLUBy: string;
  // }
  return {
    getProvinces: async (
      params: SearchParam
    ): Promise<ApiResponse<Province>> => {
      return await apiBase.post<SearchParam, ApiResponse<Province>>(
        "/MstProvince/Search",
        {
          ...params,
        }
      );
    },
    createProvince: async (
      province: Partial<Province>
    ): Promise<ApiResponse<Province>> => {
      return await apiBase.post<Partial<Province>, ApiResponse<Province>>(
        "/MstProvince/Create",
        {
          strJson: JSON.stringify(province),
        }
      );
    },

    getProvinceActive: async () => {
      return await apiBase.post<Partial<Province>, ApiResponse<Province>>(
        "/MstProvince/GetAllActive"
      );
    },

    deleteProvince: async (provinceCode: string) => {
      return await apiBase.post<SearchParam, ApiResponse<Province>>(
        "/MstProvince/Delete",
        {
          ProvinceCode: provinceCode,
        }
      );
    },
    deleteProvinces: async (provinceCodes: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<Province>>(
        "/MstProvince/DeleteMultiple",
        {
          strJson: JSON.stringify(
            provinceCodes.map((item) => ({
              ProvinceCode: item,
            }))
          ),
        }
      );
    },

    updateProvince: async (
      key: string,
      province: Partial<Province>
    ): Promise<ApiResponse<Province>> => {
      return await apiBase.post<Partial<Province>, ApiResponse<Province>>(
        "/MstProvince/Update",
        {
          strJson: JSON.stringify({
            ProvinceCode: key,
            ...province,
          }),
          ColsUpd: Object.keys(province),
        }
      );
    },

    uploadProvinceFile: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstProvince/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadTemplateProvinceFile: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Province>, ApiResponse<string>>(
        "/MstProvince/ExportTemplate",
        {}
      );
    },
    exportProvinceFile: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<Province>, ApiResponse<string>>(
          "/MstProvince/ExportByListProvinceCode",
          {
            ListProvinceCode: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<Province>, ApiResponse<string>>(
          "/MstProvince/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
