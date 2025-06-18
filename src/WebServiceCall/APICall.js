// import { appCred } from "../views/AppConfig";


// export default async function APIRequest(ReqMethod, ReqData) {
//   try {
    
    
//       const response = await fetch(appCred.appUrl+ReqMethod, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(ReqData)
//       });
    
//     return response.json();
//   } catch (err) {
//     console.error(err);
//   }
// }



import { appCred } from "../views/AppConfig";

export default async function APIRequest(ReqMethod, ReqData, isFormData = false) {
  try {
    const options = {
      method: "POST",
      body: isFormData ? ReqData : JSON.stringify(ReqData),
    };

    // Only set JSON header if not FormData
    if (!isFormData) {
      options.headers = { "Content-Type": "application/json" };
    }

    const response = await fetch(appCred.appUrl + ReqMethod, options);
    return response.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
