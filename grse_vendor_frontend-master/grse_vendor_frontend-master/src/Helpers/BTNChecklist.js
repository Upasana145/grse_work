import { toast } from "react-toastify";
import { apiCallBack } from "../utils/fetchAPIs";

export const actionHandlerBTN = async (
  flag,
  token,
  id,
  form,
  setForm,
  initialData,
  navigate
) => {
  try {
    const {
      invoice_no,
      invoice_filename,
      invoice_value,
      e_invoice_no,
      gst_rate,
      e_invoice_filename,
      debit_note,
      credit_note,
      net_claim_amount,
      debit_credit_filename,
      gate_entry_no,
      gate_entry_date,
      get_entry_filename,
      grn_no_1,
      grn_no_2,
      grn_no_3,
      grn_no_4,
      icgrn_no_1,
      icgrn_no_2,
      icgrn_no_3,
      icgrn_no_4,
      grn_nos,
      icgrn_nos,
      total_price,
      total_icgrn_value,
      hsn_gstn_icgrn,
      ld_gate_entry_date,
      ld_contractual_date,
      c_sdbg_filename,
      demand_raise_filename,
      pbg_filename,
      associated_po,
    } = form;
    console.log("associated_po1", associated_po);

    if (!hsn_gstn_icgrn) {
      toast.warning("Please check the HSN code, GSTIN, Tax rate is as per PO!");
      return;
    }
    if (total_price !== net_claim_amount) {
      toast.warning("Total price and net claim amount should be equal!");
      return;
    }
    const fDToSend = new FormData();
    fDToSend.append("purchasing_doc_no", id);
    fDToSend.append("invoice_no", invoice_no);
    fDToSend.append("invoice_value", invoice_value);
    fDToSend.append("e_invoice_no", e_invoice_no);
    fDToSend.append("debit_note", debit_note);
    fDToSend.append("credit_note", credit_note);
    fDToSend.append("gst_rate", gst_rate);
    fDToSend.append("net_claim_amount", net_claim_amount);
    fDToSend.append("gate_entry_no", gate_entry_no);
    fDToSend.append("gate_entry_date", gate_entry_date);
    fDToSend.append("grn_no_1", grn_no_1 || "");
    fDToSend.append("grn_no_2", grn_no_2 || "");
    fDToSend.append("grn_no_3", grn_no_3 || "");
    fDToSend.append("grn_no_4", grn_no_4 || "");
    fDToSend.append("icgrn_no_1", icgrn_no_1 || "");
    fDToSend.append("icgrn_no_2", icgrn_no_2 || "");
    fDToSend.append("icgrn_no_3", icgrn_no_3 || "");
    fDToSend.append("icgrn_no_4", icgrn_no_4 || "");
    fDToSend.append("grn_nos", grn_nos || "");
    fDToSend.append("icgrn_nos", icgrn_nos || "");
    fDToSend.append("total_icgrn_value", total_icgrn_value);
    fDToSend.append("total_price", total_price);
    fDToSend.append("hsn_gstn_icgrn", hsn_gstn_icgrn);
    fDToSend.append("associated_po", associated_po);
    if (invoice_filename) {
      fDToSend.append("invoice_filename", invoice_filename);
    }
    if (e_invoice_filename) {
      fDToSend.append("e_invoice_filename", e_invoice_filename);
    }
    if (debit_credit_filename) {
      fDToSend.append("debit_credit_filename", debit_credit_filename);
    }
    if (get_entry_filename) {
      fDToSend.append("get_entry_filename", get_entry_filename);
    }
    if (c_sdbg_filename) {
      fDToSend.append("c_sdbg_filename", c_sdbg_filename);
    }
    if (demand_raise_filename) {
      fDToSend.append("demand_raise_filename", demand_raise_filename);
    }
    if (pbg_filename) {
      fDToSend.append("pbg_filename", pbg_filename);
    }
    console.log("fDToSend", fDToSend);
    const response = await apiCallBack(
      "POST",
      "po/btn/BillsMaterialHybrid",
      fDToSend,
      token
    );

    if (response?.status) {
      toast.success(response?.message);
      setForm(initialData);
      // getData();
      navigate(`/invoice-and-payment-process/${id}`);
    } else {
      toast.error(response?.message);
    }
  } catch (error) {
    toast.error("Error:", error);
  }
};

export const actionHandlerByDO = async (
  doForm,
  setDoForm,
  initialData,
  navigate,
  id,
  token
) => {
  doForm.assigned_to = doForm?.certifying_authority;
  try {
    const response = await apiCallBack(
      "POST",
      "po/btn/BillsMaterialHybridByDO",
      doForm,
      token
    );
    if (response?.status) {
      toast.success(response?.message);
      setDoForm(initialData);
      navigate(`/invoice-and-payment-process/${id}`);
    } else {
      toast.error(response?.message);
    }
  } catch (error) {
    toast.error("Error:", error);
  }
};

export const actionHandlerServiceBTN = async (
  flag,
  token,
  user,
  id,
  form,
  setForm,
  initialData,
  navigate
) => {
  try {
    const {
      assigned_to,
      invoice_no,
      invoice_filename,
      invoice_value,
      e_invoice_no,
      gst_rate,
      e_invoice_filename,
      debit_note,
      credit_note,
      net_gross_claim_amount,
      total_amount,
      vendor_name,
      vendor_code,
      wdc_number,

      actual_start_date,
      actual_completion_date,
      esi_compliance_certified,
      pf_compliance_certified,

      debit_credit_filename,

      pbg_filename,
    } = form;
    if (!assigned_to || assigned_to === "") {
      return toast.warn("Please choose GRSE officer.");
    }
    const fDToSend = new FormData();
    fDToSend.append("assigned_to", assigned_to);
    fDToSend.append("purchasing_doc_no", id);
    fDToSend.append("vendor_name", vendor_name);
    fDToSend.append("vendor_code", vendor_code);
    fDToSend.append("wdc_number", wdc_number);
    fDToSend.append("invoice_no", invoice_no);
    fDToSend.append("invoice_value", invoice_value);
    fDToSend.append("e_invoice_no", e_invoice_no);
    fDToSend.append("debit_note", debit_note);
    fDToSend.append("credit_note", credit_note);
    fDToSend.append("credit_note", gst_rate);
    fDToSend.append("net_gross_claim_amount", net_gross_claim_amount);
    fDToSend.append("total_amount", total_amount);
    fDToSend.append("actual_work_start_date", actual_start_date);
    fDToSend.append("actual_work_completion_date", actual_completion_date);
    fDToSend.append("esi_compliance_certified", esi_compliance_certified);
    fDToSend.append("pf_compliance_certified", pf_compliance_certified);
    fDToSend.append("Wage_compliance_certified", "");

    if (invoice_filename) {
      fDToSend.append("invoice_filename", invoice_filename);
    }
    if (e_invoice_filename) {
      fDToSend.append("e_invoice_filename", e_invoice_filename);
    }
    if (debit_credit_filename) {
      fDToSend.append("debit_credit_filename", debit_credit_filename);
    }
    if (pbg_filename) {
      fDToSend.append("pbg", pbg_filename);
    }
    const response = await apiCallBack(
      "POST",
      "po/btn/submitBtnServiceHybrid",
      fDToSend,
      token
    );

    if (response?.status) {
      toast.success(response?.message);
      setForm(initialData);
      // getData();
      navigate(`/invoice-and-payment-process/${id}`);
    } else {
      toast.error(response?.message);
    }
  } catch (error) {
    toast.error("Error:", error);
  }
};
