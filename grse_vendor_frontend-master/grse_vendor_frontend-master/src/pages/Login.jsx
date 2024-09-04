import React, { useState } from "react";
// import bg from "assets/media/illustrations/sketchy-1/14-dark.png";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { postAPI } from "../utils/fetchAPIs";
import { loginHandler } from "../redux/slices/loginSlice";

export default function Login() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    vendor_code: "",
    password: "",
  });

  const loginSubmit = async (e) => {
    e.preventDefault();
    console.log(loginData);
    if (!loginData.vendor_code) {
      toast.error("Please provide a valid username to login");
      return;
    }
    if (loginData.password === "" || loginData.password === null) {
      toast.error("Please provide a valid password to login");
      return;
    }
    setIsLoading(true);
    let res = await postAPI("auth2/login", loginData, null);
    if (res?.status) {
      dispatch(loginHandler(res));
      // toast.success("Successfully logged in");
    } else {
      toast.error("Please provide correct username and password");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="d-flex flex-column flex-root" style={{ height: "100vh" }}>
        <div className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed">
          <div className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
            <h3 className="text-center">
              Garden Reach Shipbuilders & Engineers Ltd. <br /> (A GOVT.OF INDIA
              UNDERTAKING)
            </h3>
            <div className="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto border">
              <form onSubmit={loginSubmit} className="form w-100">
                <div className="text-center mb-3">
                  <img
                    src={require("../images/logo.png")}
                    alt=""
                    className="img-fluid mb-2"
                    style={{ width: "120px" }}
                  />
                  <h3 className="text-dark">Login to OBPS Portal</h3>
                </div>
                <div className="fv-row mb-3">
                  <label className="form-label fs-6 fw-bolder text-dark">
                    User code
                  </label>

                  <input
                    className="form-control form-control-lg form-control-solid"
                    type="username"
                    name="vendor_code"
                    autoComplete="off"
                    value={loginData.vendor_code}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        vendor_code: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="fv-row mb-3">
                  <div className="d-flex flex-stack mb-2">
                    <label className="form-label fw-bolder text-dark fs-6 mb-0">
                      Password
                    </label>
                  </div>
                  <input
                    className="form-control form-control-lg form-control-solid"
                    type="password"
                    name="password"
                    autoComplete="off"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary w-100 mb-5"
                  >
                    {!isLoading ? (
                      <span className="indicator-label">Continue</span>
                    ) : (
                      <span className="indicator-label">Please wait...</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
