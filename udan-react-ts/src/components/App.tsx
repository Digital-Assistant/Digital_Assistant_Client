import React, {useEffect } from "react";
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";

function App() {

  const [title, setTitle] = React.useState('');
  const [headlines, setHeadlines] = React.useState<string[]>([]);
  const [anchors, setAnchors] = React.useState<HTMLElement[]>([]);
  const [hide, setHide] = React.useState<boolean>(true);

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        'GET_DOM',
        (response: any) => {
          // console.log(response)
           setAnchors([...response?.anchors]);
        });
    });
  });

  const togglePanel = () => { 
    setHide(!hide);
     chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, t => {
      chrome.tabs.sendMessage(
        t[0].id || 0,
        'toggle');
    });
  }

  return (
    <>
    <div className="udan-main-panel" style={{display:hide?'none':'block'}}>
    <Draggable handle=".draggable-wrapper">
      <ResizableBox
        width={350}
        height={window.innerHeight}
        minConstraints={[100, 100]}
        maxConstraints={[340, 700]}
      >
        <div className="draggable-wrapper">
          {/* <div className="icon-wrapper">
            <div className="icon red"></div>
            <div className="icon yellow"></div>
            <div className="icon green"></div>
          </div> */}
        </div>
        <div id="uda-html-container">
        <div id="uda-html-content" nist-voice="true">
          <div>
            <div className="uda-page-right-bar">
              <div>
                <div className="uda-ribbon-arrow" id="uda-close-panel" onClick={()=>togglePanel()}>
                  <img src="./img/icons/right-arrow.png" />
                </div>
                <div className="uda-icon-txt">
                  <img src="./img/icons/nist-logo.png" />
                  <span className="uda-help-bg-tooltip">Need Help?</span>
                </div>
                <div className="uda-icon-txt">
                  <span className="" style={{ color: "#303f9f", fontWeight: "bold" }}>
                    UDAN(Beta)
                  </span>
                </div>
                <div
                  className="uda-container"
                  style={{ textAlign: "center", marginTop: 10 }}
                >
                  <div className="uda-search-div">
                    <button
                      className="uda-mic-btn"
                      style={{ borderRadius: "5px 0px 0px 5px" }}
                      id="uda-voice-icon-start"
                    />
                    <button
                      className="uda-stop-btn-bg"
                      style={{ borderRadius: "5px 0px 0px 5px", display: "none" }}
                      id="uda-voice-icon-stop"
                    />
                    <input
                      type="text"
                      name="uda-search-input"
                      className="uda-input-cntrl"
                      placeholder="search..."
                      id="uda-search-input"
                    />
                    <button
                      className="uda-search-btn"
                      id="uda-search-btn"
                      style={{ borderRadius: "0px 5px 5px 0px" }}
                    />
                  </div>
                </div>
              </div>
              <hr style={{ border: "1px solid #969696", width: "100%" }} />
              <div
                className="uda-container uda-clear uda-cards-scroller"
                id="uda-content-container"
              >
                <div className="uda-card">
                    {/* <h5>{title}</h5> */}
                    {/* {headlines.map((headline, index) => (<i key={index}>{headline}</i>))} */}
                    {anchors.map((anchor:any, index:number) => (<li><a href={"#"} key={index}>{anchor}</a></li>))}
                </div>
              </div>
              <div>
                <div className="uda-footer-bar">
                  <div className="uda-container">
                    <div className="uda-dropdown" id="uda-advanced-btn">
                      <button className="uda-advanced-btn">
                        <span>Advanced</span>
                      </button>
                      <div className="uda-advanced-btn-content">
                        <a id="uda-advance-section">New Sequence </a>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div
                    className="uda-container"
                    style={{ borderTop: "1px solid #969696", marginTop: 30 }}
                  >
                    <div className="uda-footer-left">Copyrights Reserved 2021.</div>
                    <div
                      className="uda-footer-right"
                      style={{ paddingTop: 5, textAlign: "right" }}
                    >
                      <a href="https://udan.nistapp.ai" target="_blank">
                        Know More{" "}
                      </a>
                      <img src="./img/icons/nist-logo.png" width="15px" height="15px;"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="editable-div" id="kr-edit" contentEditable />
      </ResizableBox>
      </Draggable>
    </div>  
      
    <div className="default-logo" style={{display:!hide?'none':'block'}}>
        <img src="./img/icons/nist-logo.png" onClick={() => togglePanel()} alt={"udan logo"} />
      </div> 
    </>
  );
}

export default App;
