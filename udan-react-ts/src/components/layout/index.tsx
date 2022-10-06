/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render layout components
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../../App.scss";
import { fetchSearchResults } from "../../services/searchService";
// import logo from "../../logo.svg";
import {
  BsChevronDoubleRight,
  BsPlusLg,
  BsChevronDoubleLeft,
} from "react-icons/bs";
export interface MProps {
  searchHandler?: Function;
  toggleFlag: boolean;
  toggleHandler?: Function;
  addRecordBtnStatus?: boolean;
  i18?: any;
}

export const Toggler = (props: MProps) => {
  const toggle = () => {
    if (props.toggleHandler) props.toggleHandler();
  };
  return (
    <div
      className="default-logo exclude"
      style={{ display: !props?.toggleFlag ? "none" : "block" }}
      onClick={() => toggle()}
    >
      <img className="uda_exclude" src={getLogo()} alt={"udan logo"} />
      <span className="arrow">
        <BsChevronDoubleLeft size={16} />
      </span>
    </div>
  );
};

/**
 *
 * @returns logo path
 */
function getLogo() {
  // if (window?.chrome) {
  //   console.log(window?.chrome?.runtime?.getURL(logo));
  //   return window?.chrome?.runtime?.getURL(logo);
  // }
  return "https://cdn.statically.io/gh/Digital-Assistant/Digital_Assistant_Client/react-typescript/udan-react-ts/src/logo.svg";
}

/**
 * To render search result elements
 * @returns HTML Elements
 */

export const Header = (props: MProps) => {
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const [hide, setHide] = React.useState<boolean>(props?.toggleFlag);
  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  /**
   * Toggle right side panel visibility
   */
  const togglePanel = () => {
    //setHide(hide);
    //squeezeBody(hide);
    if (props.toggleHandler) props.toggleHandler(hide, "header");
  };

  /**
   * capture keyboard event for search element
   * @param e: event
   */
  const onChange = async (e: any) => {
    setSearchKeyword(e.target.value);
  };

  /**
   * Trigger search action for fetching search results
   */
  const doSearch = async () => {
    await getSearchResults(searchKeyword);
  };

  /**
   * HTTP search results service call
   @param keyword:string
   */
  const getSearchResults = async (keyword: string) => {
    setSearchKeyword(keyword);
    const _searchResults = await fetchSearchResults({
      keyword,
      domain: encodeURI(window.location.host),
    });
    setSearchResults([..._searchResults]);
    if (props.searchHandler) {
      props.searchHandler(_searchResults, searchKeyword);
    }
  };

  return (
    <>
      <div>
        <div
          className="uda-ribbon-arrow flex-card flex-center "
          id="uda-close-panel"
          onClick={() => togglePanel()}
        >
          <span className="arrow">
            <BsChevronDoubleRight size={16} />
          </span>
        </div>
        <div className="uda-icon-txt">
          <img src={getLogo()} />
          <span className="uda-help-bg-tooltip">{props.i18("needHelp")}?</span>
        </div>
        <div className="uda-icon-txt">
          <span className="" style={{ color: "#303f9f", fontWeight: "bold" }}>
            {props.i18("logoText")}
          </span>
        </div>
        <div
          className="uda-container"
          style={{ textAlign: "center", marginTop: 10 }}
        >
          <div className="uda-search-div">
            <button
              className="uda-mic-btn"
              style={{ borderRadius: "5px 0px 0px 5px" }}
              id="uda-voice-icon-start"
            />
            <button
              className="uda-stop-btn-bg"
              style={{
                borderRadius: "5px 0px 0px 5px",
                display: "none",
              }}
              id="uda-voice-icon-stop"
            />
            <input
              type="text"
              name="uda-search-input"
              className="uda-input-cntrl"
              placeholder="search..."
              id="uda-search-input"
              onChange={onChange}
            />
            <button
              className="uda-search-btn"
              id="uda-search-btn"
              style={{ borderRadius: "0px 5px 5px 0px" }}
              onClick={() => doSearch()}
            />
          </div>
        </div>
      </div>
      <hr style={{ border: "1px solid #969696", width: "100%" }} />
    </>
  );
};

/**
 *
 * @param props
 * @returns content for the body
 */
interface ParentCompProps {
  content?: React.ReactNode;
}
export const Body: React.FC<ParentCompProps> = (props) => {
  const { content } = props;
  return (
    <div
      className="uda-container uda-clear uda-cards-scroller"
      id="uda-content-container"
    >
      {content}
    </div>
  );
};

/**
 *
 * @param props
 * @returns footer container
 */
export const Footer = (props: MProps) => {
  const setShowRecord = (flag: boolean) => {
    if (props.toggleHandler) props.toggleHandler(flag, "footer");
  };

  return (
    <div>
      <div className="uda-footer-bar">
        <div className="uda-container">
          <button
            className="uda-new-seq uda-exclude"
            onClick={() => setShowRecord(true)}
          >
            <BsPlusLg color="#ff5722" />
          </button>
          {/* <div
            className="uda-advanced-btn-content"
            onClick={() => setShowRecord(true)}
          >
            <span
              id="uda-advance-section"
              className="uda-advanced-btn-content"
              data-exclude="true"
            >
              New Sequence
            </span>
          </div> */}
          {/* <div className="uda-dropdown" id="uda-advanced-btn">
            <button className="uda-advanced-btn">
              <span>Advanced</span>
            </button>
            <div
              className="uda-advanced-btn-content"
              onClick={() => setShowRecord(true)}
            >
              <span
                id="uda-advance-section"
                className="uda-advanced-btn-content"
                data-exclude="true"
              >
                New Sequence
              </span>
            </div>
          </div> */}
        </div>
        <div
          className="uda-container"
          style={{ borderTop: "1px solid #969696", marginTop: 30 }}
        >
          <div className="uda-footer-left">Copyrights Reserved 2022.</div>
          <div
            className="uda-footer-right"
            style={{ paddingTop: 5, textAlign: "right" }}
          >
            <a
              href="https://udan.nistapp.ai"
              data-exclude="true"
              target="_blank"
            >
              Know More
            </a>
            <img src={getLogo()} width="15px" height="15px;" />
          </div>
        </div>
      </div>
    </div>
  );
};
