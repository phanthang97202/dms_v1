import { ApiResponse, SearchParam, InsuranceType } from "@packages/types";
import { AxiosInstance } from "axios";

export const useInsuranceTypeApi = (apiBase: AxiosInstance) => {
  return {
    getInsuranceType: async (
      params: SearchParam
    ): Promise<ApiResponse<InsuranceType>> => {
      return await apiBase.post<SearchParam, ApiResponse<InsuranceType>>(
        "/MstInsuranceType/Search",
        {
          ...params,
        }
      );
    },
    createInsuranceType: async (
      insuranceType: Partial<InsuranceType>
    ): Promise<ApiResponse<InsuranceType>> => {
      console.log("===insuranceType", insuranceType);
      return await apiBase.post<
        Partial<InsuranceType>,
        ApiResponse<InsuranceType>
      >("/MstInsuranceType/Create", {
        strJson: JSON.stringify(insuranceType),
      });
    },

    deleteInsuranceType: async (key: {
      InsCompanyCode: string;
      InsTypeCode: string;
      EffectiveDate: string;
    }) => {
      return await apiBase.post<SearchParam, ApiResponse<InsuranceType>>(
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
      return await apiBase.post<SearchParam, ApiResponse<InsuranceType>>(
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
      port: Partial<InsuranceType>
    ): Promise<ApiResponse<InsuranceType>> => {
      return await apiBase.post<
        Partial<InsuranceType>,
        ApiResponse<InsuranceType>
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
      return await apiBase.post<Partial<InsuranceType>, ApiResponse<string>>(
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
        return await apiBase.post<Partial<InsuranceType>, ApiResponse<string>>(
          "/MstInsuranceType/ExportByListCode",
          result
          //   {
          //     ListInsCompanyCode: ["BAOVIET", "PTIHCM"],
          //     ListInsTypeCode: ["TRANSPORTATIONINS"],
          //     ListEffectiveDate: ["2014-01-01", "2016-06-01"],
          //   }
        );
      } else {
        return await apiBase.post<Partial<InsuranceType>, ApiResponse<string>>(
          "/MstInsuranceType/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
const employees = [
  {
    ID: 1,
    FirstName: "John",
    LastName: "Heart",
    Prefix: "Mr.",
    Position: "CTO",
    StateID: 5,
    CityID: 17,
  },
  {
    ID: 2,
    FirstName: "Olivia",
    LastName: "Peyton",
    Prefix: "Mrs.",
    Position: "HR Manager",
    StateID: 5,
    CityID: 17,
  },
  {
    ID: 3,
    FirstName: "Robert",
    LastName: "Reagan",
    Prefix: "Mr.",
    Position: "IT Manager",
    StateID: 4,
    CityID: 14,
  },
  {
    ID: 4,
    FirstName: "Greta",
    LastName: "Sims",
    Prefix: "Ms.",
    Position: "Shipping Manager",
    StateID: 3,
    CityID: 8,
  },
  {
    ID: 5,
    FirstName: "Brett",
    LastName: "Wade",
    Prefix: "Mr.",
    Position: "Shipping Manager",
    StateID: 3,
    CityID: 9,
  },
  {
    ID: 6,
    FirstName: "Sandra",
    LastName: "Johnson",
    Prefix: "Mrs.",
    Position: "Network Admin",
    StateID: 2,
    CityID: 6,
  },
  {
    ID: 7,
    FirstName: "Kevin",
    LastName: "Carter",
    Prefix: "Mr.",
    Position: "Network Admin",
    StateID: 1,
    CityID: 3,
  },
  {
    ID: 8,
    FirstName: "Cynthia",
    LastName: "Stanwick",
    Prefix: "Ms.",
    Position: "Sales Assistant",
    StateID: 1,
    CityID: 3,
  },
  {
    ID: 9,
    FirstName: "Kent",
    LastName: "Samuelson",
    Prefix: "Dr.",
    Position: "Sales Assistant",
    StateID: 1,
    CityID: 2,
  },
  {
    ID: 10,
    FirstName: "Taylor",
    LastName: "Riley",
    Prefix: "Mr.",
    Position: "Support Assistant",
    StateID: 5,
    CityID: 17,
  },
  {
    ID: 11,
    FirstName: "Sam",
    LastName: "Hill",
    Prefix: "Mr.",
    Position: "Sales Assistant",
    StateID: 2,
    CityID: 5,
  },
  {
    ID: 12,
    FirstName: "Kelly",
    LastName: "Rodriguez",
    Prefix: "Ms.",
    Position: "Sales Assistant",
    StateID: 5,
    CityID: 17,
  },
  {
    ID: 13,
    FirstName: "Natalie",
    LastName: "Maguirre",
    Prefix: "Mrs.",
    Position: "Sales Assistant",
    StateID: 4,
    CityID: 14,
  },
  {
    ID: 14,
    FirstName: "Walter",
    LastName: "Hobbs",
    Prefix: "Mr.",
    Position: "Support Assistant",
    StateID: 2,
    CityID: 5,
  },
];

const states = [
  {
    ID: 1,
    Name: "Alabama",
  },
  {
    ID: 2,
    Name: "Alaska",
  },
  {
    ID: 3,
    Name: "Arizona",
  },
  {
    ID: 4,
    Name: "Arkansas",
  },
  {
    ID: 5,
    Name: "California",
  },
];

const cities = [
  {
    ID: 1,
    Name: "Tuscaloosa",
    StateID: 1,
  },
  {
    ID: 2,
    Name: "Hoover",
    StateID: 1,
  },
  {
    ID: 3,
    Name: "Dothan",
    StateID: 1,
  },
  {
    ID: 4,
    Name: "Decatur",
    StateID: 1,
  },
  {
    ID: 5,
    Name: "Anchorage",
    StateID: 2,
  },
  {
    ID: 6,
    Name: "Fairbanks",
    StateID: 2,
  },
  {
    ID: 7,
    Name: "Juneau",
    StateID: 2,
  },
  {
    ID: 8,
    Name: "Avondale",
    StateID: 3,
  },
  {
    ID: 9,
    Name: "Buckeye",
    StateID: 3,
  },
  {
    ID: 10,
    Name: "Carefree",
    StateID: 3,
  },
  {
    ID: 11,
    Name: "Springdale",
    StateID: 4,
  },
  {
    ID: 12,
    Name: "Rogers",
    StateID: 4,
  },
  {
    ID: 13,
    Name: "Sherwood",
    StateID: 4,
  },
  {
    ID: 14,
    Name: "Jacksonville",
    StateID: 4,
  },
  {
    ID: 15,
    Name: "Cabot",
    StateID: 4,
  },
  {
    ID: 16,
    Name: "Adelanto",
    StateID: 5,
  },
  {
    ID: 17,
    Name: "Glendale",
    StateID: 5,
  },
  {
    ID: 18,
    Name: "Moorpark",
    StateID: 5,
  },
  {
    ID: 19,
    Name: "Needles",
    StateID: 5,
  },
  {
    ID: 20,
    Name: "Ontario",
    StateID: 5,
  },
];

export default {
  getEmployees() {
    return employees;
  },
  getStates() {
    return states;
  },
  getCities() {
    return cities;
  },
};
