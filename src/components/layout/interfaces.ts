export interface MProps {
  toggleFlag: boolean;
  toggleHandler?: Function;
  addRecordBtnStatus?: boolean;
  i18?: any;
  config?: any;
  isRecording?: any;
  udaDivId?: string;
  enableUdaIcon?: boolean;
  userContent?: any;
  hide?: boolean;
}

export interface HeaderProps extends MProps {
  setSearchKeyword?: (searchKeyword: string) => void;
  searchKeyword?: string;
}
