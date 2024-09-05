import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CloseCircleOutlined, VideoCameraAddOutlined, } from "@ant-design/icons";
/**
 * To render record container
 * @returns HTML Element
 */
export const RecordButton = (props) => {
    const cancel = () => {
        if (props.cancelHandler)
            props.cancelHandler();
    };
    const recordSequence = () => {
        if (props.recordSeqHandler)
            props.recordSeqHandler();
    };
    return (props === null || props === void 0 ? void 0 : props.recordButtonVisibility) ? (_jsxs("div", Object.assign({ className: "uda-card-details uda_exclude" }, { children: [_jsx("span", Object.assign({ style: { float: "right" } }, { children: _jsx(CloseCircleOutlined, { className: "small uda_exclude", onClick: () => cancel() }) })), _jsx("h5", { children: "Create your own action" }), _jsx("div", Object.assign({ className: "flex-card flex-center uda_exclude" }, { children: _jsxs("button", Object.assign({ style: { marginTop: 20, flexDirection: "column" }, className: "uda-record-round-btn flex-card flex-center round uda_exclude", id: "uda-enable-record", onClick: () => recordSequence() }, { children: [_jsx(VideoCameraAddOutlined, {}), _jsx("span", Object.assign({ style: { fontSize: 10, marginTop: 6 } }, { children: "Record" }))] })) }))] }))) : null;
};
//# sourceMappingURL=RecordButton.js.map