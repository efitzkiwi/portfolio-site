import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  createContext,
  Suspense,
  lazy,
  SetStateAction
} from 'react';
import ReactDOM from 'react-dom';
import { Line } from 'rc-progress';

import styles from "../styles/loading-overlay.module.scss";

interface ICtx {
  active: boolean
  setActive: React.Dispatch<SetStateAction<boolean>>
}

const IndicatorContext = createContext<ICtx>({
  active: false,
  setActive: (a: boolean) => {}
});

export function LoadingOverlayProvider({ children }:{children: React.ReactNode}) {
  const [active, setActive] = useState(false);
  const value = useMemo(() => ({ active, setActive }), [active, setActive]);
  return (
    <IndicatorContext.Provider value={{active: value.active, setActive: value.setActive}}>
      {children}
    </IndicatorContext.Provider>
  );
}

export function LoadingOverlay() {
  const { active } = useContext(IndicatorContext);
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setPercent(percent => (percent < 100 ? percent + 10 : 100));
    }, 200);
  });
  console.log(percent)
  if (active === false) {
    return null
  }
  return (
    <div className={styles.progressBarWrapperEarth}>
      <div>Loading {percent}%</div>
      <Line percent={percent} />
    </div>    
  )


}

export function LoadingOverlayDone() {
  const { setActive } = useContext(IndicatorContext);
  useEffect(() => {
    setActive(true);
    return () => setActive(false);
  });
  return null;
}