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

const getMyPartnershipDeliveries = async () => {
  try {
    const res = await axios.get("/rewards/deliveries/my");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const confirmPartnershipDelivery = async (id) => {
  try {
    const res = await axios.put(`/rewards/deliveries/${id}/confirm`);
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

//======================Notification API================
const getNotifications = async () => {
  try {
    const res = await axios.get("/notifications");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getUnreadCount = async () => {
  try {
    const res = await axios.get("/notifications/unread-count");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const markAsRead = async (id) => {
  try {
    const res = await axios.post(`/notifications/${id}/read`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const markAllAsRead = async () => {
  try {
    const res = await axios.post("/notifications/read-all");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//======================Auth API=======================
const forgotPassword = async (email) => {
  try {
    const res = await axios.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const verifyResetPassword = async (payload) => {
  try {
    const res = await axios.post("/auth/verify-reset-password", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const changePassword = async (payload) => {
  try {
    const res = await axios.put("/auth/change-password", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
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
  getMyPartnershipDeliveries,
  confirmPartnershipDelivery,
  getAllCamapaignInvitations,
  approveInvitation,
  rejectInvitation,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  forgotPassword,
  verifyResetPassword,
  changePassword,
};
