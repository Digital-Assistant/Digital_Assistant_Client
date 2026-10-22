import { useState, useCallback, useEffect } from "react";
import { startRecording, cancelRecording, StorageUtil, CONFIG } from "@udan/digital-assistant-sdk";
import { Layout } from "./Layout";
import { SearchResults } from "./SearchResults";
import { StartRecording } from "./StartRecording";
import { Countdown } from "./Countdown";
import { RecordingScreen } from "./RecordingScreen";
import { LoginScreen } from "./LoginScreen";
import { useAuth } from "../contexts/AuthContext";

/**
 * Recording states — stepEditor and saving are managed internally
 * by RecordingScreen.tsx, so HomePageUser only tracks idle/start/countdown/recording.
 */
type RecordingState = 'idle' | 'start' | 'countdown' | 'recording';

export default function HomePageUser() {
  const { isAuthenticated } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [displayKeyword, setDisplayKeyword] = useState("");
  const [config, setConfig] = useState<any>(
    typeof window !== 'undefined' ? (window as any).UDAGlobalConfig : undefined
  );

  useEffect(() => {
    const handler = () => setConfig({ ...(window as any).UDAGlobalConfig });
    window.addEventListener('UDAConfigUpdated', handler);
    return () => window.removeEventListener('UDAConfigUpdated', handler);
  }, []);

  /**
   * Initialise from storage — if recording was active before the page
   * navigated/reloaded, restore the 'recording' state immediately so the
   * user sees the RecordingScreen instead of the list.
   */
  const getInitialRecordingState = (): RecordingState => {
    const stored = StorageUtil.getFromStore(CONFIG.RECORDING_SWITCH_KEY, true);
    if (stored === true || stored === "true") return 'recording';
    return 'idle';
  };

  const [recordingState, setRecordingState] = useState<RecordingState>(getInitialRecordingState);
  const [countdown, setCountdown] = useState(3);
  const [panelOpenedDuringRecording, setPanelOpenedDuringRecording] = useState(false);

  /**
   * On mount: if recording was already active (page navigated during recording),
   * re-attach click listeners so the SDK captures the new page's clicks too.
   */
  useEffect(() => {
    const stored = StorageUtil.getFromStore(CONFIG.RECORDING_SWITCH_KEY, true);
    if (stored === true || stored === "true") {
      startRecording(); // re-attaches addBodyEvents on the new page
    }
  }, []);

  const handleSearchChange = useCallback((display: string, query: string) => {
    setDisplayKeyword(display);
    setSearchKeyword(query);
  }, []);

  const handleRecClick = () => {
    setRecordingState('start');
  };

  const handleStart = () => {
    setRecordingState('countdown');
    setCountdown(3);
  };

  /**
   * Called by RecordingScreen on cancel or after successful save.
   */
  const handleCancel = () => {
    cancelRecording();
    setRecordingState('idle');
  };

  const recordHandler = (action: string) => {
    if (action === 'cancel') {
      handleCancel();
    }
  };

  const refetchSearch = (_trigger?: string) => {
    setSearchKeyword((prev) => prev);
  };

  // Countdown timer — activates SDK recording on the final tick
  useEffect(() => {
    if (recordingState === 'countdown') {
      if (countdown > 1) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(async () => {
          await startRecording(); // sets window.isRecording + addBodyEvents()
          setRecordingState('recording');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [recordingState, countdown]);

  // Reset panelOpenedDuringRecording when recording ends
  useEffect(() => {
    if (recordingState !== 'recording') setPanelOpenedDuringRecording(false);
  }, [recordingState]);

  if (!isAuthenticated) {
    return (
      <Layout showSearchBar={false}>
        <LoginScreen />
      </Layout>
    );
  }

  const isRecording = recordingState === 'recording';
  const minimizeForRecording = isRecording && config?.enableUDAIconDuringRecording === true && !panelOpenedDuringRecording;

  return (
    <Layout
      onRecClick={(recordingState === 'idle' && config?.enableRecording !== false) ? handleRecClick : undefined}
      searchKeyword={displayKeyword}
      onSearchChange={handleSearchChange}
      config={config}
      minimizeForRecording={minimizeForRecording}
      onFloatingButtonClick={minimizeForRecording ? () => setPanelOpenedDuringRecording(true) : undefined}
    >
      {recordingState === 'idle' && <SearchResults searchKeyword={searchKeyword} />}
      {recordingState === 'start' && <StartRecording onStart={handleStart} onCancel={handleCancel} />}
      {recordingState === 'countdown' && <Countdown count={countdown} />}
      {isRecording && !minimizeForRecording && (
        <RecordingScreen
          onCancel={handleCancel}
          recordHandler={recordHandler}
          refetchSearch={refetchSearch}
          config={config}
        />
      )}
    </Layout>
  );
}