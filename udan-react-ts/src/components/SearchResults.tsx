/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render search results
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";

import { getRowObject, setToStore } from "../util";

export interface MProps {
  visibility?: boolean;
  data?: any;
  showDetails?: Function;
}

/**
 * To render search result elements
 * @returns HTML Elements
 */

export const SearchResults = (props: MProps) => {
  const selectItem = (item: any) => {
    setToStore(item, "selectedRecordedItem", false);
    if (props?.showDetails) props.showDetails(item);
  };

  const renderData = () => {
    if (!props?.visibility) return;
    if (!props?.data?.length) {
      return (
        <div className="uda-no-results">
          <p>No results found</p>
        </div>
      );
    }
    return props?.data?.map((item: any) => {
      const _row = getRowObject(item);
      return (
        <div className="uda-card" onClick={() => selectItem(item)}>
          <h5>{_row.sequenceName}</h5>
          <i>{_row.path}</i>
        </div>
      );
    });
  };

  return renderData();
};
