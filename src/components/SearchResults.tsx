/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render search results
 * Associated Route/Usage: *
 */

import React, {useEffect, useState} from "react";
import {Button, Empty, List} from "antd";
import {DoubleRightOutlined, PlayCircleOutlined, EyeOutlined} from "@ant-design/icons";
import { setToStore } from "../util";
import InfiniteScroll from "react-infinite-scroller";
import {CONFIG} from "../config";
import {getRowObject} from "../util/getRowObject";

export interface MProps {
  visibility?: boolean;
  data?: any;
  searchKeyword?: string;
  showDetails?: Function;
  addRecordHandler?: Function;
  searchHandler?: Function;
  page?: number;
  config?: any;
  playHandler?: Function;
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

  const selectItem = (item: any, play=false) => {
    setToStore(item, CONFIG.SELECTED_RECORDING, false);
    if (props?.showDetails) props.showDetails(item);

    if(play){
      props.playHandler("on");
    }
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
          <List.Item className="uda_exclude" actions={[
            <Button shape="circle" icon={<PlayCircleOutlined className="secondary" />} onClick={() => selectItem(item, true)}></Button>,
            <Button shape="round" icon={<EyeOutlined className="secondary" />} onClick={() => selectItem(item)}>
              View
            </Button>]}>
            <List.Item.Meta
              title={getRowObject(item)?.sequenceName}
              description={getRowObject(item)?.path}
            />
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
