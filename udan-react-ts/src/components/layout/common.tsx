/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render layout components
 * Associated Route/Usage: *
 */

import React from "react";
import { DoubleLeftOutlined } from "@ant-design/icons";

import { MProps } from "./interfaces";

export const Toggler = (props: MProps) => {
  const toggle = () => {
    if (props.toggleHandler) props.toggleHandler();
  };
  return (
    <div
      className="default-logo uda_exclude"
      style={{ display: !props?.toggleFlag ? "none" : "block" }}
      onClick={() => toggle()}
    >
      <img className="uda_exclude" src={getLogo()} alt={"udan logo"} />
      <span className="arrow">
        <DoubleLeftOutlined size={16} />
      </span>
    </div>
  );
};

/**
 *
 * @returns logo path
 */
export const getLogo = () => {
  return "https://cdn.statically.io/gh/Digital-Assistant/Digital_Assistant_Client/react-typescript/udan-react-ts/src/logo.svg";
};
