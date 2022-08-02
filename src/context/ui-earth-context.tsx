import React, {useContext, createContext, Dispatch, useState, memo} from "react"
import { useMemo } from "react"

export interface UIEarthState {
  landerOpen: boolean
  callbackFuncs: {
    toggleLander: () => void
  }
}

export interface UIEarthContext {
  state: UIEarthState
  setState: Dispatch<React.SetStateAction<UIEarthState>>
}

export const defaultContext: UIEarthContext = {
  state: {
    landerOpen: false,
    callbackFuncs: {
      toggleLander: () => {}
    }
  },
  setState: (a: UIEarthState) => {}
}

export const UIEarthContext = createContext<UIEarthState>(defaultContext.state)
