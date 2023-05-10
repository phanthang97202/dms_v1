import { useI18n } from "@/i18n/useI18n";
import { logger } from "@/packages/logger";
import { ErrorMessage, clearErrorAtom, useErrorStore } from "@/packages/store";
import { ScrollView } from "devextreme-react";
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import { useSetAtom } from "jotai";

import { useEffect, useState } from "react";


const ErrorDetail = ({ error }: { error: ErrorMessage; }) => {
  logger.debug('error:', error);
  const { t } = useI18n("Error");
  return (
    <div>
      {!!error.debugInfo &&
        (
          <div className="error__debuginfo">
            <div className="error__debuginfo-title">
              {t("Debug information")}
            </div>
            {Object.entries(error.debugInfo).map(([key, value]) => {
              return (
                <div key={key}>
                  <div className="error__debuginfo__key">{key}:{JSON.stringify(value, null, 2)}</div>
                </div>
              );
            })}

          </div>
        )
      }
      {
        !!error.errorInfo &&
        (
          <div className="error__excresult">
            <div className="error__excresult-title">
              {t("Exception result")}
            </div>
            {Object.entries(error.errorInfo).map(([key, value]) => {
              return (
                <div key={key}>
                  <div className="error__excresult__key">{key}:{JSON.stringify(value, null, 2)}</div>
                </div>
              );
            })}
          </div>
        )
      }
      {JSON.stringify(error)}
    </div>
  );
};
export default function Error() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<"short" | "full">("short");
  const viewModeSizes = {
    "short": {
      width: 500,
      height: 300,
    },
    "full": {
      width: 500,
      height: 600
    }
  };

  const { t } = useI18n("Error");
  const { errors } = useErrorStore();
  const clear = useSetAtom(clearErrorAtom);
  const hasErrors = !!errors && errors.length > 0;


  const handleClose = () => {
    setOpen(false);
    clear();
  };

  const handleZoom = () => {
    setSize(size === "short" ? "full" : "short");
  };

  useEffect(() => {
    setOpen(errors.length > 0);
  }, [errors]);

  const title = t("An error message occurred!");

  return (
    <Popup
      titleRender={(item: any) => (
        <div className="error-title">
          <i className="dx-icon-warning"></i>
          {title}
        </div>
      )}
      // container=".dx-viewport"
      visible={hasErrors}
      position={'center'}
      width={viewModeSizes[size].width}
      height={viewModeSizes[size].height}
    >
      <Position
        at="bottom"
        my="center"
      />
      <ToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        options={{
          text: t(size === "short" ? 'View Detail' : "Collapse"),
          onClick: handleZoom,
          stylingMode: 'contained'
        }}
      />
      <ToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        options={{
          text: t('Close'),
          onClick: handleClose
        }}
      />
      <ScrollView width='100%' height='100%' useNative>
        <div className="error-body">
          {errors.map((item, index) => {
            if (item) {
              return (
                <div className="error-item" key={index}>
                  <div className="error__main">
                    {item.message}
                  </div>
                  {size === "full" &&
                    <div className="error__detail">
                      <ErrorDetail error={item} />
                    </div>
                  }
                </div>
              );
            }
          })}
        </div>
      </ScrollView>

    </Popup>
  );
}
