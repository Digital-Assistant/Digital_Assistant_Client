/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render search results
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";
import { Empty, List } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import { getRowObject, setToStore } from "../util";

export interface MProps {
  visibility?: boolean;
  data?: any;
  showDetails?: Function;
  addRecordHandler?: Function;
}

/**
 * To render search result elements
 * @returns HTML Elements
 */

export const SearchResults = (props: MProps) => {
  const selectItem = (item: any) => {
    //if (props.addRecordHandler) props.addRecordHandler(true);
    setToStore(item, "selectedRecordedItem", false);
    if (props?.showDetails) props.showDetails(item);
  };

  return !props?.visibility ? null : !props?.data?.length ? (
    <Empty />
  ) : (
    <List
      itemLayout="horizontal"
      dataSource={props?.data}
      renderItem={(item) => (
        <List.Item onClick={() => selectItem(item)}>
          <List.Item.Meta
            title={getRowObject(item)?.sequenceName}
            description={getRowObject(item)?.path}
          />
          <div className="arrow">
            <DoubleRightOutlined />
          </div>
        </List.Item>
      )}
    />
  );
};
