import React, {useState} from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  console.log("collapsed?", isNavCollapsed)


  return (
    <nav className="navbar navbar-expand-lg">
      <Link
          className="navbar-brand" to="/">
          <div className="mx-3">
            <span>Periodic Tables</span>
          </div>
        </Link>
        <button
            className="custom-toggler navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded={!isNavCollapsed ? true : false}
            aria-label="Toggle navigation"
            onClick={handleNavCollapse}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}  id="navbarNavAltMarkup">
          <div className="navbar-nav pl-3">
              <Link className="nav-link nav-item active" to="/dashboard">
                <span className="oi oi-dashboard" />
                &nbsp;Dashboard
                <span class="sr-only">(current)</span>
              </Link>
              <Link className="nav-link nav-item" to="/search">
                <span className="oi oi-magnifying-glass" />
                &nbsp;Search
              </Link>
              <Link className="nav-link nav-item" to="/reservations/new">
                <span className="oi oi-plus" />
                &nbsp;New Reservation
              </Link>
              <Link className="nav-link nav-item" to="/tables/new">
                <span className="oi oi-layers" />
                &nbsp;New Table
              </Link>
          </div>
        </div>
    </nav>
  );
}

export default Menu;
