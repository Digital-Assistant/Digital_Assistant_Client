import { useState, useEffect } from "react";
import { translate } from "../util/translation";
import svgPathsNew from "../imports/svg-k4wo7ducks";
import svgPathsMulti from "../imports/svg-xxlbqiqnh7";

interface FinalSaveScreenProps {
  name: string;
  setName: (name: string) => void;
  labels: { label: string; profanity?: boolean }[];
  setLabels: (labels: { label: string; profanity?: boolean }[]) => void;
  inputError: any;
  inputAlert: any;
  setInputAt: (at: string) => void;
  validateChange: (value: string) => Promise<boolean>;
  checkMainLabelProfanity: (value: string) => Promise<boolean | undefined>;
  onExtraLabelChange: (index: number, value: string) => Promise<boolean>;
  checkLabelProfanity: (index: number, value: string) => Promise<boolean | undefined>;
  addLabel: () => void;
  removeLabel: (index: number) => void;
  config: any;
  advBtnShow: boolean;
  setAdvBtnShow: (show: boolean) => void;
  tmpPermissionsObj: any;
  handlePermissions: (key: string, value: any) => void;
  slowPlayback: boolean;
  setSlowPlayback: (slow: boolean) => void;
  delayPlaybackTime: number;
  validateDelayTime: (value: number) => void;
  onCancel: () => void;
  onSubmit: () => void;
  disableForm: boolean;
  screenInfoNotAvailable: boolean;
  recordData: any[];
  getStepLabel: (item: any) => string;
  savingError: boolean;
  statusOptions?: any[];
  onStatusChange?: (statusId: number) => void;
}

