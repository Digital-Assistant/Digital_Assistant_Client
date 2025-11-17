import {getClickedNodeLabel} from "./getClickedNodeLabel";

/**
 * to render search result rows
 */
export const getRowObject = (data: any) => {
  let path = "";
  for (let [index, row] of data.userclicknodesSet.entries()) {
    if (index < 5) {
      if (path !== "") {
        path += " >> ";
      }
      // path += row.clickednodename;
      path += getClickedNodeLabel(row);
    }
  }
  let sequenceName: string;
  try {
    const names = JSON.parse(data.name || '[]');
    if (typeof names[0] === 'object' && 'label' in names[0]) {
      sequenceName = names[0].label;
    } else {
      sequenceName = names[0];
    }
  } catch (e) {
    sequenceName = data.name.toString();
  }
  if (sequenceName.length > 50) {
    sequenceName = sequenceName.substring(0, 50);
  }
  return {sequenceName, path};
};
