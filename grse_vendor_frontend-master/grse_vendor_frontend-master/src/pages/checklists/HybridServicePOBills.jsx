import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { USER_VENDOR } from "../../constants/userConstants";
import { actionHandlerServiceBTN } from "../../Helpers/BTNChecklist";
import {
  checkTypeArr,
  inputFileChange,
  inputTypeChange,
} from "../../utils/smallFun";
import { inputOnWheelPrevent } from "../../utils/inputOnWheelPrevent";
import { apiCallBack } from "../../utils/fetchAPIs";
import { formatDate } from "../../utils/getDateTimeNow";
import Select from "react-select";

const HybridServicePOBills = () => {
  const navigate = useNavigate();
  const { isDO } = useSelector((state) => state.selectedPO);
  const { user, token } = useSelector((state) => state.auth);
  const { id } = useParams();
  // const [fileData, setFileData] = useState(null);
  const [options, setOptions] = useState([]);

  const [data, setData] = useState(null);
  console.log(data, "loking display");

  let initialData = {
    assigned_to: "",
    po_no: "",
    vendor_name: "",
    vendor_code: "",
    invoice_no: "",
    wdc_number: "",
    invoice_filename: "",
    invoice_value: "",
    e_invoice_no: "",
    e_invoice_filename: "",
    debit_note: "",
    gst_rate: "",
    credit_note: "",
    total_amount: "",
    net_gross_claim_amount: 0,
    pbg: "",
    debit_credit_filename: "",
    gate_entry_no: "",
    gate_entry_date: "",
    get_entry_filename: "",
    total_icgrn_value: "",
    hsn_gstn_icgrn: false,
    ld_gate_entry_date: "",
    ld_contractual_date: "",
    c_sdbg_filename: "",
    demand_raise_filename: "",
    pbg_filename: "",
    esi_compliance_certified: "",
  };
  const [form, setForm] = useState(initialData);

  // const calNetClaimAmount = (invoice_value, debit_note, credit_note,gst_rate) => {
  //   if (typeof invoice_value !== "number") {
  //     invoice_value = parseInt(invoice_value) || 0;
  //   }
  //   if (typeof debit_note !== "number") {
  //     debit_note = parseInt(debit_note) || 0;
  //   }
  //   if (typeof credit_note !== "number") {
  //     credit_note = parseInt(credit_note) || 0;
  //   }
  //   if (typeof credit_note !== "number") {
  //     gst_rate = parseInt(gst_rate) || 0;
  //   }
  //   setForm({
  //     ...form,
  //     net_claim_amount:
  //       parseInt(invoice_value) + parseInt(debit_note) - parseInt(credit_note),
  //   });
  // };

  const calNetClaimAmount = (
    invoice_value,
    debit_note,
    credit_note,
    gst_rate
  ) => {
    invoice_value = parseInt(invoice_value) || 0;
    debit_note = parseInt(debit_note) || 0;
    credit_note = parseInt(credit_note) || 0;
    gst_rate = parseInt(gst_rate) || 0;

    const net_gross_claim_amount =
      invoice_value + debit_note - credit_note + gst_rate;

    setForm((prevForm) => ({
      ...prevForm,
      net_gross_claim_amount: net_gross_claim_amount,
    }));
  };

  useEffect(() => {
    const { invoice_value, debit_note, credit_note, gst_rate } = form;
    if (invoice_value || debit_note || credit_note || gst_rate) {
      calNetClaimAmount(invoice_value, debit_note, credit_note, gst_rate);
    }
  }, [
    form?.invoice_value,
    form?.debit_note,
    form?.credit_note,
    form?.gst_rate,
  ]);

  const getData = async () => {
    try {
      const d = await apiCallBack(
        "GET",
        `po/btn/getBTNDataServiceHybrid?id=${id}`,
        null,
        token
      );
      if (d?.status) {
        setData(d?.data);
      }
    } catch (error) {
      console.error("Error fetching WDC list:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      setForm({
        ...form,
        vendor_name: data?.vendor?.vendor_name || "",
        vendor_code: data?.vendor?.vendor_code || "",
        esi_compliance_certified: data?.sdbg_filename?.file_name || "",
        pf_compliance_certified: data?.sdbg_filename?.file_name || "",
      });
    }
  }, [data]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      createInvoiceNo();
    }
  };

  const createInvoiceNo = async () => {
    try {
      const response = await apiCallBack(
        "GET",
        `po/btn/getWdcInfoServiceHybrid?reference_no=${form?.wdc_number}`,
        null,
        token
      );
      if (response?.status) {
        const { actual_start_date, actual_completion_date, total_amount } =
          response.data;

        // const startTimestamp = actual_start_date * 1000;
        // const completionTimestamp = actual_completion_date * 1000;

        // const startDate = new Date(startTimestamp).toLocaleDateString();
        // const completionDate = new Date(
        //   completionTimestamp
        // ).toLocaleDateString();
        setForm({
          ...form,
          actual_start_date,
          actual_completion_date,
          total_amount,
        });
      } else {
        console.error("Error creating invoice number:", response.message);
      }
    } catch (error) {
      console.error("Error creating invoice number:", error);
    }
  };
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await apiCallBack(
          "GET",
          "po/btn/getEmpList",
          null,
          token
        );

        if (response?.status) {
          const data = response.data;
          const formattedOptions = data.map((item) => ({
            value: item.PERNR,
            label: `${item.CNAME} | ${item.email}`,
          }));
          // console.log("Formatted Options:", formattedOptions);
          return formattedOptions;
        }
        return [];
      } catch (error) {
        console.error("Error fetching options:", error);
        return [];
      }
    };

    fetchOptions().then((options) => {
      setOptions(options);
    });
  }, [token]);

  const handleChange = (selectedOption) => {
    setForm({ ...form, assigned_to: selectedOption.value });
  };

  console.log(form.assigned_to);

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <SideBar />
          <div className="wrapper d-flex flex-column flex-row-fluid">
            <Header title={"Bills for Service Hybrid PO"} id={id} />
            <div className="content d-flex flex-column flex-column-fluid">
              <div className="post d-flex flex-column-fluid">
                <div className="container">
                  <form>
                    <div className="row g-5 g-xl-8">
                      <div className="col-12">
                        <div className="card">
                          <h3 className="m-3">Bills for Service Hybrid PO:</h3>
                          <div className="card-body p-3">
                            <div className="tab-content">
                              <div className="table-responsive">
                                <table className="table table-striped table-bordered table_height">
                                  <tbody style={{ maxHeight: "100%" }}>
                                    <tr>
                                      <td>WDC Certifying Authority</td>
                                      <td className="btn_value">
                                        <Select
                                          options={options}
                                          onChange={handleChange}
                                          isSearchable={true}
                                          placeholder="Select an option"
                                          className="form-control"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Invoice no:</td>
                                      <td className="btn_value">
                                        <input
                                          type="text"
                                          className="form-control me-3"
                                          name="invoice_no"
                                          value={form?.invoice_no}
                                          onChange={(e) =>
                                            inputTypeChange(e, form, setForm)
                                          }
                                        />
                                        <input
                                          type="file"
                                          className="form-control"
                                          name="invoice_filename"
                                          onChange={(e) =>
                                            inputFileChange(e, form, setForm)
                                          }
                                          accept=".pdf"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Invoice value:</td>
                                      <td className="btn_value">
                                        <input
                                          type="number"
                                          className="form-control"
                                          onWheel={inputOnWheelPrevent}
                                          name="invoice_value"
                                          value={form?.invoice_value}
                                          onChange={(e) =>
                                            inputTypeChange(e, form, setForm)
                                          }
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>E-Invoice :</td>
                                      <td className="btn_value">
                                        <input
                                          type="text"
                                          className="form-control me-2"
                                          name="e_invoice_no"
                                          value={form?.e_invoice_no}
                                          onChange={(e) =>
                                            inputTypeChange(e, form, setForm)
                                          }
                                        />
                                        <input
                                          type="file"
                                          className="form-control"
                                          name="e_invoice_filename"
                                          onChange={(e) =>
                                            inputFileChange(e, form, setForm)
                                          }
                                          accept=".pdf"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Debit/Credit Note:</td>
                                      <td className="btn_value">
                                        <input
                                          type="file"
                                          className="form-control"
                                          name="debit_credit_filename"
                                          onChange={(e) =>
                                            inputFileChange(e, form, setForm)
                                          }
                                          accept=".pdf"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Debit Note value:</td>
                                      <td className="btn_value">
                                        <input
                                          type="number"
                                          className="form-control"
                                          onWheel={inputOnWheelPrevent}
                                          name="debit_note"
                                          value={form?.debit_note}
                                          onChange={(e) =>
                                            inputTypeChange(e, form, setForm)
                                          }
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Credit Note value:</td>
                                      <td className="btn_value">
                                        <input
                                          type="number"
                                          className="form-control"
                                          onWheel={inputOnWheelPrevent}
                                          name="credit_note"
                                          value={form?.credit_note}
                                          onChange={(e) => {
                                            inputTypeChange(e, form, setForm);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>GST Rate:</td>
                                      <td className="btn_value">
                                        <input
                                          type="number"
                                          className="form-control"
                                          onWheel={inputOnWheelPrevent}
                                          name="gst_rate"
                                          value={form?.gst_rate}
                                          onChange={(e) =>
                                            inputTypeChange(e, form, setForm)
                                          }
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Net claim amount:</td>
                                      <td className="btn_value">
                                        <b>{form?.net_gross_claim_amount}</b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>PBG</td>
                                      <td className="btn_value">
                                        {checkTypeArr(data?.pbg_filename)
                                          ? data?.pbg_filename.map(
                                              (item, i) => {
                                                return (
                                                  <a
                                                    key={i}
                                                    href={`${process.env.REACT_APP_PDF_URL}submitSDBG/${item?.file_name}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                  >
                                                    VIEW
                                                  </a>
                                                );
                                              }
                                            )
                                          : "PBG NOT SUBMITTED"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Total:</td>
                                      <td className="btn_value">
                                        <b>{form?.total_amount}</b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Work Done Certificate no.</td>
                                      <td className="btn_value">
                                        {/* {checkTypeArr(data?.sdbg_filename)
                                          ? data?.sdbg_filename.map(
                                              (item, i) => {
                                                return (
                                                  <a
                                                    href={`${process.env.REACT_APP_PDF_URL}submitSDBG/${item?.file_name}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    key={i}
                                                  >
                                                    VIEW
                                                  </a>
                                                );
                                              }
                                            )
                                          : "WDC File is missing!"}createInvoiceNo */}

                                        <input
                                          type="text"
                                          className="form-control me-3"
                                          name="wdc_number"
                                          value={form?.wdc_number}
                                          onChange={(e) =>
                                            setForm({
                                              ...form,
                                              wdc_number: e.target.value,
                                            })
                                          }
                                          onKeyPress={handleKeyPress}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Contractual work start date</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {form?.a_sdbg_date &&
                                            new Date(
                                              form?.a_sdbg_date
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Contractual work completion date</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {form?.a_sdbg_date &&
                                            new Date(
                                              form?.a_sdbg_date
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Actual work start date</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {form?.actual_start_date &&
                                            new Date(
                                              form?.actual_start_date * 1000
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Actual work completion date</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {form?.actual_completion_date &&
                                            formatDate(
                                              form?.actual_completion_date *
                                                1000
                                            )}
                                        </b>
                                      </td>
                                    </tr>
                                    {/* <tr>
                                      <td>ESI Compliance Certified By HR</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {false ? (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}submitSDBG/${data?.file_name}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          ) : (
                                            "ESI NOT SUBMITTED."
                                          )}
                                        </b>
                                      </td>
                                    </tr> */}
                                    <tr>
                                      <td>ESI Compliance File</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.sdbg_filename?.file_name ? (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}hrComplianceUpload/${data?.sdbg_filename?.file_name}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              View
                                            </a>
                                          ) : (
                                            <span>ESI NOT SUBMITTED</span>
                                          )}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>PF Compliance File</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.sdbg_filename?.file_name ? (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}${data?.sdbg_filename?.file_name}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              View
                                            </a>
                                          ) : (
                                            <span>PF NOT SUBMITTED</span>
                                          )}
                                        </b>
                                      </td>
                                    </tr>

                                    {/* <tr>
                                      {console.log(data, "dataBBBBBBBBBBB")}
                                      <td>PF Compliance Certified By HR</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {checkTypeArr(data?.sdbg_filename) ? (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}submitSDBG/${data?.file_name}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          ) : (
                                            "PF NOT SUBMITTED."
                                          )}

                                          {false ? (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}submitSDBG/${data?.file_name}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          ) : (
                                            "PF NOT SUBMITTED."
                                          )}
                                        </b>
                                      </td>
                                    </tr> */}

                                    {/* <tr>
                                      <td>PF Compliance Certified By HR</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.pfEsi?.pf !== null ? (
                                            <span>PF COMPLIANT</span>
                                          ) : (
                                            <span>PF NOT SUBMITTED</span>
                                          )}
                                        </b>
                                      </td>
                                    </tr> */}

                                    <tr>
                                      <td>Wage Compliance Certified By HR</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {false ? (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}submitSDBG/${data?.file_name}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          ) : (
                                            "WAGE NOT SUBMITTED."
                                          )}
                                        </b>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td colSpan="2">
                                        <div className="form-check">
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="hsn_gstn_icgrn"
                                            name="hsn_gstn_icgrn"
                                            value={form?.hsn_gstn_icgrn}
                                            onClick={(e) =>
                                              setForm({
                                                ...form,
                                                hsn_gstn_icgrn:
                                                  e.target.checked,
                                              })
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="hsn_gstn_icgrn"
                                          >
                                            Whether HSN code, GSTIN, Tax rate is
                                            as per PO
                                          </label>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="text-center">
                                {user?.user_type === USER_VENDOR && (
                                  <button
                                    type="button"
                                    className="btn fw-bold btn-primary me-3"
                                    onClick={() =>
                                      actionHandlerServiceBTN(
                                        "BillsServiceHybrid",
                                        token,
                                        user,
                                        id,
                                        form,
                                        setForm,
                                        initialData,
                                        navigate
                                      )
                                    }
                                  >
                                    SUBMIT
                                  </button>
                                )}
                                <button
                                  className="btn fw-bold btn-primary me-3"
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/invoice-and-payment-process/${id}`
                                    )
                                  }
                                >
                                  BACK
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
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

export default HybridServicePOBills;
