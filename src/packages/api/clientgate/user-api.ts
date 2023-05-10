import {ApiResponse, CGResponse, Province, SearchParam, User} from "@/packages/types";
import { AxiosInstance } from "axios";
export const useUserApi = (apiBase: AxiosInstance) => {
  return {
    getUserPermissions: async (): Promise<ApiResponse<User>> => {
      return await apiBase.post<{}, ApiResponse<User>>("SysUser/GetForCurrentUser", {
        ServiceCode: "WEB"
      });
    },
  }
}