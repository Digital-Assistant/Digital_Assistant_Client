/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render common modal/lite window
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";

import { getRowObject } from "../util";

export interface MProps {
  visibility?: boolean;
  data?: any;
}

/**
 * To render search result elements
 * @returns HTML Elements
 */

export const SearchResults = (props: MProps) => {
  const renderData = () => {
    if (!props?.visibility) return;
    return props?.data?.map((item: any) => {
      const _row = getRowObject(item);
      return (
        <div className="uda-card">
          <h5>{_row.sequenceName}</h5>
          <i>{_row.path}</i>
        </div>
      );
    });
  };

  return renderData();
};
