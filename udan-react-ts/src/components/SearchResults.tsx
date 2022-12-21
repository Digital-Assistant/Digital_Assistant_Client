/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render search results
 * Associated Route/Usage: *
 */

import React, {useEffect, useState} from "react";
import { Empty, List } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import { getRowObject, setToStore } from "../util";
import InfiniteScroll from "react-infinite-scroller";
import {CONFIG} from "../config";

export interface MProps {
  visibility?: boolean;
  data?: any;
  searchKeyword?: string;
  showDetails?: Function;
  addRecordHandler?: Function;
  searchHandler?: Function;
  page?: number;
  config?: any;
}

let globalSearchResults: any = [];
/**
 * To render search result elements
 * @returns HTML Elements
 */

export const SearchResults = (props: MProps) => {
  const [searchResults, setSearchResults] = useState<any>([]);

  useEffect(() => {
    if (props?.searchKeyword) globalSearchResults = [];
    globalSearchResults = [...globalSearchResults, ...props?.data];
    setSearchResults([...globalSearchResults]);
  }, [props?.data]);

  const selectItem = (item: any) => {
    setToStore(item, CONFIG.SELECTED_RECORDING, false);
    if (props?.showDetails) props.showDetails(item);
  };

  const loadSearchResults = () => {
    if (props?.searchHandler)
      props.searchHandler(
        props?.page ? (props?.page === 1 ? 2 : props.page + 1) : 1
      );
  };

  const renderData = () => {
    if (!props?.visibility) return <></>;
    return !props?.visibility ? null : !props?.data?.length ? (
      <Empty description={"No results found"} />
    ) : (
      <List
        itemLayout="horizontal"
        dataSource={props?.data}
        renderItem={(item) => (
          <List.Item onClick={() => selectItem(item)} className="uda_exclude">
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

  // return renderData();
  return (
    <>
      {!searchResults?.length && (
        <div className="uda-no-results">
          <Empty description={"No results found"} />
        </div>
      )}
      {searchResults?.length > 0 && (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadSearchResults}
          hasMore={CONFIG.enableInfiniteScroll && searchResults.length > CONFIG.enableInfiniteScrollPageLength}
          useWindow={false}
        >
          {renderData()}
        </InfiniteScroll>
      )}
    </>
  );
};
