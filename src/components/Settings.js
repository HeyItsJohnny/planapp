import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiColorFill } from "react-icons/bi";
import { BsCalendarCheck, BsListStars } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { GrSchedules, GrConfigure } from "react-icons/gr";
import { GoDashboard } from "react-icons/go";
import { BiFoodMenu } from "react-icons/bi";
import { MdFoodBank, MdCleaningServices } from "react-icons/md";

export const links = [
  {
    title: "Home",
    links: [
      {
        name: "Ecommerce - Sample",
        icon: <GoDashboard />,
        linktoname: "ecommerce",
      },
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
    ],
  },
  {
    title: "Chores",
    links: [
      {
        name: "chore schedule",
        icon: <MdCleaningServices />,
        linktoname: "chore-schedule",
      },
      {
        name: "chores config.",
        icon: <GrConfigure />,
        linktoname: "chores-config",
      },
      {
        name: "chores list",
        icon: <BsListStars />,
        linktoname: "chores-list",
      },
    ],
  },
  {
    title: "Meals",
    links: [
      {
        name: "meal schedule",
        icon: <BiFoodMenu />,
        linktoname: "meal-scheduler",
      },
      {
        name: "meal schedule config.",
        icon: <GrConfigure />,
        linktoname: "meal-scheduler-config",
      },
      {
        name: "meal list",
        icon: <MdFoodBank />,
        linktoname: "family-meals",
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        name: "family members",
        icon: <IoMdContacts />,
        linktoname: "family-members",
      },
      {
        name: "shared logins",
        icon: <RiLockPasswordLine />,
        linktoname: "shared-logins",
      },
      {
        name: "color picker",
        icon: <BiColorFill />,
        linktoname: "color-picker",
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
