import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { USER_VENDOR } from "../../constants/userConstants";
import { actionHandlerBTN } from "../../Helpers/BTNChecklist";
import { FaPlus } from "react-icons/fa";
import {
  checkTypeArr,
  inputFileChange,
  inputTypeChange,
} from "../../utils/smallFun";
import { inputOnWheelPrevent } from "../../utils/inputOnWheelPrevent";
import { apiCallBack } from "../../utils/fetchAPIs";
import { formatDate } from "../../utils/getDateTimeNow";
import { toast } from "react-toastify";

const BillsMaterialHybrid = () => {
  const navigate = useNavigate();
  const { isDO, poType } = useSelector((state) => state.selectedPO);

  const { user, token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [data, setData] = useState(null);

  let initialData = {
    invoice_no: "",
    invoice_filename: "",
    invoice_value: "",
    e_invoice_no: "",
    e_invoice_filename: "",
    debit_note: "",
    credit_note: "",
    net_claim_amount: 0,
    cgst: null,
    sgst: null,
    igst: null,
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
    grn_nos: "",
    icgrn_nos: "",
    associated_po: [
      {
        a_po: "",
      },
    ],
  };
  const [form, setForm] = useState(initialData);

  const calNetClaimAmount = (invoice_value, debit_note, credit_note) => {
    invoice_value = parseFloat(invoice_value) || 0;
    debit_note = parseFloat(debit_note) || 0;
    credit_note = parseFloat(credit_note) || 0;

    const net_claim_amount = invoice_value + debit_note - credit_note;

    setForm((prevForm) => ({
      ...prevForm,
      net_claim_amount: net_claim_amount,
    }));
  };
  useEffect(() => {
    const { invoice_value, debit_note, credit_note } = form;
    if (invoice_value || debit_note || credit_note) {
      calNetClaimAmount(invoice_value, debit_note, credit_note);
    }
  }, [form?.invoice_value, form?.debit_note, form?.credit_note]);

  const getData = async () => {
    try {
      const d = await apiCallBack(
        "GET",
        `po/btn/getBTNData?id=${id}`,
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
        c_sdbg_date: data?.c_sdbg_date || "",
        c_drawing_date: data?.c_drawing_date || "",
        c_qap_date: data?.c_qap_date || "",
        c_ilms_date: data?.c_ilms_date || "",
        a_sdbg_date: data?.a_sdbg_date || "",
        a_drawing_date: data?.a_drawing_date || "",
        a_qap_date: data?.a_qap_date || "",
        a_ilms_date: data?.a_ilms_date || "",
      });
    }
  }, [data]);

  const createInvoiceNo = async () => {
    try {
      const payload = {
        purchasing_doc_no: id,
        invoice_no: form.invoice_no,
      };
      const response = await apiCallBack(
        "POST",
        "po/btn/getGrnIcrenPenelty",
        payload,
        token
      );
      console.log("createInvoiceNo", response);
      if (response?.status) {
        const { gate_entry_no, grn_nos, icgrn_nos, invoice_date, total_price } =
          response.data;
        setForm({
          ...form,
          gate_entry_no: gate_entry_no,
          gate_entry_date: new Date(invoice_date).toLocaleDateString(),
          grn_nos: grn_nos,
          icgrn_nos: icgrn_nos,
          total_price: total_price,
        });
      } else {
        toast.warn(response.message);
        console.error("Error creating invoice number:", response.message);
      }
    } catch (error) {
      console.error("Error creating invoice number:", error);
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <SideBar />
          <div className="wrapper d-flex flex-column flex-row-fluid">
            <Header title={"Bills for Material Hybrid PO"} id={id} />
            <div className="content d-flex flex-column flex-column-fluid">
              <div className="post d-flex flex-column-fluid">
                <div className="container">
                  <form>
                    <div className="row g-5 g-xl-8">
                      <div className="col-12">
                        <div className="card">
                          <h3 className="m-3">Bills for Material Hybrid PO:</h3>
                          <div className="card-body p-3">
                            <div className="tab-content">
                              <div className="table-responsive">
                                <table className="table table-striped table-bordered table_height">
                                  <tbody style={{ maxHeight: "100%" }}>
                                    <tr>
                                      <td>Invoice No:</td>
                                      <td className="btn_value">
                                        <input
                                          type="text"
                                          className="form-control me-3"
                                          name="invoice_no"
                                          value={form?.invoice_no}
                                          onChange={(e) =>
                                            setForm({
                                              ...form,
                                              invoice_no: e.target.value,
                                            })
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
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-sm m-4"
                                          onClick={createInvoiceNo}
                                        >
                                          CHECK
                                        </button>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>E-Invoice No :</td>
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
                                        {/* <button
                                          type="button"
                                          className="btn btn-primary btn-sm m-4"
                                          onClick={createInvoiceNo}
                                        >
                                          CHECK
                                        </button> */}
                                      </td>
                                    </tr>

                                    {console.log(form)}
                                    <tr>
                                      <td>Associated PO:</td>
                                      <td className="btn_value">
                                        {checkTypeArr(form?.associated_po) &&
                                          form.associated_po.map((item, i) => (
                                            <input
                                              type="text"
                                              className="form-control"
                                              name="associated_po"
                                              value={item?.a_po}
                                              onChange={(e) => {
                                                item.a_po = e.target.value;
                                                // console.log(form.associated_po)
                                                setForm({
                                                  ...form,
                                                  associated_po:
                                                    form.associated_po,
                                                });
                                              }}
                                              key={i}
                                            />
                                          ))}
                                        <button
                                          className="btn btn-sm btn-primary d-flex align-items-center ms-2"
                                          style={{ fontSize: "16px" }}
                                          type="button"
                                          onClick={() =>
                                            setForm({
                                              ...form,
                                              associated_po: [
                                                ...form?.associated_po,
                                                {
                                                  a_po: "",
                                                },
                                              ],
                                            })
                                          }
                                        >
                                          <FaPlus />
                                        </button>
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
                                      <td>Net claim amount:</td>
                                      <td className="btn_value">
                                        <b>{form?.net_claim_amount}</b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>CGST:</td>
                                      <td className="btn_value">
                                        <input
                                          type="number"
                                          className="form-control"
                                          onWheel={inputOnWheelPrevent}
                                          name="cgst"
                                          value={form?.cgst}
                                          onChange={(e) => {
                                            inputTypeChange(e, form, setForm);
                                          }}
                                        />
                                        <span className="ms-1">%</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>SGST:</td>
                                      <td className="btn_value">
                                        <input
                                          type="number"
                                          className="form-control"
                                          onWheel={inputOnWheelPrevent}
                                          name="sgst"
                                          value={form?.sgst}
                                          onChange={(e) => {
                                            inputTypeChange(e, form, setForm);
                                          }}
                                        />
                                        <span className="ms-1">%</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>IGST:</td>
                                      <td className="btn_value">
                                        <input
                                          type="number"
                                          className="form-control"
                                          onWheel={inputOnWheelPrevent}
                                          name="igst"
                                          value={form?.igst}
                                          onChange={(e) => {
                                            inputTypeChange(e, form, setForm);
                                          }}
                                        />
                                        <span className="ms-1">%</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Net claim amount with GST:</td>
                                      <td className="btn_value">
                                        <b></b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Contractual SDBG Submission Date</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {form?.c_sdbg_date &&
                                            new Date(
                                              form?.c_sdbg_date
                                            ).toDateString()}
                                        </b>
                                        {checkTypeArr(data?.sdbg_filename)
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
                                          : "SDBG NOT SUBMITTED."}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Actual SDBG Submission Date</td>
                                      <td className="btn_value">
                                        <b className="me-3">
                                          {form?.a_sdbg_date &&
                                            new Date(
                                              form?.a_sdbg_date
                                            ).toDateString()}
                                        </b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Demand raised by production/PP&C if any
                                      </td>
                                      <td className="btn_value">
                                        <input
                                          type="file"
                                          className="form-control"
                                          name="demand_raise_filename"
                                          onChange={(e) =>
                                            inputFileChange(e, form, setForm)
                                          }
                                          accept=".pdf"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Gate Entry Acknowledgement no.</td>
                                      <td className="btn_value">
                                        {form.gate_entry_no}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Gate Entry Date</td>
                                      <td className="btn_value">
                                        {form.gate_entry_date}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>GRN No </td>
                                      {/* <td className="btn_value">
                                        <p>
                                          {checkTypeArr(data?.grn_nos) &&
                                            data?.grn_nos.map((item, i) => (
                                              <b key={i} className="mx-2">
                                                {item?.grn_no}
                                              </b>
                                            ))}
                                        </p>
                                      </td> */}
                                      <td className="btn_value">
                                        {form.grn_nos}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>ICGRN no </td>
                                      <td className="btn_value">
                                        {/* <p>
                                          {checkTypeArr(
                                            data?.icgrn_nos?.icgrn
                                          ) &&
                                            data?.icgrn_nos?.icgrn.map(
                                              (item, i) => (
                                                <b key={i} className="mx-2">
                                                  {item?.icgrn_no}
                                                </b>
                                              )
                                            )}
                                        </p> */}
                                        {form.icgrn_nos}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Total ICGRN Value</td>
                                      <td className="btn_value">
                                        <b>{form.total_price}</b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Contractual Drawing submission date
                                      </td>
                                      <td className="btn_value">
                                        <b>
                                          {form?.c_drawing_date &&
                                            formatDate(form?.c_drawing_date)}
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
                                            ).toDateString()}
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
                                            ).toDateString()}
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
                                            ).toDateString()}
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
                                            ).toDateString()}
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
                                            ).toDateString()}
                                        </b>
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
                                      actionHandlerBTN(
                                        "BillsMaterialHybrid",
                                        token,
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

export default BillsMaterialHybrid;
