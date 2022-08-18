///<reference types="chrome"/>
import logo from './logo.svg'
import './App.css'
import {squeezeBody} from './util'
import React, { useState, useEffect,useCallback } from 'react';

const allowedTags = ['a','button'];

function getLogo() {
  if (window?.chrome) {
    return window?.chrome?.runtime?.getURL(logo)
  } 
  return "https://s4.aconvert.com/convert/p3r68-cdx67/alc9l-hnvsn.svg";
}

const useMutationObserver = (
  ref:any,
  callback:any,
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
  const [anchors, setAnchors] = React.useState<any>([]);
  const [hide, setHide] = React.useState<boolean>(true);
  
  React.useEffect(() => {
    document.body.addEventListener('mouseover', (event: any) => {
      if (event?.target?.className?.indexOf('udan-added') === -1 &&
        event?.target?.className?.indexOf('exclude') === -1) {
        processElements(event.target);
      }
    });
  });

  const processElements = (element: any) => {
    if (element && allowedTags.includes(element?.tagName?.toLowerCase())) {
      element.className += " udan-added";
      anchors.push(element);
      setAnchors([...anchors]);
    }
  }

  const togglePanel = () => {
    setHide(!hide);
    squeezeBody(hide);
  }

  return (
    <>
    <div className="udan-main-panel" style={{display:hide?'none':'block'}}>
        <div id="uda-html-container">
        <div id="uda-html-content" nist-voice="true">
          <div>
            <div className="uda-page-right-bar">
              <div>
                <div className="uda-ribbon-arrow" id="uda-close-panel" onClick={()=>togglePanel()}>
                  <span className='arrow'> &gt;&gt; </span>
                </div>
                <div className="uda-icon-txt">
                  <img src={getLogo()} />
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
                    {anchors.map((anchor: any, index: number) => (<li><a href={"#"} className={"exclude"}  key={index}>{anchor.innerText}</a></li>))}
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
                      <img src={getLogo()} width="15px" height="15px;"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
      
    <div className="default-logo" style={{display:!hide?'none':'block'}}>
        <img src={getLogo()} onClick={() => togglePanel()} alt={"udan logo"} />
    </div> 
    </>
  )
}

export default App
