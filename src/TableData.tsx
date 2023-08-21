interface InstanceData {
  [key: string]: string;
}

export interface ChildRecord {
  records: TableItem[];
  expanded: boolean;
}

export interface ServerChildRecord {
  [key: string]: { records: ServerTableItem[] };
}

export interface TableItem {
  data: InstanceData;
  children: ChildRecord | null;
}

export interface ServerTableItem {
  data: InstanceData;
  children: ServerChildRecord;
}

function decorateRecord(record: ServerChildRecord): ChildRecord | null {
  // Concat all the different types of children together as the assessment description does not mention this
  // (would have to be reworked if that is not desirable along with the expand buttons)
  let children: TableItem[] = [];
  for (const type in record) {
    children = children.concat(decorateTableData(record[type].records));
  }
  return children.length === 0 ? null : { records: children, expanded: false };
}

export function decorateTableData(data: ServerTableItem[]): TableItem[] {
  return data.map((item) => {
    return {
      data: item.data,
      children: decorateRecord(item.children),
    };
  });
}
