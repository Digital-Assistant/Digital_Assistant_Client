/**
 * Author: Lakshman Veti
 * Type: App Component
 * Objective: To render content script
 */

///<reference types="chrome"/>
import logo from "./logo.svg";
import React, { useState, useEffect, useCallback } from "react";
import { fetchSearchResults } from "./services/searchService";
import { login, getUserSession } from "./services/authService";
import {
  squeezeBody,
  getRowObject,
  addBodyEvents,
  setToStore,
  getFromStore,
  removeFromStore,
  generateUUID,
  postRecordSequenceData,
} from "./util";
import { CONFIG } from "./config";
import UdanMain from "./components/UdanMain";
import { Header, Body, Footer, Toggler } from "./components/layout";
import { Circles } from "react-loader-spinner";
import useInterval from "react-useinterval";
import "./App.scss";

declare global {
  interface Window {
    isRecording: boolean;
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
  React.useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
  }, [callback, options]);
};

function App() {
  const [isRecording, setIsRecording] = React.useState<boolean>(
    (getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true"
      ? true
      : false) || false
  );
  const [hide, setHide] = React.useState<boolean>(isRecording ? false : true);
  const [showLoader, setShowLoader] = React.useState<boolean>(true);
  const [showRecord, setShowRecord] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<string>(
    getFromStore("isPlaying", true) || "off"
  );
  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const [refetchSearch, setRefetchSearch] = React.useState<string>("");
  const [recSequenceData, setRecSequenceData] = React.useState<any>([]);
  const [recordSequenceDetailsVisibility, setRecordSequenceDetailsVisibility] =
    React.useState<boolean>(false);
  const [selectedRecordingDetails, setSelectedRecordingDetails] =
    React.useState<any>(getFromStore("selectedRecordedItem", false) || {});

  React.useEffect(() => {
    authHandler();
    //addBodyEvents(document.body);
    getSearchResults("");
    if (isPlaying == "on") {
      togglePanel();
      setRecordSequenceDetailsVisibility(true);
    }
  }, []);

  React.useEffect(() => {
    if (refetchSearch == "on") getSearchResults("");
  }, [refetchSearch]);

  /**
   * Sync data with storage
   */
  useInterval(() => {
    setRecSequenceData(getFromStore(CONFIG.RECORDING_SEQUENCE, false));
  }, CONFIG.SYNC_INTERVAL);

  React.useEffect(() => {
    window.isRecording = isRecording;
    setToStore(isRecording, CONFIG.RECORDING_SWITCH_KEY, true);
  }, [isRecording]);

  /**
   * Toggle right side panel visibility
   */
  const togglePanel = () => {
    setHide(!hide);
    squeezeBody(!hide);
  };

  const authHandler = async () => {
    if (!window.chrome) return;
    chrome.runtime.sendMessage({ action: "login" }, (res) => {
      console.log(res);
    });
    setTimeout(() => {
      chrome.storage.sync.get(CONFIG.USER_AUTH_DATA_KEY, (data) => {
        if (data) {
          if (!getFromStore(CONFIG.USER_AUTH_DATA_KEY, true)) {
            setToStore(data.udaUserData, CONFIG.USER_AUTH_DATA_KEY, true);
            const authData = JSON.parse(data[CONFIG.USER_AUTH_DATA_KEY]);
            setToStore(authData?.authdata?.id, CONFIG.USER_SESSION_ID, true);
            login(authData)?.then((resp) => {
              getUserSession().then((session) => {
                setToStore(session, CONFIG.USER_SESSION_KEY, true);
              });
            });
          }
        }
      });
    }, 5000);
  };

  /**
   * HTTP search results service call
   @param keyword:string
   */
  const getSearchResults = async (keyword: string) => {
    setShowLoader(true);
    setSearchKeyword(keyword);
    const _searchResults = await fetchSearchResults({
      keyword,
      domain: encodeURI(window.location.host),
    });
    setTimeout(() => setShowLoader(false), 1500);
    setSearchResults([..._searchResults]);
  };

  /**to enable record sequence card/container */
  const recordSequence = () => {
    playHandler("off");
    setIsRecording(true);
    setShowRecord(false);
  };

  /**common cancel button handler */
  const cancel = () => {
    // removeFromStore("udaSessionId");
    setIsRecording(false);
    setShowRecord(false);
    setRecordSequenceDetailsVisibility(false);
    playHandler("off");
    //getSearchResults("");
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
        await getSearchResults("");
        break;
      case "cancel":
        break;
    }
    cancel();
  };

  /**
   * search handler callback function
   * @param data search handler callback function
   */
  const searchHandler = (data: any) => {
    setSearchResults([...data]);
  };

  /**
   * common toggle callback function
   * @param hideFlag
   * @param type
   */
  const toggleHandler = (hideFlag: boolean, type: string) => {
    if (type == "footer") setShowRecord(hideFlag);
    else setHide(hideFlag);
  };

  /**
   * to handle record button
   * @param flag
   */
  const showRecordHandler = (flag: boolean) => {
    setIsPlaying("off");
    setToStore("off", "isPlaying", true);
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
    setSelectedRecordingDetails({ ...data });
    setRecordSequenceDetailsVisibility(true);
  };

  /**
   * Recording play handler callback
   * @param status
   */
  const playHandler = (status: string) => {
    setIsPlaying(status);
    setToStore(status, "isPlaying", true);
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
                  searchHandler={searchHandler}
                  toggleFlag={hide}
                  toggleHandler={toggleHandler}
                />
                <Body
                  content={
                    <>
                      {showLoader && (
                        <Circles
                          height="60"
                          width="60"
                          color="#ff5722"
                          ariaLabel="circles-loading"
                          wrapperClass="loader"
                          visible={true}
                        />
                      )}

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

                      {!showLoader && (
                        <UdanMain.SearchResults
                          data={searchResults}
                          showDetails={showRecordingDetails}
                          visibility={toggleContainer("search-results")}
                          addRecordHandler={setShowRecord}
                          key={searchResults.length + showLoader}
                        />
                      )}

                      <UdanMain.RecordedData
                        isShown={toggleContainer("recorded-data")}
                        data={recSequenceData}
                        recordHandler={recordHandler}
                      />

                      <UdanMain.RecordSequenceDetails
                        data={selectedRecordingDetails}
                        recordSequenceDetailsVisibility={
                          recordSequenceDetailsVisibility &&
                          !isRecording &&
                          !toggleContainer("record-button")
                        }
                        cancelHandler={cancel}
                        playHandler={playHandler}
                        isPlaying={isPlaying}
                        refetchSearch={setRefetchSearch}
                        key={"rSD" + recordSequenceDetailsVisibility}
                      />
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
