import axiosClient from "../../api/axiosClient";


export const publicApi = {


  getPublicProperties: () =>
    axiosClient.get("public/public-property"),

 
  sendContactMessage: (data) =>
  axiosClient.post("/public/user-Contact", data),

}


