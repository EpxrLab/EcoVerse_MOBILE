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

//======================Reward API======================

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

const cancelRequest = async (id) => {
  try {
    const res = await axios.put(`/rewards/requests/${id}/cancel`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const confirmRequest = async (id) => {
  try {
    const res = await axios.put(`/rewards/requests/${id}/confirm`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//======================Campaign API===================

const getAllCamapaignInvitations = async () => {
  try {
    const res = await axios.get("/parent/campaign-invitations");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const approveInvitation = async (id, payload) => {
  try {
    const res = await axios.post(
      `/parent/campaigns/${id}/approve-join`,
      payload,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const rejectInvitation = async (id, payload) => {
  try {
    const res = await axios.post(
      `/parent/campaigns/${id}/reject-join`,
      payload,
    );
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
  cancelRequest,
  confirmRequest,
  getAllCamapaignInvitations,
  approveInvitation,
  rejectInvitation,
};
