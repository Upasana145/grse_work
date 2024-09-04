import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { USER_VENDOR } from "../../constants/userConstants";
import { actionHandlerByDO } from "../../Helpers/BTNChecklist";
import {
  calculateNetPay,
  calculatePenalty,
  checkTypeArr,
} from "../../utils/smallFun";
import { apiCallBack } from "../../utils/fetchAPIs";

const ServiceContractBillsView = () => {
  const navigate = useNavigate();
  const { isDO } = useSelector((state) => state.selectedPO);
  const { user, token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const { state } = useLocation();

  const [impDates, setImpDates] = useState(null);
  const [data, setData] = useState(null);
  const [doData, setDoData] = useState(null);
  let initialData = {
    invoice_no: "",
    invoice_filename: "",
    invoice_value: "",
    e_invoice_no: "",
    e_invoice_filename: "",
    debit_note: "",
    credit_note: "",
    net_claim_amount: 0,
    debit_credit_filename: "",
    gate_entry_no: "",
    gate_entry_date: "",
    get_entry_filename: "",
    grn_nos: "",
    icgrn_nos: "",
    icgrn_total: "",
    hsn_gstn_icgrn: false,
    c_sdbg_filename: "",
    demand_raise_filename: "",
    pbg_filename: "",
  };
  let inititalDOData = {
    btn_num: state,
    ld_ge_date: "",
    ld_c_date: "",
    ld_amount: "",
    p_sdbg_amount: "",
    p_drg_amount: "",
    p_qap_amount: "",
    p_ilms_amount: "",
    o_deduction: "",
    total_deduction: "",
    net_payable_amount: "",
  };
  const [form, setForm] = useState(initialData);
  const [doForm, setDoForm] = useState(inititalDOData);
  console.log(data, "ssssssssssssssdata");
  console.log(doData, "doData-------");
  console.log(form, "form*******************8");
  console.log(doForm, "doForm888888888888888888");
  const calNetClaimAmount = (invoice_value, debit_note, credit_note) => {
    if (typeof invoice_value !== "number") {
      invoice_value = parseInt(invoice_value) || 0;
    }
    if (typeof debit_note !== "number") {
      debit_note = parseInt(debit_note) || 0;
    }
    if (typeof credit_note !== "number") {
      credit_note = parseInt(credit_note) || 0;
    }
    // setForm({
    //   ...form,
    //   net_claim_amount:
    //     parseInt(invoice_value) + parseInt(debit_note) - parseInt(credit_note),
    // });
  };

  useEffect(() => {
    const { invoice_value, debit_note, credit_note } = form;
    if (invoice_value || debit_note || credit_note) {
      calNetClaimAmount(invoice_value, debit_note, credit_note);
    }
  }, [form?.invoice_value, form?.debit_note, form?.credit_note]);

  const getBTNData = async () => {
    try {
      const d = await apiCallBack(
        "GET",
        `po/btn/getBTNData?id=${id}`,
        null,
        token
      );
      if (d?.status) {
        setImpDates(d?.data);
      }
    } catch (error) {
      console.error("Error fetching WDC list:", error);
    }
  };

  const getDataByBTN = async () => {
    try {
      const d = await apiCallBack(
        "GET",
        `po/btn/btn_num?id=${id}&btn_num=${state}`,
        null,
        token
      );
      if (d?.status && checkTypeArr(d?.data)) {
        setData(d?.data[0]);
      }
    } catch (error) {
      console.error("Error fetching WDC list:", error);
    }
  };

  const getBTNDOData = async () => {
    try {
      const d = await apiCallBack(
        "GET",
        `po/btn/btn_do?btn_num=${state}`,
        null,
        token
      );
      console.log("DFdf", d, state);
      if (d?.status && checkTypeArr(d?.data)) {
        setDoData(d?.data[0]);
      }
    } catch (error) {
      console.error("Error fetching WDC list:", error);
    }
  };

  useEffect(() => {
    let net = data?.icgrn_nos && JSON.parse(data?.icgrn_nos).total_icgrn_value;
    let report = calculateNetPay(
      net,
      doForm?.ld_amount,
      doForm?.p_sdbg_amount,
      doForm?.p_drg_amount,
      doForm?.p_qap_amount,
      doForm?.p_ilms_amount,
      doForm?.o_deduction
    );
    setDoForm({
      ...doForm,
      total_deduction: report?.deduct,
      net_payable_amount: report?.net_pay,
    });
  }, [
    doForm?.ld_amount,
    doForm?.p_sdbg_amount,
    doForm?.p_drg_amount,
    doForm?.p_qap_amount,
    doForm?.p_ilms_amount,
    doForm?.o_deduction,
  ]);

  useEffect(() => {
    getBTNData();
    getBTNDOData();
    getDataByBTN();
  }, []);

  useEffect(() => {
    const { ld_c_date, ld_ge_date, total_price } = doForm;
    if (ld_c_date && ld_ge_date) {
      let p_amt = calculatePenalty(ld_c_date, ld_ge_date, total_price, 0.5, 5);
      console.log(ld_c_date, ld_ge_date, total_price, "total_price");
      setDoForm({ ...doForm, ld_amount: p_amt });
    }
  }, [doForm?.ld_c_date, doForm?.ld_ge_date]);

  useEffect(() => {
    const {
      a_sdbg_date,
      a_drawing_date,
      a_ilms_date,
      a_qap_date,
      c_sdbg_date,
      c_drawing_date,
      c_ilms_date,
      c_qap_date,
    } = form;
    let p_sdbg = 0;
    let p_drg = 0;
    let p_qap = 0;
    let p_ilms = 0;
    if (data?.total_price) {
      const { total_price } = data;
      if (a_sdbg_date && c_sdbg_date) {
        p_sdbg = calculatePenalty(
          c_sdbg_date,
          a_sdbg_date,
          total_price,
          0.5,
          5
        );
      }
      if (a_drawing_date && c_drawing_date) {
        p_drg = calculatePenalty(
          c_drawing_date,
          a_drawing_date,
          total_price,
          0.25,
          2
        );
      }
      if (a_qap_date && c_qap_date) {
        p_qap = calculatePenalty(c_qap_date, a_qap_date, total_price, 0.25, 2);
      }
      if (a_ilms_date && c_ilms_date) {
        p_ilms = calculatePenalty(
          c_ilms_date,
          a_ilms_date,
          total_price,
          0.25,
          2
        );
      }
    }
    setDoForm({
      ...doForm,
      p_sdbg_amount: p_sdbg,
      p_drg_amount: p_drg,
      p_qap_amount: p_qap,
      p_ilms_amount: p_ilms,
    });
  }, [form]);

  useEffect(() => {
    if (data) {
      setForm(data);
    }
    if (impDates) {
      setForm({
        ...form,
        c_sdbg_date: impDates?.c_sdbg_date || "",
        c_drawing_date: impDates?.c_drawing_date || "",
        c_qap_date: impDates?.c_qap_date || "",
        c_ilms_date: impDates?.c_ilms_date || "",
        a_sdbg_date: impDates?.a_sdbg_date || "",
        a_drawing_date: impDates?.a_drawing_date || "",
        a_qap_date: impDates?.a_qap_date || "",
        a_ilms_date: impDates?.a_ilms_date || "",
      });
    }
  }, [impDates, data]);

  //   console.log("data", data);
  //   console.log("doForm", doForm);
  //   console.log("doData", doData);

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <SideBar />
          <div className="wrapper d-flex flex-column flex-row-fluid">
            <Header title={"Service Contract Bills"} id={id} />
            <div className="content d-flex flex-column flex-column-fluid">
              <div className="post d-flex flex-column-fluid">
                <div className="container">
                  <form>
                    <div className="row g-5 g-xl-8">
                      <div className="col-12">
                        <div className="card">
                          <h3 className="m-3">Service Contract Bills:</h3>
                          <div className="card-body p-3">
                            <div className="tab-content">
                              <div className="table-responsive">
                                <table className="table table-striped table-bordered table_height">
                                  <tbody style={{ maxHeight: "100%" }}>
                                    <tr>
                                      <td>Invoice no:</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.invoice_no}
                                        </b>
                                        {data?.invoice_filename && (
                                          <a
                                            href={`${process.env.REACT_APP_PDF_URL}btns/${data?.invoice_filename}`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            VIEW
                                          </a>
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Invoice value:</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.invoice_value}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>E-Invoice :</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.e_invoice_no}
                                        </b>
                                        {data?.e_invoice_filename &&
                                          data?.e_invoice_filename !== "" && (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}btns/${data?.e_invoice_filename}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Debit/Credit Note:</td>
                                      <td className="btn_value">
                                        {data?.debit_credit_filename &&
                                          data?.debit_credit_filename !==
                                            "" && (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}btns/${data?.debit_credit_filename}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Debit Note value:</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.debit_note}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Credit Note value:</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.credit_note}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>GST Rate:</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.credit_note}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Net claim amount:</td>
                                      <td className="btn_value">
                                        <b>{data?.net_claim_amount}</b>
                                      </td>
                                    </tr>{" "}
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
                                      <td>Contractual SDBG Submission Date</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {form?.c_sdbg_date &&
                                            new Date(
                                              form?.c_sdbg_date
                                            ).toLocaleDateString()}
                                        </b>
                                        {data?.c_sdbg_filename &&
                                          data?.c_sdbg_filename !== "" && (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}btns/${data?.c_sdbg_filename}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Actual SDBG Submission Date</td>
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
                                      <td>
                                        Demand raised by production/PP&C if any
                                      </td>
                                      <td className="btn_value">
                                        {data?.demand_raise_filename &&
                                          data?.demand_raise_filename !==
                                            "" && (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}btns/${data?.demand_raise_filename}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Gate Entry Acknowledgement no.</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {checkTypeArr(impDates?.gate_entry) &&
                                            impDates?.gate_entry.map(
                                              (item, i) => (
                                                <span className="me-1" key={i}>
                                                  {item.acc_no}
                                                </span>
                                              )
                                            )}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Gate Entry Date</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {checkTypeArr(impDates?.gate_entry) &&
                                            impDates?.gate_entry.map(
                                              (item, i) => (
                                                <span className="me-1" key={i}>
                                                  {item.gate_date}
                                                </span>
                                              )
                                            )}
                                        </b>
                                        {data?.get_entry_filename &&
                                          data?.get_entry_filename !== "" && (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}btns/${data?.get_entry_filename}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>GRN No</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.grn_nos &&
                                            JSON.parse(data?.grn_nos).map(
                                              (item, i) => (
                                                <span key={i} className="px-1">
                                                  {item?.grn_no}
                                                </span>
                                              )
                                            )}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>ICGRN No</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.icgrn_nos &&
                                            JSON.parse(data?.icgrn_nos).icgrn &&
                                            JSON.parse(
                                              data?.icgrn_nos
                                            ).icgrn.map((item, i) => (
                                              <span key={i} className="px-1">
                                                {item?.icgrn_no}
                                              </span>
                                            ))}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Total ICGRN Value</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {data?.icgrn_nos &&
                                            JSON.parse(data?.icgrn_nos)
                                              .total_icgrn_value}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Contractual Drawing submission date
                                      </td>
                                      <td className="btn_value">
                                        <b>
                                          {form?.c_drawing_date &&
                                            new Date(
                                              form?.c_drawing_date
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Actual Drawing submission date</td>
                                      <td className="btn_value">
                                        <b>
                                          {form?.a_drawing_date &&
                                            new Date(
                                              form?.a_drawing_date
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Contractual QAP submission date</td>
                                      <td className="btn_value">
                                        <b>
                                          {form?.c_qap_date &&
                                            new Date(
                                              form?.c_qap_date
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Actual QAP submission date</td>
                                      <td className="btn_value">
                                        <b>
                                          {form?.a_qap_date &&
                                            new Date(
                                              form?.a_qap_date
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Contractual ILMS submission date</td>
                                      <td className="btn_value">
                                        <b>
                                          {form?.c_ilms_date &&
                                            new Date(
                                              form?.c_ilms_date
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Actual ILMS submission date</td>
                                      <td className="btn_value">
                                        <b>
                                          {form?.a_ilms_date &&
                                            new Date(
                                              form?.a_ilms_date
                                            ).toLocaleDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>PBG</td>
                                      <td className="btn_value">
                                        {data?.pbg_filename &&
                                          data?.pbg_filename !== "" && (
                                            <a
                                              href={`${process.env.REACT_APP_PDF_URL}btns/${data?.pbg_filename}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              VIEW
                                            </a>
                                          )}
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
                                            defaultChecked={true}
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
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {doData ? (
                        <div className="col-12">
                          <div className="card">
                            <h3 className="m-3">ENTRY BY DEALING OFFICER:</h3>
                            <div className="card-body p-3">
                              <div className="tab-content">
                                <div className="table-responsive">
                                  <table className="table table-striped table-bordered table_height">
                                    <tbody style={{ maxHeight: "100%" }}>
                                      <tr>
                                        <td>BTN Number:</td>
                                        <td className="btn_value">
                                          <b>{doData?.btn_num}</b>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Liquidated damage</td>
                                        <td className="btn_value">
                                          <div className="me-3">
                                            <label htmlFor="GED">
                                              Gate Entry Date:
                                            </label>
                                            <br />
                                            <b>{doData?.btn_num}</b>
                                          </div>
                                          <div className="me-3">
                                            <label htmlFor="CLD">
                                              Contractual Delivery Date:
                                            </label>
                                            <br />
                                            <b>{doData?.contractual_ld}</b>
                                          </div>
                                          <div>
                                            <label>Amount:</label>
                                            <p>&#8377; {doData?.ld_amount}</p>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Penalty for Drawing submission</td>
                                        <td className="btn_value">
                                          <div className="me-3">
                                            <label htmlFor="DADD">
                                              Actual Delivery Date:
                                            </label>
                                            <p>
                                              <b>
                                                {form?.a_drawing_date &&
                                                  new Date(
                                                    form?.a_drawing_date
                                                  ).toLocaleDateString()}
                                              </b>
                                            </p>
                                          </div>
                                          <div className="me-3">
                                            <label htmlFor="DCDD">
                                              Contractual Delivery Date:
                                            </label>
                                            <p>
                                              <b>
                                                {form?.c_drawing_date &&
                                                  new Date(
                                                    form?.c_drawing_date
                                                  ).toLocaleDateString()}
                                              </b>
                                            </p>
                                          </div>
                                          <div>
                                            <label>Amount:</label>
                                            <p>
                                              &#8377; {doForm?.p_drg_amount}
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Penalty for QAP submission</td>
                                        <td className="btn_value">
                                          <div className="me-3">
                                            <label htmlFor="QADD">
                                              Actual Delivery Date:
                                            </label>
                                            <p>
                                              <b>
                                                {form?.a_qap_date &&
                                                  new Date(
                                                    form?.a_qap_date
                                                  ).toLocaleDateString()}
                                              </b>
                                            </p>
                                          </div>
                                          <div className="me-3">
                                            <label htmlFor="QCDD">
                                              Contractual Delivery Date:
                                            </label>
                                            <p>
                                              <b>
                                                {form?.c_qap_date &&
                                                  new Date(
                                                    form?.c_qap_date
                                                  ).toLocaleDateString()}
                                              </b>
                                            </p>
                                          </div>
                                          <div>
                                            <label>Amount:</label>
                                            <p>
                                              &#8377; {doForm?.p_qap_amount}
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Penalty for ILMS submission</td>
                                        <td className="btn_value">
                                          <div className="me-3">
                                            <label htmlFor="LADD">
                                              Actual Delivery Date:
                                            </label>
                                            <p>
                                              <b>
                                                {form?.a_ilms_date &&
                                                  new Date(
                                                    form?.a_ilms_date
                                                  ).toLocaleDateString()}
                                              </b>
                                            </p>
                                          </div>
                                          <div className="me-3">
                                            <label htmlFor="LCDD">
                                              Contractual Delivery Date:
                                            </label>
                                            <p>
                                              <b>
                                                {form?.c_ilms_date &&
                                                  new Date(
                                                    form?.c_ilms_date
                                                  ).toLocaleDateString()}
                                              </b>
                                            </p>
                                          </div>
                                          <div>
                                            <label>Amount:</label>
                                            <p>
                                              &#8377; {doForm?.p_ilms_amount}
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Other deduction if any </td>
                                        <td className="btn_value">
                                          {doData?.other_deduction}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Total deductions</td>
                                        <td>
                                          <b>
                                            &#8377; {doData?.total_deduction}
                                          </b>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>Net payable amount</td>
                                        <td>
                                          <b>
                                            &#8377; {doData?.net_payable_amout}
                                          </b>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className="text-center">
                                  {user?.user_type !== 1 && (
                                    <>
                                      <button
                                        type="button"
                                        className="btn fw-bold btn-primary me-3"
                                        onClick={() =>
                                          actionHandlerByDO(
                                            doForm,
                                            setDoForm,
                                            initialData,
                                            navigate,
                                            id,
                                            token
                                          )
                                        }
                                      >
                                        SUBMIT
                                      </button>
                                    </>
                                  )}
                                  <button
                                    className="btn fw-bold btn-primary"
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
                      ) : (
                        <>
                          <div className="col-12">
                            Waiting for the action from GRSE.
                          </div>
                        </>
                      )}
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

export default ServiceContractBillsView;
