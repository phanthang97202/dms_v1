import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Popup, { ToolbarItem, Position } from "devextreme-react/popup";
import List from "devextreme-react/list";

interface CustomColumnChooserProps {
  title: string;
  applyText: string;
  cancelText: string;
  selectAllText: string;
  container: any;
  button: any;
  visible: boolean;
  columns: any[];
  onHiding: () => void;
  onApply: (columns: any[]) => void;
}
export default function CustomColumnChooser(props: CustomColumnChooserProps) {
  const {
    container,
    button,
    visible,
    columns,
    onHiding,
    onApply,
    applyText,
    cancelText,
    title,
    selectAllText,
  } = props;

  const listRef = useRef<List>(null);

  const onPopupHiding = useCallback(() => {
    onHiding();
  }, [onHiding]);

  const columnsList = useMemo(() => {
    return columns.map((column) => captionize(column.dataField));
  }, [columns]);

  const [selectedItems, setSelectedItems] = useState(
    columns
      .filter((column) => column.visible)
      .map((column) => captionize(column.dataField))
  );

  useEffect(() => {
    setSelectedItems(
      columns
        .filter((column) => column.visible)
        .map((column) => captionize(column.dataField))
    );
  }, [columns, setSelectedItems]);

  const onSelectionChanged = useCallback(
    (e: any) => {
      setSelectedItems(e.component.option("selectedItems"));
    },
    [setSelectedItems]
  );

  const applyButtonOptions = useMemo(() => {
    return {
      text: applyText,
      stylingMode: "contained",
      onClick: () => {
        const selectedItems =
          listRef.current?.instance?.option("selectedItems");

        let changes: any[] = [];
        columns.forEach((column) => {
          let isSelected = selectedItems?.includes(
            captionize(column.dataField)
          );
          if (column.visible !== isSelected) {
            changes.push({
              ...column,
              visible: isSelected,
            });
          }
        });
        onApply(changes);
      },
    };
  }, [listRef, columns, onApply]);

  const cancelButtonOptions = useMemo(() => {
    return {
      text: cancelText,
      stylingMode: "outlined",
      onClick: () => {
        setSelectedItems(
          columns
            .filter((column) => column.visible)
            .map((column) => captionize(column.dataField))
        );
        onHiding();
      },
    };
  }, [columns, onHiding, setSelectedItems]);

  return (
    <Popup
      container={container}
      title={title}
      className={"column-chooser"}
      width={250}
      height={350}
      resizeEnabled={false}
      shading={false}
      showCloseButton={false}
      dragEnabled={false}
      visible={visible}
      onHiding={onPopupHiding}
    >
      <Position at="right top" my="right top" of={`${container} ${button}`} />

      <List
        ref={listRef}
        dataSource={columnsList}
        searchEnabled={false}
        selectionMode="all"
        selectAllText={selectAllText}
        showSelectionControls={true}
        selectedItems={selectedItems}
        onSelectionChanged={onSelectionChanged}
      />

      <ToolbarItem
        widget="dxButton"
        location="center"
        toolbar="bottom"
        options={applyButtonOptions}
      />

      <ToolbarItem
        widget="dxButton"
        location="center"
        toolbar="bottom"
        options={cancelButtonOptions}
      />
    </Popup>
  );
}

const DIGIT_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function captionize(name: string) {
  const captionList = [];
  let i;
  let char;
  let isPrevCharNewWord = false;
  let isNewWord = false;

  for (i = 0; i < name.length; i++) {
    char = name.charAt(i);
    isNewWord =
      (char === char.toUpperCase() &&
        char !== "-" &&
        char !== ")" &&
        char !== "/") ||
      char in DIGIT_CHARS;
    if (char === "_" || char === ".") {
      char = " ";
      isNewWord = true;
    } else if (i === 0) {
      char = char.toUpperCase();
      isNewWord = true;
    } else if (!isPrevCharNewWord && isNewWord) {
      if (captionList.length > 0) {
        captionList.push(" ");
      }
    }
    captionList.push(char);
    isPrevCharNewWord = isNewWord;
  }
  return captionList.join("");
}
