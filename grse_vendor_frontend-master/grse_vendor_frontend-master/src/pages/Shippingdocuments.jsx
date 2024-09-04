import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { apiCallBack } from "../utils/fetchAPIs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { REQUESTED, SUBMITTED } from "../constants/BGconstants";
import { checkTypeArr } from "../utils/smallFun";

const Shippingdocuments = () => {
  const inputFileRef = useRef(null);
  const [isPopup, setIsPopup] = useState(false);
  const [isPopupstore, setIsPopupstore] = useState(false);
  const [data, setData] = useState([]);
  const { id } = useParams();

  const { user, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    dataFile: null,
    remarks: "",
  });
  const [selectedFileType, setSelectedFileType] = useState("");

  const optionss = [
    {
      file_type_name: "Invoice",
    },
    {
      file_type_name: "Packing list",
    },
    {
      file_type_name: "Delivery challan",
    },
    {
      file_type_name: "Lorry Receipt (LR)",
    },
    {
      file_type_name: "Inspection note",
    },
    {
      file_type_name: "Manufacturers test certificates",
    },
    {
      file_type_name: "Guarantee certificate",
    },
    {
      file_type_name: "Certificate of compliance",
    },
    {
      file_type_name: "Preservation certificate",
    },
    {
      file_type_name: "E-way Bill",
    },
    {
      file_type_name: "Undertaking",
    },
    {
      file_type_name: "Remarks",
    },
  ];

  const getData = async () => {
    try {
      const data = await apiCallBack(
        "GET",
        `po/ListOfShippingDocuments?poNo=${id}`,
        null,
        token
      );
      if (data?.status) {
        setData(data?.data);
      }
    } catch (error) {
      console.error("Error fetching drawing list:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [id, token]);

  const shippingdocumentsBtn = async (flag) => {
    const { dataFile, remarks } = formData;
    if (
      flag === SUBMITTED &&
      (!dataFile || selectedFileType.trim() === "" || remarks.trim() === "")
    ) {
      return toast.warn("Please fill all the required fields!");
    }
    if (flag === REQUESTED && remarks.trim() === "") {
      return toast.warn("Please fill all the required fields!");
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("purchasing_doc_no", id);
      formDataToSend.append("file", dataFile);
      formDataToSend.append("remarks", remarks);
      if (flag === REQUESTED) {
        formDataToSend.append("file_type_name", "REQUESTED to VENDOR");
      } else {
        formDataToSend.append("file_type_name", selectedFileType);
      }

      const response = await apiCallBack(
        "POST",
        "po/shippingDocuments",
        formDataToSend,
        token
      );

      if (response?.status) {
        toast.success("Shipping Document Uploaded Successfully");
        setIsPopup(false);
        setFormData({
          dataFile: null,
          remarks: "",
        });
        setSelectedFileType("");
        setIsPopupstore(false);
        if (flag === SUBMITTED) {
          inputFileRef.current.value = null;
        }
        getData();
      } else {
        // Handle failure, log error details
        console.error("Failed to upload Shipping Document:", response?.error);
        toast.error(
          `Failed to upload Shipping Document: ${response?.error?.message}`
        );
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Error uploading Shipping Document:", error);
      toast.error(
        "An unexpected error occurred while uploading Shipping Document"
      );
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <SideBar />
          <div className="wrapper d-flex flex-column flex-row-fluid">
            <Header title={"Shipping Documents"} id={id} />
            <div className="content d-flex flex-column flex-column-fluid">
              <div className="post d-flex flex-column-fluid">
                <div className="container">
                  <div className="row g-5 g-xl-8">
                    <div className="col-12">
                      <div className="screen_header">
                        {user?.user_type === 1 && (
                          <>
                            <button
                              onClick={() => setIsPopup(true)}
                              className="btn fw-bold btn-primary me-3"
                            >
                              ACTION
                            </button>
                          </>
                        )}
                        {(user?.department_id === 5 ||
                          user?.department_id === 16) && (
                          <>
                            <button
                              onClick={() => setIsPopupstore(true)}
                              className="btn fw-bold btn-primary me-3"
                            >
                              ACTION
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="card-body p-3">
                        <div className="tab-content">
                          <div className="table-responsive">
                            <table className="table table-striped table-bordered table_height">
                              <thead>
                                <tr className="border-0">
                                  <th>DateTime</th>
                                  <th>Shipping Documents</th>
                                  <th>Action Type</th>
                                  <th>Action By</th>
                                  <th className="min-w-150px">Remarks</th>
                                </tr>
                              </thead>
                              <tbody style={{ maxHeight: "100%" }}>
                                {checkTypeArr(data) &&
                                  data.map((item, index) => (
                                    <tr key={index}>
                                      <td className="table_center">
                                        {moment(item.created_at)
                                          .utc()
                                          .format("YYYY-MM-DD")}
                                      </td>
                                      <td>
                                        {item.file_name && (
                                          <a
                                            href={`${process.env.REACT_APP_PDF_URL}shippingDocuments/${item.file_name}`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            Click Here
                                          </a>
                                        )}
                                      </td>
                                      <td>{item.file_type_name}</td>
                                      <td>{item.updated_by}</td>
                                      <td>{item.remarks}</td>
                                    </tr>
                                  ))}
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

      {/* vendor */}
      {user?.user_type === 1 && (
        <div className={isPopup ? "popup active" : "popup"}>
          <div className="card card-xxl-stretch mb-5 mb-xxl-8">
            <div className="card-header border-0 pt-5 pb-3">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  Upload Shipping Documents
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
                    <select
                      name=""
                      id=""
                      className="form-select"
                      onChange={(e) => {
                        setSelectedFileType(e.target.value);
                      }}
                      value={selectedFileType}
                    >
                      <option value="">Select...</option>

                      {optionss.map((option, i) => (
                        <option key={i} value={option.selectedFileTypeName}>
                          {option.file_type_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Shipping Documents File
                    </label>
                    &nbsp;&nbsp;
                    <span className="mandatorystart">*</span>
                    <input
                      type="file"
                      className="form-control"
                      ref={inputFileRef}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataFile: e.target.files[0],
                        })
                      }
                      accept=".pdf"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    &nbsp;&nbsp;
                    <span className="mandatorystart">*</span>
                    <textarea
                      name=""
                      id=""
                      rows="4"
                      className="form-control"
                      value={formData?.remarks}
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3 d-flex justify-content-between">
                    <button
                      onClick={() => shippingdocumentsBtn("SUBMITTED")}
                      className="btn fw-bold btn-primary"
                      type="button"
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* store  ric*/}
      {(user?.department_id === 5 || user?.department_id === 16) && (
        <div className={isPopupstore ? "popup active" : "popup"}>
          <div className="card card-xxl-stretch mb-5 mb-xxl-8">
            <div className="card-header border-0 pt-5 pb-3">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  Request For Required Shipping Documents
                </span>
              </h3>
              <button
                className="btn fw-bold btn-danger"
                onClick={() => setIsPopupstore(false)}
              >
                Close
              </button>
            </div>
            <form>
              <div className="row">
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    &nbsp;&nbsp;
                    <span className="mandatorystart">*</span>
                    <textarea
                      name=""
                      id=""
                      rows="4"
                      className="form-control"
                      value={formData?.remarks}
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3 d-flex justify-content-between">
                    <button
                      onClick={() => shippingdocumentsBtn("REQUESTED")}
                      className="btn fw-bold btn-primary"
                      type="button"
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Shippingdocuments;
