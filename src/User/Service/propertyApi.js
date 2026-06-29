import axios from "axios";

const BASE_URL = "https://backendapi.urbanrwa.io";

export const getListedProperties = async () => {
  const res = await axios.get(`${BASE_URL}/user/properties/listed`);
  return res.data.data; // 👈 direct properties array
};
