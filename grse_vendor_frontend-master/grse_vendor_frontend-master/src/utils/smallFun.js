// import { toast } from "react-toastify";

import { convertToEpoch } from "./getDateTimeNow";

export const checkTypeArr = (data) => {
  return data && Array.isArray(data) && data.length > 0;
};

export const inputTypeChange = (e, form, setForm) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

export const inputFileChange = (e, form, setForm) => {
  const { name } = e.target;
  setForm({ ...form, [name]: e.target.files[0] });
};

export const calculatePenalty = (
  contractualDate,
  actualDate,
  originalValue,
  percentage,
  maxPercentage
) => {
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const contractualTime = new Date(contractualDate).getTime();
  const actualTime = new Date(actualDate).getTime();

  // Calculate the difference in time in milliseconds
  const difference = actualTime - contractualTime;
  if (difference < 0) return 0;

  // Calculate the number of weeks delayed
  const weeksDelayed = Math.ceil(difference / oneWeek);
  console.log("fun", difference, actualTime, contractualTime, weeksDelayed);

  // Calculate the penalty percentage
  let penaltyPercentage = weeksDelayed * percentage;

  // Ensure penalty does not exceed 5%
  penaltyPercentage = Math.min(penaltyPercentage, maxPercentage);

  // Calculate the penalty amount
  const penaltyAmount = (originalValue * penaltyPercentage) / 100;
  console.log(
    "penaltyAmount",
    penaltyAmount,
    contractualDate,
    actualDate,
    originalValue
  );

  return Math.round(penaltyAmount);
};

export const calculateNetPay = (
  net,
  ld,
  sdbg,
  drg,
  qap,
  ilms,
  other,
  estimate
) => {
  // if (!net || net === "") {
  //   toast.warn("ICGRN Value is missing");
  // }
  if (!ld && ld === "") {
    ld = 0;
  } else if (!sdbg && sdbg === "") {
    sdbg = 0;
  } else if (!drg && drg === "") {
    drg = 0;
  } else if (!qap && qap === "") {
    qap = 0;
  } else if (!ilms && ilms === "") {
    ilms = 0;
  } else if (!other && other === "") {
    other = 0;
  } else if (!estimate && estimate === "") {
    estimate = 0;
  }
  let deduct = parseInt(ld) + parseInt(other) + parseInt(estimate);

  let net_pay = parseInt(net) - deduct;

  return {
    deduct,
    net_pay,
  };
};
