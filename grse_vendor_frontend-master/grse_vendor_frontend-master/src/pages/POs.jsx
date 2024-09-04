import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiCallBack } from "../utils/fetchAPIs";
import { poHandler, poRemoveHandler } from "../redux/slices/poSlice";
import { FiSearch } from "react-icons/fi";
import MainHeader from "../components/MainHeader";
import { logOutFun } from "../utils/logOutFun";
import { logoutHandler } from "../redux/slices/loginSlice";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const POs = () => {
  const dispatch = useDispatch();
  const [polist, setPolist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { token, user } = useSelector((state) => state.auth);
  const { po } = useSelector((state) => state.selectedPO);
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    (async () => {
      const data = await apiCallBack("GET", `po/poList`, null, token);
      if (data?.status) {
        setPolist(data?.data);
      } else if (data?.response?.data?.message === "INVALID_EXPIRED_TOKEN") {
        logOutFun(dispatch, logoutHandler, poRemoveHandler);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (po) {
      navigate(`/po/${po}`);
    }
  }, [po, navigate]);

  // Filter the polist based on the searchQuery
  const filteredPolist = polist.filter((po) => {
    const matchesSearchQuery =
      (po?.poNumber &&
        po?.poNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po?.poType &&
        po?.poType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po?.vendor_code &&
        po?.vendor_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po?.vendor_name &&
        po?.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po?.wbs_id &&
        po?.wbs_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (po?.project_code &&
        po?.project_code.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSelectedStatus =
      selectedStatus === "All" ||
      (po?.currentStage?.current &&
        po?.currentStage?.current
          .toLowerCase()
          .includes(selectedStatus.toLowerCase()));

    return matchesSearchQuery && matchesSelectedStatus;
  });

  const generateExcel = () => {
    const table = document.querySelector(".table");

    const rows = table.querySelectorAll("tr");

    const data = [];
    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td, th");
      cells.forEach((cell) => {
        rowData.push(cell.innerText);
      });
      data.push(rowData);
    });

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Po Details");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(excelBlob);
    downloadLink.download = "po_table.xlsx";

    downloadLink.click();
  };

  return (
    <>
      {/* {user.department_name !== "PPC" && ( */}
      <MainHeader title={"Welcome to OBPS Portal"} />
      {/* )} */}
      {/* {user.department_name !== "PPC" ? ( */}
      {/* // <div className="container">
        //   <div className="row justify-content-center">
        //     <div className="col-md-8 col-12"> */}
      <div className="w-99 m-auto">
        <div className="card">
          <div className="searchfun">
            <div className="card_headline">
              <div>
                <div className="search_top">
                  <label htmlFor="">Search</label>
                </div>
                <div className="input_search">
                  <input
                    type="text"
                    className="form-control"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                  />
                  <button className="search_btn">
                    <FiSearch />
                  </button>
                </div>
              </div>
            </div>
            <div className="card_headline">
              <div>
                <button
                  onClick={generateExcel}
                  className="btn fw-bold btn-primary"
                >
                  Download Po Details
                </button>
              </div>
            </div>
            <div className="card_headline">
              <div>
                <div className="search_top">
                  <label htmlFor="">Select Current Status</label>
                </div>
                <div className="input_search">
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                    }}
                  >
                    <option value="All">All</option>
                    <option value="SDBG">SDBG</option>
                    <option value="Drawing">Drawing</option>
                    <option value="QAP">QAP</option>
                    <option value="ILMS">ILMS</option>
                    <option value="Inspection call letter">
                      Inspection call letter
                    </option>
                    <option value="Shipping documents">
                      Shipping documents
                    </option>
                    <option value="ICGRN">ICGRN</option>
                    <option value="WDC">WDC</option>
                    <option value="BTN">BTN</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped table_styled">
              <thead>
                <tr>
                  <th>POs</th>
                  <th>SDBG</th>
                  <th>Drawings</th>
                  <th>QAP</th>
                  <th>ILMS</th>
                  <th>Current Stage</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolist && filteredPolist.length === 0 ? (
                  <tr>
                    <td colSpan="7">No data found</td>
                  </tr>
                ) : (
                  filteredPolist.map((po, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          className="btn_simple"
                          onClick={() => dispatch(poHandler(po))}
                        >
                          <u>{po?.poNumber}</u> |{" "}
                          {/* {po?.poType === "material"
                            ? "Hybrid"
                            : po?.poType === "service"
                            ? "Service"
                            : ""}{" "} */}
                          <span style={{ textTransform: "capitalize" }}>
                            {po?.poType}
                          </span>
                          {user && user?.user_type !== 1 && (
                            <>
                              {" "}
                              | {po?.project_code} |{" "}
                              {po?.DO?.CNAME && po?.DO?.CNAME}{" "}
                              {po?.DO?.ERNAM && `(${po?.DO?.ERNAM})`}{" "}
                            </>
                          )}
                          <span>
                            | {po?.vendor_code} ({po.vendor_name})
                          </span>
                        </button>
                      </td>
                      <td>
                        {/* SD Date:{" "} */}
                        {po?.SD?.SdContractualSubmissionDate
                          ? new Date(
                              po.SD.SdContractualSubmissionDate
                            ).toLocaleDateString()
                          : "--"}{" "}
                        |{" "}
                        {po?.SD?.SdActualSubmissionDate
                          ? new Date(
                              po.SD.SdActualSubmissionDate
                            ).toLocaleDateString()
                          : "--"}{" "}
                        | {po?.SD?.SdLastStatus || "--"}
                      </td>
                      <td>
                        {/* Drawing Date:{" "} */}
                        {po?.Drawing?.DrawingContractualSubmissionDate
                          ? new Date(
                              po.Drawing.DrawingContractualSubmissionDate
                            ).toLocaleDateString()
                          : "--"}{" "}
                        |{" "}
                        {po?.Drawing?.DrawingActualSubmissionDate
                          ? new Date(
                              po.Drawing.DrawingActualSubmissionDate
                            ).toLocaleDateString()
                          : "--"}{" "}
                        | {po?.Drawing?.DrawingLastStatus || "--"}
                      </td>
                      <td>
                        {/* QAP Date:{" "} */}
                        {po?.QAP?.qapContractualSubmissionDate
                          ? new Date(
                              po.QAP.qapContractualSubmissionDate
                            ).toLocaleDateString()
                          : "--"}{" "}
                        |{" "}
                        {po?.QAP?.qapActualSubmissionDate
                          ? new Date(
                              po.QAP.qapActualSubmissionDate
                            ).toLocaleDateString()
                          : "--"}{" "}
                        | {po?.QAP?.qapLastStatus || "--"}
                      </td>

                      <td>
                        {/* ILMS Date:{" "} */}
                        {po?.ILMS?.ilmsContractualSubmissionDate
                          ? new Date(
                              po.ILMS.ilmsContractualSubmissionDate
                            ).toLocaleDateString()
                          : "--"}{" "}
                        |{" "}
                        {po?.ILMS?.ilmsActualSubmissionDate
                          ? new Date(
                              po.ILMS.ilmsActualSubmissionDate
                            ).toLocaleDateString()
                          : "--"}{" "}
                        | {po?.ILMS?.ilmsLastStatus || "--"}
                      </td>

                      <td>{po?.currentStage?.current}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* ) : ( */}
      {/* //     </div>
        //   </div>
        // </div>
        <WBS />
      )} */}
    </>
  );
};

export default POs;
