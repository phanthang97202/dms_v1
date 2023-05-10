import {
  ApiResponse,
  Area,
  CGResponse,
  CarModel,
  Ports,
  Province,
  SearchParam,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useCarModelApi = (apiBase: AxiosInstance) => {
  return {
    getCarModel: async (
      params: SearchParam
    ): Promise<ApiResponse<CarModel>> => {
      return await apiBase.post<SearchParam, ApiResponse<CarModel>>(
        "/MstCarModel/Search",
        {
          ...params,
        }
      );
    },
    createCarModel: async (
      carModel: Partial<CarModel>
    ): Promise<ApiResponse<CarModel>> => {
      return await apiBase.post<Partial<CarModel>, ApiResponse<CarModel>>(
        "/MstCarModel/Create",
        {
          strJson: JSON.stringify(carModel),
        }
      );
    },

    deleteCarModel: async (carModelCode: string) => {
      return await apiBase.post<SearchParam, ApiResponse<CarModel>>(
        "/MstCarModel/Delete",
        {
          ModelCode: carModelCode,
        }
      );
    },
    deleteCarModels: async (codeModels: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<CarModel>>(
        "/MstCarModel/DeleteMultiple",
        {
          strJson: JSON.stringify(
            codeModels.map((item) => ({
              ModelCode: item,
            }))
          ),
        }
      );
    },

    updateCarModel: async (
      key: string,
      ports: Partial<CarModel>
    ): Promise<ApiResponse<CarModel>> => {
      return await apiBase.post<Partial<CarModel>, ApiResponse<CarModel>>(
        "/MstCarModel/Update",
        {
          strJson: JSON.stringify({
            ModelCode: key,
            ...ports,
          }),
          ColsUpd: Object.keys(ports),
        }
      );
    },

    uploadCarModelFile: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstCarModel/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadTemplateCarModelFile: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<CarModel>, ApiResponse<string>>(
        "/MstCarModel/ExportTemplate",
        {}
      );
    },
    exportCarModelFile: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<CarModel>, ApiResponse<string>>(
          "MstCarModel/ExportByListCode",
          {
            ListModelCode: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<CarModel>, ApiResponse<string>>(
          "/MstCarModel/Export",
          {
            KeyWord: keyword,
            FlagActive: "1",
          }
        );
      }
    },
  };
};
