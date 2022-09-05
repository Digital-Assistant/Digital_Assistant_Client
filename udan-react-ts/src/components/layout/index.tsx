/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render layout components
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../../App.scss";
import { fetchSearchResults } from "../../services/searchService";
import { squeezeBody } from "../../util";
import logo from "../../logo.svg";

/**
 *
 * @returns logo path
 */
function getLogo() {
  if (window?.chrome) {
    return window?.chrome?.runtime?.getURL(logo);
  }
  return "https://s4.aconvert.com/convert/p3r68-cdx67/alc9l-hnvsn.svg";
}

export interface MProps {
  searchHandler?: Function;
  toggleFlag: boolean;
  toggleHandler?: Function;
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
    setHide(hide);
    squeezeBody(hide);
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
      props.searchHandler(_searchResults);
    }
  };

  return (
    <>
      <div>
        <div
          className="uda-ribbon-arrow"
          id="uda-close-panel"
          onClick={() => togglePanel()}
        >
          <span className="arrow"> &gt;&gt; </span>
        </div>
        <div className="uda-icon-txt">
          <img src={getLogo()} />
          <span className="uda-help-bg-tooltip">Need Help?</span>
        </div>
        <div className="uda-icon-txt">
          <span className="" style={{ color: "#303f9f", fontWeight: "bold" }}>
            UDAN(Beta)
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
          <div className="uda-dropdown" id="uda-advanced-btn">
            <button className="uda-advanced-btn">
              <span>Advanced</span>
            </button>
            <div
              className="uda-advanced-btn-content"
              onClick={() => setShowRecord(true)}
            >
              <a id="uda-advance-section" data-exclude="true">
                New Sequence
              </a>
            </div>
          </div>
        </div>
        <br />
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
              Know More{" "}
            </a>
            <img src={getLogo()} width="15px" height="15px;" />
          </div>
        </div>
      </div>
    </div>
  );
};
