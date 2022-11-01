import React, { useState } from "react";

import { DoubleRightOutlined } from "@ant-design/icons";

import { HeaderProps } from "./interfaces";
import MicButton from "../MicButton";
import { getLogo } from "./common";

import { CONFIG } from "../../config";
import LanguageSelect from "./LanguageSelect";
import { translateText } from "../../services/translateService";

/**
 * To render search result elements
 * @returns HTML Elements
 */

const Header = (props: HeaderProps) => {
  const {
    selectedLang: selectedLanguage,
    searchInLang,
    enabled: multiLingualEnabled,
  } = CONFIG.multilingual;

  const [hide, setHide] = useState<boolean>(props?.toggleFlag);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>(selectedLanguage);

  /**
   * Toggle right side panel visibility
   */
  const togglePanel = () => {
    if (props.toggleHandler) props.toggleHandler(hide, "header");
  };

  /**
   * Trigger search action for fetching search results
   */
  const multiLangSearch = async (searchText: string) => {
    if (searchInLang !== selectedLang) {
      props.setSearchKeyword(
        await translateText(searchText, selectedLang, searchInLang)
      );
      return;
    }
    props.setSearchKeyword(searchText);
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
            <DoubleRightOutlined size={16} />
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
            <MicButton
              onSpeech={(text: string) => {
                setSearchKeyword(text);
                multiLangSearch(text);
              }}
              selectedLang={selectedLang}
            />
            <input
              type="text"
              name="uda-search-input"
              className="uda-input-cntrl"
              placeholder="search..."
              id="uda-search-input"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              className="uda-search-btn"
              id="uda-search-btn"
              style={{ borderRadius: "0px 5px 5px 0px" }}
              onClick={() => multiLangSearch(searchKeyword)}
            />
          </div>
          {multiLingualEnabled && (
            <LanguageSelect
              onLanguageChange={setSelectedLang}
              selectedLang={selectedLang}
            />
          )}
        </div>
      </div>
      <hr style={{ border: "1px solid #969696", width: "100%" }} />
    </>
  );
};

export default Header;
