/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render recorded sequences
 * Associated Route/Usage: *
 */

import React, {useEffect, useState} from "react";
import {
  InfoCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import {setToStore, postRecordSequenceData, getObjData} from "../util";
import {updateRecordClicks, profanityCheck} from "../services/recordService";
import {CONFIG} from "../config";
import SelectedElement from "./SelectedElement";

import TSON from "typescript-json";
import {translate} from "../util/translation";

export interface MProps {
  sequenceName?: string;
  isShown?: boolean;
  hide?: () => void;
  data?: any;
  config?: any;
  refetchSearch?: Function;
  recordHandler?: Function;
}

/**
 * To render recorded sequence elements
 * @returns HTML Elements
 */

export const RecordedData = (props: MProps) => {
  const [name, setName] = React.useState<string>("");
  const [labels, setLabels] = React.useState<any>([]);
  const [disableForm, setDisableForm] = React.useState<boolean>(false);
  const [recordData, setRecordData] = React.useState<any>(props.data || []);
  const [advBtnShow, setAdvBtnShow] = React.useState<boolean>(false);
  const [tmpPermissionsObj, setTmpPermissionsObj] = useState<any>({});
  const [inputAlert, setInputAlert] = useState<any>({});
  const [inputError, setInputError] = useState<any>({});
  const [tooltip, setToolTip] = React.useState<string>("");

  useEffect(() => {
    setRecordData([...(props.data || [])]);
  }, [props.data]);

  /**
   * @param data
   */

  useEffect(() => {
    let permissions = {...props?.config?.PERMISSIONS};
    setTmpPermissionsObj(permissions);
  }, [props.config.PERMISSIONS]);

  const storeRecording = (data: any) => {
    setRecordData([...data]);
    setToStore(data, CONFIG.RECORDING_SEQUENCE, false);
  };

  const setEdit = (index: number) => {
    if (CONFIG.enableEditClickedName === true) {
      recordData[index].editable = true;
      storeRecording(recordData);
    }
  };

  const checkProfanity = async (keyword: any) => {
    if (!CONFIG.profanity.enabled) return keyword.trim();
    const response: any = await profanityCheck(keyword);
    if (response.Terms && response.Terms.length > 0) {
      response.Terms.forEach(function (term) {
        keyword = keyword.replaceAll(term.Term, '');
      });
    }
    return keyword.trim();
  };

  /**check profanity for input text */
  const handleDebounceFn = async (index: number, inputValue: string) => {
    if (!validateInput(inputValue)) {
      setInputError({...inputError, clickedNodeName: true});
      return;
    } else {
      setInputError({...inputError, clickedNodeName: false});
    }
    recordData[index].clickednodename = inputValue;
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
        setTimeout(async () => {
          let changedName: any = await checkProfanity(inputValue);
          // recordData[index].clickednodename = changedName.trim();
          delete recordData[index].profanity;
          setDisableForm(false);
          const _cloneRecObj = _.cloneDeep(props?.data?.[index]);
          if (_.isEmpty(_cloneRecObj)) return;
          const _objData: any = getObjData(_cloneRecObj?.objectdata);
          if (!_.isEmpty(_objData)) {
            setRecordData([...props?.data]);
            _objData.meta.displayText = changedName.trim();
            _cloneRecObj.objectdata = TSON.stringify(_objData);
            recordData[index].objectdata = TSON.stringify(_objData);
            storeRecording(recordData);
            await updateRecordClicks(_cloneRecObj);
          }
        }, CONFIG.DEBOUNCE_INTERVAL)
    );

  };

  const handleChange = (index: number) => async (event: any) => {
    // debounceFn(index, event.target.value);
    if (CONFIG.enableEditClickedName === true) {
      recordData[index].clickednodename = event.target.value;
      await handleDebounceFn(index, event.target.value);
    }
  };

  const handlePersonal = (index: number) => (event: any) => {
    updatePersonalOrSkipPlay("isPersonal", index);
  };

  const handleSkipPlay = (index: number) => (event: any) => {
    updatePersonalOrSkipPlay("skipDuringPlay", index);
  };

  const updatePersonalOrSkipPlay = (key: string, index: number) => {
    const _objData = getObjData(recordData[index]?.objectdata);
    if (_objData) {
      if (_objData.meta[key] === undefined) _objData.meta[key] = false;
      _objData.meta[key] = !_objData.meta[key];
      recordData[index].objectdata = TSON.stringify(_objData);
      storeRecording(recordData);
      updateRecordClicks(recordData[index]);
    }
  };

  const addLabel = () => {
    labels.push({label: ""});
  };

  /**
   * remove added label
   * @param index
   */
  const removeLabel = (index: number) => {
    labels.splice(index, 1);
    setLabels([...labels]);
  };

  /**
   * cancel recording
   */
  const cancelRecording = () => {
    if (props.recordHandler) props.recordHandler("cancel");
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
  };

  /**
   * submit the clicked input record to backend
   */
  const submitRecording = async () => {

    if (name === "") {
      setInputAlert({...inputAlert, name: true});
      return false;
    }

    let _labels: any = [name];
    if (labels.length) {
      const _extraLabels = labels.map((label: any) => {
        if (label.label) {
          return label.label;
        }
      });
      _labels = [..._labels, ..._extraLabels];
    }

    const _payload: any = {
      name: TSON.stringify(_labels),
    };

    //if additional params available send them part of payload
    if (!_.isEmpty(tmpPermissionsObj)) _payload.additionalParams = tmpPermissionsObj;

    const instance = await postRecordSequenceData(_payload);
    if (instance && props?.refetchSearch) {
      props.refetchSearch("on");
    }

    if (props.recordHandler) props.recordHandler("cancel");
    setToStore(false, CONFIG.RECORDING_SWITCH_KEY, true);
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
  };

  const [timer, setTimer] = useState(null);

  /**
   * validate and update of first label
   * @param e
   */
  const onChange = async (e: any) => {
    setName(e.target.value);
    if (!validateInput(e.target.value)) {
      setInputError({...inputError, name: true})
      return;
    } else {
      setInputError({...inputError, name: false})
    }
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
        setTimeout(async () => {
          let changedName: any = await checkProfanity(e.target.value);
          setName(changedName);
        }, CONFIG.DEBOUNCE_INTERVAL)
    );
  };

  /**
   * Validate and check profanity of label input
   * @param index
   */
  const onExtraLabelChange = (index: number) => async (e: any) => {
    let label: any;
    if (inputError['label' + index]) {
      label = inputError['label' + index];
    } else {
      inputError['label' + index] = {error: false};
      label = inputError['label' + index];
      setInputError({...inputError});
    }

    labels[index].label = e.target.value;
    setLabels([...labels]);
    if (!validateInput(e.target.value)) {
      label.error = true;
      inputError['label' + index] = label;
      setInputError({...inputError})
      return;
    } else {
      label.error = false;
      inputError['label' + index] = label;
      setInputError({...inputError});
    }
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
        setTimeout(async () => {
          let changedName: any = await checkProfanity(e.target.value);
          labels[index].label = changedName;
          setLabels([...labels]);
        }, CONFIG.DEBOUNCE_INTERVAL)
    );
  };

  /**
   * Validate input of given string
   * @param value
   */
  const validateInput = (value) => {
    let validateCondition = new RegExp("^[0-9A-Za-z _.-]+$");
    return (validateCondition.test(value));
  }

  /**
   * validate input change of tooltip
   * @param e
   */
  const onChangeTooltip = async (e: any) => {
    setToolTip(e.target.value);
    if (!validateInput(e.target.value)) {
      setInputError({...inputError, tooltip: true})
      return;
    } else {
      setInputError({...inputError, tooltip: false})
    }
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
        setTimeout(async () => {
          let changedName: any = await checkProfanity(e.target.value);
          setToolTip(changedName);
        }, CONFIG.DEBOUNCE_INTERVAL)
    );
  };

  /**
   * Add custom tooltip to the clicked element
   * @param key
   * @param index
   */
  const updateTooltip = async (key: string, index: number) => {
    const _objData = getObjData(recordData[index]?.objectdata);
    if (_objData) {
      if (_objData.meta[key] === undefined) _objData.meta[key] = tooltip;
      _objData.meta[key] = tooltip
      recordData[index].objectdata = TSON.stringify(_objData);
      storeRecording(recordData);
      await updateRecordClicks(recordData[index]);
    }
  };

  const renderData = () => {
    if (!props.isShown) return;
    else
      return recordData?.map((item: any, index: number) => {
        return (
            <li
                className="uda-recorded-label-editable completed"
                key={`rec-seq-${index}`}
            >
              <div
                  className="flex-card flex-center"
                  style={{alignItems: "center"}}
              >
                <span id="uda-display-clicked-text" style={{flex: 2}}>
                  <input
                      type="text"
                      id="uda-edited-name"
                      name="uda-edited-name"
                      className={`uda-form-input ${
                          !item.editable ? "non-editable" : ""
                      } ${item.profanity ? "profanity" : ""}`}
                      placeholder="Enter Name"
                      // onChange={onLabelChange(index)}
                      onChange={handleChange(index)}
                      readOnly={!item.editable}
                      style={{width: "85%! important"}}
                      // onKeyDown={handleLabelChange(index)}
                      onClick={() => {
                        setEdit(index);
                      }}
                      value={item.clickednodename}
                  />
                  {inputError.clickednodename && <span className={`uda-alert`}> {translate('inputError')}</span>}
                </span>
                <br/>
              </div>

              {recordData?.length - 1 === index && (
                  <>
                    <div className="flex-card flex-vcenter small-text">
                      <input
                          type="checkbox"
                          id="UDA-skip-duringPlay"
                          className="uda-checkbox flex-vcenter"
                          checked={getObjData(item?.objectdata)?.meta?.skipDuringPlay}
                          onClick={handleSkipPlay(index)}
                      />
                      <label className="uda-checkbox-label">Skip during play</label>
                      <span
                          className="info-icon"
                          title="Select this box if this field / text is not required to navigate while processing."
                      >
                        <InfoCircleOutlined/>
                      </span>
                    </div>

                    <div className="flex-card flex-vcenter small-text">
                      <input
                          type="checkbox"
                          id="isPersonal"
                          checked={getObjData(item?.objectdata)?.meta?.isPersonal}
                          onClick={handlePersonal(index)}
                      />
                      <label>Personal Information</label>
                      <span
                          className="info-icon"
                          title="select this box if this field / text contains personal information like name / username. We need to ignore personal information while processing."
                      >
                        <InfoCircleOutlined/>
                      </span>
                    </div>

                    {CONFIG.enableTooltipAddition === true &&
                        <>
                            <div className="uda-recording" style={{textAlign: "center"}}>
                                <input type="text" id="uda-edited-tooltip" name="uda-edited-tooltip"
                                       className="uda-form-input" placeholder="Custom Tooltip (Optional)"
                                       style={{width: "68% !important"}} onChange={onChangeTooltip} value={tooltip}/>
                              {inputError.tooltip && <span className={`uda-alert`}> {translate('inputError')}</span>}
                                <span>
                              <button className="delete-btn" style={{color: "#fff"}} id="uda-tooltip-save"
                                      onClick={() => {
                                        updateTooltip('tooltipInfo', index)
                                      }}>Save</button>
                            </span>
                            </div>
                        </>
                    }
                    <SelectedElement data={item}/>
                  </>
              )}
            </li>
        );
      });
  };

  const toggleAdvanced = () => {
    setAdvBtnShow(!advBtnShow);
  };

  const handlePermissions = (obj: any) => (event: any) => {
    let permissions = tmpPermissionsObj;
    if (permissions[obj.key]) {
      delete permissions[obj.key];
    } else {
      permissions[obj.key] = obj[obj.key];
    }
    setTmpPermissionsObj({...permissions});
  };

  const displayKeyValue = (key: string, value: any) => {
    return <span>{key}:{value}</span>
  };

  return props?.isShown ? (
      <div className="uda-card-details">
        <h5>Recorded Sequence</h5>
        <hr style={{border: "1px solid #969696", width: "100%"}}/>
        <ul className="uda-recording" id="uda-recorded-results">
          {renderData()}
        </ul>
        <hr style={{border: "1px solid #969696", width: "100%"}}/>
        <div style={{textAlign: "left"}}>
          <input
              type="text"
              id="uda-recorded-name"
              name="uda-save-recorded[]"
              className={`uda-form-input`}
              placeholder="Enter Label"
              onChange={onChange}
              value={name}
          />
          {inputAlert.name && <span className={`uda-alert`}> {translate('inputMandatory')}</span>}
          {inputError.name && <span className={`uda-alert`}> {translate('inputError')}</span>}
          <div id="uda-sequence-names">
            {labels?.map((item: any, index: number) => {
              return (
                  <div key={`label-${index}`}>
                    <div className="flex-card flex-center">
                      <input
                          type="text"
                          id="uda-recorded-name"
                          name="uda-save-recorded[]"
                          className={`uda-form-input uda-form-input-reduced ${
                              item.profanity ? "profanity" : ""
                          }`}
                          placeholder="Enter Label"
                          onChange={onExtraLabelChange(index)}
                          value={item.label}
                      />
                      <button
                          className="delete-btn uda-remove-row"
                          style={{color: "white", width: 40, marginLeft: 16}}
                          onClick={() => removeLabel(index)}
                      >
                        <DeleteOutlined/>
                      </button>
                    </div>
                    <div className="flex-card flex-center">
                      {(inputError['label' + index] && inputError['label' + index].error) &&
                          <span className={`uda-alert`}> {translate('inputError')}</span>}
                    </div>
                  </div>
              );
            })}
          </div>

          <div style={{marginBottom: "10px", padding: "20px 0"}}>
            <button className="add-btn uda_exclude" onClick={() => addLabel()}>
              + Add Label
            </button>
          </div>

          {props?.config?.ENABLE_PERMISSIONS && (
              <div id="uda-permissions-section" style={{padding: "30px 0px"}}>
                <div>
                  <button
                      className="add-btn uda_exclude"
                      onClick={() => toggleAdvanced()}
                  >
                    {advBtnShow ? "Hide Permissions" : "Show Permissions"}
                  </button>
                </div>

                {
                    advBtnShow &&
                    <div>
                      {Object.entries(props?.config?.PERMISSIONS).map(([key, value]) => {
                        return <div key={key}>
                          <input
                              type="checkbox"
                              id="uda-recorded-name"
                              checked={tmpPermissionsObj[key] !== undefined}
                              onChange={handlePermissions({[key]: value, key})}
                          />
                          {displayKeyValue(key, value)}
                        </div>
                      })
                      }
                    </div>
                }
              </div>
          )}

          <div
              className="flex-card flex-center"
              style={{clear: "both", marginTop: 50}}
          >
            <div className="flex-card flex-start" style={{flex: 2}}>
              <button
                  className="uda-record-btn"
                  onClick={() => cancelRecording()}
                  style={{flex: 1}}
              >
                <span className="uda_exclude">Cancel and Exit</span>
              </button>
            </div>
            <div className="flex-card flex-end" style={{flex: 1}}>
              <button
                  className={`uda-tutorial-btn uda_exclude ${
                      disableForm ? "disabled" : ""
                  }`}
                  onClick={() => submitRecording()}
                  disabled={disableForm}
                  // style={{ float: "right", padding: "5px 20px" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
  ) : null;
};
