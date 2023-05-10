import {
  ApiResponse,
  CGResponse,
  District,
  Payment,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const usePaymentApi = (apiBase: AxiosInstance) => {
  return {
    createPayment: async (
      payment: Partial<Payment>
    ): Promise<ApiResponse<Payment>> => {
      return await apiBase.post<Partial<Payment>, ApiResponse<Payment>>(
        "/MstPaymentType/Create",
        {
          strJson: JSON.stringify(payment),
        }
      );
    },
    getPayment: async (params: SearchParam): Promise<ApiResponse<Payment>> => {
      return await apiBase.post<SearchParam, ApiResponse<Payment>>(
        "/MstPaymentType/Search",
        {
          ...params,
        }
      );
    },
    updatePayment: async (
      key: string,
      payment: Partial<Payment>
    ): Promise<ApiResponse<Payment>> => {
      return await apiBase.post<Partial<Payment>, ApiResponse<Payment>>(
        "/MstPaymentType/Update",
        {
          strJson: JSON.stringify({
            PaymentType: key,
            ...payment,
          }),
          ColsUpd: Object.keys(payment),
        }
      );
    },
    deletePayment: async (PaymentType: string) => {
      return await apiBase.post<SearchParam, ApiResponse<Payment>>(
        "/MstPaymentType/Delete",
        {
          PaymentType: PaymentType,
        }
      );
    },
    deletePayments: async (paymentTypes: string[]) => {
      console.log(
        "paymentTypes",
        paymentTypes,
        paymentTypes.map((item) => ({
          PaymentType: item,
        }))
      );
      return await apiBase.post<SearchParam, ApiResponse<Payment>>(
        "/MstPaymentType/DeleteMultiple",
        {
          strJson: JSON.stringify(
            paymentTypes.map((item) => ({
              PaymentType: item,
            }))
          ),
        }
      );
    },
    uploadPaymentFile: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload

      return await apiBase.post<File, ApiResponse<any>>(
        "/MstPaymentType/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadTemplatePaymentFile: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<Payment>, ApiResponse<string>>(
        "/MstPaymentType/ExportTemplate",
        {}
      );
    },
    exportPaymentFile: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      console.log("export payment file nè", keys, keyword);
      if (keys.length > 0) {
        return await apiBase.post<Partial<Payment>, ApiResponse<string>>(
          "/MstPaymentType/ExportByListPaymentType",
          {
            ListPaymentType: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<Payment>, ApiResponse<string>>(
          "/MstPaymentType/Export",
          {
            KeyWord: keyword,
          }
        );
      }
    },
  };
};
