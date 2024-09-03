var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Author: Yureswar Ravuri
 * Type: App Component
 * Objective: To render content script
 */
import { useState, useEffect, useCallback, useRef } from "react";
import "./css/UDAN.scss";
import { Button, Spin } from "antd";
import { fetchRecord, fetchSearchResults } from "./services/searchService";
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
import { postRecordSequenceData, recordUserClickData } from "./services";
import { addBodyEvents } from "./util/addBodyEvents";
import { initSpecialNodes } from "./util/initSpecialNodes";
import { fetchDomain } from "./util/fetchDomain";
import ReactGA from 'react-ga4';
// adding global variable declaration for exposing react custom configuration
global.UDAPluginSDK = AppConfig;
global.UDAGlobalConfig = CustomConfig;
function App(props) {
    const [isRecording, setIsRecording] = useState(getFromStore(CONFIG.RECORDING_SWITCH_KEY, true) == "true" || false);
    const [hide, setHide] = useState(!isRecording);
    const [showLoader, setShowLoader] = useState(false);
    const [showSearch, setShowSearch] = useState(true);
    const [showRecord, setShowRecord] = useState(false);
    const [playDelay, setPlayDelay] = useState("off");
    const [isPlaying, setIsPlaying] = useState(getFromStore(CONFIG.RECORDING_IS_PLAYING, true) || "off");
    const [manualPlay, setManualPlay] = useState(getFromStore(CONFIG.RECORDING_MANUAL_PLAY, true) || "off");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [reFetchSearch, setReFetchSearch] = useState("off");
    const [recSequenceData, setRecSequenceData] = useState([]);
    const [recordSequenceDetailsVisibility, setRecordSequenceDetailsVisibility,] = useState(false);
    const [selectedRecordingDetails, setSelectedRecordingDetails] = useState(getFromStore(CONFIG.SELECTED_RECORDING, false) || false);
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
        if (!showLoader && (global.UDAGlobalConfig.enablePermissions || global.UDAGlobalConfig.enableForAllDomains)) {
            // init();
            getSearchResults(0, true);
        }
    }, [global.UDAGlobalConfig.enablePermissions, global.UDAGlobalConfig.enableForAllDomains]);
    useEffect(() => {
        trigger("RequestUDASessionData", {
            detail: { data: "getusersessiondata" },
            bubbles: false,
            cancelable: false,
        });
    }, [global.UDAGlobalConfig.realm, global.UDAGlobalConfig.clientId, global.UDAGlobalConfig.clientSecret]);
    useEffect(() => {
        if (global.UDAGlobalConfig.environment !== previousEnvironment.current) {
            getSearchResults(0, true);
        }
    }, [global.UDAGlobalConfig.environment]);
    useEffect(() => {
        if (invokeKeycloak) {
            let keycloakData = getFromStore(CONFIG.UDAKeyCloakKey, false);
            if (keycloakData) {
                setKeycloakSessionData(keycloakData);
                // setAuthenticated(true);
            }
            else {
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
                .then((auth) => __awaiter(this, void 0, void 0, function* () {
                // If keycloak is authenticated
                if (keycloak.authenticated) {
                    // Create user data object
                    let userData = {
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
                    yield togglePanel();
                }
            }))
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
                .then((auth) => __awaiter(this, void 0, void 0, function* () {
                setAuthenticated(auth);
                // If user session data is not available
                if (!userSessionData) {
                    // Create user data object
                    let userData = {
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
                    yield togglePanel();
                }
            }))
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
    const openUDAPanel = () => __awaiter(this, void 0, void 0, function* () {
        if (!_.isEmpty(selectedRecordingDetails)) {
            if (isPlaying == "on") {
                setTimeout(() => {
                    setPlayDelay("on");
                }, 2000);
            }
            // togglePanel();
            if (isPlaying !== "on") {
                yield openPanel();
            }
            offSearch();
            setRecordSequenceDetailsVisibility(true);
        }
        else if (isRecording) {
            // togglePanel();
            yield openPanel();
            offSearch();
        }
        else {
            setShowSearch(true);
        }
    });
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
    useEffect(() => {
        if (authenticated) {
            init();
        }
    }, [authenticated]);
    const init = () => __awaiter(this, void 0, void 0, function* () {
        const searchParams = new URLSearchParams(window.location.search);
        if (!authenticated) {
            return;
        }
        setShowLoader(true);
        yield initSpecialNodes();
        if (searchParams.get(CONFIG.UDA_URL_Param)) {
            let searchId = searchParams.get(CONFIG.UDA_URL_Param);
            yield recordUserClickData('searchRecordingId', window.location.host, parseInt(searchId));
            let recordDetails = yield fetchRecord({
                id: searchParams.get(CONFIG.UDA_URL_Param),
                domain: encodeURI(fetchDomain()),
                additionalParams: global.UDAGlobalConfig.enablePermissions
                    ? encodeURI(JSON.stringify(global.UDAGlobalConfig.permissions))
                    : null,
            });
            if (recordDetails && recordDetails !== null) {
                setToStore(recordDetails, CONFIG.SELECTED_RECORDING, false);
                yield showRecordingDetails(recordDetails);
                yield togglePanel();
                offSearch();
                setRecordSequenceDetailsVisibility(true);
            }
            else {
                yield togglePanel();
                offSearch();
                setRecordSequenceDetailsVisibility(true);
                cancel();
            }
        }
        else {
            yield getSearchResults(0, true);
        }
        if (hide) {
            yield squeezeBody(true);
        }
    });
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
        /**
         * Asynchronous function to be get called in the beginning
         */
        const initialInvoke = () => __awaiter(this, void 0, void 0, function* () {
            let userSessionData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
            if (!userSessionData) {
                trigger("RequestUDASessionData", {
                    detail: { data: "getusersessiondata" },
                    bubbles: false,
                    cancelable: false,
                });
            }
            else {
                setUserSessionData(userSessionData);
                // setAuthenticated(true);
                openUDAPanel();
                if (userSessionData.authenticationsource === "keycloak") {
                    setInvokeKeycloak(true);
                }
                else {
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
            ReactGA.send({ hitType: "pageview", page: "/", title: "Loaded Plugin" });
        });
        // Initializing google analytics
        ReactGA.initialize(process.env.googleAnalyticsMeasurementId, { testMode: ((process.env.enableGoogleAnalytics === 'false') ? true : false) });
        initialInvoke();
        // Clearing event handlers on application close.
        return () => {
            off("UDAUserSessionData", createSession);
            off("UDAAuthenticatedUserSessionData", createSession);
            off("UDAAlertMessageData", authenticationError);
            off("openPanel", openPanel);
            off("closePanel", closePanel);
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
            getSearchResults(0, true);
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
    const togglePanel = () => __awaiter(this, void 0, void 0, function* () {
        setHide(!hide);
        yield squeezeBody(!hide);
    });
    const openPanel = () => __awaiter(this, void 0, void 0, function* () {
        setHide(false);
        yield squeezeBody(true);
    });
    const closePanel = () => __awaiter(this, void 0, void 0, function* () {
        setHide(true);
        yield squeezeBody(false);
    });
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
    const getSearchResults = (_page = 0, refetch = false) => __awaiter(this, void 0, void 0, function* () {
        if (!authenticated) {
            return;
        }
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setTimer(setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            if (isRecording) {
                setShowLoader(false);
                yield addBodyEvents();
                return;
            }
            if (_page === 0 && searchResults.length > 0 && !refetch) {
                setShowLoader(false);
                return;
            }
            else if (!_.isEmpty(selectedRecordingDetails)) {
                setShowLoader(false);
                return;
            }
            /*if(selectedRecordingDetails){
                return;
            }*/
            if (_page === 0 && refetch) {
                setShowLoader(true);
            }
            let domain = fetchDomain();
            const _searchResults = yield fetchSearchResults({
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
                if (_searchResults.length === 10) {
                    setHasMorePages(true);
                }
                else {
                    setHasMorePages(false);
                }
                if (_page === 0) {
                    setSearchResults(_searchResults);
                }
                else {
                    setSearchResults(searchResults.concat(_searchResults));
                }
            }
            else {
                setHasMorePages(false);
                setSearchResults([]);
            }
        }), CONFIG.apiInvokeTime));
    });
    /**to enable record sequence card/container */
    const recordSequence = () => __awaiter(this, void 0, void 0, function* () {
        playHandler("off");
        setIsRecording(true);
        setShowRecord(false);
        setReFetchSearch("");
        setShowSearch(false);
        yield recordUserClickData('recordingStart', window.location.host);
        yield addBodyEvents();
    });
    /**common cancel button handler */
    const cancel = (forceRefresh = false) => {
        setIsRecording(false);
        setShowRecord(false);
        setRecordSequenceDetailsVisibility(false);
        playHandler("off");
        setManualPlay("off");
        setToStore("off", CONFIG.RECORDING_MANUAL_PLAY, true);
        setToStore([], CONFIG.RECORDING_SEQUENCE, false);
        setToStore({}, CONFIG.SELECTED_RECORDING, false);
        setSelectedRecordingDetails({});
        if (forceRefresh || searchResults.length === 0) {
            setReFetchSearch("on");
        }
        setShowSearch(true);
        if (window.udanSelectedNodes)
            window.udanSelectedNodes = [];
    };
    /**
     * To handle record / cancel buttons
     * @param type
     * @param data
     */
    const recordHandler = (type, data) => __awaiter(this, void 0, void 0, function* () {
        switch (type) {
            case "submit":
                yield recordUserClickData('recordingSubmit', window.location.host);
                yield postRecordSequenceData(Object.assign({}, data));
                yield setSearchKeyword("");
                break;
            case "cancel":
                yield recordUserClickData('recordingStop', window.location.host);
                setIsRecording(false);
                yield setSearchKeyword("");
                break;
        }
        setReFetchSearch("on");
        setShowSearch(true);
        cancel();
    });
    /**
     * common toggle callback function
     * @param hideFlag
     * @param type
     */
    const toggleHandler = (hideFlag, type) => __awaiter(this, void 0, void 0, function* () {
        if (type == "footer") {
            setReFetchSearch("off");
            setShowSearch(false);
            setToStore([], CONFIG.RECORDING_SEQUENCE, false);
            setShowRecord(hideFlag);
        }
        else {
            yield togglePanel();
        }
    });
    /**
     * to handle record button
     * @param flag
     */
    const showRecordHandler = (flag) => {
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
    const toggleContainer = (card) => {
        if (card == "record-button") {
            return (showRecord === true &&
                isRecording === false &&
                !(recSequenceData === null || recSequenceData === void 0 ? void 0 : recSequenceData.length));
        }
        else if (card == "record-seq") {
            return (isRecording === true &&
                showRecord === false &&
                !(recSequenceData === null || recSequenceData === void 0 ? void 0 : recSequenceData.length));
        }
        else if (card == "recorded-data") {
            return recSequenceData && (recSequenceData === null || recSequenceData === void 0 ? void 0 : recSequenceData.length) > 0;
        }
        else if (card == "search-results") {
            return (isRecording === false &&
                showRecord === false &&
                recordSequenceDetailsVisibility === false);
        }
    };
    /**
     * Show recording details card
     * @param data
     */
    const showRecordingDetails = (data) => {
        playHandler("off");
        setReFetchSearch("");
        setShowSearch(false);
        setSelectedRecordingDetails(Object.assign({}, data));
        setRecordSequenceDetailsVisibility(true);
    };
    /**
     * Recording play handler callback
     * @param status
     */
    const playHandler = (status) => {
        setPlayDelay(status);
        setIsPlaying(status);
        setToStore(status, CONFIG.RECORDING_IS_PLAYING, true);
    };
    const userContent = () => {
        return _jsxs(_Fragment, { children: [authenticated && (_jsxs(_Fragment, { children: [_jsx(Header, { setSearchKeyword: setSearchKeyword, searchKeyword: searchKeyword, toggleFlag: hide, toggleHandler: toggleHandler, config: global.UDAGlobalConfig }), _jsx(Body, { content: _jsxs(_Fragment, { children: [showLoader && (_jsx(Spin, { tip: "Loading..." })), _jsx(UdanMain.RecordButton, { recordHandler: showRecordHandler, cancelHandler: cancel, recordSeqHandler: recordSequence, recordButtonVisibility: toggleContainer("record-button"), config: global.UDAGlobalConfig }), toggleContainer("record-seq") && (_jsx(UdanMain.RecordSequence, { cancelHandler: cancel, recordSequenceVisibility: toggleContainer("record-seq") })), !showLoader &&
                                        showSearch && (_jsx(UdanMain.SearchResults, { data: searchResults, showDetails: showRecordingDetails, playHandler: playHandler, visibility: toggleContainer("search-results"), addRecordHandler: setShowRecord, searchKeyword: searchKeyword, searchHandler: getSearchResults, hasMorePages: hasMorePages, page: page, config: global.UDAGlobalConfig })), _jsx(UdanMain.RecordedData, { isShown: toggleContainer("recorded-data"), data: recSequenceData, recordHandler: recordHandler, refetchSearch: setReFetchSearch, showLoader: setShowLoader, config: global.UDAGlobalConfig }), recordSequenceDetailsVisibility && (_jsx(UdanMain.RecordSequenceDetails, { data: selectedRecordingDetails, recordSequenceDetailsVisibility: recordSequenceDetailsVisibility &&
                                            !isRecording &&
                                            !toggleContainer("record-button"), cancelHandler: cancel, playHandler: playHandler, isPlaying: playDelay, config: global.UDAGlobalConfig, showLoader: setShowLoader }, "rSD" + recordSequenceDetailsVisibility))] }) }), _jsx(Footer, { toggleFlag: hide, addRecordBtnStatus: showRecord, toggleHandler: toggleHandler, config: global.UDAGlobalConfig, isRecording: isRecording })] })), !authenticated && (_jsx(_Fragment, { children: _jsx("div", Object.assign({ style: {
                            margin: "auto",
                            display: "inline-block",
                            width: "100% !important",
                        } }, { children: _jsx(Button, Object.assign({ type: "primary", className: "uda_exclude", onClick: () => {
                                keycloak.login();
                            } }, { children: "Login" })) })) }))] });
    };
    return (_jsxs(UserDataContext.Provider, Object.assign({ value: userSessionData }, { children: [_jsx("div", Object.assign({ className: "udan-main-panel", style: {
                    display: hide ? "none" : "block",
                    position: "relative",
                } }, { children: _jsx("div", Object.assign({ id: "uda-html-container" }, { children: _jsx("div", Object.assign({ id: "uda-html-content", className: "uda_exclude" }, { children: _jsx("div", { children: _jsx("div", Object.assign({ className: "uda-page-right-bar uda_exclude" }, { children: userContent() })) }) })) })) })), _jsx(Toggler, { toggleFlag: hide, userContent: userContent, toggleHandler: togglePanel, udaDivId: global.UDAGlobalConfig.udaDivId, enableUdaIcon: global.UDAGlobalConfig.enableUdaIcon, config: global.UDAGlobalConfig })] })));
}
export default App;
//# sourceMappingURL=App.js.map