import { ApiResponse, SearchParam, PointRegis } from "@packages/types";
import { AxiosInstance } from "axios";

export const usePointRegisApi = (apiBase: AxiosInstance) => {
  return {
    getPointRegis: async (
      params: SearchParam
    ): Promise<ApiResponse<PointRegis>> => {
      return await apiBase.post<SearchParam, ApiResponse<PointRegis>>(
        "/MstPointRegis/Search",
        {
          ...params,
        }
      );
    },
    createPointRegis: async (
      PointRegisCode: Partial<PointRegis>
    ): Promise<ApiResponse<PointRegis>> => {
      return await apiBase.post<Partial<PointRegis>, ApiResponse<PointRegis>>(
        "/MstPointRegis/Create",
        {
          strJson: JSON.stringify(PointRegisCode),
        }
      );
    },

    deletePointRegis: async (key: {
      PointRegisCode: string;
      DealerCode: string;
    }) => {
      return await apiBase.post<SearchParam, ApiResponse<PointRegis>>(
        "/MstPointRegis/Delete",
        {
          PointRegisCode: key.PointRegisCode,
          DealerCode: key.DealerCode,
        }
      );
    },
    deletePointRegiss: async (
      keys: {
        PointRegisCode: string;
        DealerCode: string;
      }[]
    ) => {
      return await apiBase.post<SearchParam, ApiResponse<PointRegis>>(
        "/MstPointRegis/DeleteMultiple",
        {
          strJson: JSON.stringify(
            keys.map((item) => ({
              PointRegisCode: item.PointRegisCode,
              DealerCode: item.DealerCode,
            }))
          ),
        }
      );
    },
    updatePointRegis: async (
      key: string,
      port: Partial<PointRegis>
    ): Promise<ApiResponse<PointRegis>> => {
      return await apiBase.post<Partial<PointRegis>, ApiResponse<PointRegis>>(
        "/MstPointRegis/Update",
        {
          strJson: JSON.stringify({
            PointRegisCode: key,
            ...port,
          }),
          ColsUpd: Object.keys(port),
        }
      );
    },
    uploadPointRegis: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstPointRegis/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadPointRegis: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<PointRegis>, ApiResponse<string>>(
        "/MstPointRegis/ExportTemplate",
        {}
      );
    },
    exportPointRegis: async (
      keys: {
        ListPointRegisCode: string;
        ListDealerCode: string;
      }[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        let result = keys.reduce(
          (accumulator: any, currentValue: any) => {
            accumulator.ListPointRegisCode.push(currentValue.PointRegisCode);
            accumulator.ListDealerCode.push(currentValue.DealerCode);
            return accumulator;
          },
          {
            ListPointRegisCode: [],
            ListDealerCode: [],
          }
        );

        result.ListPointRegisCode = result.ListPointRegisCode.join(",");
        result.ListDealerCode = result.ListDealerCode.join(",");
        return await apiBase.post<Partial<PointRegis>, ApiResponse<string>>(
          "/MstPointRegis/ExportByListPointRegisCode",
          result
        );
      } else {
        return await apiBase.post<Partial<PointRegis>, ApiResponse<string>>(
          "/MstPointRegis/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
