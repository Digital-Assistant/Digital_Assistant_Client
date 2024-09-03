import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { translate } from "../util/translation";
import { Space } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
/**
 * To render record sequence container
 * @returns HTML Elements
 */
export const RecordSequence = (props) => {
    const cancelRecording = () => {
        if (props.cancelHandler) {
            props.cancelHandler();
        }
    };
    return props.recordSequenceVisibility ? (_jsxs("div", Object.assign({ className: "uda-card-details" }, { children: [_jsxs("h5", { children: [_jsx(Space, { children: _jsx("span", Object.assign({ className: "pulse" }, { children: _jsx(InfoCircleOutlined, {}) })) }), translate('recordSequenceHeading')] }), " ", _jsx("hr", {}), _jsx("h5", { children: translate('recordSequenceDescription') }), " ", _jsx("br", {}), _jsx("div", Object.assign({ className: "uda-recording", style: { textAlign: "center" } }, { children: _jsx("button", Object.assign({ className: "uda-record-btn uda-record-btn-icon uda_exclude", "data-exclude": true, onClick: () => { cancelRecording(); } }, { children: translate('cancelRecording') })) }))] }))) : null;
};
//# sourceMappingURL=RecordSequence.js.map