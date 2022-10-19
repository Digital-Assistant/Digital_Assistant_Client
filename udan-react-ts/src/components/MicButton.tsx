import React, { useEffect, useRef } from "react";

interface IMicButtonProps{
    onSpeech: (text: string) => void
}

const speech = (window as any).webkitSpeechRecognition;
let UDAVoiceRecognition: any;
if (speech) {
  UDAVoiceRecognition = speech;
}

const MicButton = ({onSpeech}:IMicButtonProps) => {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);

  const recognition = useRef<typeof UDAVoiceRecognition>( new UDAVoiceRecognition())

  useEffect(() => {
    recognition.current.lang = "en-US";

    recognition.current.onstart = function () {
      setIsRecording(true);
    };

    recognition.current.onerror = function (event: any) {
      if (event.error === "no-speech") {
        alert("No speech was detected. Try again.");
      }
      setIsRecording(false);
      stopRecord();
    };

    recognition.current.onresult = function (event: any) {
        console.log(event, 'speech event recognised in MicButton.tsx line 33');
        
      if (event.results.length > 0) {
        const current = event.resultIndex;
        // Get a transcript of what was said.
        const transcript = event.results[current][0].transcript;
        // setSearchKeyword(transcript);
        setIsRecording(false);
        stopRecord();
        onSpeech(transcript)
      }
    };
  }, []);

  const startRecord = () => {
    recognition.current.start();
  };

  const stopRecord = () => {
    recognition.current.stop();
  };


  return (
    <button
      className={isRecording ? "uda-stop-btn-bg" : "uda-mic-btn"}
      onClick={isRecording ? stopRecord : startRecord}
      style={{ borderRadius: "5px 0px 0px 5px" }}
      id="uda-voice-icon-start"
    />
  );
};

export default MicButton;
