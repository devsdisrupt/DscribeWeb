/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/CreateProfile.js";
import Site from "views/examples/CreateSite.js";
import ProcessFiles from "views/ProcessUploads/ProcessFiles.js";
import GenerateNotes from "views/examples/GenerateNotes.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/Site",
    name: "Create Site",
    icon: "ni ni-pin-3 text-orange",
    component: <Site />,
    layout: "/admin",
  },
  {
    path: "/userprofile",
    name: "Create User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Create Facility API Keys",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/ProcessFiles",
    name: "Process Files",
    icon: "ni ni-bullet-list-67 text-red",
    component: <ProcessFiles />,
    layout: "/admin",
  },
  // {
  //   path: "/GenerateNotes",
  //   name: "Bulk Mode",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: <GenerateNotes />,
  //   layout: "/admin",
  // }
];
export default routes;
