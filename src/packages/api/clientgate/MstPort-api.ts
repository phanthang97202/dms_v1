import { ApiResponse, SearchParam, Mst_Port } from "@packages/types";
import { AxiosInstance } from "axios";

export const useMstPort = (apiBase: AxiosInstance) => {
  return {
    getMst_Port: async (
      params: SearchParam
    ): Promise<ApiResponse<Mst_Port>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_Port>>(
        "/MstPort/Search",
        {
          ...params,
        }
      );
    },
    getMstPortAllActive: async (): Promise<ApiResponse<Mst_Port>> => {
      return await apiBase.post<any, ApiResponse<Mst_Port>>(
        "/MstPort/GetAllActive"
      );
    },
    createMst_Port: async (
      province: Partial<Mst_Port>
    ): Promise<ApiResponse<Mst_Port>> => {
      return await apiBase.post<Partial<Mst_Port>, ApiResponse<Mst_Port>>(
        "/MstPort/Create",
        {
          strJson: JSON.stringify(province),
        }
      );
    },

    deleteMst_Port: async (PortCode: string) => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_Port>>(
        "/MstPort/Delete",
        {
          PortCode: PortCode,
        }
      );
    },
    deleteMstPorts: async (provinceCodes: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_Port>>(
        "/MstPort/DeleteMultiple",
        {
          strJson: JSON.stringify(
            provinceCodes.map((item) => ({
              ProvinceCode: item,
            }))
          ),
        }
      );
    },
    updateMst_Port: async (
      key: string,
      port: Partial<Mst_Port>
    ): Promise<ApiResponse<Mst_Port>> => {
      return await apiBase.post<Partial<Mst_Port>, ApiResponse<Mst_Port>>(
        "/MstPort/Update",
        {
          strJson: JSON.stringify({
            PortCode: key,
            ...port,
          }),
          ColsUpd: Object.keys(port),
        }
      );
    },
    uploadMst_Port: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstPort/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadTemplateMst_Port: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Mst_Port>, ApiResponse<string>>(
        "/MstPort/ExportTemplate",
        {}
      );
    },
    exportMst_Port: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<Mst_Port>, ApiResponse<string>>(
          "/MstPort/ExportByListProvinceCode",
          {
            ListProvinceCode: keys,
          }
        );
      } else {
        return await apiBase.post<Partial<Mst_Port>, ApiResponse<string>>(
          "/MstPort/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
