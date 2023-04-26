import '../chatbot/runtime.js';
import '../chatbot/polyfills.js';
import '../chatbot/main.js';
import '../chatbot/styles.css';
import React, {useEffect} from "react";

import {ParentCompProps} from "../interfaces/ParentCompProps";

export const ChatBot: React.FC<ParentCompProps> = (props) => {
  const {content} = props;

  let shadowRoot: any;

  const createRootElement = () => {
    // get shadow root element
    shadowRoot = document.getElementById('udan-react-root').shadowRoot;

    // Create div element for react to render into
    const angularDiv = document.createElement('chat-bot-root');
    angularDiv.setAttribute('id', 'chat-bot-root');

    // Append react root to shadow root
    shadowRoot.appendChild(angularDiv);
  }

  useEffect(()=>{
    createRootElement();
  },[])

  return <></>;
}
