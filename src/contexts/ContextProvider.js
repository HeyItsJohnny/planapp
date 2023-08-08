import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  userProfile: false,
  notification: false,
  addNewPlan: false,
};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true); 
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#03C9D7');
  const [currentMode, setCurrentMode] = useState('Light');
  const [currentPlan, setCurrentPlan] = useState('default');
  const [themeSettings, setThemeSettings] = useState(false);
  const [userSettings, setUserSettings] = useState(false);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
    setThemeSettings(false);
  }

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
    setThemeSettings(false);
  }

  const setPlan = (plan) => {
    setCurrentPlan(plan);
    //localStorage.setItem('plan', plan);
  }

  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true});
  } 

  const handleExitClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: false});
  } 

  return (
    <StateContext.Provider value={{ 
        activeMenu, 
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize,
        currentColor,
        currentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        userSettings,
        setUserSettings,
        handleExitClick,
        currentPlan,
        setCurrentPlan,
        setPlan
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
