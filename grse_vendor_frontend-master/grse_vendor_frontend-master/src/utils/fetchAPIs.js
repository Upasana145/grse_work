import axios from "axios";
import { toast } from "react-toastify";

export const postAPI = (path, body, token) => {
  // console.log(`${process.env.REACT_APP_BACKEND_API}/${path}`);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_BACKEND_API}${path}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: JSON.stringify(body),
  };

  return axios(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      toast.error("Something went wrong! Please contact to the administrator");
      console.log(error);
    });
};

export const apiCallBack = async (method, slug, payload, token) => {
  let path = `${process.env.REACT_APP_BACKEND_API}${slug}`;
  console.log("Path", path);

  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: path,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Conditionally set the Content-Type based on the payload
    ...(payload instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" }),
    data: payload,
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

// export const getAPI = (path, token) => {
//   let config = {
//     method: "GET",
//     maxBodyLength: Infinity,
//     url: `${process.env.REACT_APP_BACKEND_API}/${path}`,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   return axios(config)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       console.log(error.response.data.errors);
//       toast.error(
//         "Something went wrong! Please contact to the administrator",
//         error.response.data.errors
//       );
//     });
// };

// export const putAPI = (path, body, token) => {
//   let config = {
//     method: "PUT",
//     maxBodyLength: Infinity,
//     url: `${process.env.REACT_APP_BACKEND_API}/${path}`,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     data: JSON.stringify(body),
//   };

//   return axios(config)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       toast.error("Something went wrong! Please contact to the administrator");
//       console.log(error);
//     });
// };

// export const deleteAPI = (path, token) => {
//   let config = {
//     method: "DELETE",
//     url: `${process.env.REACT_APP_BACKEND_API}/${path}`,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   return axios(config)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       toast.error("Something went wrong! Please contact to the administrator");
//       console.log(error);
//     });
// };
