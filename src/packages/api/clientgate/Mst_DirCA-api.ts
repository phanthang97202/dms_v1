import { ApiResponse, SearchParam, DirCA } from "@packages/types";
import { AxiosInstance } from "axios";

export const useDirCAApi = (apiBase: AxiosInstance) => {
  return {
    getDirCA: async (params: SearchParam): Promise<ApiResponse<DirCA>> => {
      return await apiBase.post<SearchParam, ApiResponse<DirCA>>(
        "/DlrCA/Search",
        {
          ...params,
        }
      );
    },
    createDirCA: async (data: Partial<DirCA>): Promise<ApiResponse<DirCA>> => {
      return await apiBase.post<Partial<DirCA>, ApiResponse<DirCA>>(
        "/DlrCA/Create",
        {
          strJson: JSON.stringify(data),
        }
      );
    },

    deleteDirCA: async (AutoId: string) => {
      return await apiBase.post<SearchParam, ApiResponse<DirCA>>(
        "/DlrCA/Delete",
        {
          AutoId,
        }
      );
    },
    deleteDirCAs: async (keys: string[]) => {
      return await apiBase.post<SearchParam, ApiResponse<DirCA>>(
        "/DlrCA/DeleteMultiple",
        {
          strJson: JSON.stringify(
            keys.map((item) => ({
              AutoId: item,
            }))
          ),
        }
      );
    },
    updateDirCA: async (
      key: string,
      dirca: Partial<DirCA>
    ): Promise<ApiResponse<DirCA>> => {
      return await apiBase.post<Partial<DirCA>, ApiResponse<DirCA>>(
        "/DlrCA/Update",
        {
          strJson: JSON.stringify({
            AutoId: key,
            ...dirca,
          }),
          ColsUpd: Object.keys(dirca),
        }
      );
    },
    uploadDirCA: async (file: File): Promise<ApiResponse<any>> => {
      const form = new FormData();
      form.append("file", file); // file is the file you want to upload
      return await apiBase.post<File, ApiResponse<any>>("/DlrCA/Import", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    downloadDirCA: async (): Promise<ApiResponse<any>> => {
      return await apiBase.post<Partial<DirCA>, ApiResponse<string>>(
        "/DlrCA/ExportTemplate",
        {}
      );
    },
    exportDirCA: async (
      keys: string[],
      keyword?: string
    ): Promise<ApiResponse<any>> => {
      if (keys.length > 0) {
        return await apiBase.post<Partial<DirCA>, ApiResponse<string>>(
          "/DlrCA/ExportByListAutoId",
          {
            ListAutoId: keys.join(","),
          }
        );
      } else {
        return await apiBase.post<Partial<DirCA>, ApiResponse<string>>(
          "/DlrCA/Export",
          {
            KeyWord: keyword,
            FlagActive: "",
          }
        );
      }
    },
  };
};
