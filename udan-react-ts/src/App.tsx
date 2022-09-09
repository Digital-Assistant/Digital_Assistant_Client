/**
 * Author: Lakshman Veti
 * Type: App Component
 * Objective: To render content script
 */

///<reference types="chrome"/>
import logo from "./logo.svg";
// import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { fetchSearchResults } from "./services/searchService";
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
import { RecordedSeq } from "./components/RecordedSeq";
import { SearchResults } from "./components/SearchResults";
import {
  RecordSequence,
  RecordButton,
  RecordSequenceDetails,
} from "./components/MiscComponents";
import { Footer, Header } from "./components/layout";
import useInterval from "react-useinterval";
import "./App.scss";

const allowedTags = ["a", "button"];

declare global {
  interface Window {
    isRecording: boolean;
  }
}

function getLogo() {
  if (window?.chrome) {
    return window?.chrome?.runtime?.getURL(logo);
  }
  return "https://s4.aconvert.com/convert/p3r68-cdx67/alc9l-hnvsn.svg";
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
  const [showRecord, setShowRecord] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<string>(
    getFromStore("isPlaying", true) || "off"
  );
  const [searchKeyword, setSearchKeyword] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const [recSequenceData, setRecSequenceData] = React.useState<any>([]);
  const [recordSequenceDetailsVisibility, setRecordSequenceDetailsVisibility] =
    React.useState<boolean>(false);
  const [selectedRecordingDetails, setSelectedRecordingDetails] =
    React.useState<any>(getFromStore("selectedRecordedItem", false) || {});

  React.useEffect(() => {
    // addBodyEvents(document.body);
    getSearchResults("");
    if (isPlaying == "on") {
      togglePanel();
      setRecordSequenceDetailsVisibility(true);
    }
  }, []);

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
  };

  /**to enable record sequence card/container */
  const recordSequence = () => {
    playHandler("off");
    setToStore(generateUUID(), "sessionId", true);
    setIsRecording(true);
    setShowRecord(false);
  };

  /**common cancel button handler */
  const cancel = () => {
    removeFromStore("sessionId");
    setIsRecording(false);
    setShowRecord(false);
    setRecordSequenceDetailsVisibility(false);
    playHandler("off");
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
        style={{ display: hide ? "none" : "block" }}
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
                <div
                  className="uda-container uda-clear uda-cards-scroller"
                  id="uda-content-container"
                >
                  <RecordButton
                    recordHandler={showRecordHandler}
                    recordSeqHandler={recordSequence}
                    recordButtonVisibility={toggleContainer("record-button")}
                  />

                  <RecordSequence
                    cancelHandler={cancel}
                    recordSequenceVisibility={toggleContainer("record-seq")}
                  />

                  <SearchResults
                    data={searchResults}
                    showDetails={showRecordingDetails}
                    visibility={toggleContainer("search-results")}
                  />

                  <RecordedSeq
                    isShown={toggleContainer("recorded-data")}
                    data={recSequenceData}
                    recordHandler={recordHandler}
                  />

                  <RecordSequenceDetails
                    data={selectedRecordingDetails}
                    recordSequenceDetailsVisibility={
                      recordSequenceDetailsVisibility &&
                      !isRecording &&
                      !toggleContainer("record-button")
                    }
                    cancelHandler={cancel}
                    playHandler={playHandler}
                    isPlaying={isPlaying}
                    key={"rSD" + recordSequenceDetailsVisibility}
                  />
                </div>
                <Footer toggleFlag={hide} toggleHandler={toggleHandler} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="default-logo exclude"
        style={{ display: !hide ? "none" : "block" }}
      >
        <img
          className="uda_exclude"
          src={getLogo()}
          onClick={() => togglePanel()}
          alt={"udan logo"}
        />
      </div>
    </>
  );
}

export default App;
