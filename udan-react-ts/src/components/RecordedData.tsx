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

import TSON from "typescript-json";

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
    recordData[index].editable = true;
    storeRecording(recordData);
  };

  const checkProfanity = async (keyword: any) => {
    if (!CONFIG.profanity.enabled) return false;
    const response: any = await profanityCheck(keyword);
    if (response.Terms && response.Terms.length>0) {
      response.Terms.forEach(function (term) {
        keyword = keyword.replaceAll(term.Term, '');
      });
    }
    return keyword.trim();
    // return resp.error ? true : false;
  };

  const handleDebounceFn = async (index: number, inputValue: string) => {
    /**check profanity for input text */
    /*if (await checkProfanity(inputValue)) {
      recordData[index].profanity = true;
      storeRecording(recordData);
      setDisableForm(true);
      return;
    }*/
    recordData[index].clickednodename = inputValue;
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
        setTimeout(async () => {
          let changedName: any = await checkProfanity(inputValue);
          console.log(changedName);
          recordData[index].clickednodename = changedName.trim();
          delete recordData[index].profanity;
          setDisableForm(false);
          const _cloneRecObj = _.cloneDeep(props?.data?.[index]);
          if (_.isEmpty(_cloneRecObj)) return;
          const _objData: any = getObjData(_cloneRecObj?.objectdata);
          if (!_.isEmpty(_objData)) {
            setRecordData([...props?.data]);
            _objData.meta.displayText = inputValue;
            _cloneRecObj.objectdata = TSON.stringify(_objData);
            recordData[index].objectdata = TSON.stringify(_objData);
            storeRecording(recordData);
            await updateRecordClicks(_cloneRecObj);
          }
        }, 3000)
    );

  };

  /*const debounceFn = useCallback(debounce(handleDebounceFn, 3000), [
    props?.data,
  ]);*/

  const handleChange = (index: number) => async (event: any) => {
    // debounceFn(index, event.target.value);
    recordData[index].clickednodename = event.target.value;
    await handleDebounceFn(index, event.target.value);
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

  const removeLabel = (index: number) => {
    labels.splice(index, 1);
    setLabels([...labels]);
  };

  const cancelRecording = () => {
    if (props.recordHandler) props.recordHandler("cancel");
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
  };

  const submitRecording = async () => {

    if(name===""){
      setInputAlert({...inputAlert, name: true});
      return false;
    }

    let _labels: any = [name];
    if (labels.length) {
      const _extraLabels = labels.map((label: any) => {
        if(label.label) {
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

  const onChange = async (e: any) => {
    setName(e.target.value);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
        setTimeout(async () => {
          let changedName: any = await checkProfanity(e.target.value);
          setName(changedName);
        }, 3000)
    );

  };

  const onExtraLabelChange = (index: number) => async (e: any) => {
    labels[index].label = e.target.value;
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
        setTimeout(async () => {
          let changedName: any = await checkProfanity(e.target.value);
          console.log(changedName);
          labels[index].label = changedName;
        }, 3000)
    );
    /*setLabels([...labels]);
    const prof = await checkProfanity(e.target.value);
    if (prof) {
      labels[index].profanity = true;
      setLabels([...labels]);
      setDisableForm(true);
      return;
    } else {
      delete labels[index].profanity;
      setDisableForm(false);
    }*/
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
              className={`uda-form-input}`}
              placeholder="Enter Label"
              onChange={onChange}
              value={name}
          />
          {inputAlert.name && <span className={`uda-alert`}> Please input proper name.</span>}
          <div id="uda-sequence-names">
            {labels?.map((item: any, index: number) => {
              return (
                  <div className="flex-card flex-center" key={`label-${index}`}>
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
