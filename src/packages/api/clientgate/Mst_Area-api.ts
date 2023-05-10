import {
  ApiResponse,
  Area,
  CGResponse,
  Ports,
  Province,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useAreaApi = (apiBase: AxiosInstance) => {
  return {
    getArea: async (params: SearchParam): Promise<ApiResponse<Area>> => {
      return await apiBase.post<SearchParam, ApiResponse<Area>>(
        "/MstArea/Search",
        {
          ...params,
        }
      );
    },
    createArea: async (province: Partial<Area>): Promise<ApiResponse<Area>> => {
      return await apiBase.post<Partial<Area>, ApiResponse<Area>>(
        "/MstArea/Create",
        {
          strJson: JSON.stringify(province),
        }
      );
    },

    deleteArea: async (areaCode: string) => {
      return await apiBase.post<SearchParam, ApiResponse<Area>>(
        "/MstArea/Delete",
        {
          AreaCode: areaCode,
        }
      );
    },
    deleteAreas: async (areaCodes: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<Area>>(
        "/MstArea/DeleteMultiple",
        {
          strJson: JSON.stringify(
            areaCodes.map((item) => ({
              AreaCode: item,
            }))
          ),
        }
      );
    },

    updateArea: async (
      key: string,
      ports: Partial<Area>
    ): Promise<ApiResponse<Area>> => {
      return await apiBase.post<Partial<Area>, ApiResponse<Area>>(
        "/MstArea/Update",
        {
          strJson: JSON.stringify({
            AreaCode: key,
            ...ports,
          }),
          ColsUpd: Object.keys(ports),
        }
      );
    },

    uploadAreaFile: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstArea/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadTemplateAreaFile: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Area>, ApiResponse<string>>(
        "/MstArea/ExportTemplate",
        {}
      );
    },
    exportAreaFile: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<Area>, ApiResponse<string>>(
          "/MstArea/ExportByListAreaCode",
          {
            ListAreaCode: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<Area>, ApiResponse<string>>(
          "/MstArea/Export",
          {
            KeyWord: keyword,
            FlagActive: "1",
          }
        );
      }
    },
  };
};
