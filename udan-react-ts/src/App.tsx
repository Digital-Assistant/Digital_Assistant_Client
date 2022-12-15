/**
 * Author: Lakshman Veti
 * Type: App Component
 * Objective: To render content script
 */

import React, {useState, useEffect, useCallback, useRef} from "react";
// import 'antd/dist/reset.css';
import './css/antd.css';
import "./css/UDAN.scss";

import {Button, Spin} from "antd";
import {fetchSearchResults} from "./services/searchService";
import {login} from "./services/authService";
import _ from "lodash";
import {
  squeezeBody,
  setToStore,
  getFromStore,

} from "./util";
import {CONFIG} from "./config";
import UdanMain from "./components/UdanMain";
import {Toggler} from "./components/layout/common";
import Header from "./components/layout/Header";
import Body from "./components/layout/Body";
import Footer from "./components/layout/Footer";
import useInterval from "react-useinterval";
import keycloak from './config/keycloak';
import {off, on, trigger} from "./util/events";
import {UserDataContext} from "./providers/UserDataContext";
import {AppConfig} from "./config/AppConfig";
import {CustomConfig} from "./config/CustomConfig";
import {postRecordSequenceData} from "./services";
import {addBodyEvents} from "./util/addBodyEvents";
import {initSpecialNodes} from "./util/initSpecialNodes";

// adding global variable declaration for exposing react custom configuration
global.UDAPluginSDK = AppConfig;
global.UDAGlobalConfig = CustomConfig;

declare global {
  interface Window {
    isRecording: boolean;
    domJSON: any;
  }
}


