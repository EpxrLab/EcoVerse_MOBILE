import axios from "../utils/axios.customize";

const getAuthenticatedParent = async () => {
  try {
    const res = await axios.get("/profile/parent");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getParentChildren = async () => {
  try {
    const res = await axios.get("/parent/children");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllRewards = async () => {
  try {
    const res = await axios.get("/school/rewards/parent");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getMyRequests = async () => {
  try {
    const res = await axios.get("/rewards/requests/my");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const createRewardRequest = async (payload) => {
  try {
    const res = await axios.post("/rewards/requests", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  getAuthenticatedParent,
  getParentChildren,
  getAllRewards,
  createRewardRequest,
  getMyRequests,
};
