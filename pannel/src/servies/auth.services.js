import axios from "axios";
import { api } from "../constant/api";

export const register = async (payload) => {
  try {
    const res = await axios.post(api.register, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
