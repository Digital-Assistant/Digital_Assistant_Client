/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: Udan Main Component
 * Associated Route/Usage: *
 */

import React from "react";
import "../App.scss";
import {SearchResults } from "./SearchResults";
import { RecordSequenceDetails } from "./RecordSequenceDetails";
import { RecordSequence } from "./RecordSequence";
import {RecordButton} from "./RecordButton";
import { RecordedData } from "./RecordedData";

export interface MProps {
  visibility?: boolean;
  data?: any;
  showDetails?: Function;
  addRecordHandler?: Function;
}

/**
 * To render search result elements
 * @returns HTML Elements
 */

export function UdanMain(props: MProps) {}

UdanMain.SearchResults = SearchResults;
UdanMain.RecordButton = RecordButton;
UdanMain.RecordedData = RecordedData;
UdanMain.RecordSequence = RecordSequence;
UdanMain.RecordSequenceDetails = RecordSequenceDetails;

export default UdanMain;
