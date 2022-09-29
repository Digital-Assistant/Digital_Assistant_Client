/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render search results
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";
import { getRowObject, setToStore } from "../util";
import InfiniteScroll from "react-infinite-scroller";
import { fetchSearchResults } from "../services/searchService";

export interface MProps {
  visibility?: boolean;
  data?: any;
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
        "",
        props?.page ? (props?.page === 1 ? 2 : props.page + 1) : 1
      );
  };

  const renderData = () => {
    if (!props?.visibility) return;
    return searchResults?.map((item: any, index: number) => {
      const _row = getRowObject(item);
      return (
        <div
          className="uda-card"
          onClick={() => selectItem(item)}
          key={`${index}-search-result`}
        >
          <h5>{_row.sequenceName}</h5>
          <i>{_row.path}</i>
        </div>
      );
    });
  };

  // return renderData();
  return (
    <>
      {!searchResults?.length && (
        <div className="uda-no-results">
          <p>No results found</p>
        </div>
      )}
      {searchResults?.length > 0 && (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadSearchResults}
          hasMore={searchResults.length < 100}
          useWindow={false}
        >
          {renderData()}
        </InfiniteScroll>
      )}
    </>
  );
};
