import { ChildRecord } from "./TableData";

export default function ExpandButton({
  childRecord,
  updateRow,
}: {
  childRecord: ChildRecord;
  updateRow: (record: ChildRecord) => void;
}) {
  function clickExpandButton() {
    updateRow({ ...childRecord, expanded: !childRecord.expanded });
    // currently all children remain expanded/collapsed as before
    // If we would want to collapse all children when collapsing the parent, then we would have to walk the tree
  }

  return childRecord.expanded ? (
    <td>
      <span onClick={clickExpandButton}>▼</span>
    </td>
  ) : (
    <td>
      <span onClick={clickExpandButton}>▶</span>
    </td>
  );
}
