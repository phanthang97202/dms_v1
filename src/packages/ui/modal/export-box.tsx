import {PropsWithChildren, useEffect, useState} from "react";
import {useI18n} from "@/i18n/useI18n";
import {ModalBox, ModalBoxProps} from "@packages/ui/modal/confirmation-box";
import RadioGroup from "devextreme-react/radio-group";
import {logger} from "@packages/logger";

export interface ExportConfirmBoxProps extends ModalBoxProps {
  selectedItems: string[]
}
export const ExportConfirmBox = ({control, onYesClick, onNoClick, selectedItems}: ExportConfirmBoxProps) => {
  const { t } = useI18n("Common");
  const [value, setValue] = useState(0);
  
  useEffect((
  ) => {
    logger.debug('re-render')
    if(selectedItems.length === 0) {
      setValue(1);
    }
  }, [selectedItems])

  const items = [
    {
      text: t("All Search results"),
      id: 1
    },
    {
      text: `${t("Current selected items")} (${selectedItems.length})`,
      id: 0,
      disabled: selectedItems.length === 0
    },
  ];

  return (
    <ModalBox
      control={control}
      title={t("Export Excel")}
      onYesClick={onYesClick}
      onNoClick={onNoClick}>
      <ModalBox.Slot name={"Content"}>
        <RadioGroup value={value} 
                    items={items} 
                    valueExpr={'id'} 
                    onValueChanged={(e) => setValue(e.value)} />
      </ModalBox.Slot>
    </ModalBox>
  )
}
