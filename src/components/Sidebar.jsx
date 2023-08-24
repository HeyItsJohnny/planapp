import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { constantLinks, planLinks } from "../components/Settings";
import { useStateContext } from "../contexts/ContextProvider";

const Sidebar = () => {
  
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    currentColor,
    currentMode,
    currentPlanIsSet,
    setCurrentPlanIsSet,
    setCurrentSelectedPlan,
  } = useStateContext();

  const handleCloseSizeBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const handleGoToHome = () => {
    setCurrentPlanIsSet(false);
    setCurrentSelectedPlan('');
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={handleCloseSizeBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <SiShopware /> <span>Day Trip</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => {
                  setActiveMenu((prevActiveMenu) => !prevActiveMenu);
                }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 blockmd:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {
            !currentPlanIsSet && (
            constantLinks.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 m-3 mt-4 uppercase">{item.title}</p>
                {item.links.map((link) => (
                  <NavLink
                    to={`${link.linktoname}`}
                    key={link.name}
                    onClick={handleCloseSizeBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : "",
                    })}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))
            )
            }
            {currentPlanIsSet &&
              planLinks.map((item) => (
                <div key={item.title}>
                  <p className="text-gray-400 m-3 mt-4 uppercase">
                    {item.title}
                  </p>
                  <NavLink
                    to='plans'
                    onClick={handleGoToHome}
                    className={normalLink}
                  >
                    <AiOutlineHome />
                    <span className="capitalize">Home</span>
                  </NavLink>
                  {item.links.map((link) => (
                    <NavLink
                      to={`${link.linktoname}`}
                      key={link.name}
                      onClick={handleCloseSizeBar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? currentColor : "",
                      })}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      {link.icon}
                      <span className="capitalize">{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
