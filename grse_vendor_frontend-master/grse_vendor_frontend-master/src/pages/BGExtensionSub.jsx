import React, { useState } from "react";
import Footer from "../components/Footer";
// import SideBar from "../components/SideBar";
// import Header from "../components/Header";
// import { useParams } from "react-router-dom";
import MainHeader from "../components/MainHeader";

const BGExtensionSub = () => {
  const [isPopup, setIsPopup] = useState(false);

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          {/* <SideBar /> */}
          <div className="d-flex flex-column flex-row-fluid">
            <MainHeader title={"BG Extension/Release"} />
            <div className="content d-flex flex-column flex-column-fluid">
              <div className="post d-flex flex-column-fluid">
                <div className="container">
                  <div className="row g-5 g-xl-8">
                    <div className="col-12">
                      <div className="card-body p-3">
                        <div className="tab-content">
                          <div className="d-flex align-items-center justify-content-end mb-3">
                            <button className="btn fw-bold btn-primary mx-3">
                              GENERATE
                            </button>
                          </div>
                          <div className="table-responsive">
                            <table className="table table-striped table-bordered table_height">
                              <thead>
                                <tr className="border-0">
                                  <th>SL No </th>
                                  <th>BG Number </th>
                                  <th>PO</th>
                                  {/* for DO */}
                                  {/* <th>Recommandation By DO</th> */}
                                  {/* for finance officer */}
                                  {/* <th>Action</th> */}
                                  <th>Action By FO</th>
                                </tr>
                              </thead>
                              <tbody style={{ maxHeight: "100%" }}>
                                <tr>
                                  <td className="table_center">
                                    01/11/2023-10:30AM
                                  </td>
                                  <td>
                                    {/* <a
                                      href={require("C:/Users/admin/Downloads/sample.pdf")}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Check File
                                    </a> */}
                                  </td>
                                  <td>BG extension request lette</td>
                                  <td>
                                    <select
                                      name=""
                                      id=""
                                      className="form-control"
                                      // disabled
                                    >
                                      <option value="">Extension</option>
                                      <option value="">Release</option>
                                    </select>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="table_center">
                                    31/10/2023-12:36PM
                                  </td>
                                  <td>
                                    {/* <a
                                      href={require("C:/Users/admin/Downloads/sample.pdf")}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Check File
                                    </a> */}
                                  </td>
                                  <td>BG release letter</td>
                                  <td>
                                    {/* disabled for FO but enable for DO */}
                                    <select
                                      name=""
                                      id=""
                                      className="form-control"
                                      // disabled
                                    >
                                      <option value="">Extension</option>
                                      <option value="">Release</option>
                                    </select>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
      <div className={isPopup ? "popup active" : "popup"}>
        <div className="card card-xxl-stretch mb-5 mb-xxl-8">
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">
                Upload Shipping documents
              </span>
            </h3>
            <button
              className="btn fw-bold btn-danger"
              onClick={() => setIsPopup(false)}
            >
              Close
            </button>
          </div>
          <form>
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Shipping File Type <span className="star">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Shipping File <span className="star">*</span>
                  </label>
                  <input type="file" className="form-control" />
                </div>
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea
                    name=""
                    id=""
                    rows="4"
                    className="form-control"
                  ></textarea>
                </div>
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <button className="btn fw-bold btn-primary">UPDATE</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BGExtensionSub;
