import { ApiResponse, SearchParam, MngQuota } from "@packages/types";
import { AxiosInstance } from "axios";

export const useMngQuotaApi = (apiBase: AxiosInstance) => {
  return {
    getMngQuota: async (
      params: SearchParam
    ): Promise<ApiResponse<MngQuota>> => {
      return await apiBase.post<SearchParam, ApiResponse<MngQuota>>(
        "/MngQuota/Search",
        {
          ...params,
        }
      );
    },
    createMngQuota: async (
      data: Partial<MngQuota>
    ): Promise<ApiResponse<MngQuota>> => {
      return await apiBase.post<Partial<MngQuota>, ApiResponse<MngQuota>>(
        "/MngQuota/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    deleteMngQuota: async (key: { DealerCode: string; SpecCode: string }) => {
      return await apiBase.post<SearchParam, ApiResponse<MngQuota>>(
        "/MngQuota/Delete",
        {
          SpecCode: key.SpecCode,
          DealerCode: key.DealerCode,
        }
      );
    },
    deleteMngQuotas: async (
      keys: { DealerCode: string; SpecCode: string }[]
    ) => {
      return await apiBase.post<SearchParam, ApiResponse<MngQuota>>(
        "/MngQuota/DeleteMultiple",
        {
          strJson: JSON.stringify(
            keys.map((item) => ({
              SpecCode: item.SpecCode,
              DealerCode: item.DealerCode,
            }))
          ),
        }
      );
    },
    updateMngQuota: async (
      key: {
        DealerCode: string;
        SpecCode: string;
      },
      port: Partial<MngQuota>
    ): Promise<ApiResponse<MngQuota>> => {
      return await apiBase.post<Partial<MngQuota>, ApiResponse<MngQuota>>(
        "/MngQuota/Update",
        {
          strJson: JSON.stringify({
            DealerCode: key.DealerCode,
            SpecCode: key.SpecCode,
            ...port,
          }),
          ColsUpd: Object.keys(port),
        }
      );
    },
    uploadMngQuota: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MngQuota/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadMngQuota: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<MngQuota>, ApiResponse<string>>(
        "/MngQuota/ExportTemplate",
        {}
      );
    },
    exportMngQuota: async (
      keys: {
        ListDealerCode: string;
        ListSpecCode: string;
      }[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        let result = keys.reduce(
          (accumulator: any, currentValue: any) => {
            accumulator.ListSpecCode.push(currentValue.PointRegisCode);
            accumulator.ListDealerCode.push(currentValue.DealerCode);
            return accumulator;
          },
          {
            ListDealerCode: [],
            ListSpecCode: [],
          }
        );

        result.ListSpecCode = result.ListSpecCode.join(",");
        result.ListDealerCode = result.ListDealerCode.join(",");
        return await apiBase.post<Partial<MngQuota>, ApiResponse<string>>(
          "/MngQuota/ExportByListDealerCode",
          result
        );
      } else {
        return await apiBase.post<Partial<MngQuota>, ApiResponse<string>>(
          "/MngQuota/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
