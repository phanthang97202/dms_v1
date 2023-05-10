import {PropsWithChildren} from "react";
import {useI18n} from "@/i18n/useI18n";
import {ModalBox, ModalBoxProps} from "@packages/ui/modal/confirmation-box";

export const DeleteConfirmationBox = ({control, onYesClick, onNoClick}: PropsWithChildren<ModalBoxProps>) => {
  const { t } = useI18n("Common");
  return (
    <ModalBox
      control={control}
      title={t("Are you sure to delete selected items?")}
      onYesClick={onYesClick}
      onNoClick={onNoClick}>
      <ModalBox.Slot name={"Content"}>
        {t("This action cannot be undone. Are you sure you want to delete selected items?")}
      </ModalBox.Slot>
    </ModalBox>
  )
}
