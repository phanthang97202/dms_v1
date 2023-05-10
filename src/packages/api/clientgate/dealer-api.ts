import { CGResponse, Dealer, DeleteDealerParam, SearchParam } from "@/packages/types";
import { AxiosInstance } from "axios";

export const useDealerApi = (apiBase: AxiosInstance) => {
  return {
    getDealers: async (params: SearchParam): Promise<CGResponse<Dealer>> => {
      return await apiBase.post<SearchParam, CGResponse<Dealer>>("/MstDealer/Search", {
        ...params
      });
    },
    updateDealer: async (code: string, values: Partial<Dealer>) => {
      return await apiBase.post<DeleteDealerParam, CGResponse<Dealer>>("/MstDealer/Update", {
        strJson: JSON.stringify({
          DealerCode: code,
          ...values
        }),
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
    },
    deleteDealer: async (code: string): Promise<CGResponse<Dealer>> => {
      return await apiBase.post<DeleteDealerParam, CGResponse<Dealer>>("/MstDealer/Delete", {
        DealerCode: code
      });
    },
    uploadDealerFile: async (file: File): Promise<CGResponse<any>> => {
      const form = new FormData();
      form.append('file', file); // file is the file you want to upload

      const resp = await apiBase.post<File, CGResponse<any>>("/MstDealer/Import", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      console.log('resp:', resp);
      return {
        ...resp,
        isSuccess: resp.Data._strErrCode === "0"
      };
    }
  };
};