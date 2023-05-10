import { ApiResponse, SearchParam, Mst_PortType } from "@packages/types";
import { AxiosInstance } from "axios";

export const useMstPortTypeAPI = (apiBase: AxiosInstance) => {
  return {
    getPortTypeActive: async (): Promise<ApiResponse<Mst_PortType>> => {
      return await apiBase.post<any, ApiResponse<Mst_PortType>>(
        "/MstPortType/GetAllActive"
      );
    },

    getPortType: async (
      params: SearchParam
    ): Promise<ApiResponse<Mst_PortType>> => {
      return await apiBase.post<SearchParam, ApiResponse<Mst_PortType>>(
        "/MstPortType/Search",
        {
          ...params,
        }
      );
    },
    deletePortType: async (PortType: string) => {
      return await apiBase.post<
        Partial<Mst_PortType>,
        ApiResponse<Partial<Mst_PortType>>
      >("/MstPortType/Delete");
    },

    Mst_Port_Type_Upload: async (file: File) => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstPortType/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },

    Mst_PortType_ExportExcel: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Mst_PortType>,
        ApiResponse<Mst_PortType>
      >("/MstPortType/Export", {
        ListProvinceCode: keys,
      });
    },

    Mst_PortType_ExportExcelTemplate: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<
        Partial<Mst_PortType>,
        ApiResponse<Mst_PortType>
      >("/MstPortType/ExportTemplate");
    },

    Mst_PortType_Delete: async (PortType: string) => {
      return await apiBase.post<
        Partial<Mst_PortType>,
        ApiResponse<Mst_PortType>
      >("MstPortType/Delete", {
        PortType,
      });
    },

    Mst_PortType_Create: async (
      data: Partial<Mst_PortType>
    ): Promise<ApiResponse<Mst_PortType>> => {
      const strJson = JSON.stringify(data);
      return await apiBase.post("MstPortType/Create", {
        strJson: strJson,
      });
    },

    Mst_PortType_Update: async (
      key: string,
      data: Partial<Mst_PortType>
    ): Promise<ApiResponse<Mst_PortType>> => {
      return await apiBase.post<
        Partial<Mst_PortType>,
        ApiResponse<Mst_PortType>
      >("/MstPortType/Update", {
        strJson: JSON.stringify({
          ...data,
          PortType: key,
        }),
        ColsUpd: Object.keys(data),
      });
    },
  };
};
