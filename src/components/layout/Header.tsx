import React, { useState } from "react";

import { HeaderProps } from "./interfaces";
import MicButton from "../MicButton";

import { CONFIG } from "../../config";
import LanguageSelect from "./LanguageSelect";
import { translateText } from "../../services/translateService";
import {translate} from "../../util/translation";
import {CloseCircleOutlined, MinusSquareTwoTone, MinusCircleOutlined, CloseSquareTwoTone} from "@ant-design/icons";
import {recordUserClickData} from "../../services";

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
   * Toggle right side panel visibility
   */
  const togglePanel = async () => {
    recordUserClickData('UDAPanelClosed');
    if (props.toggleHandler){
      props.toggleHandler(hide, "header");
    }
  };

  /**
   * close right side panel visibility
   */
  const closePanel = async () => {
    recordUserClickData('UDAPanelClosed');
    if (props.closeHandler){
      props.closeHandler(hide, "header");
    }
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

  /**
   * clear search function
   * @param event
   */
  const clearSearch = async () => {
    props.setSearchKeyword('');
    setSearchKeyword('');
    recordUserClickData('clearSearch');
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
        <>
          {/* Left side toggle button with chevrons */}
          <div
              className="uda-ribbon-arrow flex-card flex-center uda_exclude"
              id="uda-toggle-panel"
          >
            <div onClick={() => togglePanel()} style={{ width: '24px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MinusCircleOutlined style={{ color: 'white' }} />
            </div>
            <div onClick={() => closePanel()} style={{ width: '24px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloseCircleOutlined style={{ color: 'white' }} />
            </div>
          </div>
        </>

        <div className="uda-icon-txt">
        {!props.config.enableCustomIcon && <>
            <span className="" style={{ color: "#303f9f", fontWeight: "bold" }}>
              {translate("logoText")}
            </span>
          </>
        }
        </div>

        <div
          className="uda-container"
          style={{ textAlign: "center", marginTop: '15px' }}
        >
          <div className="uda-search-div">
            {(props.config.enableSpeechToText) &&
            <MicButton
              onSpeech={(text: string) => {
                setSearchKeyword(text);
                multiLangSearch(text);
              }}
              selectedLang={selectedLang}
            />
            }
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
