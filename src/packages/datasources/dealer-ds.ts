import CustomStore from "devextreme/data/custom_store";
import { createClientGateApi } from "@packages/api/clientgate-api";
import { useAuth } from "@packages/contexts/auth";
import { logger } from "@packages/logger";
import notify from "devextreme/ui/notify";
import { SearchParam } from "../types";
import { useI18n } from "@/i18n/useI18n";

export const useDealerDataSource = () => {
    const { auth: { currentUser, networkId, orgData, clientGateUrl } } = useAuth();
    const { m } = useI18n("Common");

    const clientGateApi = createClientGateApi(currentUser!, clientGateUrl!, networkId, orgData?.Id!);

    return new CustomStore({
        key: 'DealerCode',
        update: async (key: string, values: any) => {
            console.log('item:', key, values);
            const resp = await clientGateApi.updateDealer(key, values);
            if (resp.isSuccess) {
                notify(m('UpdatedSuccessfully'), 'success');
                return true;
            } else {
                notify(m(resp.Data._strErrCode), 'error');
                return false;
            }

        },
        remove: async (code: any) => {
            logger.debug('deleting record:', code);
            try {
                const response = await clientGateApi.deleteDealer(code);
                if (response.isSuccess) {
                    notify(m('DeletedSuccessfully'), 'success');
                } else {
                    notify(m(response.Data._strErrCode), 'error');
                }
            } catch (e) {
                logger.debug('error:', e);
            }
        },
        load(loadOptions) {
            logger.debug('loadOptions:', loadOptions);
            const { take, skip, userData, searchValue, filter } = loadOptions;
            let keyword = userData.keyword;
            if (filter && filter.length > 0) {
                keyword = filter[0].filterValue;
            }
            if (userData.keyword) {
                keyword = userData.keyword;
            }
            const params = {
                KeyWord: keyword ?? "",
                FlagActive: "",
                Ft_PageSize: take,
                Ft_PageIndex: skip ? Math.floor(skip / (take ?? 1)) : 0
            } as SearchParam;
            return clientGateApi.getDealers(params)
                .then((data) => {
                    console.log('data from api:', data);
                    if (data.isSuccess) {
                        return ({
                            data: data.Data._objResult.DataList,
                            totalCount: data.Data._objResult.ItemCount,
                        });
                    } else {
                        notify(m('DataLoadingError'), 'error');
                        throw new Error(m(data.Data._strErrCode));
                    }
                })
                .catch((e) => { console.log(e); throw new Error('Data Loading Error'); });
        },
    });
};
