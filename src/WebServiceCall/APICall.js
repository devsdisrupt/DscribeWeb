// import { appCred } from "../views/AppConfig";

// export default async function APIRequest(ReqMethod, ReqData, isFormData = false) {
//   try {
//     const options = {
//       method: "POST",
//       body: isFormData ? ReqData : JSON.stringify(ReqData),
//     };

//     // Only set JSON header if not FormData
//     if (!isFormData) {
//       options.headers = { "Content-Type": "application/json" };
//     }

//     const response = await fetch(appCred.appUrl + ReqMethod, options);
//     return response.json();
//   } catch (err) {
//     console.error("API Error:", err);
//     throw err;
//   }
// }

import axios from "axios";
import { appCred } from "../views/AppConfig";

export default async function APIRequest(ReqMethod, ReqData, isFormData = false) {
  try {
    debugger;
    const url = appCred.appUrl;

    let data = isFormData ? ReqData : new FormData();
    const headers = {
      _token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBY2Nlc3NEYXRlVGltZSI6NjM4ODYwMDEyNjAzOTUwMDgwLCJBcHBsaWNhdGlvbklEIjoiSElTIiwiVG9rZW5OYXR1cmUiOiJFIiwiVGltZUR1cmF0aW9uSW5Ib3VycyI6MCwiVXNlcklEIjoiRFNjcmliZSIsIlBhc3N3b3JkIjoiWERzTE9rZlVyU29Qem1mbzgxd0Jpc0QxWXRYaDNyS3A0ZVE3dlo5akY4dz0ifQ.NBS7uayB-RQurQBgssOsv30Ulv685T5IvQHMVzZL22A"
    };

    if (isFormData) {
      // `ReqData` is already a FormData instance
      data = ReqData;
    } else {
      // Create FormData and append method/data
      data = new FormData();
      data.append("RequestMethod", ReqMethod);
      data.append("RequestData", JSON.stringify(ReqData));
    }   

    

    const config = {
      method: "post",
      url: url,
      headers: headers,
      maxBodyLength: Infinity,
      data: data,
    };

    const response = await axios.request(config);
    return response.data;

  } catch (err) {
    console.error("API Request Error:", err.message);
    throw err;
  }
}
