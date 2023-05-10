import {
  ApiResponse,
  CGResponse,
  District,
  Province,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useDistrictApi = (apiBase: AxiosInstance) => {
  return {
    getAllActiveDistrictProvinceCode: async (): Promise<
      ApiResponse<Province>
    > => {
      return await apiBase.post<Partial<Province>, ApiResponse<Province>>(
        "/MstProvince/GetAllActive",
        {}
      );
    },
    getAllActiveDistrictCode: async (): Promise<ApiResponse<District>> => {
      return await apiBase.post<Partial<District>, ApiResponse<District>>(
        "/MstDistrict/GetAllActive",
        {}
      );
    },
    createDistrict: async (
      province: Partial<District>
    ): Promise<ApiResponse<District>> => {
      return await apiBase.post<Partial<District>, ApiResponse<District>>(
        "/MstDistrict/Create",
        {
          strJson: JSON.stringify(province),
        }
      );
    },
    getDistrict: async (
      params: SearchParam
    ): Promise<ApiResponse<District>> => {
      return await apiBase.post<SearchParam, ApiResponse<District>>(
        "/MstDistrict/Search",
        {
          ...params,
        }
      );
    },
    updateDistrict: async (
      key: string,
      district: Partial<District>
    ): Promise<ApiResponse<District>> => {
      return await apiBase.post<Partial<District>, ApiResponse<District>>(
        "/MstDistrict/Update",
        {
          strJson: JSON.stringify({
            DistrictCode: key,
            ...district,
          }),
          ColsUpd: Object.keys(district),
        }
      );
    },
    deleteDistrict: async (DistrictCode: string) => {
      return await apiBase.post<SearchParam, ApiResponse<District>>(
        "/MstDistrict/Delete",
        {
          DistrictCode: DistrictCode,
        }
      );
    },
    deleteDistricts: async (districtCodes: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<District>>(
        "/MstDistrict/DeleteMultiple",
        {
          strJson: JSON.stringify(
            districtCodes.map((item) => ({
              DistrictCode: item,
            }))
          ),
        }
      );
    },
    uploadDistrictFile: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstDistrict/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadTemplateDistrictFile: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<District>, ApiResponse<string>>(
        "/MstDistrict/ExportTemplate",
        {}
      );
    },
    exportDistrictFile: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<District>, ApiResponse<string>>(
          "/MstDistrict/ExportByListDistrictCode",
          {
            ListProvinceCode: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<District>, ApiResponse<string>>(
          "/MstDistrict/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
