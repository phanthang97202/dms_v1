import {
  ApiResponse,
  CGResponse,
  Ports,
  Province,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const usePortsApi = (apiBase: AxiosInstance) => {
  // export interface Province {
  //   ProvinceCode: string;
  //   AreaCode: string;
  //   ProvinceName: string;
  //   FlagActive: string;
  //   LogLUDateTime: string;
  //   LogLUBy: string;
  // }
  return {
    getPorts: async (params: SearchParam): Promise<ApiResponse<Ports>> => {
      return await apiBase.post<SearchParam, ApiResponse<Ports>>(
        "/MstPort/Search",
        {
          ...params,
        }
      );
    },
    createPorts: async (
      province: Partial<Ports>
    ): Promise<ApiResponse<Ports>> => {
      return await apiBase.post<Partial<Ports>, ApiResponse<Ports>>(
        "/MstPort/Create",
        {
          strJson: JSON.stringify(province),
        }
      );
    },

    deletePorts: async (portCode: string) => {
      return await apiBase.post<SearchParam, ApiResponse<Ports>>(
        "MstPort/Delete",
        {
          PortCode: portCode,
        }
      );
    },
    deleteMultiPorts: async (portCodes: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<Ports>>(
        "/MstPort/DeleteMultiple",
        {
          strJson: JSON.stringify(
            portCodes.map((item) => ({
              PortCode: item,
            }))
          ),
        }
      );
    },

    updatePorts: async (
      key: string,
      ports: Partial<Ports>
    ): Promise<ApiResponse<Ports>> => {
      return await apiBase.post<Partial<Ports>, ApiResponse<Ports>>(
        "/MstPort/Update",
        {
          strJson: JSON.stringify({
            PortCode: key,
            ...ports,
          }),
          ColsUpd: Object.keys(ports),
        }
      );
    },

    uploadPortsFile: async (file: File): Promise<ApiResponse<any>> => {
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
    downloadTemplatePortsFile: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Ports>, ApiResponse<string>>(
        "/MstPort/ExportTemplate",
        {}
      );
    },
    exportPortssFile: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<Ports>, ApiResponse<string>>(
          "/MstPort/ExportByListPortCode",
          {
            ListPortCode: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<Ports>, ApiResponse<string>>(
          "/MstPort/Export",
          {
            KeyWord: keyword,
            FlagActive: "1",
          }
        );
      }
    },
  };
};
