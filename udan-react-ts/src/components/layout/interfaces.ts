export interface MProps {
  toggleFlag: boolean;
  toggleHandler?: Function;
  addRecordBtnStatus?: boolean;
  i18?: any;
  config?: any;
}

export interface HeaderProps extends MProps {
  setSearchKeyword?: (searchKeyword: string) => void;
  searchKeyword?: string;
}
