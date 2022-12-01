import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fluid main-pages mb-0 px-0">
      <div className="row h-100">
        <div className="col menu ">
          <Menu />
        </div>
      </div>
      <div className="row m-0">
        <div className="col m-0">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
