import React from "react";
import {ParentCompProps} from "../../interfaces/ParentCompProps";
import {Tabs, TabsProps} from 'antd';
import {ChatBot} from "../ChatBot";

const Body: React.FC<ParentCompProps> = (props) => {
  const { content } = props;

  const chatBotDiv = () => {
    return React.createElement('chat-bot-root', {id:"chat-bot-root", class:"chat-bot-root"}, <ChatBot></ChatBot>);
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `UDAN`,
      children: content,
    },
    {
      key: '2',
      label: `SMARTBOT`,
      children: chatBotDiv() ,
    }
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div
      className="uda-container uda-clear uda-cards-scroller uda_exclude"
      id="uda-content-container"
    >
      {/*{content}*/}
      {/*<ChatBot></ChatBot>*/}
      <Tabs defaultActiveKey="1" centered size={`large`} items={items} onChange={onChange} />
    </div>
  );
};

// @ts-ignore
export default Body;
