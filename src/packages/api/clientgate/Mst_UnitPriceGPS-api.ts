import { ApiResponse, SearchParam, UnitPriceGPS } from "@packages/types";
import { AxiosInstance } from "axios";

export const useUnitPriceGPSApi = (apiBase: AxiosInstance) => {
  return {
    getUnitPriceGPS: async (
      params: SearchParam
    ): Promise<ApiResponse<UnitPriceGPS>> => {
      return await apiBase.post<SearchParam, ApiResponse<UnitPriceGPS>>(
        "/MstUnitPriceGPS/Search",
        {
          ...params,
        }
      );
    },
    createUnitPriceGPS: async (
      contractNo: Partial<UnitPriceGPS>
    ): Promise<ApiResponse<UnitPriceGPS>> => {
      return await apiBase.post<
        Partial<UnitPriceGPS>,
        ApiResponse<UnitPriceGPS>
      >("/MstUnitPriceGPS/Create", {
        strJson: JSON.stringify(contractNo),
      });
    },

    deleteUnitPriceGPS: async (ContractNo: string) => {
      return await apiBase.post<SearchParam, ApiResponse<UnitPriceGPS>>(
        "/MstUnitPriceGPS/Delete",
        {
          ContractNo: ContractNo,
        }
      );
    },
    deleteUnitPriceGPSs: async (contractNos: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<UnitPriceGPS>>(
        "/MstUnitPriceGPS/DeleteMultiple",
        {
          strJson: JSON.stringify(
            contractNos.map((item) => ({
              ProvinceCode: item,
            }))
          ),
        }
      );
    },
    updateUnitPriceGPS: async (
      key: string,
      port: Partial<UnitPriceGPS>
    ): Promise<ApiResponse<UnitPriceGPS>> => {
      return await apiBase.post<
        Partial<UnitPriceGPS>,
        ApiResponse<UnitPriceGPS>
      >("/MstUnitPriceGPS/Update", {
        strJson: JSON.stringify({
          ContractNo: key,
          ...port,
        }),
        ColsUpd: Object.keys(port),
      });
    },
    uploadUnitPriceGPS: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstUnitPriceGPS/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadUnitPriceGPS: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<UnitPriceGPS>, ApiResponse<string>>(
        "/MstUnitPriceGPS/ExportTemplate",
        {}
      );
    },
    exportUnitPriceGPS: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<UnitPriceGPS>, ApiResponse<string>>(
          "/MstUnitPriceGPS/ExportByListCode",
          {
            ListContractNo: keys,
          }
        );
      } else {
        return await apiBase.post<Partial<UnitPriceGPS>, ApiResponse<string>>(
          "/MstUnitPriceGPS/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
