import React from "react";

export const useInterval = (callback: Function, delay: number) => {
  const savedCallback: any = React.useRef();

  React.useEffect(() => {
    if (savedCallback && callback) savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const tick = () => {
      if (savedCallback.current) savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
