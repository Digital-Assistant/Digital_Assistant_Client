/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render search results
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import { Empty, List } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import { getRowObject, setToStore } from "../util";
import InfiniteScroll from "react-infinite-scroller";
// import { fetchSearchResults } from "../services/searchService";

export interface MProps {
  visibility?: boolean;
  data?: any;
  searchKeyword?: string;
  showDetails?: Function;
  addRecordHandler?: Function;
  searchHandler?: Function;
  page?: number;
}

let globalSearchResults: any = [];
/**
 * To render search result elements
 * @returns HTML Elements
 */

export const SearchResults = (props: MProps) => {
  const [searchResults, setSearchResults] = React.useState<any>([]);

  React.useEffect(() => {
    if (props?.searchKeyword) globalSearchResults = [];
    globalSearchResults = [...globalSearchResults, ...props?.data];
    setSearchResults([...globalSearchResults]);
  }, [props?.data]);

  const selectItem = (item: any) => {
    //if (props.addRecordHandler) props.addRecordHandler(true);
    setToStore(item, "selectedRecordedItem", false);
    if (props?.showDetails) props.showDetails(item);
  };

  const loadSearchResults = () => {
    if (props?.searchHandler)
      props.searchHandler(
        props?.page ? (props?.page === 1 ? 2 : props.page + 1) : 1
      );
  };

  const renderData = () => {
    if (!props?.visibility) return;
    return !props?.visibility ? null : !props?.data?.length ? (
      <Empty description={"No results found"} />
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
          hasMore={searchResults.length > 10 && searchResults.length < 100}
          useWindow={false}
        >
          {renderData()}
        </InfiniteScroll>
      )}
    </>
  );
};
