import React, { Fragment, useEffect, useState } from "react";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiCallBack } from "../utils/fetchAPIs";
import { useSelector } from "react-redux";
import { groupByDocumentType } from "../utils/groupedByReq";
import moment from "moment";
import { formatDate } from "../utils/getDateTimeNow";

const DisplayStoreActions = () => {
  const navigate = useNavigate();
  const [isPopup, setIsPopup] = useState(false);
  const [icgrnData, setIcgrnData] = useState([]);
  const [allPdfData, setAllPdfData] = useState([]);
  const [groupByPdfData, setGroupByPdfData] = useState([]);
  const [payloadData, setPayloadData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { poType } = useSelector((state) => state.selectedPO);

  console.log(
    allPdfData,
    "poTypepoTypepoTypepoTypepoTypepoTypepoTypepoTypepoType"
  );

  const getIcgrnData = async () => {
    try {
      const data = await apiCallBack(
        "GET",
        `po/ListOfIcgrn?poNo=${id}`,
        null,
        token
      );
      if (data?.status) {
        setIcgrnData(data?.data);
      }
    } catch (error) {
      console.error("Error fetching ICGRN list:", error);
    }
  };

  const doc_Type_Name = {
    reservation_report: "Store Issue Requisition",
    goods_issue_slip: "Goods Issue Slip",
    icgrn_report: "ICGRN Report",
    ztfi_bil_deface: "Payment Advice",
    gate_entry: "Gate in Entry",
    grn_report: "Grn Report",
    service_entry_report: "Service Entry Number",
  };

  const doc_routes = {
    reservation_report: "/display-store-actions/store-issue-requisition",
    goods_issue_slip: "/display-store-actions/goods-issue-slip",
    icgrn_report: "/display-store-actions/icgrn-report",
    ztfi_bil_deface: "/display-store-actions/payment-advice",
    gate_entry: "/display-store-actions/goods-entry",
    grn_report: "/display-store-actions/good-receipt-slip",
    service_entry_report: "/display-store-actions/service-entry-sheet",
  };

  const getAllPdfHandler = async () => {
    try {
      const data = await apiCallBack(
        "GET",
        `sap/store/storeActionList?poNo=${id}`,
        null,
        token
      );
      if (data?.status) {
        setAllPdfData(data?.data);
      }
    } catch (error) {
      console.error("Error fetching ICGRN list:", error);
    }
  };

  const CheckFileHandler = (item) => {
    if (item.documentType === "reservation_report") {
      setPayloadData({
        reservationNumber: item.reservationNumber,
      });
    }
    if (item.documentType === "goods_issue_slip") {
      setPayloadData({
        issueNo: item.issueNo,
      });
    }
    if (item.documentType === "icgrn_report") {
      setPayloadData({
        docNo: item.docNo,
      });
    }
    if (item.documentType === "ztfi_bil_deface") {
      setPayloadData({
        btn: item.btn,
      });
    }
    if (item.documentType === "gate_entry") {
      setPayloadData({
        gate_entry_no: item.gateEntryNo,
      });
    }
    if (item.documentType === "grn_report") {
      setPayloadData({
        // matDocNo: item.matDocNo,
        matDocNo: item.matDocNo,
      });
    }
    if (item.documentType === "service_entry_report") {
      setPayloadData({
        serviceEntryNumber: item.serviceEntryNumber,
      });
    }
  };

  useEffect(() => {
    getIcgrnData();
    getAllPdfHandler();
  }, [id, token]);

  useEffect(() => {
    if (allPdfData && allPdfData.length > 0) {
      const gData = groupByDocumentType(allPdfData);
      setGroupByPdfData(gData);
    }
  }, [allPdfData]);

  const filteredPdfData = Object.keys(groupByPdfData).reduce(
    (acc, key) => ({
      ...acc,
      [key]: groupByPdfData[key].filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    }),
    {}
  );

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <SideBar />
          <div className="wrapper d-flex flex-column flex-row-fluid">
            <Header title={"Display Store Actions"} id={id} />
            <div className="content d-flex flex-column flex-column-fluid">
              <div className="post d-flex flex-column-fluid">
                <div className="container">
                  <div className="row g-5 g-xl-8">
                    <div className="col-12">
                      <div className="card-body p-3">
                        <div className="tab-content">
                          <div className="table-responsive">
                            <div className="search-bar mb-4 d-flex align-items-center justify-content-end">
                              <input
                                className="searchui"
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <table className="table table-striped table-bordered table_height">
                              <thead>
                                <tr className="border-0">
                                  <th>Document Number</th>
                                  <th>DATE</th>
                                  <th>VIEW DOCUMENT</th>
                                </tr>
                              </thead>
                              <tbody style={{ maxHeight: "100%" }}>
                                {Object.keys(filteredPdfData).map(
                                  (it, index) => {
                                    let items = filteredPdfData[it];
                                    return (
                                      <Fragment key={index}>
                                        <tr>
                                          <td
                                            colSpan={4}
                                            className="fw-bold p-2"
                                            style={{ fontSize: "15px" }}
                                          >
                                            {doc_Type_Name[it]}
                                          </td>
                                        </tr>
                                        {items &&
                                          items.map((item, index) => (
                                            <tr key={index}>
                                              <td>
                                                {" "}
                                                {item.docNo ||
                                                  item.btn ||
                                                  item.issueNo ||
                                                  item.reservationNumber ||
                                                  item.gateEntryNo ||
                                                  item.matDocNo ||
                                                  item.serviceEntryNumber}
                                              </td>
                                              <td>
                                                {/* {item.dateTime &&
                                                  new Date(
                                                    item.dateTime
                                                  ).toLocaleDateString()} */}
                                                {item.dateTime &&
                                                  new Date(
                                                    item.dateTime
                                                  ).toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      day: "2-digit",
                                                      month: "2-digit",
                                                      year: "numeric",
                                                    }
                                                  )}

                                                {/* {item?.dateTime &&
                                                  formatDate(item?.dateTime)} */}
                                              </td>
                                              <td>
                                                <a
                                                  href={`${
                                                    doc_routes[
                                                      item.documentType
                                                    ]
                                                  }/${JSON.stringify(
                                                    payloadData
                                                  )}`}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  onClick={() =>
                                                    CheckFileHandler(item)
                                                  }
                                                >
                                                  VIEW
                                                </a>
                                              </td>
                                            </tr>
                                          ))}
                                      </Fragment>
                                    );
                                  }
                                )}
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
    </>
  );
};

export default DisplayStoreActions;
