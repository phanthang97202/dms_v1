import CustomStore from "devextreme/data/custom_store";
import { createClientGateApi } from "@packages/api/clientgate-api";
import { useAuth } from "@packages/contexts/auth";
import { logger } from "@packages/logger";
import notify from "devextreme/ui/notify";
import { Area, CGResult, Province, SearchParam } from "@packages/types";
import { useI18n } from "@/i18n/useI18n";
import { GroupDescriptor, LoadOptions } from "devextreme/data";

export const useAreaDataSource = () => {
  const { auth: { currentUser, networkId, orgData, clientGateUrl } } = useAuth();
  const { m } = useI18n("Common");

  const clientGateApi = createClientGateApi(currentUser!, clientGateUrl!, networkId, orgData?.Id!);
  return new CustomStore<Area>({
    key: 'AreaCode',
    byKey: (key: string) => {
      return clientGateApi.getArea(key).then(data => {
        logger.debug('response:', data);
        if (data.isSuccess) {
          return data.Data._objResult[0];
        } else {
          throw new Error('');
        }
      }).catch(e => {
        throw new Error('');
      });
    },
    load(loadOptions: LoadOptions<Area>) {
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

      const key = `areas`;
      return clientGateApi.getAreas(params)
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