export function FinalSaveScreen({
  name,
  setName,
  labels,
  setLabels,
  inputError,
  inputAlert,
  setInputAt,
  validateChange,
  checkMainLabelProfanity,
  onExtraLabelChange,
  checkLabelProfanity,
  addLabel,
  removeLabel,
  config,
  advBtnShow,
  setAdvBtnShow,
  tmpPermissionsObj,
  handlePermissions,
  slowPlayback,
  setSlowPlayback,
  delayPlaybackTime,
  validateDelayTime,
  onCancel,
  onSubmit,
  disableForm,
  screenInfoNotAvailable,
  recordData,
  getStepLabel,
  savingError,
  statusOptions,
  onStatusChange,
}: FinalSaveScreenProps) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start w-full overflow-y-auto max-h-[85vh] p-2">
      {/* Header */}
      <div className="flex items-center gap-[8px]">
        <div className="w-[12px] h-[12px] bg-[#FF0000] rounded-full pulse shadow-[0_0_8px_rgba(0,0,0,0.3)]"></div>
        <span className="font-['Raleway',sans-serif] text-[18px] font-bold text-black">
          Save Recording
        </span>
      </div>

      <hr className="w-full border-[#969696] my-0" />

      {/* Error alerts */}
      {savingError && (
        <div className="w-full bg-red-50 border border-red-300 text-red-700 rounded-[8px] px-4 py-3 text-sm">
          Some steps failed to save previously. Please retry.
        </div>
      )}
      {screenInfoNotAvailable && (
        <div className="w-full bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-[8px] px-4 py-3 text-sm">
          {translate("screenInfoError")}
        </div>
      )}

      {/* Status Selection */}
      {config?.enableStatusSelection && statusOptions && statusOptions.length > 0 && (
        <div className="w-full">
          <p className="font-['Raleway',sans-serif] font-semibold text-[14px] text-black mb-2">{translate('statusLabel')}</p>
          <select
            className="w-full bg-white border border-[#c8c8c8] h-[46px] rounded-[8px] px-3 font-['Raleway',sans-serif] text-[14px] text-black outline-none uda_exclude"
            value={tmpPermissionsObj.status || 1}
            onChange={(e) => onStatusChange?.(parseInt(e.target.value))}
          >
            {statusOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Recorded steps (read-only list) */}
      <div className="w-full">
        <p className="font-['Raleway',sans-serif] font-semibold text-[14px] text-black mb-2">Recorded Steps</p>
        <ul className="w-full flex flex-col gap-2">
          {recordData.map((item, index) => (
            <li
              key={`step-${index}`}
              className="bg-white content-stretch flex gap-[10px] h-[44px] items-center px-[10px] rounded-[8px] border border-[#e0e0e0]"
            >
              <span className="font-['Raleway',sans-serif] text-[14px] text-[#1c1c1e]">
                {index + 1}. {getStepLabel(item)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="w-full border-[#969696] my-0" />

      {/* Labels Section (Bottom Card) */}
      <div className="mt-3 rounded-[8px] bg-[#d5d5d5] p-4 relative w-full">
        {/* Original SVG background to ensure exact matching */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" fill="none" preserveAspectRatio="none" viewBox="0 0 424 186">
          <path d={svgPathsMulti.p16d5f480} fill="#D5D5D5" stroke="#D5D5D5" />
        </svg>

        <div className="relative z-10 flex flex-col">
          {/* Enable slow replay */}
          {config?.enableSlowReplay && (
            <div className="flex flex-col gap-2 mb-4">
              <button onClick={() => setSlowPlayback(!slowPlayback)} className="flex items-center gap-1">
                <div className="h-[16px] w-[32px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 32 16">
                    {slowPlayback ? (
                      <><rect fill="#007AFF" height="16" rx="8" width="32" /><circle cx="24" cy="8" fill="white" r="6" /></>
                    ) : (
                      <><rect fill="#969696" height="16" rx="8" width="32" /><circle cx="8" cy="8" fill="white" r="6" /></>
                    )}
                  </svg>
                </div>
                <span className="font-['Roboto',sans-serif] text-[14px] text-black">{translate("enableDelayTimeText")}</span>
              </button>

              {slowPlayback && (
                <div className="flex items-center gap-[8px]">
                  <input
                    type="number"
                    className="flex-1 bg-white border border-[#c8c8c8] h-[46px] rounded-[8px] px-3 font-['Raleway',sans-serif] text-[14px] text-black outline-none uda_exclude"
                    placeholder={translate("delayTimePlaceHolder")}
                    value={delayPlaybackTime}
                    onChange={(e) => validateDelayTime(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={async (e) => {
                await validateChange(e.target.value);
                setInputAt("mainLabel");
              }}
              onBlur={async (e) => {
                await checkMainLabelProfanity(e.target.value);
              }}
              placeholder="Enter Label"
              className={`w-full bg-white border ${inputError.name ? "border-red-500" : "border-neutral-300"} h-[46px] rounded-[8px] px-3 font-['Raleway',sans-serif] text-[14px] text-black outline-none`}
            />
            {config?.enableProfanity && inputAlert.mainLabelProfanity && (
              <span className="text-red-500 text-[12px]">{translate("profanityDetected")}</span>
            )}
            {inputAlert.name && (
              <span className="text-red-500 text-[12px]">{translate("inputMandatory")}</span>
            )}
            {inputError.name && (
              <span className="text-red-500 text-[12px]">{translate("inputError")}</span>
            )}
          </div>

          <div className="flex flex-col gap-4 mb-4">
            {labels.map((label, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={label.label}
                    onChange={async (e) => {
                      await onExtraLabelChange(index, e.target.value);
                      setInputAt(`label${index}`);
                    }}
                    onBlur={async (e) => {
                      await checkLabelProfanity(index, e.target.value);
                    }}
                    placeholder="Enter Label"
                    className={`flex-1 bg-white border ${inputError[`label${index}`]?.error ? "border-red-500" : "border-neutral-300"} h-[46px] rounded-[8px] px-3 font-['Raleway',sans-serif] text-[14px] text-black outline-none`}
                  />
                  <button onClick={() => removeLabel(index)} className="w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="black"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
                {config?.enableProfanity && label.profanity && (
                  <span className="text-red-500 text-[12px]">{translate("profanityDetected")}</span>
                )}
                {inputError[`label${index}`]?.error && (
                  <span className="text-red-500 text-[12px]">{translate("inputError")}</span>
                )}
              </div>
            ))}
            <button onClick={addLabel} className="w-full bg-black h-[47px] rounded-[8px] flex items-center justify-center gap-[10px] hover:opacity-90 mt-2">
              <svg className="w-[14px] h-[14px]" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14"><path d={svgPathsNew.p11195800} fill="white" /></svg>
              <span className="font-['Raleway',sans-serif] text-[20px] text-white">Add Alias</span>
            </button>
          </div>
        </div>
      </div>

      {/* Permissions */}
      {config?.enablePermissions && config?.permissions && (
        <div className="mt-3 flex flex-col items-end gap-1 w-full">
          <button onClick={() => setAdvBtnShow(!advBtnShow)} className={`${advBtnShow ? 'bg-black w-full' : 'bg-[#969696] w-[218px]'} h-[47px] rounded-[8px] font-['Raleway',sans-serif] text-[20px] text-white transition-all`}>
            {advBtnShow ? 'Hide Permissions' : 'Show Permissions'}
          </button>
          {advBtnShow && (
            <div className="w-full mt-2 space-y-2 bg-white/30 p-2 rounded">
              {Object.entries(config.permissions).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer self-end">
                  <input type="checkbox" checked={!!tmpPermissionsObj[key]} onChange={() => handlePermissions(key, value)} className="w-[22px] h-[22px]" />
                  <span className="font-['Jost',sans-serif] text-[16px] text-black">{key}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 flex gap-[10px] w-full mb-4">
        <button onClick={onCancel} disabled={disableForm} className="flex-1 bg-[#969696] h-[50px] rounded-[8px] font-['Raleway',sans-serif] text-[20px] text-white disabled:opacity-50">Cancel</button>
        <button onClick={onSubmit} disabled={disableForm || screenInfoNotAvailable} className="flex-1 bg-black h-[50px] rounded-[8px] font-['Raleway',sans-serif] text-[20px] text-white disabled:opacity-50">save</button>
      </div>
    </div>
  );
}
