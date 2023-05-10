import {
  ApiResponse,
  CGResponse,
  District,
  Payment,
  Port,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const usePortApi = (apiBase: AxiosInstance) => {
  return {
    createPort: async (payment: Partial<Port>): Promise<ApiResponse<Port>> => {
      return await apiBase.post<Partial<Port>, ApiResponse<Port>>(
        "/MstPortType/Create",
        {
          strJson: JSON.stringify(payment),
        }
      );
    },
    getPort: async (params: SearchParam): Promise<ApiResponse<Port>> => {
      return await apiBase.post<SearchParam, ApiResponse<Port>>(
        "/MstPortType/Search",
        {
          ...params,
        }
      );
    },
    updatePort: async (
      key: string,
      PortType: Partial<Port>
    ): Promise<ApiResponse<Port>> => {
      return await apiBase.post<Partial<Port>, ApiResponse<Port>>(
        "/MstPortType/Update",
        {
          strJson: JSON.stringify({
            PortType: key,
            ...PortType,
          }),
        }
      );
    },
    deletePort: async (PortType: string) => {
      return await apiBase.post<SearchParam, ApiResponse<Port>>(
        "/MstPortType/Delete",
        {
          PortType: PortType,
        }
      );
    },
    deletePorts: async (portTypes: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<Port>>(
        "/MstPortType/DeleteMultiple",
        {
          strJson: JSON.stringify(
            portTypes.map((item) => ({
              PortType: item,
            }))
          ),
        }
      );
    },
    uploadPortFile: async (file: File): Promise<ApiResponse<any>> => {
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
    downloadTemplatePortFile: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Port>, ApiResponse<string>>(
        "/MstPortType/ExportTemplate",
        {}
      );
    },
    exportPortFile: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      console.log("export payment file nè", keys, keyword);
      if (keys.length > 0) {
        return await apiBase.post<Partial<Port>, ApiResponse<string>>(
          "MstPortType/Export",
          {
            // ListPaymentType: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<Port>, ApiResponse<string>>(
          "/MstPortType/Export",
          {
            KeyWord: keyword,
          }
        );
      }
    },
  };
};
