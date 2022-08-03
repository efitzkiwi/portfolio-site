import dynamic from 'next/dynamic';
import React, { memo, Suspense, useState } from 'react';

import {
  LoadingOverlay,
  LoadingOverlayDone,
  LoadingOverlayProvider,
} from './loading-overlay';
import type { UIEarthState } from './ui-earth-context';
import { defaultContext, UIEarthContext } from './ui-earth-context';

const Earth = dynamic(() => import('../components/earth'), { ssr: false });

export const UIEarthContextProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const cbEarthLander = () => {
      console.log('toggle');
      setEarthState((prev) => ({
        ...prev,
        landerOpen: !prev.landerOpen,
      }));
    };

    const [earthState, setEarthState] = useState<UIEarthState>({
      ...defaultContext.state,
      callbackFuncs: {
        toggleLander: cbEarthLander,
      },
    });

    return (
      <UIEarthContext.Provider value={earthState}>
        <LoadingOverlayProvider>
          <LoadingOverlay />
          <Suspense fallback={<LoadingOverlayDone />}>
            <Earth />
          </Suspense>
        </LoadingOverlayProvider>

        {children}
      </UIEarthContext.Provider>
    );
  }
);
