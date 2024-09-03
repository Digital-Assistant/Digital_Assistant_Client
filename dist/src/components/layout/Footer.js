import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PlusOutlined } from "@ant-design/icons";
import { getLogo } from "./common";
/**
 *
 * @param props
 * @returns footer container
 */
const Footer = (props) => {
    const setShowRecord = (flag) => {
        if (props.toggleHandler)
            props.toggleHandler(flag, "footer");
    };
    const printYear = () => {
        const date = new Date();
        const year = date.getFullYear();
        return year;
    };
    return (_jsx("div", { children: _jsxs("div", Object.assign({ className: "uda-footer-bar" }, { children: [(props.config.enableRecording && !props.isRecording) &&
                    _jsx("div", Object.assign({ className: "uda-container" }, { children: _jsx("button", Object.assign({ className: "uda-new-seq uda-exclude", onClick: () => setShowRecord(true) }, { children: _jsx(PlusOutlined, { className: "secondary" }) })) })), _jsxs("div", Object.assign({ className: "uda-container", style: { borderTop: "1px solid #969696", marginTop: 30 } }, { children: [_jsxs("div", Object.assign({ className: "uda-footer-left" }, { children: ["Copyrights Reserved ", printYear(), "."] })), _jsxs("div", Object.assign({ className: "uda-footer-right", style: { textAlign: "right" } }, { children: [_jsx("a", Object.assign({ href: "https://udan.nistapp.ai", "data-exclude": "true", target: "_blank" }, { children: "Know More" })), _jsx("img", { src: getLogo(), width: "15px", height: "15px;", alt: "UDAN-Logo" })] }))] }))] })) }));
};
export default Footer;
//# sourceMappingURL=Footer.js.map