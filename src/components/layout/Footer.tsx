import React from "react";

import { PlusOutlined } from "@ant-design/icons";

import { MProps } from "./interfaces";
import { getLogo } from "./common";

/**
 *
 * @param props
 * @returns footer container
 */
const Footer = (props: MProps) => {
  const setShowRecord = (flag: boolean) => {
    if (props.toggleHandler) props.toggleHandler(flag, "footer");
  };

  const printYear = ()=> {
    const date = new Date();
    const year = date.getFullYear();
    return year;
  }

  return (
    <div>
      <div className="uda-footer-bar">
        {props.config.enableRecording &&
            <div className="uda-container">
                <button
                    className="uda-new-seq uda-exclude"
                    onClick={() => setShowRecord(true)}
                >
                    <PlusOutlined className="secondary"/>
                </button>
            </div>
        }
        <div
          className="uda-container"
          style={{ borderTop: "1px solid #969696", marginTop: 30 }}
        >
          <div className="uda-footer-left">Copyrights Reserved {printYear()}.</div>
          <div
            className="uda-footer-right"
            style={{ textAlign: "right" }}
          >
            <a
              href="https://udan.nistapp.ai"
              data-exclude="true"
              target="_blank"
            >
              Know More
            </a>
            <img src={getLogo()} width="15px" height="15px;" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