function App() {
  const [isRecording, setIsRecording] = useState<boolean>(
      (getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true") || false
  );
  const [hide, setHide] = useState<boolean>(!isRecording);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [showRecord, setShowRecord] = useState<boolean>(false);
  const [playDelay, setPlayDelay] = useState<string>("off");
  const [isPlaying, setIsPlaying] = useState<string>(getFromStore(CONFIG.RECORDING_IS_PLAYING, true) || "off");
  const [manualPlay, setManualPlay] = useState<string>(getFromStore(CONFIG.RECORDING_MANUAL_PLAY, true) || "off");
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [refetchSearch, setRefetchSearch] = useState<string>("off");
  const [recSequenceData, setRecSequenceData] = useState<any>([]);
  const [recordSequenceDetailsVisibility, setRecordSequenceDetailsVisibility] = useState<boolean>(false);
  const [selectedRecordingDetails, setSelectedRecordingDetails] = useState<any>(getFromStore(CONFIG.SELECTED_RECORDING, false) || false);

  /**
   * keycloak integration
   */
  const [authenticated, setAuthenticated] = useState(false);
  const [userSessionData, setUserSessionData] = useState(null);
  const [invokeKeycloak, setInvokeKeycloak] = useState(false);

  const previousSearchKeyword = useRef('');

  const config = global.UDAGlobalConfig;

  useEffect(() => {
    // getSearchResults();
  }, [config]);


  useEffect(() => {
    if (invokeKeycloak) {
      let userSessionData = getFromStore(CONFIG.UDAKeyCloakKey, false);
      if (userSessionData) {
        setUserSessionData(userSessionData);
        setAuthenticated(true);
      } else {
        console.log('token not found');
      }
    }
  }, [invokeKeycloak, userSessionData]);

  useEffect(() => {
    if (invokeKeycloak) {
      if (!keycloak.authenticated && !userSessionData && !authenticated) {
        keycloak.init({}).then(auth => {
          setAuthenticated(auth);
          if (keycloak.authenticated) {
            let userData: any = {
              token: keycloak.token,
              refreshToken: keycloak.refreshToken,
              id: keycloak.subject,
              authenticated: auth,
              idToken: keycloak.idToken
            };
            setToStore(userData, CONFIG.UDAKeyCloakKey, false);
            setUserSessionData(userData);
            trigger("CreateUDASessionData", {
              detail: {action: 'createSession', data: userData},
              bubbles: false,
              cancelable: false
            });
          }
        }).catch((e) => {
          console.log(e);
        });
      } else {
        keycloak.init({
          token: userSessionData.authdata.token,
          refreshToken: userSessionData.authdata.refreshToken,
          idToken: userSessionData.authdata.idToken
        }).then(auth => {
          setAuthenticated(auth);
        });
      }
    }
  }, [keycloak, userSessionData, invokeKeycloak]);

  /**
   * User authentication implementation
   *
   */
  const openUDAPanel = () => {
    if (!_.isEmpty(selectedRecordingDetails)) {
      if (isPlaying == "on") {
        setTimeout(() => {
          setPlayDelay("on");
        }, 2000);
      }
      togglePanel();
      offSearch();
      setRecordSequenceDetailsVisibility(true);
    } else if (isRecording) {
      offSearch();
    } else {
      setShowSearch(true);
    }
  };

  const createSession = useCallback((data) => {
    setToStore(data.detail.data, CONFIG.USER_AUTH_DATA_KEY, true);
    setAuthenticated(true);
    setUserSessionData(data.detail.data);
    openUDAPanel();
  }, []);

  const authenticationError = useCallback((data) => {
    if (data.detail.data === 'login') {
      setInvokeKeycloak(true);
    }
  }, []);

  useEffect(() => {
    let userSessionData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
    if (!userSessionData) {
      trigger("RequestUDASessionData", {detail: {data: "getusersessiondata"}, bubbles: false, cancelable: false});
    } else {
      setUserSessionData(userSessionData);
      setAuthenticated(true);
      openUDAPanel();
      if (userSessionData.authenticationsource === 'keycloak') {
        setInvokeKeycloak(true);
      } else {
        setAuthenticated(true);
      }
    }

    on("UDAUserSessionData", createSession);
    on("UDAAuthenticatedUserSessionData", createSession);
    on("UDAAlertMessageData", authenticationError);

    //adding class to body tag
    let documentBody = document.body;
    if(!documentBody.classList.contains('universal-digital-parent-ele')){
      documentBody.classList.add('universal-digital-parent-ele');
    }

    return () => {
      off("UDAUserSessionData", createSession);
      off("UDAAuthenticatedUserSessionData", createSession);
      off("UDAAlertMessageData", authenticationError);
    }
  }, []);

  useEffect(() => {
    window.isRecording = isRecording;
    CONFIG.isRecording = isRecording;
    setToStore(isRecording, CONFIG.RECORDING_SWITCH_KEY, true);
  }, [isRecording]);

  useEffect(() => {
    const init = async () => {
      await initSpecialNodes();
      await getSearchResults();
      if(hide) {
        squeezeBody(true);
      }
    }

    init();
  },[]);

  useEffect(() => {
    if(searchKeyword !== previousSearchKeyword.current) {
      previousSearchKeyword.current = searchKeyword;
      getSearchResults();
    }

    if (refetchSearch === "on") {
      getSearchResults();
      setRefetchSearch("off");
    }
  }, [searchKeyword, refetchSearch]);

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

  const offSearch = () => {
    setRefetchSearch('off');
    setShowSearch(false);
    setShowLoader(false);
  };

  /**
   * HTTP search results service call
   * @param _page
   */
  const getSearchResults = async (_page = 1) => {
    /*if(isRecording || !_.isEmpty(selectedRecordingDetails)){
      offSearch();
      return;
    }*/
    setShowLoader(true);
    const _searchResults = await fetchSearchResults({
      keyword: searchKeyword,
      page,
      domain: encodeURI(window.location.host),
      additionalParams: (CustomConfig.enablePermissions) ? encodeURI(JSON.stringify(CustomConfig.permissions)) : null,
    });
    setPage(_page);
    setTimeout(() => setShowLoader(false), 500);
    setSearchResults([..._searchResults]);
  };

  /**to enable record sequence card/container */
  const recordSequence = async () => {
    playHandler("off");
    setIsRecording(true);
    setShowRecord(false);
    setRefetchSearch('');
    setShowSearch(false);
    await addBodyEvents();
  };

  /**common cancel button handler */
  const cancel = () => {
    setIsRecording(false);
    setShowRecord(false);
    setRecordSequenceDetailsVisibility(false);
    playHandler("off");
    setManualPlay("off");
    setToStore("off", CONFIG.RECORDING_MANUAL_PLAY, true);
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
    setToStore({}, CONFIG.SELECTED_RECORDING, false);
    setSelectedRecordingDetails({});
    setRefetchSearch('on');
    setShowSearch(true);
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
        await postRecordSequenceData({...data});
        await setSearchKeyword("");
        break;
      case "cancel":
        setIsRecording(false);
        await setSearchKeyword("");
        break;
    }
    setRefetchSearch('on');
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
      setRefetchSearch('off');
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
    setRefetchSearch('');
    setShowSearch(false);
    setManualPlay("off");
    setToStore("off", CONFIG.RECORDING_MANUAL_PLAY, true);
    playHandler("off");
    setShowRecord(flag);
  };

  /**
   * common toggle function based on card type
   * @returns
   * @param card
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
    setRefetchSearch('');
    setShowSearch(false);
    setSelectedRecordingDetails({...data});
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
      <UserDataContext.Provider value={userSessionData}>
        <div
            className="udan-main-panel"
            style={{display: hide ? "none" : "block", position: "relative"}}
        >
          <div id="uda-html-container">
            <div id="uda-html-content" className="uda_exclude">
              <div>
                <div className="uda-page-right-bar uda_exclude">
                  {authenticated &&
                      <>
                          <Header
                              setSearchKeyword={setSearchKeyword}
                              searchKeyword={searchKeyword}
                              toggleFlag={hide}
                              toggleHandler={toggleHandler}
                          />
                          <Body
                              content={
                                <>
                                  {showLoader && <Spin tip="Loading..."/>}

                                  <UdanMain.RecordButton
                                      recordHandler={showRecordHandler}
                                      cancelHandler={cancel}
                                      recordSeqHandler={recordSequence}
                                      recordButtonVisibility={toggleContainer(
                                          "record-button"
                                      )}
                                      config={global.UDAGlobalConfig}
                                  />
                                  {toggleContainer("record-seq") &&
                                      <UdanMain.RecordSequence
                                          cancelHandler={cancel}
                                          recordSequenceVisibility={toggleContainer("record-seq")}
                                      />
                                  }
                                  {!showLoader && showSearch && (
                                      <UdanMain.SearchResults
                                          data={searchResults}
                                          showDetails={showRecordingDetails}
                                          visibility={toggleContainer("search-results")}
                                          addRecordHandler={setShowRecord}
                                          searchKeyword={searchKeyword}
                                          searchHandler={getSearchResults}
                                          page={page}
                                          config={global.UDAGlobalConfig}
                                      />
                                  )}

                                  <UdanMain.RecordedData
                                      isShown={toggleContainer("recorded-data")}
                                      data={recSequenceData}
                                      recordHandler={recordHandler}
                                      refetchSearch={setRefetchSearch}
                                      config={global.UDAGlobalConfig}
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
                                          key={"rSD" + recordSequenceDetailsVisibility}
                                          config={global.UDAGlobalConfig}
                                      />
                                  }
                                </>
                              }
                          />
                          <Footer
                              toggleFlag={hide}
                              addRecordBtnStatus={showRecord}
                              toggleHandler={toggleHandler}
                              config={global.UDAGlobalConfig}
                          />
                      </>
                  }

                  {!authenticated && <>
                      <Button type="primary" className="uda_exclude" onClick={() => {
                        keycloak.login();
                      }}>Login</Button>
                  </>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toggler toggleFlag={hide} toggleHandler={togglePanel}/>
      </UserDataContext.Provider>
  );
}

export default App;
