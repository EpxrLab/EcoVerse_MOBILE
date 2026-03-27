import axios from "../../../utils/axios.customize";

const loginFunction = async (payload) => {
  try {
    const res = await axios.post("/auth/login", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export { loginFunction };
