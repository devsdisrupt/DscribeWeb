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
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// import "assets/plugins/nucleo/css/nucleo.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "assets/scss/argon-dashboard-react.scss";

// import AdminLayout from "layouts/Admin.js";
// import AuthLayout from "layouts/Auth.js";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

// root.render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/admin/*" element={<AdminLayout />} />
//       <Route path="/auth/*" element={<AuthLayout />} />
//       <Route
//         path="*"
//         element={
//           isLoggedIn
//             ? <Navigate to="/admin/index" replace />
//             : <Navigate to="/auth/login" replace />
//         }
//       />
//     </Routes>
//   </BrowserRouter>
// );


import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Public pages like login */}
      <Route element={<PublicRoute />}>
        <Route path="/auth/*" element={<AuthLayout />} />
      </Route>

      {/* Protected pages like admin */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/admin" element={<Navigate to="/admin/ProcessFiles" replace />} /> */}
        <Route path="/admin/*" element={<AdminLayout />} />
      </Route>


      {/* Default route */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  </BrowserRouter>
);
