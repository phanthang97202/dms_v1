import { useState } from 'react';
import { Button } from 'devextreme-react/button';
import { FileUploader } from 'devextreme-react/file-uploader';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import { useI18n } from '@/i18n/useI18n';
import { logger } from '@/packages/logger';

type UploadDialogProps = {
  visible: boolean;
  onUpload: (files: File[]) => void;
  onCancel: () => void;
  onDownloadTemplate?: () => void;
};

export const UploadDialog = ({ visible, onUpload, onCancel, onDownloadTemplate }: UploadDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);


  const handleFileSelection = (event: any) => {
    logger.debug('files:', event);
    setFiles(event.value);
  };

  const handleUploadClick = () => {
    logger.debug('upload files:', files);
    onUpload(files);
    setFiles([]);
  };

  const handleCancelClick = () => {
    onCancel();
    setFiles([]);
  };
  const { t } = useI18n("Common");

  return (
    <Popup
      visible={visible}
      dragEnabled={true}
      showTitle={true}
      title={t("Upload Files")}
      onHiding={handleCancelClick}
      height={600}
      width={800}
    >
      <div className="upload-dialog flex items-center justify-center m-8 ">
        <FileUploader
          width={400}
          height={300}
          multiple={false}
          value={files}
          className='bg-gray-200 self-center flex items-center justify-center'
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          uploadMode="useForm"
          onValueChanged={handleFileSelection}
        />
      </div>
      <div className="download-template">
        <Button
          icon='download'
          text={t("Download Template")}
          type="success"
          stylingMode="text"
          onClick={onDownloadTemplate}
        />
      </div>
      <ToolbarItem location='after' toolbar={'bottom'}>
        <Button text={t('Upload')} onClick={handleUploadClick} stylingMode='contained' type="default" />
      </ToolbarItem>
      <ToolbarItem location='after' toolbar={'bottom'}>
        <Button text={t('Cancel')} onClick={handleCancelClick} />
      </ToolbarItem>
    </Popup>
  );
};