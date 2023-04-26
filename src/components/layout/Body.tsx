import React from "react";
import {ParentCompProps} from "../../interfaces/ParentCompProps";
import {ChatBot} from "../ChatBot";

const Body: React.FC<ParentCompProps> = (props) => {
  const { content } = props;
  return (
    <div
      className="uda-container uda-clear uda-cards-scroller uda_exclude"
      id="uda-content-container"
    >
      {content}
      <ChatBot></ChatBot>
    </div>
  );
};

export default Body;
