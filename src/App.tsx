/**
 * Author: Yureswar Ravuri
 * Type: App Component
 * Objective: To render content script
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import {postRecordSequenceData, recordUserClickData} from "./services";
import { addBodyEvents } from "./util/addBodyEvents";
import { initSpecialNodes } from "./util/initSpecialNodes";
import {fetchDomain} from "./util/fetchDomain";

import ReactGA from 'react-ga4';

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
    const [page, setPage] = useState<number>(0);
    const [hasMorePages, setHasMorePages] = useState<boolean>(true);
    const [reFetchSearch, setReFetchSearch] = useState<string>("off");
    const [recSequenceData, setRecSequenceData] = useState<any>(getFromStore(CONFIG.RECORDING_SEQUENCE, false) || []);
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
    const previousEnvironment = useRef(global.UDAGlobalConfig.environment);

    const config = global.UDAGlobalConfig;

    // fetch search results based on the permissions
    useEffect(() => {
        if(!showLoader && (global.UDAGlobalConfig.enablePermissions || global.UDAGlobalConfig.enableForAllDomains)) {
            // init();
            getSearchResults(0,true);
        }
    }, [global.UDAGlobalConfig.enablePermissions, global.UDAGlobalConfig.enableForAllDomains]);

    useEffect(()=>{
        trigger("RequestUDASessionData", {
            detail: { data: "getusersessiondata" },
            bubbles: false,
            cancelable: false,
        });
    },[global.UDAGlobalConfig.realm,global.UDAGlobalConfig.clientId,global.UDAGlobalConfig.clientSecret])

    useEffect(() => {
        if(global.UDAGlobalConfig.environment !== previousEnvironment.current) {
            getSearchResults(0,true);
        }
    }, [global.UDAGlobalConfig.environment]);

    useEffect(() => {
        if (invokeKeycloak) {
            let keycloakData = getFromStore(CONFIG.UDAKeyCloakKey, false);
            if (keycloakData) {
                setKeycloakSessionData(keycloakData);
                // setAuthenticated(true);
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

    /**
     * Initializes the Keycloak authentication.
     *
     * @returns {void} This function does not return anything.
     */
    const initKeycloak = () => {
        // If keycloak is not already authenticated and there is no session or user data
        if (!keycloak.authenticated && !keycloakSessionData && !userSessionData && !authenticated) {
            // Initialize keycloak
            keycloak.init({})
                .then(async (auth) => {
                    // If keycloak is authenticated
                    if (keycloak.authenticated) {
                        // Create user data object
                        let userData: any = {
                            token: keycloak.token,
                            refreshToken: keycloak.refreshToken,
                            id: keycloak.subject,
                            email: keycloak.idTokenParsed.email,
                            authenticated: auth,
                            idToken: keycloak.idToken,
                        };

                        // Store user data
                        setToStore(userData, CONFIG.UDAKeyCloakKey, false);

                        // Set keycloak session data
                        setKeycloakSessionData(userData);

                        // set authenticated to true
                        setAuthenticated(auth);

                        // Trigger event to create user data session
                        trigger("CreateUDASessionData", {
                            detail: { action: "createSession", data: userData },
                            bubbles: false,
                            cancelable: false,
                        });

                        // Toggle panel
                        await togglePanel();
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        // If keycloak session data is available
        else if (keycloakSessionData) {
            // Initialize keycloak with session data
            keycloak.init({
                token: keycloakSessionData.token,
                refreshToken: keycloakSessionData.refreshToken,
                idToken: keycloakSessionData.idToken,
            })
                .then(async (auth) => {
                    setAuthenticated(auth);
                    // If user session data is not available
                    if (!userSessionData) {
                        // Create user data object
                        let userData: any = {
                            token: keycloak.token,
                            refreshToken: keycloak.refreshToken,
                            id: keycloak.subject,
                            email: keycloak.idTokenParsed.email,
                            authenticated: auth,
                            idToken: keycloak.idToken,
                        };

                        // Trigger event to create user data session
                        trigger("CreateUDASessionData", {
                            detail: { action: "createSession", data: userData },
                            bubbles: false,
                            cancelable: false,
                        });

                        // Toggle panel
                        await togglePanel();
                    }
                })
                .catch((error) => {
                    console.log(error);

                    // If there is an error, clear the session
                    if (error) {
                        // clearSession();
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
            if (isPlaying !== "on") {
                await openPanel();
            }
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

    useEffect(()=>{
        if(authenticated){
            init();
        }
    },[authenticated]);

    const init = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        if(!authenticated){
            return;
        }
        setShowLoader(true);
        await initSpecialNodes();
        if(searchParams.get(CONFIG.UDA_URL_Param)){
            let searchId = searchParams.get(CONFIG.UDA_URL_Param);
            recordUserClickData('searchRecordingId', '', parseInt(searchId));
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
            await getSearchResults(0, true);
        }
        if (hide) {
            await squeezeBody(true);
        }
    };

    const updateRecordedData = async () => {
        let recordingData = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
        // console.log(recordingData);
        if(recordingData.length > 0) {
            setRecSequenceData(recordingData);
        } else {
            setRecSequenceData([]);
        }
    }

    /**
     * Initializing functionality on start of the application
     */
    useEffect(() => {

        // Registering event handlers on startup of the application
        on("UDAUserSessionData", createSession);
        on("UDAAuthenticatedUserSessionData", createSession);
        on("UDAAlertMessageData", authenticationError);
        on("UDAClearSessionData", clearSession);
        on("openPanel", openPanel);
        on("closePanel", closePanel);
        on("updateRecordedData", updateRecordedData);

        /**
         * Asynchronous function to be get called in the beginning
         */
        const initialInvoke = async ()=> {

            let userSessionData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
            if (!userSessionData) {
                trigger("RequestUDASessionData", {
                    detail: { data: "getusersessiondata" },
                    bubbles: false,
                    cancelable: false,
                });
            } else {
                setUserSessionData(userSessionData);
                // setAuthenticated(true);
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

            // Send pageview with a custom path
            ReactGA.send({ hitType: "pageView", page: "/", title: "Loaded Plugin" });

        }

        // Initializing google analytics
        ReactGA.initialize(process.env.googleAnalyticsMeasurementId, {testMode: ((process.env.enableGoogleAnalytics === 'false') ? true : false)});

        initialInvoke();

        // Clearing event handlers on application close.
        return () => {
            off("UDAUserSessionData", createSession);
            off("UDAAuthenticatedUserSessionData", createSession);
            off("UDAAlertMessageData", authenticationError);
            off("openPanel", openPanel);
            off("closePanel", closePanel);
            off("updateRecordedData", updateRecordedData);
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
            cancel(true);
            previousSearchKeyword.current = searchKeyword;
            getSearchResults(0, true);
        }

        if (reFetchSearch === "on") {
            getSearchResults(0,true);
            setReFetchSearch("off");
        }
    }, [searchKeyword, reFetchSearch]);

    /**
     * Sync data with storage
     */
    /*useInterval(() => {
        let recordingData = getFromStore(CONFIG.RECORDING_SEQUENCE, false);
        // console.log(recordingData);
        if(recordingData.length > 0) {
            setRecSequenceData(recordingData);
        }
    }, CONFIG.SYNC_INTERVAL);*/

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
    const getSearchResults = async (_page: number = 0, refetch=false) => {
        if (!authenticated) {
            return;
        }
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
                if(_page===0 &&searchResults.length > 0 && !refetch) {
                    setShowLoader(false);
                    return;
                } else if (!_.isEmpty(selectedRecordingDetails)) {
                    setShowLoader(false);
                    return;
                }
                /*if(selectedRecordingDetails){
                    return;
                }*/
                if(_page===0 && refetch) {
                    setShowLoader(true);
                }
                let domain = fetchDomain();
                const _searchResults = await fetchSearchResults({
                    keyword: searchKeyword,
                    page: _page,
                    domain: encodeURI(domain),
                    additionalParams: global.UDAGlobalConfig.enablePermissions
                        ? encodeURI(JSON.stringify(global.UDAGlobalConfig.permissions))
                        : null,
                });
                setTimeout(() => setShowLoader(false), 500);
                if (_searchResults.length) {
                    setPage(_page);
                    if(_searchResults.length===10){
                        setHasMorePages(true);
                    } else {
                        setHasMorePages(false);
                    }
                    if(_page===0){
                        setSearchResults(_searchResults);
                    } else {
                        setSearchResults(searchResults.concat(_searchResults));
                    }
                } else {
                    setHasMorePages(false);
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
        recordUserClickData('recordingStart');
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
                recordUserClickData('recordingSubmit');
                await postRecordSequenceData({ ...data });
                await setSearchKeyword("");
                break;
            case "cancel":
                recordUserClickData('recordingStop');
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
                                          hasMorePages={hasMorePages}
                                          page={page}
                                          config={
                                              global.UDAGlobalConfig
                                          }
                                      />
                                  )}
                              {(recSequenceData?.length > 0) && <>
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
                                </>
                              }
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
                                      searchKeyword={searchKeyword}
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
            <Toggler toggleFlag={hide} userContent={userContent} toggleHandler={togglePanel}
                     udaDivId={global.UDAGlobalConfig.udaDivId} enableUdaIcon={global.UDAGlobalConfig.enableUdaIcon}
                     config={global.UDAGlobalConfig}/>
        </UserDataContext.Provider>
    );
}

export default App;
