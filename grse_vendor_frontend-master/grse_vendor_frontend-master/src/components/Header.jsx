import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reConfirm } from "../utils/reConfirm";
import { logoutHandler } from "../redux/slices/loginSlice";
import { poRemoveHandler } from "../redux/slices/poSlice";
import { Link, useLocation } from "react-router-dom";

export default function Header({ title, id }) {
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();
  const logOutFun = () => {
    dispatch(logoutHandler());
    dispatch(poRemoveHandler());
    window.location.href = "/";
    // Persistor.pause();
    // Persistor.flush().then(() => {
    //   return Persistor.purge();
    // });
  };

  useEffect(() => {
    (async () => {
      if (id === "null") {
        dispatch(poRemoveHandler());
      }
    })();
  }, [id]);

  return (
    <>
      <div id="kt_header" className="header align-items-stretch shadow">
        <div className="container-fluid d-flex align-items-stretch justify-content-between">
          <div
            className="d-flex align-items-center d-lg-none ms-n2 me-2"
            title="Show aside menu"
          >
            <div
              className="btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
              id="kt_aside_mobile_toggle"
            >
              <span className="svg-icon svg-icon-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
                    fill="currentColor"
                  ></path>
                  <path
                    opacity="0.3"
                    d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
          <div className="d-flex align-items-stretch justify-content-between w-100">
            <div className="header-menu align-items-stretch justify-content-between w-100">
              <div className="menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch">
                <div className="menu-item here show menu-lg-down-accordion me-lg-1">
                  <span className="menu-link py-3">
                    <span className="menu-title">
                      {
                        <div onClick={() => dispatch(poRemoveHandler())}>
                          <Link className="menu-title" to="/">
                            Dashboard
                          </Link>
                        </div>
                      }
                      &nbsp;
                      {location.pathname.includes("/po/") ? "" : ` / ${title}`}
                    </span>
                    <span className="menu-arrow d-lg-none"></span>
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-end">
                <div
                  className="menu menu-lg-rounded menu-column menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch"
                  style={{ width: "110px" }}
                >
                  <div className="menu-item here show menu-lg-down-accordion pe-lg-2">
                    PO number: <br /> <span className="menu-title">{id}</span>
                  </div>
                </div>
                {/* <div
                  className="menu menu-lg-rounded menu-column menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch"
                  style={{ width: "110px" }}
                >
                  <div className="menu-item here show menu-lg-down-accordion pe-lg-2">
                    User Logged In: <br />{" "}
                    <span className="menu-title">{user.user.username}</span>
                  </div>
                </div> */}
                <div
                  className="menu menu-lg-rounded menu-column menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch"
                  style={{ width: "200px" }}
                >
                  <div className="menu-item here show menu-lg-down-accordion pe-lg-2">
                    Logged In: <br />
                    <span className="menu-title">
                      {user?.user?.vendor_code}
                    </span>
                    <span className="menu-title">
                      {user.user.name ? `(${user.user.name})` : ""}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
