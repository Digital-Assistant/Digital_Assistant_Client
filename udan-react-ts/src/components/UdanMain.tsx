/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: Udan Main Component
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";
import { SearchResults } from "./SearchResults";
import {
  RecordSequence,
  RecordButton,
  RecordSequenceDetails,
} from "./MiscComponents";
import { RecordedSeq } from "./RecordedSeq";

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
UdanMain.RecordedData = RecordedSeq;
UdanMain.RecordSequence = RecordSequence;
UdanMain.RecordSequenceDetails = RecordSequenceDetails;

export default UdanMain;
