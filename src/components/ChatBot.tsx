import React, {useEffect} from "react";

import {ParentCompProps} from "../interfaces/ParentCompProps";

export const ChatBot: React.FC<ParentCompProps> = (props) => {

  let shadowRoot: any;

  const createRootElement = () => {
    // get shadow root element
    shadowRoot = document.getElementById('udan-react-root').shadowRoot;

    let chatBotDiv = shadowRoot.getElementById('chat-bot-root');

    // Create div element for react to render into
    // const angularDiv = document.createElement('chat-bot-root');
    // angularDiv.setAttribute('id', 'chat-bot-root');

    // Append react root to shadow root
    // shadowRoot.appendChild(angularDiv);

    /*let chatBotScripts = [
      'runtime.js',
      'polyfills.js',
      'main.js'
    ]

    for(let chatBotScript of chatBotScripts){
      const scriptDiv: any = document.createElement('script');
      scriptDiv.src = "../chatbot/"+chatBotScript;
      chatBotDiv.appendChild(scriptDiv);
    }
    */

    require('../chatbot/runtime.js');
    require('../chatbot/polyfills.js');
    require('../chatbot/main.js');

  }

  useEffect(()=>{
    createRootElement();
  },[])

  // return <div id="chat-bot-root"></div>;
  // return React.createElement('chat-bot-root', {id:"chat-bot-root"});
  return <></>;
}
