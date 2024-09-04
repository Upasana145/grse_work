export const getDateTimeNow = () => {
  let currentdate = new Date();
  let datetime =
    "Last Sync: " +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  return datetime;
};

export const tenDaysEarlierDate = () => {
  let currentTimestamp = Math.floor(Date.now() / 1000);

  // Calculate 10 days earlier
  let tenDaysEarlierTimestamp = currentTimestamp - 10 * 24 * 60 * 60;

  // console.log("Current timestamp:", currentTimestamp);
  // console.log("10 days earlier timestamp:", tenDaysEarlierTimestamp);
  return tenDaysEarlierTimestamp;
};

export const convertToEpoch = (date) => {
  if (date) {
    return Math.floor(date.getTime() / 1000);
  } else {
    return null;
  }
};

export const formatDate = (epochTime) => {
  let date = new Date(epochTime);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return day + "/" + month + "/" + year;
};

export const calDatesDiff = (date1, date2) => {
  let differenceInTime = date1.getTime() - date2.getTime();

  let differenceInDays = differenceInTime / (1000 * 3600 * 24);
  if(differenceInDays < 0){
    return 0;
  }

  return Math.round(differenceInDays);
}