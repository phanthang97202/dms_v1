import CustomStore from "devextreme/data/custom_store";
import { createClientGateApi } from "@packages/api/clientgate-api";
import { useAuth } from "@packages/contexts/auth";
import { logger } from "@packages/logger";
import notify from "devextreme/ui/notify";
import { CGResult, Province, SearchParam } from "@packages/types";
import { useI18n } from "@/i18n/useI18n";
import { GroupDescriptor, LoadOptions } from "devextreme/data";

export const useProvinceDataSource = () => {
  const { auth: { currentUser, networkId, orgData, clientGateUrl } } = useAuth();
  const { m } = useI18n("Common");

  const clientGateApi = createClientGateApi(currentUser!, clientGateUrl!, networkId, orgData?.Id!);
  return new CustomStore({
    key: 'ProvinceCode',
    onUpdating(key: string, values: any) {
      logger.debug('onUpdating:', key, values);
      values.FlagActive = !!values.FlagActive ? "1" : "0";
    },
    update: async (key: string, values: any) => {
      logger.debug('update values:', values);
      try {
        const response = await clientGateApi.updateProvince(key, values);
        if (response.isSuccess) {
          notify(m('DataSavedSuccessfully'), 'success');
        } else {
          notify(m(response.Data._strErrCode), 'error');
          throw new Error(m('DataSavingError'));
        }
      } catch (e) {
        notify(m('DataSavingError'), 'error');
        throw new Error(m('DataSavingError'));
      }
    },
    insert: async (values: Partial<Province>) => {
      logger.debug('inserted values:', values);
      try {
        const response = await clientGateApi.createProvince(values);
        if (response.isSuccess) {
          notify(m('DataSavedSuccessfully'), 'success');
          return values;
        } else {
          notify(m(response.Data._strErrCode), 'error');
          throw new Error("");
        }
      } catch (e) {
        notify(m('DataSavingError'), 'error');
        throw new Error("");
      }
    },
    load(loadOptions: LoadOptions<Province>) {
      logger.debug('loadOptions:', loadOptions);
      const { take, skip, userData, searchValue, filter, group } = loadOptions;
      let keyword = userData ? userData.keyword : "";
      if (filter && filter.length > 0) {
        keyword = filter[0].filterValue;
      }
      const params = {
        KeyWord: keyword ?? "",
        FlagActive: "",
        Ft_PageSize: take,
        Ft_PageIndex: skip ? Math.floor(skip / (take ?? 1)) : 0
      } as SearchParam;

      const key = `provinces`;


      if (group) {
        const selector = (group as any)[0].selector as keyof Province;
        const cachedData: CGResult<Province> = JSON.parse(localStorage.getItem(key) as string) as any;
        // group data by selector and return distinct values
        const groupedData = cachedData.DataList.reduce((acc, cur) => {
          const value = cur[selector];
          const existingItem = acc.find((item) => item[selector] === value);
          if (!existingItem) {
            acc.push({ [selector]: value, count: 1 });
          } else {
            existingItem.count++;
          }
          return acc;
        }, [] as any[]);
        logger.debug('grouped data:', groupedData);
        return Promise.resolve({
          data: groupedData.map(item => ({ key: `${item[selector]} (${item.count})`, count: item.count })),
          totalCount: groupedData.length
        });
      }

      return clientGateApi.getProvinces(params)
        .then((data) => {
          if (data.isSuccess) {
            // cache the result
            localStorage.setItem(key, JSON.stringify(data.Data._objResult));
            return {
              data: data.Data._objResult.DataList,
              totalCount: data.Data._objResult.ItemCount
            };
          } else {
            notify(m('DataLoadingError'), 'error');
          }
        })
        .catch((e) => { console.log(e); throw new Error('Data Loading Error'); });
    },
  });
};