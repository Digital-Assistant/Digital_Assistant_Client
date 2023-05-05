import React, { useState } from "react";

import { HeaderProps } from "./interfaces";
import MicButton from "../MicButton";
import { getLogo } from "./common";

import { CONFIG } from "../../config";
import LanguageSelect from "./LanguageSelect";
import { translateText } from "../../services/translateService";
import {translate} from "../../util/translation";
import {CloseCircleOutlined} from "@ant-design/icons";

/**
 * To render search result elements
 * @returns HTML Elements
 */

const Header = (props: HeaderProps) => {
  const {
    selectedLang: selectedLanguage,
    searchInLang,
  } = CONFIG.multilingual;

  const [hide, setHide] = useState<boolean>(props?.toggleFlag);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>(selectedLanguage);

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

  /**
   * clear search function
   * @param event
   */
  const clearSearch = () => {
    props.setSearchKeyword('');
    setSearchKeyword('');
  }

  const submitSearch = (event) => {
    if(event.keyCode === 13 || event.key === 'Enter'){
      props.setSearchKeyword(searchKeyword);
    }
  }

  /**
   * Validate input of given string
   * @param value
   */
  const validateInput = (value) => {
    let validateCondition = new RegExp("^[0-9A-Za-z _.-]+$");
    if(value !== '')
      return (validateCondition.test(value));
    else
      return true;
  }

  return (
    <>
      <div>
        <div className="uda-icon-txt">
          <img alt="UDA-Logo" src={getLogo()} />
          <span className="uda-help-bg-tooltip">{translate("needHelp")}?</span>
        </div>
        <div className="uda-icon-txt">
          <span className="" style={{ color: "#303f9f", fontWeight: "bold" }}>
            {translate("logoText")}
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
              className="uda-input-cntrl uda_exclude"
              placeholder="search..."
              id="uda-search-input"
              value={searchKeyword}
              onChange={(e) => {
                if(validateInput(e.target.value)) {
                  setSearchKeyword(e.target.value)
                }
              }}
              onKeyDown={submitSearch}
            />
            {(!searchKeyword) &&
                <button
                    className="uda-search-btn uda_exclude"
                    id="uda-search-btn"
                    style={{borderRadius: "0px 5px 5px 0px"}}
                    onClick={() => multiLangSearch(searchKeyword)}
                />
            }
            {(searchKeyword) &&
                <button
                    className="uda-btn uda_exclude"
                    id="uda-clear-btn"
                    style={{borderRadius: "0px 5px 5px 0px"}}
                    onClick={() => clearSearch()}
                >
                    <CloseCircleOutlined />
                </button>
            }
          </div>
          {props?.config?.enableMultilingual && (
              <LanguageSelect
                onLanguageChange={setSelectedLang}
                selectedLang={selectedLang}
                config={props?.config}
              />
          )}
        </div>
      </div>
      <hr style={{ border: "1px solid #969696", width: "100%" }} />
    </>
  );
};

export default Header;
