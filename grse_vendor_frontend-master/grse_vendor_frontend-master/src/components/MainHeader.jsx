import React from "react";
import { Link } from "react-router-dom";
import logoheader from "../images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { reConfirm } from "../utils/reConfirm";
import { logoutHandler } from "../redux/slices/loginSlice";
import { poRemoveHandler } from "../redux/slices/poSlice";

const MainHeader = ({ title }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log("user..", user);
  const logOutFun = () => {
    dispatch(logoutHandler());
    dispatch(poRemoveHandler());
    window.location.href = "/";
    // Persistor.pause();
    // Persistor.flush().then(() => {
    //   return Persistor.purge();
    // });
  };

  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logoheader} alt="Logo" height="60" />
          <span className="navbar-text custom-text">GRSE</span>
        </Link>
        <div className="my-3">
          <h2>{title}</h2>
        </div>
        <div className="" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* <li className="nav-item">
              <Link className="nav-link text-black" to="/">
                Purchase Orders
              </Link>
            </li> */}
            {user?.user_type !== 1 && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-black" to={`/log-report`}>
                    LOGS
                  </Link>
                </li>
              </>
            )}
            {/* <li className="nav-item">
              <Link className="nav-link text-black" to="/bg-extension">
                BG Extension
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-black" to="/checklist">
                Checklists
              </Link>
            </li> */}
            <li>
              <div className="ps-4 log_in menu-item">
                <b>
                  Logged In: <br />
                  <span className="menu-title">{user?.vendor_code}</span>
                  <span className="menu-title">
                    {user?.name ? `(${user?.name})` : ""}
                  </span>
                  <span
                    onClick={() =>
                      reConfirm(
                        { file: true },
                        logOutFun,
                        "You're going to Logout!"
                      )
                    }
                  >
                    (<u className="red">Logout?</u>)
                  </span>
                </b>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MainHeader;
