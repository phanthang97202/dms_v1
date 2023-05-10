import { ApiResponse, SearchParam, AmplitudeApprOrd } from "@packages/types";
import { AxiosInstance } from "axios";

export const useAmplitudeApprOrdApi = (apiBase: AxiosInstance) => {
  return {
    getAmplitudeApprOrd: async (
      params: SearchParam
    ): Promise<ApiResponse<AmplitudeApprOrd>> => {
      return await apiBase.post<SearchParam, ApiResponse<AmplitudeApprOrd>>(
        "/MstAmplitudeApprOrd/Search",
        {
          ...params,
        }
      );
    },
    createAmplitudeApprOrd: async (
      insuranceType: Partial<AmplitudeApprOrd>
    ): Promise<ApiResponse<AmplitudeApprOrd>> => {
      return await apiBase.post<
        Partial<AmplitudeApprOrd>,
        ApiResponse<AmplitudeApprOrd>
      >("/MstInsuranceType/Create", {
        strJson: JSON.stringify(insuranceType),
      });
    },

    deleteInsuranceType: async (key: {
      InsCompanyCode: string;
      InsTypeCode: string;
      EffectiveDate: string;
    }) => {
      return await apiBase.post<SearchParam, ApiResponse<AmplitudeApprOrd>>(
        "/MstInsuranceType/Delete",
        key
      );
    },
    deleteInsuranceTypes: async (
      key: {
        InsCompanyCode: string;
        InsTypeCode: string;
        EffectiveDate: string;
      }[]
    ) => {
      return await apiBase.post<SearchParam, ApiResponse<AmplitudeApprOrd>>(
        "/MstInsuranceType/DeleteMultiple",
        {
          strJson: JSON.stringify(
            key.map(({ InsCompanyCode, InsTypeCode, EffectiveDate }) => ({
              InsCompanyCode,
              InsTypeCode,
              EffectiveDate,
            }))
          ),
        }
      );
    },
    updateInsuranceTypes: async (
      key: string,
      port: Partial<AmplitudeApprOrd>
    ): Promise<ApiResponse<AmplitudeApprOrd>> => {
      return await apiBase.post<
        Partial<AmplitudeApprOrd>,
        ApiResponse<AmplitudeApprOrd>
      >("/MstInsuranceType/Update", {
        strJson: JSON.stringify({
          InsCompanyCode: key,
          InsTypeCode: key,
          EffectiveDate: key,
          ...port,
        }),
        ColsUpd: Object.keys(port),
      });
    },
    uploadInsuranceTypes: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      return await apiBase.post<File, ApiResponse<any>>(
        "/MstInsuranceType/Import",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    downloadInsuranceTypes: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<AmplitudeApprOrd>, ApiResponse<string>>(
        "/MstInsuranceType/ExportTemplate",
        {}
      );
    },
    exportInsuranceTypes: async (
      keys: {
        InsCompanyCode: string;
        InsTypeCode: string;
        EffectiveDate: string;
      }[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        let result = keys.reduce(
          (accumulator: any, currentValue: any) => {
            accumulator.ListInsCompanyCode.push(currentValue.InsCompanyCode);
            accumulator.ListInsTypeCode.push(currentValue.InsTypeCode);
            accumulator.ListEffectiveDate.push(currentValue.EffectiveDate);
            return accumulator;
          },
          {
            ListInsCompanyCode: [],
            ListInsTypeCode: [],
            ListEffectiveDate: [],
          }
        );

        result.ListInsCompanyCode = result.ListInsCompanyCode.join(",");
        result.ListInsTypeCode = result.ListInsTypeCode.join(",");
        result.ListEffectiveDate = result.ListEffectiveDate.join(",");
        console.log("keys export chooser columns", result);
        return await apiBase.post<
          Partial<AmplitudeApprOrd>,
          ApiResponse<string>
        >(
          "/MstInsuranceType/ExportByListCode",
          result
          //   {
          //     ListInsCompanyCode: ["BAOVIET", "PTIHCM"],
          //     ListInsTypeCode: ["TRANSPORTATIONINS"],
          //     ListEffectiveDate: ["2014-01-01", "2016-06-01"],
          //   }
        );
      } else {
        return await apiBase.post<
          Partial<AmplitudeApprOrd>,
          ApiResponse<string>
        >("/MstInsuranceType/Export", {
          KeyWord: keyword,
          FlagActive: "",
        });
      }
    },
  };
};
