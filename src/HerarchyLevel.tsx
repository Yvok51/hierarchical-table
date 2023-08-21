import { Fragment } from "react";
import { ChildRecord, TableItem } from "./TableData";
import ExpandButton from "./ExpandButton";
import "./assets/css/HierarchicalTable.css";

export default function HierarchyLevel({
  items,
  level,
  updateTable,
}: {
  items: TableItem[];
  level: number;
  updateTable: (data: TableItem[]) => void;
}) {
  const dataKeys = getKeys(items.map((item) => item.data));

  const expandHeader = <th key="expandHeader">Expand</th>;
  const dataHeaders = dataKeys.map((key) => <th key={key}>{key}</th>);
  const deleteHeader = <th key="deleteHeader">Delete</th>;

  function checkIntegrity(item: TableItem) {
    if (item.children !== null && item.children.records.length == 0) {
      return { ...item, children: null };
    }
    return item;
  }

  function deleteItem(item: TableItem) {
    let data = [...items];
    data.splice(data.indexOf(item), 1);
    updateTable(data);
  }

  function updateItem(item: TableItem, newItem: TableItem) {
    let data = [...items];
    data[data.indexOf(item)] = checkIntegrity(newItem);
    updateTable(data);
  }

  function getUUID(item: TableItem, idx: number) {
    return `${idx}-${level}-${item.data["ID"]}`;
  }

  const rows = items.map((item, idx) => {
    const values = dataKeys.map((key) => item.data[key]);
    const updateRow = (record: ChildRecord) => {
      updateItem(item, { data: item.data, children: record });
    };

    // item.children !== null ~ is expandable (typescript doesn't allow me to introduce a variable)
    const expandButton =
      item.children !== null ? (
        <ExpandButton
          key="expand"
          childRecord={item.children}
          updateRow={updateRow}
        ></ExpandButton>
      ) : (
        <td key="expand"></td>
      );

    const valueCells = values.map((value, idx) =>
      value ? <td key={idx}>{value}</td> : <td key={idx}></td>
    );

    const deleteButton = (
      <td key="delete" onClick={() => deleteItem(item)}>
        ❌
      </td>
    );

    const currentRow = // Presumes all items have "ID" field (which example data do)
      (
        <tr key={getUUID(item, idx)} data-level={level}>
          {expandButton}
          {valueCells}
          {deleteButton}
        </tr>
      );

    if (item.children !== null && item.children.expanded) {
      return (
        <Fragment key={`fragment-${getUUID(item, idx)}`}>
          {currentRow}
          <HierarchyLevel
            key={`subtable-${getUUID(item, idx)}`}
            items={item.children.records}
            updateTable={(data) => {
              updateRow({ expanded: item.children!.expanded, records: data });
            }}
            level={level + 1}
          />
        </Fragment>
      );
    } else {
      return currentRow;
    }
  });

  return (
    <>
      <tr
        key={`header-${items.map((item) => getUUID(item, -1)).join("|")}`}
        data-level={level}
      >
        {expandHeader} {dataHeaders} {deleteHeader}
      </tr>
      {rows}
    </>
  );
}

function getKeys(items: {}[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    for (const key in item) {
      set.add(key);
    }
  }
  return Array.from(set.values());
}
