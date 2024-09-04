import React, { Fragment, useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiCallBack } from "../utils/fetchAPIs";
import Select from "react-select";
import { toast } from "react-toastify";
import { reConfirm } from "../utils/reConfirm";
import ReactDatePicker from "react-datepicker";
import {
  calDatesDiff,
  convertToEpoch,
  formatDate,
} from "../utils/getDateTimeNow";
import { clrLegend } from "../utils/clrLegend";
import { checkTypeArr } from "../utils/smallFun";
import { USER_PPNC_DEPARTMENT, USER_VENDOR } from "../constants/userConstants";
import { APPROVED, REJECTED, SUBMITTED } from "../constants/BGconstants";
import { groupedByRefNo } from "../utils/groupedByReq";
import { inputOnWheelPrevent } from "../utils/inputOnWheelPrevent";
import { FaPlus } from "react-icons/fa";

const WDCSub = () => {
  let line_item_fields = {
    claim_qty: "",
    line_item_no: "",
    contractual_start_date: "",
    Contractual_completion_date: "",
    actual_start_date: "",
    actual_completion_date: "",
    hinderance_in_days: "",
  };

  let initialFormData = {
    certifying_authority: "",
    action_type: "",
    remarks: "",
    job_location: "",
    yard_no: "",
    unit: "",
    stage_details: "",
    work_title: "",
    work_done_by: "",
    inspection_note_ref_no: "",
    file_inspection_note_ref_no: null,
    hinderence_report_cerified_by_berth: "",
    file_hinderence_report_cerified_by_berth: null,
    attendance_report: "",
    file_attendance_report: null,
    line_item_array: [line_item_fields],
  };

  //wdc*****************************************************************************************************************

  let line_item_fieldswdc = {
    claim_qty: "",
    line_item_no: "",
    actual_start_date: "",
    actual_completion_date: "",
    delay_in_work_execution: "",
  };

  let initialFormDatawdc = {
    action_type: "",
    remarks: "",
    job_location: "",
    yard_no: "",
    status: "",
    work_title: "",
    work_done_by: "",
    guarantee_defect_liability_start_date: "",
    guarantee_defect_liability_end_date: "",
    line_item_array: [line_item_fieldswdc],
  };

  const [isPopup, setIsPopup] = useState(false);
  const [isPopupView, setIsPopupView] = useState(false);
  const [isSecPopup, setIsSecPopup] = useState(false);
  const [allData, setAllData] = useState([]);
  const [lineItemData, setLineItemData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [emp, setEmp] = useState(null);
  const [delay, setDelay] = useState("");
  const [doForm, setDoForm] = useState({
    contractual_start_date: "",
    Contractual_completion_date: "",
  });
  console.log(viewData, "viewData,,,,,,,,,,,,,,,");

  const [dynamicFields, setDynamicFields] = useState([line_item_fields]);
  const [dynamicFieldsWdc, setDynamicFieldsWdc] = useState([
    line_item_fieldswdc,
  ]);
  // console.log(dynamicFieldsWdc, "dynamicFieldsWdc mmmmmmmmmmmmm");

  const [formData, setFormData] = useState(initialFormData);
  const [formDataWdc, setFormDataWdc] = useState(initialFormDatawdc);
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);

  // console.log(
  //   formDataWdc,
  //   "formDataWdcformDataWdcformDataWdcformDataWdc zzzzzzzzzzzzzzzzzzzzzz"
  // );

  const fileoneInputRef = useRef(null);
  const filetwoInputRef = useRef(null);
  const filethreeInputRef = useRef(null);
  // console.log(formData, "formDataabhinit");

  const getData = async () => {
    try {
      const data = await apiCallBack(
        "GET",
        `po/wdc/wdcList?poNo=${id}`,
        null,
        token
      );
      if (data?.status) {
        setAllData(JSON.parse(data?.data));
      }
    } catch (error) {
      console.error("Error fetching WDC/JCC list:", error);
    }
  };

  const getPOLineItemData = async () => {
    try {
      const data = await apiCallBack("GET", `po/details?id=${id}`, null, token);
      if (data?.status) {
        let lineItem = data?.data[0]?.materialResult;
        setLineItemData(lineItem);
      }
    } catch (error) {
      console.error("Error fetching PO Line Items:", error);
    }
  };

  const getEmp = async () => {
    try {
      const data = await apiCallBack("GET", `po/wdc/grseEmpList`, null, token);
      if (data?.status) {
        let options = data.data.map((item, index) => {
          return {
            value: item.code,
            label: `${item.name} (${item.code})`,
          };
        });
        setEmp(options);
      }
    } catch (error) {
      console.error("Error fetching Employee list:", error);
    }
  };

  useEffect(() => {
    getData();
    getEmp();
    getPOLineItemData();
  }, [id, token]);

  useEffect(() => {
    if (allData && allData.length > 0) {
      const gData = groupedByRefNo(allData);
      setGroupedData(gData);
    }
  }, [allData]);

  const submitHandler = async (flag, ref_no) => {
    try {
      const formDataCopy = { ...formData }; // Create a copy of formData

      // Check if all required fields are filled
      if (
        formDataCopy.action_type &&
        formDataCopy.remarks &&
        formDataCopy.line_item_array &&
        formDataCopy.line_item_array.length > 0
      ) {
        const fD = new FormData();

        // Append other fields to FormData
        fD.append("action_type", formDataCopy.action_type);
        fD.append("purchasing_doc_no", id);
        fD.append("remarks", formDataCopy.remarks);
        fD.append("status", flag);
        fD.append("work_done_by", formDataCopy.work_done_by);
        fD.append("work_title", formDataCopy.work_title);
        fD.append("job_location", formDataCopy.job_location);
        fD.append("yard_no", formDataCopy.yard_no);
        fD.append(
          "inspection_note_ref_no",
          formDataCopy.inspection_note_ref_no
        );
        fD.append(
          "file_inspection_note_ref_no",
          formDataCopy.file_inspection_note_ref_no
        );
        fD.append(
          "hinderence_report_cerified_by_berth",
          formDataCopy.hinderence_report_cerified_by_berth
        );
        fD.append(
          "file_hinderence_report_cerified_by_berth",
          formDataCopy.file_hinderence_report_cerified_by_berth
        );
        fD.append("attendance_report", formDataCopy.attendance_report);
        fD.append(
          "file_attendance_report",
          formDataCopy.file_attendance_report
        );
        fD.append("unit", formDataCopy.unit);
        fD.append("stage_details", formDataCopy.stage_details);
        fD.append("assigned_to", formDataCopy.certifying_authority);

        // Convert line_item_array to JSON string and append to FormData
        formDataCopy.line_item_array = dynamicFields;
        fD.append(
          "line_item_array",
          JSON.stringify(formDataCopy.line_item_array)
        );

        console.log("fd", fD);

        const res = await apiCallBack("POST", "po/wdc/submitWdc", fD, token);

        if (res.status) {
          toast.success(res.message);
          setIsPopup(false);
          setIsSecPopup(false);
          setFormData(initialFormData);
          getData();
        } else {
          toast.warn(res.message);
        }
      } else {
        toast.warn("Please fill up all the required fields!");
      }
    } catch (error) {
      toast.error("Error uploading file: " + error.message);
      console.error("Error uploading file:", error);
    }
  };

  //JCC *****************************************************

  const submitHandlerWdc = async (flag, ref_no) => {
    try {
      // Create copies of formData and formDataWdc
      const formDataCopy = { ...formData };
      const formDataWdcCopy = { ...formDataWdc };

      // Check if all required fields are filled
      if (
        formDataCopy.action_type &&
        formDataWdcCopy.remarks &&
        formDataWdcCopy.line_item_array &&
        formDataWdcCopy.line_item_array.length > 0
      ) {
        const formDataToSend = new FormData();

        // Append data to formDataToSend
        formDataToSend.append("action_type", formDataCopy.action_type);
        formDataToSend.append("purchasing_doc_no", id);
        formDataToSend.append("remarks", formDataWdcCopy.remarks);
        formDataToSend.append("status", flag);
        formDataToSend.append("work_done_by", formDataWdcCopy.work_done_by);
        formDataToSend.append("work_title", formDataWdcCopy.work_title);
        formDataToSend.append("job_location", formDataWdcCopy.job_location);
        formDataToSend.append("yard_no", formDataWdcCopy.yard_no);
        formDataToSend.append("assigned_to", formDataCopy.certifying_authority);
        formDataToSend.append(
          "guarantee_defect_liability_start_date",
          convertToEpoch(formDataWdcCopy.guarantee_defect_liability_start_date)
        );
        formDataToSend.append(
          "guarantee_defect_liability_end_date",
          convertToEpoch(formDataWdcCopy.guarantee_defect_liability_end_date)
        );
        // convertToEpoch(delivery_date),
        // Convert line_item_array to JSON string and append to FormData
        formDataWdcCopy.line_item_array = dynamicFieldsWdc;
        formDataToSend.append(
          "line_item_array",
          JSON.stringify(formDataWdcCopy.line_item_array)
        );

        // Perform API call
        const res = await apiCallBack(
          "POST",
          "po/wdc/submitWdc",
          formDataToSend,
          token
        );

        // Handle response
        if (res.status) {
          toast.success(res.message);
          setIsPopup(false);
          setIsSecPopup(false);
          setFormData(initialFormData);
          setFormDataWdc(initialFormDatawdc);
          getData();
        } else {
          toast.warn(res.message);
        }
      } else {
        toast.warn("Please fill up all the required fields!");
      }
    } catch (error) {
      toast.error("Error uploading file: " + error.message);
      console.error("Error uploading file:", error);
    }
  };

  const submitHandlerAction = async (flag, reference_no) => {
    try {
      const formDataCopy = { ...formData }; // Create a copy of formData

      // Check if all required fields are filled
      {
        const fD = new FormData();

        // Append other fields to FormData

        fD.append("purchasing_doc_no", viewData?.purchasing_doc_no || ""); // Use viewData instead of id
        fD.append("reference_no", reference_no || viewData.reference_no || "");

        // Append status from parameters
        fD.append("status", flag);

        // Construct line_item_array from multiple objects
        const lineItemArray = viewData.line_item_array.map((item) => ({
          contractual_start_date: doForm.contractual_start_date,
          Contractual_completion_date: doForm.Contractual_completion_date,
          delay: delay,
          line_item_no: item.line_item_no || "", // Use the line_item_no from viewData, if available
        }));

        fD.append("line_item_array", JSON.stringify(lineItemArray));

        console.log("fd", fD);

        console.log("fd", fD);

        const res = await apiCallBack("POST", "po/wdc/submitWdc", fD, token);

        if (res.status) {
          toast.success(res.message);
          setIsPopup(false);
          setIsSecPopup(false);
          setFormData(initialFormData);
          getData();
        } else {
          toast.warn(res.message);
        }
      }
    } catch (error) {
      toast.error("Error uploading file: " + error.message);
      console.error("Error uploading file:", error);
    }
  };

  // const submitHandlerAction = async (flag, ref_no) => {
  //   try {
  //     const { action_type, line_item_array } = formData;

  //     if (action_type && line_item_array && line_item_array.length > 0) {
  //       const fD = new FormData();

  //       fD.append("action_type", action_type);
  //       Object.keys(viewData).forEach((key) => {
  //         if (key !== "line_item_array") {
  //           fD.append(key, viewData[key]);
  //         }
  //       });

  //       const updatedLineItemArray = line_item_array.map((item) => ({
  //         ...item,
  //         contractual_start_date: doForm.contractual_start_date,
  //         Contractual_completion_date: doForm.Contractual_completion_date,
  //       }));
  //       fD.append("line_item_array", JSON.stringify(updatedLineItemArray));

  //       const res = await apiCallBack("POST", "po/wdc/submitWdc", fD, token);

  //       if (res.status) {
  //         toast.success(res.message);
  //         setIsPopup(false);
  //         setIsSecPopup(false);
  //         setFormData(initialFormData);
  //         getData();
  //       } else {
  //         toast.warn(res.message);
  //       }
  //     } else {
  //       // No need for this warning since all required fields are displayed in viewData
  //       // toast.warn("Please fill up all the required fields!");
  //     }
  //   } catch (error) {
  //     toast.error("Error uploading file: " + error.message);
  //     console.error("Error uploading file:", error);
  //   }
  // };

  const getAvailableAmount = async (item) => {
    try {
      const res = await apiCallBack(
        "GET",
        `po/demandeManagement/getRestAmount?po_no=${id}&line_item_no=${item}`,
        null,
        token
      );
      if (res?.status) {
        return {
          description: res?.data?.description,
          rest_amount: res?.data?.rest_amount,
          unit: res?.data?.unit,
        };
      }
    } catch (error) {
      console.error("Error fetching WDC list:", error);
      return null;
    }
  };

  const getAvailableAmountWdc = async (item) => {
    try {
      const res = await apiCallBack(
        "GET",
        `po/demandeManagement/getRestAmount?po_no=${id}&line_item_no=${item}`,
        null,
        token
      );
      if (res?.status) {
        return {
          description: res?.data?.description,
          rest_amount: res?.data?.rest_amount,
          unit: res?.data?.unit,
          matarial_code: res?.data?.matarial_code,
          target_amount: res?.data?.target_amount,
          po_rate: res?.data?.po_rate,
        };
      }
    } catch (error) {
      console.error("Error fetching WDC list:", error);
      return null;
    }
  };

  const handleFieldChange = async (index, fieldName, value) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index][fieldName] = value;

    // Fetch and update Description, Open PO Qty, and UOM when Line Item No changes
    if (fieldName === "line_item_no") {
      const lineItemNo = value;
      // Fetch corresponding data for the selected Line Item No
      let getRestData = await getAvailableAmount(lineItemNo);
      // Update the corresponding fields in the state
      updatedFields[index].description = getRestData?.description;
      updatedFields[index].rest_amount = getRestData?.rest_amount;
      updatedFields[index].unit = getRestData?.unit;

      // Update the state with the modified dynamic fields
      setDynamicFields(updatedFields);
    } else {
      // Update the state with the modified dynamic fields
      setDynamicFields(updatedFields);
    }
  };

  const handleFieldChangeWdc = async (index, fieldName, value) => {
    const updatedFields = [...dynamicFieldsWdc];
    updatedFields[index][fieldName] = value;

    // Fetch and update Description, Open PO Qty, and UOM when Line Item No changes
    if (fieldName === "line_item_no") {
      const lineItemNo = value;
      // Fetch corresponding data for the selected Line Item No
      let getRestData = await getAvailableAmountWdc(lineItemNo);
      // Update the corresponding fields in the state
      updatedFields[index].description = getRestData?.description;
      updatedFields[index].rest_amount = getRestData?.rest_amount;
      updatedFields[index].unit = getRestData?.unit;
      updatedFields[index].matarial_code = getRestData?.matarial_code;
      updatedFields[index].target_amount = getRestData?.target_amount;
      updatedFields[index].po_rate = getRestData?.po_rate;

      // Update the state with the modified dynamic fields
      setDynamicFieldsWdc(updatedFields);
    } else {
      // Update the state with the modified dynamic fields
      setDynamicFieldsWdc(updatedFields);
    }
  };

  const handleDateChange = (index, fieldName, date) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index][fieldName] = date;
    setDynamicFields(updatedFields);
  };
  const handleDateChangeWdc = (index, fieldName, date) => {
    const updatedFields = [...dynamicFieldsWdc];
    updatedFields[index][fieldName] = date;
    setDynamicFieldsWdc(updatedFields);
  };

  // useEffect(() => {
  //   console.log("viewData2", doForm?.contractual_completion_date);
  //   let dateDelay;
  //   if(doForm?.contractual_completion_date){
  //     dateDelay = parseInt(calDatesDiff(new Date(viewData?.line_item_array[0]?.actual_completion_date), new Date(doForm?.contractual_completion_date))) + parseInt(viewData?.line_item_array[0]?.hinderance_in_days)
  //   } else {
  //     dateDelay = parseInt(viewData?.line_item_array[0]?.hinderance_in_days)

  //   }
  //   setDelay(dateDelay)
  // }, [doForm?.contractual_completion_date, viewData])

  useEffect(() => {
    // console.log("viewData2", doForm?.contractual_completion_date);

    let dateDelay = 0; // Initialize delay to a default value

    if (viewData?.line_item_array && viewData.line_item_array.length > 0) {
      // Check if viewData.line_item_array exists and has at least one element
      if (doForm?.Contractual_completion_date) {
        // Calculate delay based on actual completion date and contractual completion date
        dateDelay =
          parseInt(
            calDatesDiff(
              new Date(viewData.line_item_array[0].actual_completion_date),
              new Date(doForm.Contractual_completion_date)
            )
          ) + parseInt(viewData.line_item_array[0].hinderance_in_days);
      } else {
        // If contractual completion date is not available, use only hinderance in days
        dateDelay = parseInt(viewData.line_item_array[0].hinderance_in_days);
      }
    }

    // Set the delay state
    setDelay(dateDelay);
  }, [doForm?.Contractual_completion_date, viewData]);

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <SideBar />
          <div className="wrapper d-flex flex-column flex-row-fluid">
            <Header title={"WDC - JCC"} id={id} />
            <div className="content d-flex flex-column flex-column-fluid">
              <div className="post d-flex flex-column-fluid">
                <div className="container">
                  <div className="row g-5 g-xl-8">
                    <div className="col-12">
                      <div className="screen_header">
                        {user?.user_type === USER_VENDOR && (
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
                                  {/* <th className="min-w-150px">Reference No</th> */}
                                  <th>Action Type</th>
                                  <th className="min-w-150px">DateTime </th>
                                  <th className="min-w-150px">Action By</th>
                                  <th className="min-w-150px">Date</th>
                                  <th>PO LineItem</th>
                                  <th className="min-w-150px">Status</th>
                                  <th className="min-w-150px">Action</th>
                                </tr>
                              </thead>
                              <tbody style={{ maxHeight: "100%" }}>
                                {Object.keys(groupedData).map((it, index) => {
                                  let items = groupedData[it];
                                  return (
                                    <Fragment key={index}>
                                      <tr>
                                        <td colSpan={19}>
                                          <b>{it}</b>
                                        </td>
                                      </tr>
                                      {checkTypeArr(items) &&
                                        items.map((item, index) => (
                                          <tr key={index}>
                                            <td>{item?.action_type}</td>
                                            <td>
                                              {item?.created_at &&
                                                formatDate(item?.created_at)}
                                            </td>
                                            <td>{item.created_by_id}</td>
                                            <td>
                                              {item?.wdc_date &&
                                                new Date(
                                                  item.wdc_date * 1000
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>{item?.line_item_no}</td>
                                            <td
                                              className={`${clrLegend(
                                                item?.status
                                              )} bold`}
                                            >
                                              {item?.status}
                                            </td>
                                            <td className="d-flex">
                                              <button
                                                onClick={() => {
                                                  setViewData(item);
                                                  setIsPopupView(true);
                                                }}
                                                className="btn btn-sm fw-bold btn-secondary m-1"
                                                type="button"
                                              >
                                                View
                                              </button>
                                              {item.status === "SUBMITTED" &&
                                                user.department_id ===
                                                  USER_PPNC_DEPARTMENT && (
                                                  <>
                                                    <button
                                                      onClick={() => {
                                                        setViewData(item);
                                                        setIsSecPopup(true);
                                                      }}
                                                      className="btn btn-sm fw-bold btn-primary m-1"
                                                      type="button"
                                                    >
                                                      Action
                                                    </button>
                                                  </>
                                                )}
                                            </td>
                                          </tr>
                                        ))}
                                    </Fragment>
                                  );
                                })}
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

      {user?.user_type === USER_VENDOR && (
        <div className={isPopup ? "popup popup_lg active" : "popup popup_lg"}>
          <div className="card card-xxl-stretch mb-5 mb-xxl-8">
            <div className="card-header border-0 pt-5 pb-3">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  Take Your Action{" "}
                  {formData?.action_type === "WDC" ? "(WDC)" : "(JCC)"}
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
                <div className="col-12 col-md-3">
                  <div className="mb-3">
                    <label className="form-label">
                      Action <span className="red">*</span>{" "}
                    </label>
                    <select
                      name=""
                      id=""
                      className="form-select"
                      value={formData?.action_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          action_type: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose Your Action</option>
                      <option value="WDC">Work Done Certificate</option>
                      <option value="JCC">Job Completion Certificate</option>
                    </select>
                  </div>
                </div>
                {formData?.action_type === "WDC" && (
                  <>
                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">Work Done By</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData?.work_done_by}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              work_done_by: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">Work Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData?.work_title}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              work_title: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">JOB Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData?.job_location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              job_location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Unit</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData?.unit}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              unit: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Yard No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData?.yard_no}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              yard_no: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">
                          Inspection Note Ref. No.
                        </label>
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={formData?.inspection_note_ref_no}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                inspection_note_ref_no: e.target.value,
                              })
                            }
                          />
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                file_inspection_note_ref_no: e.target.files[0],
                              })
                            }
                            ref={fileoneInputRef}
                            accept=".pdf"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">
                          Hinderence report cerified By Berth.{" "}
                        </label>
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={
                              formData?.hinderence_report_cerified_by_berth
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                hinderence_report_cerified_by_berth:
                                  e.target.value,
                              })
                            }
                          />
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                file_hinderence_report_cerified_by_berth:
                                  e.target.files[0],
                              })
                            }
                            ref={filetwoInputRef}
                            accept=".pdf"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Attendance Report</label>
                        <div className="d-flex">
                          <input
                            type="text"
                            className="form-control me-2"
                            value={formData?.attendance_report}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                attendance_report: e.target.value,
                              })
                            }
                          />
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                file_attendance_report: e.target.files[0],
                              })
                            }
                            ref={filethreeInputRef}
                            accept=".pdf"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Stage Details</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData?.stage_details}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stage_details: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>PO LineItem</th>
                          <th>Description</th>
                          <th>Open Quantity</th>
                          <th>Claim Quantity</th>
                          <th>Actual Start</th>
                          <th>Actual Completion</th>
                          <th>Hinderance in Days</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dynamicFields.map((field, index) => (
                          <Fragment key={index}>
                            <tr>
                              <td>
                                <select
                                  name={`line_item_${index}`}
                                  id={`line_item_${index}`}
                                  className="form-select"
                                  value={field.line_item_no}
                                  onChange={(e) => {
                                    handleFieldChange(
                                      index,
                                      "line_item_no",
                                      e.target.value
                                    );
                                    // getAvailableAmount(e.target.value, index);
                                  }}
                                >
                                  <option value="">Choose PO Line Item</option>
                                  {checkTypeArr(lineItemData) &&
                                    lineItemData.map((item, i) => (
                                      <option
                                        value={item?.material_item_number}
                                        key={i}
                                      >
                                        {item?.material_item_number}
                                      </option>
                                    ))}
                                </select>
                              </td>
                              <td>{field.description}</td>
                              <td>
                                {field.rest_amount} {field.unit}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={field.claim_qty}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "claim_qty",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                {" "}
                                <ReactDatePicker
                                  selected={field.actual_start_date}
                                  onChange={(date) =>
                                    handleDateChange(
                                      index,
                                      "actual_start_date",
                                      date
                                    )
                                  }
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  placeholderText="DD/MM/YYYY"
                                />
                              </td>
                              <td>
                                <ReactDatePicker
                                  selected={field.actual_completion_date}
                                  onChange={(date) =>
                                    handleDateChange(
                                      index,
                                      "actual_completion_date",
                                      date
                                    )
                                  }
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  placeholderText="DD/MM/YYYY"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={field.hinderance_in_days}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "hinderance_in_days",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                {index === dynamicFields.length - 1 && (
                                  <FaPlus
                                    onClick={() =>
                                      setDynamicFields([
                                        ...dynamicFields,
                                        line_item_fields,
                                      ])
                                    }
                                  />
                                )}
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>

                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Certifying Authority <span className="red">*</span>{" "}
                        </label>

                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isClearable={true}
                          isSearchable={true}
                          name="emp"
                          id="emp"
                          options={emp}
                          value={
                            emp &&
                            emp.filter(
                              (item) =>
                                item.value === formData?.certifying_authority
                            )[0]
                          }
                          onChange={(val) =>
                            setFormData({
                              ...formData,
                              certifying_authority: val.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Remarks <span className="red">*</span>{" "}
                        </label>
                        <textarea
                          name=""
                          id=""
                          rows="4"
                          className="form-control"
                          value={formData?.remarks}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              remarks: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3 d-flex justify-content-between">
                        <button
                          onClick={() => submitHandler("SUBMITTED", null)}
                          className="btn fw-bold btn-primary"
                          type="button"
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {formData?.action_type === "JCC" && (
                  <>
                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">Work Done By</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formDataWdc?.work_done_by}
                          onChange={(e) =>
                            setFormDataWdc({
                              ...formDataWdc,
                              work_done_by: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">Work Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formDataWdc?.work_title}
                          onChange={(e) =>
                            setFormDataWdc({
                              ...formDataWdc,
                              work_title: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">JOB Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formDataWdc?.job_location}
                          onChange={(e) =>
                            setFormDataWdc({
                              ...formDataWdc,
                              job_location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">Yard No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formDataWdc?.yard_no}
                          onChange={(e) =>
                            setFormDataWdc({
                              ...formDataWdc,
                              yard_no: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    {/* guarantee_defect_liability_start_date: "",
    guarantee_defect_liability_end_date: "", */}
                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">
                          Guarantee Defect Start Date
                        </label>
                        <ReactDatePicker
                          selected={
                            formDataWdc?.guarantee_defect_liability_start_date
                          }
                          onChange={(date) =>
                            setFormDataWdc({
                              ...formDataWdc,
                              guarantee_defect_liability_start_date: date,
                            })
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          placeholderText="DD/MM/YYYY"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">
                          Guarantee Defect End Date
                        </label>
                        <ReactDatePicker
                          selected={
                            formDataWdc?.guarantee_defect_liability_end_date
                          }
                          onChange={(date) =>
                            setFormDataWdc({
                              ...formDataWdc,
                              guarantee_defect_liability_end_date: date,
                            })
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          placeholderText="DD/MM/YYYY"
                        />
                      </div>
                    </div>

                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>PO LineItem</th>
                          <th>Service Code</th>
                          <th>Description</th>
                          <th>PO Quantity</th>
                          <th>Claim Quantity</th>
                          <th>PO Rate</th>
                          <th>Total</th>
                          <th>Actual Start Date</th>
                          <th>Actual Completion date</th>
                          <th>Delay in work execution</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dynamicFieldsWdc.map((field, index) => (
                          <Fragment key={index}>
                            <tr>
                              <td>
                                <select
                                  name={`line_item_${index}`}
                                  id={`line_item_${index}`}
                                  className="form-select"
                                  value={field.line_item_no}
                                  onChange={(e) => {
                                    handleFieldChangeWdc(
                                      index,
                                      "line_item_no",
                                      e.target.value
                                    );
                                    // getAvailableAmount(e.target.value, index);
                                  }}
                                >
                                  <option value="">Choose PO Line Item</option>
                                  {checkTypeArr(lineItemData) &&
                                    lineItemData.map((item, i) => (
                                      <option
                                        value={item?.material_item_number}
                                        key={i}
                                      >
                                        {item?.material_item_number}
                                      </option>
                                    ))}
                                </select>
                              </td>
                              <td>{field.matarial_code}</td>
                              <td>{field.description}</td>
                              {/* <td>{field.po_qty}</td> */}
                              <td>{field.target_amount}</td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={field.claim_qty}
                                  onChange={(e) =>
                                    handleFieldChangeWdc(
                                      index,
                                      "claim_qty",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>{field.po_rate}</td>
                              <td>{field.total}</td>
                              {/* <td>
                                {field.rest_amount} {field.unit}
                              </td> */}

                              <td>
                                {" "}
                                <ReactDatePicker
                                  selected={field.actual_start_date}
                                  onChange={(date) =>
                                    handleDateChangeWdc(
                                      index,
                                      "actual_start_date",
                                      date
                                    )
                                  }
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  placeholderText="DD/MM/YYYY"
                                />
                              </td>
                              <td>
                                <ReactDatePicker
                                  selected={field.actual_completion_date}
                                  onChange={(date) =>
                                    handleDateChangeWdc(
                                      index,
                                      "actual_completion_date",
                                      date
                                    )
                                  }
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  placeholderText="DD/MM/YYYY"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={field.delay_in_work_execution}
                                  onChange={(e) =>
                                    handleFieldChangeWdc(
                                      index,
                                      "delay_in_work_execution",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              {/* <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={field.hinderance_in_days}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "hinderance_in_days",
                                      e.target.value
                                    )
                                  }
                                />
                              </td> */}
                              <td>
                                {index === dynamicFieldsWdc.length - 1 && (
                                  <FaPlus
                                    onClick={() =>
                                      setDynamicFieldsWdc([
                                        ...dynamicFieldsWdc,
                                        line_item_fieldswdc,
                                      ])
                                    }
                                  />
                                )}
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>

                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Certifying Authority <span className="red">*</span>{" "}
                        </label>

                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isClearable={true}
                          isSearchable={true}
                          name="emp"
                          id="emp"
                          options={emp}
                          value={
                            emp &&
                            emp.filter(
                              (item) =>
                                item.value === formData?.certifying_authority
                            )[0]
                          }
                          onChange={(val) =>
                            setFormData({
                              ...formData,
                              certifying_authority: val.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Remarks <span className="red">*</span>{" "}
                        </label>
                        <textarea
                          name=""
                          id=""
                          rows="4"
                          className="form-control"
                          value={formDataWdc?.remarks}
                          onChange={(e) =>
                            setFormDataWdc({
                              ...formDataWdc,
                              remarks: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3 d-flex justify-content-between">
                        <button
                          onClick={() => submitHandlerWdc("SUBMITTED", null)}
                          className="btn fw-bold btn-primary"
                          type="button"
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {user.department_id === USER_PPNC_DEPARTMENT && (
        <div
          className={isSecPopup ? "popup popup_lg active" : "popup popup_lg"}
        >
          <div className="card card-xxl-stretch mb-5 mb-xxl-8">
            <div className="card-header border-0 pt-5 pb-3">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  All Data for{" "}
                  {viewData?.reference_no && `for ${viewData?.reference_no}`}
                </span>
              </h3>
              <button
                className="btn fw-bold btn-danger"
                onClick={() => {
                  setViewData(null);
                  setIsSecPopup(false);
                }}
              >
                Close
              </button>
            </div>
            <form>
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Action</label>
                    <p>{viewData?.action_type}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Work Title</label>
                    <p>{viewData?.work_title}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Work Done By</label>
                    <p>{viewData?.work_done_by}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">JOB Location</label>
                    <p>{viewData?.job_location}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Yard No</label>
                    <p>{viewData?.yard_no}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Unit</label>
                    <p>{viewData?.unit}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Inspecttion Note Ref No
                    </label>
                    <p>
                      <span>{viewData?.inspection_note_ref_no}</span>
                      {viewData?.file_inspection_note_ref_no && (
                        <Link
                          to={`${process.env.REACT_APP_PDF_URL}wdcs/${viewData?.file_inspection_note_ref_no}`}
                          target="_blank"
                        >
                          Click here
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Hinderence Report Certified by Berth
                    </label>
                    <p>
                      <span>
                        {viewData?.hinderence_report_cerified_by_berth}
                      </span>
                      {viewData?.file_hinderence_report_cerified_by_berth && (
                        <Link
                          to={`${process.env.REACT_APP_PDF_URL}wdcs/${viewData?.file_hinderence_report_cerified_by_berth}`}
                          target="_blank"
                        >
                          Click here
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Attendance Report</label>
                    <p>
                      <span>{viewData?.attendance_report}</span>
                      {viewData?.file_attendance_report && (
                        <Link
                          to={`${process.env.REACT_APP_PDF_URL}wdcs/${viewData?.file_attendance_report}`}
                          target="_blank"
                        >
                          Click here
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">line_item_no</label>
                    <p>{viewData?.line_item_no}</p>
                  </div>
                </div>

                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>PO LineItem</th>
                      <th>Description</th>
                      <th>Open Quantity</th>
                      <th>Claim Quantity</th>
                      <th>Contractual Start</th>
                      <th>Contractual Completion</th>
                      <th>Actual Start</th>
                      <th>Actual Completion</th>
                      <th>Hinderance in Days</th>
                      <th>Delay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkTypeArr(viewData?.line_item_array) &&
                      viewData?.line_item_array.map((field, index) => (
                        <Fragment key={index}>
                          <tr>
                            <td>
                              <span>{field?.line_item_no}</span>
                            </td>
                            <td>{field?.description}</td>
                            <td>
                              {field?.rest_amount} {field?.unit}
                            </td>
                            <td>{field?.claim_qty}</td>
                            <td>
                              <input
                                type="date"
                                onChange={(e) =>
                                  setDoForm({
                                    ...doForm,
                                    contractual_start_date: e.target.value,
                                  })
                                }
                                className="form-control"
                                placeholderText="DD/MM/YYYY"
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                onChange={(e) =>
                                  setDoForm({
                                    ...doForm,
                                    Contractual_completion_date: e.target.value,
                                  })
                                }
                                className="form-control"
                                placeholderText="DD/MM/YYYY"
                              />
                            </td>
                            <td>
                              {field?.actual_start_date &&
                                formatDate(field?.actual_start_date)}
                            </td>
                            <td>
                              {field?.actual_completion_date &&
                                formatDate(field?.actual_completion_date)}
                            </td>
                            <td>{field?.hinderance_in_days}</td>
                            <td>{delay}</td>
                          </tr>
                        </Fragment>
                      ))}
                  </tbody>
                </table>

                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Stage Details</label>
                    <p>{viewData?.stage_details}</p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <p>{viewData?.remarks}</p>
                  </div>
                </div>
                <div className="col-12">
                  {/* <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => toast.warn("SAP is not conntected!")}
                  >
                    SUBMIT
                  </button> */}
                  <button
                    onClick={() => submitHandlerAction("APPROVED", null)}
                    className="btn fw-bold btn-primary"
                    type="button"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={isPopupView ? "popup popup_lg active" : "popup popup_lg"}>
        {formData?.action_type === "WDC" && (
          <div className="card card-xxl-stretch mb-5 mb-xxl-8">
            <div className="card-header border-0 pt-5 pb-3">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  All Data for{" "}
                  {viewData?.reference_no && `for ${viewData?.reference_no}`}
                </span>
              </h3>
              <button
                className="btn fw-bold btn-danger"
                onClick={() => {
                  setViewData(null);
                  setIsPopupView(false);
                }}
              >
                Close
              </button>
            </div>
            <form>
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Action</label>
                    <p>{viewData?.action_type}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Work Title</label>
                    <p>{viewData?.work_title}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Work Done By</label>
                    <p>{viewData?.work_done_by}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">JOB Location</label>
                    <p>{viewData?.job_location}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Yard No</label>
                    <p>{viewData?.yard_no}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Unit</label>
                    <p>{viewData?.unit}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Inspecttion Note Ref No
                    </label>
                    <p>
                      <span>{viewData?.inspection_note_ref_no}</span>
                      {viewData?.file_inspection_note_ref_no && (
                        <Link
                          to={`${process.env.REACT_APP_PDF_URL}wdcs/${viewData?.file_inspection_note_ref_no}`}
                          target="_blank"
                        >
                          Click here
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Hinderence Report Certified by Berth
                    </label>
                    <p>
                      <span>
                        {viewData?.hinderence_report_cerified_by_berth}
                      </span>
                      {viewData?.file_hinderence_report_cerified_by_berth && (
                        <Link
                          to={`${process.env.REACT_APP_PDF_URL}wdcs/${viewData?.file_hinderence_report_cerified_by_berth}`}
                          target="_blank"
                        >
                          Click here
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Attendance Report</label>
                    <p>
                      <span>{viewData?.attendance_report}</span>
                      {viewData?.file_attendance_report && (
                        <Link
                          to={`${process.env.REACT_APP_PDF_URL}wdcs/${viewData?.file_attendance_report}`}
                          target="_blank"
                        >
                          Click here
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">line_item_no</label>
                    <p>{viewData?.line_item_no}</p>
                  </div>
                </div>

                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>PO LineItem</th>
                      <th>Description</th>
                      <th>Open Quantity</th>
                      <th>Claim Quantity</th>
                      <th>Actual Start</th>
                      <th>Actual Completion</th>
                      <th>Hinderance in Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkTypeArr(viewData?.line_item_array) &&
                      viewData?.line_item_array.map((field, index) => (
                        <Fragment key={index}>
                          <tr>
                            <td>
                              <span>{field?.line_item_no}</span>
                            </td>
                            <td>{field?.description}</td>
                            <td>
                              {field?.rest_amount} {field?.unit}
                            </td>
                            <td>{field?.claim_qty}</td>
                            <td>
                              {field?.actual_start_date &&
                                formatDate(field?.actual_start_date)}
                            </td>
                            <td>
                              {field?.actual_completion_date &&
                                formatDate(field?.actual_completion_date)}
                            </td>
                            <td>{field?.hinderance_in_days}</td>
                          </tr>
                        </Fragment>
                      ))}
                  </tbody>
                </table>

                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Stage Details</label>
                    <p>{viewData?.stage_details}</p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <p>{viewData?.remarks}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {formData?.action_type === "JCC" && (
          <div className="card card-xxl-stretch mb-5 mb-xxl-8">
            <div className="card-header border-0 pt-5 pb-3">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  All Data for{" "}
                  {viewData?.reference_no && `for ${viewData?.reference_no}`}
                </span>
              </h3>
              <button
                className="btn fw-bold btn-danger"
                onClick={() => {
                  setViewData(null);
                  setIsPopupView(false);
                }}
              >
                Close
              </button>
            </div>
            <form>
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Action</label>
                    <p>{viewData?.action_type}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Work Title</label>
                    <p>{viewData?.work_title}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Work Done By</label>
                    <p>{viewData?.work_done_by}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">JOB Location</label>
                    <p>{viewData?.job_location}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Yard No</label>
                    <p>{viewData?.yard_no}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Attendance Report</label>
                    <p>
                      <span>{viewData?.attendance_report}</span>
                      {viewData?.file_attendance_report && (
                        <Link
                          to={`${process.env.REACT_APP_PDF_URL}wdcs/${viewData?.file_attendance_report}`}
                          target="_blank"
                        >
                          Click here
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">line_item_no</label>
                    <p>{viewData?.line_item_no}</p>
                  </div>
                </div>

                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>PO LineItem</th>
                      <th>Description</th>
                      <th>Open Quantity</th>
                      <th>Claim Quantity</th>
                      <th>Actual Start</th>
                      <th>Actual Completion</th>
                      <th>Hinderance in Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkTypeArr(viewData?.line_item_array) &&
                      viewData?.line_item_array.map((field, index) => (
                        <Fragment key={index}>
                          <tr>
                            <td>
                              <span>{field?.line_item_no}</span>
                            </td>
                            <td>{field?.description}</td>
                            <td>
                              {field?.rest_amount} {field?.unit}
                            </td>
                            <td>{field?.claim_qty}</td>
                            <td>
                              {field?.actual_start_date &&
                                formatDate(field?.actual_start_date)}
                            </td>
                            <td>
                              {field?.actual_completion_date &&
                                formatDate(field?.actual_completion_date)}
                            </td>
                            <td>{field?.hinderance_in_days}</td>
                          </tr>
                        </Fragment>
                      ))}
                  </tbody>
                </table>

                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Stage Details</label>
                    <p>{viewData?.stage_details}</p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <p>{viewData?.remarks}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default WDCSub;
