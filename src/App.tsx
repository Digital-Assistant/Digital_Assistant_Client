/**
 * Author: Yureswar Ravuri
 * Type: App Component
 * Objective: To render content script
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {useSearchParams} from 'react-router-dom';
import "./css/UDAN.scss";
import { Button, Spin } from "antd";
import {fetchRecord, fetchSearchResults} from "./services/searchService";
import _ from "lodash";
import { squeezeBody, setToStore, getFromStore, removeFromStore } from "./util";
import { CONFIG } from "./config";
import UdanMain from "./components/UdanMain";
import { Toggler } from "./components/layout/common";
import Header from "./components/layout/Header";
import Body from "./components/layout/Body";
import Footer from "./components/layout/Footer";
import useInterval from "react-useinterval";
import keycloak from "./config/keycloak";
import { off, on, trigger } from "./util/events";
import { UserDataContext } from "./providers/UserDataContext";
import { AppConfig } from "./config/AppConfig";
import { CustomConfig } from "./config/CustomConfig";
import { postRecordSequenceData } from "./services";
import { addBodyEvents } from "./util/addBodyEvents";
import { initSpecialNodes } from "./util/initSpecialNodes";
import {delay} from "./util/delay";
import {fetchDomain} from "./util/fetchDomain";

// adding global variable declaration for exposing react custom configuration
global.UDAPluginSDK = AppConfig;
global.UDAGlobalConfig = CustomConfig;

declare global {
    interface Window {
        isRecording: boolean;
        domJSON: any;
    }
}

function App(props) {
    const [isRecording, setIsRecording] = useState<boolean>(
        getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true" || false
    );
    const [hide, setHide] = useState<boolean>(!isRecording);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [showSearch, setShowSearch] = useState<boolean>(true);
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
    const [reFetchSearch, setReFetchSearch] = useState<string>("off");
    const [recSequenceData, setRecSequenceData] = useState<any>([]);
    const [
        recordSequenceDetailsVisibility,
        setRecordSequenceDetailsVisibility,
    ] = useState<boolean>(false);
    const [selectedRecordingDetails, setSelectedRecordingDetails] =
        useState<any>(getFromStore(CONFIG.SELECTED_RECORDING, false) || false);

    /**
     * keycloak integration
     */
    const [authenticated, setAuthenticated] = useState(false);
    const [keycloakSessionData, setKeycloakSessionData] = useState(null);
    const [userSessionData, setUserSessionData] = useState(null);
    const [invokeKeycloak, setInvokeKeycloak] = useState(false);

    // const [searchParams, setSearchParams] = useSearchParams();

    const previousSearchKeyword = useRef("");

    const config = global.UDAGlobalConfig;

    useEffect(() => {
        if(!showLoader && (global.UDAGlobalConfig.enablePermissions || global.UDAGlobalConfig.enableForAllDomains)) {
            // init();
            getSearchResults(1,true);
        }
    }, [global.UDAGlobalConfig.enablePermissions, global.UDAGlobalConfig.enableForAllDomains]);

    useEffect(() => {
        if (invokeKeycloak) {
            let keycloakData = getFromStore(CONFIG.UDAKeyCloakKey, false);
            if (keycloakData) {
                setKeycloakSessionData(keycloakData);
                setAuthenticated(true);
            } else {
                initKeycloak();
            }
        }
    }, [invokeKeycloak, userSessionData]);

    useEffect(() => {
        if (invokeKeycloak) {
            initKeycloak();
        }
    }, [keycloak, keycloakSessionData]);

    const initKeycloak = () => {
        if (
            !keycloak.authenticated &&
            !keycloakSessionData &&
            !userSessionData &&
            !authenticated
        ) {
            keycloak
                .init({})
                .then(async (auth) => {
                    setAuthenticated(auth);
                    if (keycloak.authenticated) {
                        let userData: any = {
                            token: keycloak.token,
                            refreshToken: keycloak.refreshToken,
                            id: keycloak.subject,
                            email: keycloak.idTokenParsed.email,
                            authenticated: auth,
                            idToken: keycloak.idToken,
                        };
                        setToStore(userData, CONFIG.UDAKeyCloakKey, false);
                        setKeycloakSessionData(userData);
                        trigger("CreateUDASessionData", {
                            detail: { action: "createSession", data: userData },
                            bubbles: false,
                            cancelable: false,
                        });
                        await togglePanel();
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        } else if (keycloakSessionData) {
            keycloak
                .init({
                    token: keycloakSessionData.token,
                    refreshToken: keycloakSessionData.refreshToken,
                    idToken: keycloakSessionData.idToken,
                })
                .then(async (auth) => {
                    setAuthenticated(auth);
                    if (!userSessionData) {
                        let userData: any = {
                            token: keycloakSessionData.token,
                            refreshToken: keycloakSessionData.refreshToken,
                            id: keycloakSessionData.id,
                            email: keycloak.idTokenParsed.email,
                            authenticated: auth,
                            idToken: keycloakSessionData.idToken,
                        };
                        trigger("CreateUDASessionData", {
                            detail: { action: "createSession", data: userData },
                            bubbles: false,
                            cancelable: false,
                        });
                        await togglePanel();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error) {
                        clearSession();
                    }
                });
        }
    };

    /**
     * User authentication implementation
     *
     */
    const openUDAPanel = async () => {
        if (!_.isEmpty(selectedRecordingDetails)) {
            if (isPlaying == "on") {
                setTimeout(() => {
                    setPlayDelay("on");
                }, 2000);
            }
            // togglePanel();
            await openPanel();
            offSearch();
            setRecordSequenceDetailsVisibility(true);
        } else if (isRecording) {
            // togglePanel();
            await openPanel();
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
        if (data.detail.data === "login") {
            setInvokeKeycloak(true);
        }
    }, []);

    const clearSession = useCallback(() => {
        removeFromStore(CONFIG.USER_AUTH_DATA_KEY);
        removeFromStore(CONFIG.UDAKeyCloakKey);
        setAuthenticated(false);
        setInvokeKeycloak(true);
        setKeycloakSessionData(null);
        setUserSessionData(null);
        trigger("RequestUDASessionData", {
            detail: { data: "getusersessiondata" },
            bubbles: false,
            cancelable: false,
        });
    }, []);

    const init = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        setShowLoader(true);
        await initSpecialNodes();
        if(searchParams.get(CONFIG.UDA_URL_Param)){
            let recordDetails = await fetchRecord({
                id: searchParams.get(CONFIG.UDA_URL_Param),
                domain: encodeURI(fetchDomain()),
                additionalParams: global.UDAGlobalConfig.enablePermissions
                    ? encodeURI(JSON.stringify(global.UDAGlobalConfig.permissions))
                    : null,
            });
            if(recordDetails && recordDetails !== null){
                setToStore(recordDetails, CONFIG.SELECTED_RECORDING, false);
                await showRecordingDetails(recordDetails);
                await togglePanel();
                offSearch();
                setRecordSequenceDetailsVisibility(true);
            } else {
                await togglePanel();
                offSearch();
                setRecordSequenceDetailsVisibility(true);
                cancel();
            }
        } else {
            await getSearchResults(1, true);
        }
        if (hide) {
            await squeezeBody(true);
        }
    };

    useEffect(() => {
        on("UDAUserSessionData", createSession);
        on("UDAAuthenticatedUserSessionData", createSession);
        on("UDAAlertMessageData", authenticationError);
        on("UDAClearSessionData", clearSession);

        let userSessionData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
        if (!userSessionData) {
            trigger("RequestUDASessionData", {
                detail: { data: "getusersessiondata" },
                bubbles: false,
                cancelable: false,
            });
        } else {
            setUserSessionData(userSessionData);
            setAuthenticated(true);
            openUDAPanel();
            if (userSessionData.authenticationsource === "keycloak") {
                setInvokeKeycloak(true);
            } else {
                setAuthenticated(true);
            }
        }

        //adding class to body tag
        let documentBody = document.body;
        if (!documentBody.classList.contains("uda-body")) {
            documentBody.classList.add("uda-body");
        }

        init();

        return () => {
            off("UDAUserSessionData", createSession);
            off("UDAAuthenticatedUserSessionData", createSession);
            off("UDAAlertMessageData", authenticationError);
        };
    }, []);

    useEffect(() => {
        window.isRecording = isRecording;
        CONFIG.isRecording = isRecording;
        setToStore(isRecording, CONFIG.RECORDING_SWITCH_KEY, true);
        if (isRecording) {
            setHide(false);
        }
    }, [isRecording]);

    useEffect(() => {
        if (searchKeyword !== previousSearchKeyword.current) {
            previousSearchKeyword.current = searchKeyword;
            getSearchResults(1, true);
        }

        if (reFetchSearch === "on") {
            getSearchResults(1,true);
            setReFetchSearch("off");
        }
    }, [searchKeyword, reFetchSearch]);

    /**
     * Sync data with storage
     */
    useInterval(() => {
        setRecSequenceData(getFromStore(CONFIG.RECORDING_SEQUENCE, false));
    }, CONFIG.SYNC_INTERVAL);

    /**
     * Toggle right side panel visibility
     */
    const togglePanel = async () => {
        setHide(!hide);
        await squeezeBody(!hide);
    };

    const openPanel = async () => {
        setHide(false);
        await squeezeBody(true);
    };

    const closePanel = async () => {
        setHide(true);
        await squeezeBody(false);
    };

    const offSearch = () => {
        setReFetchSearch("off");
        setShowSearch(false);
        setShowLoader(false);
    };

    /**
     * HTTP search results service call
     * @param _page
     */
    const [timer, setTimer] = useState(null);
    const getSearchResults = async (_page = 1, refetch=false) => {
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setTimer(
            setTimeout(async () => {
                if(isRecording){
                    setShowLoader(false);
                    await addBodyEvents();
                    return;
                }
                if(searchResults.length > 0 && !refetch){
                    setShowLoader(false);
                    return;
                } else if (!_.isEmpty(selectedRecordingDetails)) {
                    setShowLoader(false);
                    return;
                }
                /*if(selectedRecordingDetails){
                    return;
                }*/
                setShowLoader(true);
                let domain = fetchDomain();
                const _searchResults = await fetchSearchResults({
                    keyword: searchKeyword,
                    page,
                    domain: encodeURI(domain),
                    additionalParams: global.UDAGlobalConfig.enablePermissions
                        ? encodeURI(JSON.stringify(global.UDAGlobalConfig.permissions))
                        : null,
                });
                setPage(_page);
                setTimeout(() => setShowLoader(false), 500);
                if (_searchResults.length) {
                    setSearchResults([..._searchResults]);
                } else {
                    setSearchResults([]);
                }
            }, CONFIG.apiInvokeTime)
        );
    };

    /**to enable record sequence card/container */
    const recordSequence = async () => {
        playHandler("off");
        setIsRecording(true);
        setShowRecord(false);
        setReFetchSearch("");
        setShowSearch(false);
        await addBodyEvents();
    };

    /**common cancel button handler */
    const cancel = (forceRefresh=false) => {
        setIsRecording(false);
        setShowRecord(false);
        setRecordSequenceDetailsVisibility(false);
        playHandler("off");
        setManualPlay("off");
        setToStore("off", CONFIG.RECORDING_MANUAL_PLAY, true);
        setToStore([], CONFIG.RECORDING_SEQUENCE, false);
        setToStore({}, CONFIG.SELECTED_RECORDING, false);
        setSelectedRecordingDetails({});
        if(forceRefresh || searchResults.length === 0) {
            setReFetchSearch("on");
        }
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
                await postRecordSequenceData({ ...data });
                await setSearchKeyword("");
                break;
            case "cancel":
                setIsRecording(false);
                await setSearchKeyword("");
                break;
        }
        setReFetchSearch("on");
        setShowSearch(true);
        cancel();
    };

    /**
     * common toggle callback function
     * @param hideFlag
     * @param type
     */
    const toggleHandler = async (hideFlag: boolean, type: string) => {
        if (type == "footer") {
            setReFetchSearch("off");
            setShowSearch(false);
            setToStore([], CONFIG.RECORDING_SEQUENCE, false);
            setShowRecord(hideFlag);
        } else {
            await togglePanel();
        }
    };

    /**
     * to handle record button
     * @param flag
     */
    const showRecordHandler = (flag: boolean) => {
        setReFetchSearch("");
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
                showRecord === true &&
                isRecording === false &&
                !recSequenceData?.length
            );
        } else if (card == "record-seq") {
            return (
                isRecording === true &&
                showRecord === false &&
                !recSequenceData?.length
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
        playHandler("off");
        setReFetchSearch("");
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

    const userContent = () => {
        return <>
          {authenticated && (
              <>
                  <Header
                      setSearchKeyword={setSearchKeyword}
                      searchKeyword={searchKeyword}
                      toggleFlag={hide}
                      toggleHandler={toggleHandler}
                      config={global.UDAGlobalConfig}
                  />
                  <Body
                      content={
                          <>
                              {showLoader && (
                                  <Spin tip="Loading..." />
                              )}

                              <UdanMain.RecordButton
                                  recordHandler={
                                      showRecordHandler
                                  }
                                  cancelHandler={cancel}
                                  recordSeqHandler={
                                      recordSequence
                                  }
                                  recordButtonVisibility={toggleContainer(
                                      "record-button"
                                  )}
                                  config={
                                      global.UDAGlobalConfig
                                  }
                              />
                              {toggleContainer(
                                  "record-seq"
                              ) && (
                                  <UdanMain.RecordSequence
                                      cancelHandler={
                                          cancel
                                      }
                                      recordSequenceVisibility={toggleContainer(
                                          "record-seq"
                                      )}
                                  />
                              )}
                              {!showLoader &&
                                  showSearch && (
                                      <UdanMain.SearchResults
                                          data={
                                              searchResults
                                          }
                                          showDetails={
                                              showRecordingDetails
                                          }
                                          playHandler={playHandler}
                                          visibility={toggleContainer(
                                              "search-results"
                                          )}
                                          addRecordHandler={
                                              setShowRecord
                                          }
                                          searchKeyword={
                                              searchKeyword
                                          }
                                          searchHandler={
                                              getSearchResults
                                          }
                                          page={page}
                                          config={
                                              global.UDAGlobalConfig
                                          }
                                      />
                                  )}

                              <UdanMain.RecordedData
                                  isShown={toggleContainer(
                                      "recorded-data"
                                  )}
                                  data={recSequenceData}
                                  recordHandler={
                                      recordHandler
                                  }
                                  refetchSearch={
                                      setReFetchSearch
                                  }
                                  showLoader={
                                      setShowLoader
                                  }
                                  config={
                                      global.UDAGlobalConfig
                                  }
                              />

                              {recordSequenceDetailsVisibility && (
                                  <UdanMain.RecordSequenceDetails
                                      data={
                                          selectedRecordingDetails
                                      }
                                      recordSequenceDetailsVisibility={
                                          recordSequenceDetailsVisibility &&
                                          !isRecording &&
                                          !toggleContainer(
                                              "record-button"
                                          )
                                      }
                                      cancelHandler={cancel}
                                      playHandler={playHandler}
                                      isPlaying={playDelay}
                                      key={"rSD" + recordSequenceDetailsVisibility}
                                      config={global.UDAGlobalConfig}
                                      showLoader={setShowLoader}
                                  />
                              )}
                          </>
                      }
                  />
                  <Footer
                      toggleFlag={hide}
                      addRecordBtnStatus={showRecord}
                      toggleHandler={toggleHandler}
                      config={global.UDAGlobalConfig}
                      isRecording={isRecording}
                  />
              </>
          )}

          {!authenticated && (
              <>
                  <div style={{
                      margin: "auto",
                      display: "inline-block",
                      width: "100% !important",
                  }}
                  >
                      <Button type="primary" className="uda_exclude"
                              onClick={() => {
                                  keycloak.login();
                              }}
                      >
                          Login
                      </Button>
                  </div>
              </>
          )}
        </>
    }

    return (
      <UserDataContext.Provider value={userSessionData}>
            <div
                className="udan-main-panel"
                style={{
                    display: hide ? "none" : "block",
                    position: "relative",
                }}
            >
                <div id="uda-html-container">
                    <div id="uda-html-content" className="uda_exclude">
                        <div>
                            <div className="uda-page-right-bar uda_exclude">
                              {userContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Toggler toggleFlag={hide} toggleHandler={togglePanel} udaDivId={global.UDAGlobalConfig.udaDivId} enableUdaIcon={global.UDAGlobalConfig.enableUdaIcon} />
        </UserDataContext.Provider>
    );
}

export default App;
