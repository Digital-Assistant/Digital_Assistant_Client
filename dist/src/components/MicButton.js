import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
const speech = window.webkitSpeechRecognition;
let UDAVoiceRecognition;
if (speech) {
    UDAVoiceRecognition = speech;
}
const MicButton = ({ onSpeech, selectedLang }) => {
    const [isRecording, setIsRecording] = React.useState(false);
    const recognition = useRef(new UDAVoiceRecognition());
    useEffect(() => {
        recognition.current.lang = selectedLang;
        recognition.current.onstart = function () {
            setIsRecording(true);
        };
        recognition.current.onerror = function (event) {
            if (event.error === "no-speech") {
                alert("No speech was detected. Try again.");
            }
            setIsRecording(false);
            stopRecord();
        };
        recognition.current.onresult = function (event) {
            if (event.results.length > 0) {
                const current = event.resultIndex;
                // Get a transcript of what was said.
                const transcript = event.results[current][0].transcript;
                setIsRecording(false);
                stopRecord();
                onSpeech(transcript);
            }
        };
    }, [selectedLang]);
    const startRecord = () => {
        recognition.current.start();
    };
    const stopRecord = () => {
        recognition.current.stop();
        setIsRecording(false);
    };
    return (_jsx("button", { className: (isRecording ? "uda-stop-btn-bg" : "uda-mic-btn") + " uda_exclude", onClick: isRecording ? stopRecord : startRecord, style: { borderRadius: "5px 0px 0px 5px" }, id: "uda-voice-icon-start" }));
};
export default MicButton;
//# sourceMappingURL=MicButton.js.map