import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiColorFill } from "react-icons/bi";
import { BsCalendarCheck, BsListStars } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { GrSchedules, GrConfigure } from "react-icons/gr";
import { GoDashboard } from "react-icons/go";
import { BiFoodMenu } from "react-icons/bi";
import { TbReportMoney } from "react-icons/tb";

export const links = [
  {
    title: "Home",
    links: [
      {
        name: "dashboard",
        icon: <GoDashboard />,
        linktoname: "dashboard",
      },
    ],
  },
  {
    title: "Apps",
    links: [
      {
        name: "Costs",
        icon: <TbReportMoney />,
        linktoname: "trip-cost",
      },
      /*
      {
        name: "family calendar",
        icon: <AiOutlineCalendar />,
        linktoname: "calendar",
      },
      {
        name: "family plans",
        icon: <BsCalendarCheck />,
        linktoname: "planner",
      },
      {
        name: "scheduler",
        icon: <GrSchedules />,
        linktoname: "scheduler",
      },
      */
    ],
  },
  {
    title: "Settings",
    links: [
      {
        name: "people invited",
        icon: <IoMdContacts />,
        linktoname: "people-invited",
      },
    ],
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];
