import { useState, useEffect } from "react";
import { TableItem, ServerTableItem, decorateTableData } from "./TableData";
import HierarchyLevel from "./HerarchyLevel";
import "./assets/css/HierarchicalTable.css";

export default function HierarchicalTable() {
  const [tableData, setTableData] = useState<TableItem[]>([]);

  useEffect(() => {
    let ignore = false;
    fetch("/example-data.json")
      .then((response) => response.json())
      .then((result: ServerTableItem[]) => {
        const data = decorateTableData(result);
        insertOffsetRules(getDeepestChildLevel(data));
        if (!ignore) setTableData(data);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <table>
      <tbody>
        <HierarchyLevel
          items={tableData}
          updateTable={(data) => {
            setTableData(data);
          }}
          level={0}
        />
      </tbody>
    </table>
  );
}

function insertOffsetRules(to: number) {
  let sheet = window.document.styleSheets[0];
  for (let i = 0; i <= to; i++) {
    sheet.insertRule(
      `[data-level="${i}"] { position: relative; left: ${i * 10}px; }`
    );
  }
}

function getDeepestChildLevel(data: TableItem[]): number {
  let maxLevel = 0;
  for (const item of data) {
    const deepestLevel =
      item.children !== null
        ? getDeepestChildLevel(item.children.records) + 1
        : 0;
    maxLevel = Math.max(maxLevel, deepestLevel);
  }
  return maxLevel;
}
