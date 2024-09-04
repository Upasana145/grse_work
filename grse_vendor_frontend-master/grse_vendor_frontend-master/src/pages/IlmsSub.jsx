import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiCallBack } from "../utils/fetchAPIs";
import moment from "moment";
import { toast } from "react-toastify";
import { reConfirm } from "../utils/reConfirm";
import { clrLegend } from "../utils/clrLegend";

const IlmsSub = () => {
  const [isPopup, setIsPopup] = useState(false);
  const [allData, setAllData] = useState([]);
  const [referenceNo, setreferenceNo] = useState("");
  const [formData, setFormData] = useState({
    drawingFile: null,
    remarks: "",
  });
  const [selectedActionTypeName, setSelectedActionTypeName] = useState("");
  const { id } = useParams();
  const { user, token, userType } = useSelector((state) => state.auth);
  const { poType } = useSelector((state) => state.selectedPO);
  console.log(user, "useruser");

  const getData = async () => {
    try {
      const data = await apiCallBack(
        "GET",
        `po/ilms/list?poNo=${id}`,
        null,
        token
      );
      console.log(data);
      if (data?.status) {
        setAllData(data?.data);
      }
    } catch (error) {
      console.error("Error fetching drawing list:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [id, token]);

  const optionss = [
    {
      file_type_name: "Upload ILMS",
    },
    {
      file_type_name: "Remarks",
    },
    {
      file_type_name: "Others",
    },
  ];

  const submitHandler = async (flag) => {
    try {
      if (selectedActionTypeName !== "") {
        const formDataToSend = new FormData();
        formDataToSend.append("purchasing_doc_no", id);
        if (formData.drawingFile) {
          formDataToSend.append("file", formData.drawingFile);
        }
        formDataToSend.append("remarks", formData.remarks);
        formDataToSend.append("status", flag);
        formDataToSend.append("type", selectedActionTypeName);
        formDataToSend.append("reference_no", referenceNo);

        const response = await apiCallBack(
          "POST",
          "po/ilms/submitILMS",
          formDataToSend,
          token
        );

        if (response?.status) {
          toast.success(response.message);
          setIsPopup(false);
          setFormData({
            drawingFile: null,
            remarks: "",
          });
          getData();
        } else {
          toast.error(response.message);
        }
      } else {
        toast.warn("Please choose action type!");
      }
    } catch (error) {
      toast.error("Error uploading ilms:", error);
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <SideBar />
          <div className="wrapper d-flex flex-column flex-row-fluid">
            <Header title={"ILMS Submission"} id={id} />
            <div className="content d-flex flex-column flex-column-fluid">
              <div className="post d-flex flex-column-fluid">
                <div className="container">
                  <div className="row g-5 g-xl-8">
                    <div className="col-12">
                      <div className="screen_header">
                        {userType === 1 && (
                          <button
                            onClick={() => setIsPopup(true)}
                            className="btn fw-bold btn-primary mx-3"
                          >
                            ACTION
                          </button>
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
                                  <th>Reference No</th>
                                  <th>DateTime </th>
                                  <th>ILMS File</th>
                                  <th>Action By</th>
                                  <th className="min-w-150px">Remarks</th>
                                  <th>Status</th>
                                  {user.department_id === 2 ? (
                                    <th>Action</th>
                                  ) : (
                                    ""
                                  )}
                                </tr>
                              </thead>
                              <tbody style={{ maxHeight: "100%" }}>
                                {allData &&
                                  allData.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.reference_no}</td>
                                      <td>
                                        {item?.created_at &&
                                          new Date(
                                            item?.created_at
                                          ).toLocaleString()}
                                      </td>
                                      <td className="">
                                        {item.file_name && (
                                          <a
                                            href={`${process.env.REACT_APP_PDF_URL}submitILMS/${item.file_name}`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            Click Here
                                          </a>
                                        )}
                                      </td>
                                      <td className="">
                                        {item?.created_by_id}
                                      </td>
                                      <td className="">{item?.remarks}</td>
                                      <td
                                        className={`${clrLegend(
                                          item?.status
                                        )} bold`}
                                      >
                                        {item.status}
                                      </td>

                                      {user.department_id === 2 ? (
                                        <td>
                                          {item.status == "SUBMITTED" ? (
                                            <button
                                              onClick={() => {
                                                setIsPopup(true);
                                                setreferenceNo(
                                                  item.reference_no
                                                );
                                              }}
                                              className="btn fw-bold btn-primary mx-3"
                                            >
                                              ACTION
                                            </button>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                      ) : (
                                        ""
                                      )}
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

      {(userType === 1 || user?.department_id === 2) && (
        <div className={isPopup ? "popup active" : "popup"}>
          <div className="card card-xxl-stretch mb-5 mb-xxl-8">
            <div className="card-header border-0 pt-5">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  UPLOAD ILMS
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
                  <div className="my-3">
                    <select
                      className="form-select"
                      onChange={(e) => {
                        setSelectedActionTypeName(e.target.value);
                      }}
                    >
                      <option value="">Choose Action Type</option>
                      {optionss.map((option, i) => (
                        <option key={i} value={option.file_type_name}>
                          {option.file_type_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ILMS File</label>
                    &nbsp;&nbsp;
                    <span className="mandatorystart">*</span>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          drawingFile: e.target.files[0],
                        })
                      }
                      accept=".pdf"
                    />
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
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3 d-flex justify-content-between">
                    <button
                      onClick={() => submitHandler("SUBMITTED")}
                      className="btn fw-bold btn-primary"
                      type="button"
                    >
                      SUBMIT
                    </button>

                    <div className="d-flex gap-3">
                      {userType !== 1 && (
                        <button
                          onClick={() =>
                            reConfirm(
                              { file: true },
                              () => submitHandler("APPROVED"),
                              "You're approving the ILMS. Please confirm!"
                            )
                          }
                          className="btn fw-bold btn-success"
                          type="button"
                        >
                          APPROVE
                        </button>
                      )}

                      {userType !== 1 && (
                        <button
                          onClick={() =>
                            reConfirm(
                              { file: true },
                              () => submitHandler("REJECTED"),
                              "The ILMS file is rejected"
                            )
                          }
                          className="btn fw-bold btn-danger"
                          type="button"
                        >
                          REJECT
                        </button>
                      )}
                    </div>
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

export default IlmsSub;
