import {
  ApiResponse,
  Area,
  CGResponse,
  CarModel,
  Ports,
  Province,
  SearchParam,
  TransporterDriver,
} from "@/packages/types";
import { AxiosInstance } from "axios";

export const useTransporterDriverApi = (apiBase: AxiosInstance) => {
  return {
    getTransporterDriver: async (
      params: SearchParam
    ): Promise<ApiResponse<TransporterDriver>> => {
      return await apiBase.post<SearchParam, ApiResponse<TransporterDriver>>(
        "/MstTransporterDriver/Search",
        {
          ...params,
        }
      );
    },
    createCarModel: async (
      carModel: Partial<TransporterDriver>
    ): Promise<ApiResponse<TransporterDriver>> => {
      return await apiBase.post<
        Partial<TransporterDriver>,
        ApiResponse<TransporterDriver>
      >("/MstCarModel/Create", {
        strJson: JSON.stringify(carModel),
      });
    },

    deleteTransporterDriver: async ({
      TransporterCode,
      DriverId,
    }: {
      TransporterCode: string;
      DriverId: string;
    }) => {
      // console.log("xóa transporter driver nè", {
      //   TransporterCode: TransporterCode,
      //   DriverId: DriverId,
      // });
      return await apiBase.post<SearchParam, ApiResponse<TransporterDriver>>(
        "/MstCarModel/Delete",
        {
          TransporterCode: TransporterCode,
          DriverId: DriverId,
        }
      );
    },
    deleteTransporterDrivers: async (
      codeTransporterDrivers: {
        TransporterCode: string;
        DriverId: string;
      }[]
    ) => {
      console.log("quản lý xe xóa nhiều nè", codeTransporterDrivers);
      return await apiBase.post<SearchParam, ApiResponse<TransporterDriver>>(
        "/MstCarModel/DeleteMultiple",
        {
          strJson: JSON.stringify(
            codeTransporterDrivers.map(({ TransporterCode, DriverId }) => ({
              TransporterCode,
              DriverId,
            }))
          ),
        }
      );
    },

    updateTransporterDriver: async (
      key: { TransporterCode: string; DriverId: string },
      ports: Partial<TransporterDriver>
    ): Promise<ApiResponse<TransporterDriver>> => {
      return await apiBase.post<
        Partial<TransporterDriver>,
        ApiResponse<TransporterDriver>
      >("/MstCarModel/Update", {
        strJson: JSON.stringify({
          TransporterCode: key.TransporterCode,
          DriverId: key.DriverId,
          ...ports,
        }),
        ColsUpd: Object.keys(ports),
      });
    },

    uploadTransporterDriverFile: async (
      file: File
    ): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstTransporterDriver/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadTemplateTransporterDriverFile: async (): Promise<
      ApiResponse<any>
    > => {
      return await apiBase.post<
        Partial<TransporterDriver>,
        ApiResponse<string>
      >("/MstTransporterDriver/ExportTemplate", {});
    },
    exportTransporterDriverFile: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<
          Partial<TransporterDriver>,
          ApiResponse<string>
        >("/MstTransporterDriver/ExportByListCode", {
          ListTransporterCode: keys.join(","),
        });
      } else {
        return await apiBase.post<
          Partial<TransporterDriver>,
          ApiResponse<string>
        >("/MstTransporterDriver/Export", {
          KeyWord: keyword,
          FlagActive: "1",
        });
      }
    },
  };
};
