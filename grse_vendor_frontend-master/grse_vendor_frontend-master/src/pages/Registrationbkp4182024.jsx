import React, { useState } from "react";
// import bg from "assets/media/illustrations/sketchy-1/14-dark.png";
import { useDispatch } from "react-redux";

export default function Registration() {
  const [isLoading, setIsLoading] = useState(false);
  const [regData, setRegData] = useState({
    user_type: "",
    deppartment: "",
  });

  const regSubmit = async (e) => {
    e.preventDefault();
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
              <form onSubmit={regSubmit} className="form w-100">
                <div className="text-center mb-3">
                  <img
                    src={require("../images/logo.png")}
                    alt=""
                    className="img-fluid mb-2"
                    style={{ width: "120px" }}
                  />
                  <h3 className="text-dark">
                    Registration Request for OBPS Portal
                  </h3>
                </div>
                <div className="fv-row mb-3">
                  <label className="form-label fs-6 fw-bolder text-dark">
                    User Type
                  </label>
                  <select
                    className="form-select form-control-lg form-control-solid"
                    value={regData?.user_type}
                    onChange={(e) =>
                      setRegData({ ...regData, user_type: e.target.value })
                    }
                  >
                    <option value="">Choose User Type</option>
                    <option value="Vendor">Vendor</option>
                    <option value="GRSE">GRSE Employee</option>
                  </select>
                </div>
                {regData?.user_type !== "" && (
                  <>
                    {regData?.user_type === "GRSE" && (
                      <div className="fv-row mb-3">
                        <label className="form-label fs-6 fw-bolder text-dark">
                          Functional Area
                        </label>
                        <select className="form-select form-control-lg form-control-solid">
                          <option value="">Choose Department Type</option>
                          <option value="Finance">Finance</option>
                          <option value="Design">Design</option>
                          <option value="QAP">Quality Assurance</option>
                          <option value="PPNC">Purchase</option>
                          <option value="PPNC">Contract</option>
                          <option value="PPNC">General</option>
                        </select>
                      </div>
                    )}

                    <div className="fv-row mb-3">
                      <label className="form-label fs-6 fw-bolder text-dark">
                        {regData?.user_type !== "GRSE"
                          ? "Vendor Code"
                          : "MAN Number"}
                      </label>

                      <input
                        className="form-control form-control-lg form-control-solid"
                        type="username"
                        name="vendor_code"
                        autoComplete="off"
                      />
                    </div>
                  </>
                )}
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
