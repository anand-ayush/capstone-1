import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "For Undertrials",
    path: "/undertrialInfo",
    newTab: false,
  },
  {
    id: 33,
    title: "For Lawyers",
    path: "/lawyerInfo",
    newTab: false,
  },
  {
    id: 3,
    title: "Support",
    path: "/contact",
    newTab: false,
  },
  {
    id: 5,
    title: "Bail",
    path: "/bail",
    newTab: false,
  },
  {
    id: 4,
    title: "More",
    newTab: false,
    submenu: [
      // {
      //   id: 41,
      //   title: "Legal Resources",
      //   path: "/legalResources",
      //   newTab: false,
      // },
      {
        id: 42,
        title: "Contact Us",
        path: "/contact",
        newTab: false,
      },
      {
        id: 43,
        title: "Help Center",
        path: "/blog",
        newTab: false,
      },
      {
        id: 44,
        title: "About Us",
        path: "/about",
        newTab: false,
      },
      {
        id: 45,
        title: "Find Lawyer's",
        path: "/lawyer",
        newTab: false,
      }
     
     
    ],
  },
];
export default menuData;
