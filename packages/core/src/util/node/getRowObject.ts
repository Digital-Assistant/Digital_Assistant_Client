import {getClickedNodeLabel} from "./getClickedNodeLabel";

/**
 * Processes search result data to generate a displayable row object.
 * This function creates a concise representation of a search result, including a sequence name
 * and a path derived from user click nodes.
 *
 * @param data The search result data object. It is expected to have `userclicknodesSet` and `name` properties.
 * @returns An object containing `sequenceName` and `path`, suitable for rendering in a search result list.
 */
export const getRowObject = (data: any) => {
  let path = "";
  // Generate a path string from the first 5 user click nodes.
  for (let [index, row] of data.userclicknodesSet.entries()) {
    if (index < 5) {
      if (path !== "") {
        path += " >> ";
      }
      // Use `getClickedNodeLabel` to get a descriptive label for each node.
      path += getClickedNodeLabel(row);
    }
  }

  let sequenceName: string;
  try {
    // The sequence name can be a JSON string, so it needs to be parsed.
    const names = JSON.parse(data.name || '[]');
    // The name can be a simple string or an object with a 'label' property.
    if (typeof names[0] === 'object' && 'label' in names[0]) {
      sequenceName = names[0].label;
    } else {
      sequenceName = names[0];
    }
  } catch (e) {
    // If parsing fails, fall back to using the raw name.
    sequenceName = data.name.toString();
  }

  // Truncate the sequence name if it's too long.
  if (sequenceName.length > 50) {
    sequenceName = sequenceName.substring(0, 50);
  }

  // Return the formatted sequence name and path.
  return {sequenceName, path};
};
