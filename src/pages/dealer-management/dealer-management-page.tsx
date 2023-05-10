import { HeaderForm } from "@packages/ui/header-form/header-form";

import { PageHeaderLayout } from "@layouts/page-header-layout";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import { BaseGridView, ColumnOptions } from "@packages/ui/base-gridview";
import { useMemo, useRef } from "react";
import notify from 'devextreme/ui/notify';


import './dealer-management.scss';
import { useDealerDataSource } from "@packages/datasources";
import { StatusButton } from "@packages/ui/status-button";
import { useClientgateApi } from "@/packages/api";
import { useI18n } from "@/i18n/useI18n";


export const DealerManagementPage = () => {
    const { t } = useI18n("Common");
    const dataSource = useDealerDataSource();

    const clientgateApi = useClientgateApi();
    let gridRef: any = useRef(null);

    const columns: ColumnOptions[] = [
        {
            dataField: 'DealerCode',
            caption: t('DealerCode'),
            visible: true
        },
        {
            dataField: 'DealerName',
            caption: t('DealerName'),
            visible: true
        },
        {
            dataField: 'DealerScale',
            caption: t('DealerScale'),
            visible: true,
        },
        {
            dataField: 'CompanyName',
            caption: t('CompanyName'),
            visible: true,
            width: 100
        },
        {
            dataField: 'CompanyAddress',
            caption: t('CompanyAddress'),
            visible: true,
        },

        {
            dataField: 'FlagActive',
            caption: t('status'),
            editorType: 'dxSwitch',
            visible: true,
            width: 100,
            cellRender: ({ data }: any) => {
                return (
                    <StatusButton isActive={data.FlagActive === "1"} />
                );
            }
        }
    ];
    const handleSearch = async (keyword: string) => {
        if (gridRef.instance) {
            gridRef.instance.searchByText(keyword);
        }
    };
    const handleUploadFile = async (file: File, progressCallback: Function) => {
        console.log('uploaded file:', file);
        const resp = await clientgateApi.uploadDealerFile(file);
        console.log('result:', resp);
        if (resp.isSuccess) {
            notify(t('uploadSuccess'), "success");
        } else {
            notify(t(resp.Data._strErrCode), {
                position: {
                    top: 0
                },
                direction: 'down-push'
            });
        }
    };
    return (
        <AdminContentLayout className={'province-management'}>
            <AdminContentLayout.Slot name={'Header'}>
                <PageHeaderLayout>
                    <PageHeaderLayout.Slot name={'Before'}>
                        <div className="font-bold dx-font-m">
                            {t('dealerManagement')}
                        </div>
                    </PageHeaderLayout.Slot>
                    <PageHeaderLayout.Slot name={'Center'}>
                        <HeaderForm onSearch={handleSearch}
                            onUploadFile={handleUploadFile}
                        />
                    </PageHeaderLayout.Slot>
                </PageHeaderLayout>
            </AdminContentLayout.Slot>
            <AdminContentLayout.Slot name={'Content'}>
                <BaseGridView
                    dataSource={dataSource}
                    columns={columns}
                    inlineEditMode="popup"
                    onReady={(ref) => gridRef = ref}
                    allowSelection={true} />
            </AdminContentLayout.Slot>
        </AdminContentLayout>
    );
}

