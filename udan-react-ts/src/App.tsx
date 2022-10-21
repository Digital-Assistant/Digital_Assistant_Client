/**
 * Author: Lakshman Veti
 * Type: App Component
 * Objective: To render content script
 */
///<reference types="chrome"/>

import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import "../public/css/antd.css";
import { fetchSearchResults } from "./services/searchService";
import { login, getUserSession } from "./services/authService";
import _ from "lodash";
import {
  squeezeBody,
  setToStore,
  getFromStore,
  postRecordSequenceData,
} from "./util";
import { CONFIG } from "./config";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import "./i18n";
import UdanMain from "./components/UdanMain";
import { Toggler } from "./components/layout/common";
import  Header  from "./components/layout/Header";
import Body from "./components/layout/Body";
import Footer from "./components/layout/Footer";
import useInterval from "react-useinterval";
import "./App.scss";

global.udaGlobalConfig = CONFIG;

// i18n
//   .use(initReactI18next) // passes i18n down to react-i18next
//   .init(RESOURCES);

declare global {
  interface Window {
    isRecording: boolean;
    domJSON: any;
  }
}

const useMutationObserver = (
  ref: any,
  callback: any,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  }
) => {
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
  }, [callback, options]);
};

function App() {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState<boolean>(
    (getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true"
      ? true
      : false) || false
  );
  const [hide, setHide] = useState<boolean>(isRecording ? false : true);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showRecord, setShowRecord] = useState<boolean>(false);
  const [playDelay, setPlayDelay] = useState<string>("off");
  const [isPlaying, setIsPlaying] = useState<string>(
    getFromStore(CONFIG.RECORDING_IS_PLAYING, true) || "off"
  );
  const [manualPlay, setManualPlay] = useState<string>(
    getFromStore(CONFIG.RECORDING_MANUAL_PLAY, true) || "off"
  );
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [refetchSearch, setRefetchSearch] = useState<string>("");
  const [recSequenceData, setRecSequenceData] = useState<any>([]);
  const [recordSequenceDetailsVisibility, setRecordSequenceDetailsVisibility] =
    useState<boolean>(false);
  const [selectedRecordingDetails, setSelectedRecordingDetails] =
    useState<any>(getFromStore(CONFIG.SELECTED_RECORDING, false) || {});

  useEffect(() => {
    authHandler();
    //addBodyEvents(document.body);
    if ((isPlaying == "on" || manualPlay == "on") && !_.isEmpty(selectedRecordingDetails)) {
      console.log(isPlaying, manualPlay, selectedRecordingDetails);
       setTimeout(() => {
         setPlayDelay("on");
       }, 2000);
      togglePanel();
      offSearch();
      setRecordSequenceDetailsVisibility(true);
    } else if (isRecording) {
      offSearch();
    } else {
      setShowSearch(true);
      setSearchKeyword("");
    }
    
   

    /*
    //language change test      
    setTimeout(() => {
      changeLanguage("fr");
    }, 5000);
    */
  }, []);

  useEffect(() => {
    window.isRecording = isRecording;
    setToStore(isRecording, CONFIG.RECORDING_SWITCH_KEY, true);
  }, [isRecording]);

  useEffect(() => {
    if (refetchSearch == "on") {
      setSearchKeyword("");
      setSearchKeyword("");
    }
  }, [refetchSearch]);

  useEffect(() => {
    getSearchResults()
  }, [searchKeyword]);

  /**
   * Sync data with storage
   */
  useInterval(() => {
    setRecSequenceData(getFromStore(CONFIG.RECORDING_SEQUENCE, false));
  }, CONFIG.SYNC_INTERVAL);

  /**
   * Toggle right side panel visibility
   */
  const togglePanel = () => {
    setHide(!hide);
    squeezeBody(!hide);
  };

  /**
   * to change the language
   * @param locale
   */
  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
  };

  const offSearch = () => {
    setShowSearch(false);
    setShowLoader(false);
  };

  const authHandler = async () => {
    setTimeout(() => {
      const authData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
      if (!authData) return;
      setToStore(authData?.authdata?.id, CONFIG.USER_SESSION_ID, true);
      login(authData)?.then((resp) => {
        getUserSession().then((session) => {
          setToStore(session, CONFIG.USER_SESSION_KEY, true);
        });
      });
    }, 7000);
  };

  /**
   * HTTP search results service call
   @param keyword:string
   */
  const getSearchResults = async ( _page = 1) => {
    // if (!showSearch) return;
    setShowLoader(true);
    const _searchResults = await fetchSearchResults({
      keyword:searchKeyword,
      page,
      domain: encodeURI(window.location.host),
    });
    setPage(_page);
    setTimeout(() => setShowLoader(false), 500);
    setSearchResults([..._searchResults]);
  };

  /**to enable record sequence card/container */
  const recordSequence = () => {
    playHandler("off");
    setIsRecording(true);
    setShowRecord(false);
    setShowSearch(false);
  };

  /**common cancel button handler */
  const cancel = () => {
    // removeFromStore("udaSessionId");
    setIsRecording(false);
    setShowRecord(false);
    setRecordSequenceDetailsVisibility(false);
    playHandler("off");
    setManualPlay("off");
    setToStore("off", CONFIG.RECORDING_MANUAL_PLAY, true);
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
    setToStore({}, CONFIG.SELECTED_RECORDING, false);
    setSelectedRecordingDetails({});
    setShowSearch(true);
    setRefetchSearch("on");
    if (window.udanSelectedNodes) window.udanSelectedNodes = [];
  };

  /**
   * To handle record / cancel buttons
   * @param type
   * @param data
   */
  const recordHandler = async (type: string, data?: any) => {
    switch (type) {
      case "submit":
        await postRecordSequenceData({ ...data });
        await setSearchKeyword("");
        break;
      case "cancel":
        break;
    }
    setShowSearch(true);
    cancel();
  };

  /**
   * common toggle callback function
   * @param hideFlag
   * @param type
   */
  const toggleHandler = (hideFlag: boolean, type: string) => {
    if (type == "footer") {
      setShowSearch(false);
      setToStore([], CONFIG.RECORDING_SEQUENCE, false);
      setShowRecord(hideFlag);
    } else togglePanel();
  };

  /**
   * to handle record button
   * @param flag
   */
  const showRecordHandler = (flag: boolean) => {
    setShowSearch(false);
    setManualPlay("off");
    setToStore("off", CONFIG.RECORDING_MANUAL_PLAY, true);
    playHandler("off");
    setShowRecord(flag);
  };

  /**
   * common toggle function based on card type
   * @param type
   * @returns
   */
  const toggleContainer = (card: string) => {
    if (card == "record-button") {
      return (
        showRecord === true && isRecording === false && !recSequenceData?.length
      );
    } else if (card == "record-seq") {
      return (
        isRecording === true && showRecord === false && !recSequenceData?.length
      );
    } else if (card == "recorded-data") {
      return recSequenceData && recSequenceData?.length > 0;
    } else if (card == "search-results") {
      return (
        isRecording === false &&
        showRecord === false &&
        recordSequenceDetailsVisibility === false
      );
    }
  };

  /**
   * Show recording details card
   * @param data
   */
  const showRecordingDetails = (data: any) => {
    playHandler("off")
    setShowSearch(false);
    setSelectedRecordingDetails({ ...data });
    setRecordSequenceDetailsVisibility(true);
  };

  /**
   * Recording play handler callback
   * @param status
   */
  const playHandler = (status: string) => {
    setPlayDelay(status);
    setIsPlaying(status);
    setToStore(status, CONFIG.RECORDING_IS_PLAYING, true);
  };

  return (
    <>
      <div
        className="udan-main-panel"
        style={{ display: hide ? "none" : "block", position: "relative" }}
      >
        <div id="uda-html-container">
          <div id="uda-html-content" nist-voice="true">
            <div>
              <div className="uda-page-right-bar">
                <Header
                  setSearchKeyword={setSearchKeyword}
                  searchKeyword={searchKeyword}
                  toggleFlag={hide}
                  toggleHandler={toggleHandler}
                  i18={t}
                />
                <Body
                  content={
                    <>
                      {showLoader && <Spin tip="Loading..." />}

                      <UdanMain.RecordButton
                        recordHandler={showRecordHandler}
                        cancelHandler={cancel}
                        recordSeqHandler={recordSequence}
                        recordButtonVisibility={toggleContainer(
                          "record-button"
                        )}
                      />

                      <UdanMain.RecordSequence
                        cancelHandler={cancel}
                        recordSequenceVisibility={toggleContainer("record-seq")}
                      />

                      {!showLoader && showSearch && (
                        <UdanMain.SearchResults
                          data={searchResults}
                          showDetails={showRecordingDetails}
                          visibility={toggleContainer("search-results")}
                          addRecordHandler={setShowRecord}
                          searchKeyword={searchKeyword}
                          // key={searchResults.length + showLoader}
                          searchHandler={getSearchResults}
                          page={page}
                        />
                      )}

                      <UdanMain.RecordedData
                        isShown={toggleContainer("recorded-data")}
                        data={recSequenceData}
                        recordHandler={recordHandler}
                        refetchSearch={setRefetchSearch}
                        config={global.udaGlobalConfig}
                      />

                      {recordSequenceDetailsVisibility &&
                        <UdanMain.RecordSequenceDetails
                          data={selectedRecordingDetails}
                          recordSequenceDetailsVisibility={
                            recordSequenceDetailsVisibility &&
                            !isRecording &&
                            !toggleContainer("record-button")
                          }
                          cancelHandler={cancel}
                          playHandler={playHandler}
                          isPlaying={playDelay}
                          // refetchSearch={setRefetchSearch}
                          key={"rSD" + recordSequenceDetailsVisibility}
                        />
                      }
                    </>
                  }
                />
                <Footer
                  toggleFlag={hide}
                  addRecordBtnStatus={showRecord}
                  toggleHandler={toggleHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toggler toggleFlag={hide} toggleHandler={togglePanel} />
    </>
  );
}

export default App;
