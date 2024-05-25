import axios from "axios";

export const loginUser = async (email, password) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  return res.data;
};

export const signupUser = async (name, email, password, role) => {
  try{
  const res = await axios.post("/user/signup", { name, email, password, role});
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  return res.data;
} catch (error) {
  console.error("Signup failed:", error.response.data.message);
  throw new Error(error.response.data.message);
}
}; 


export const sendChatRequest = async (message) => {
  const res = await axios.post("http://localhost:5005/api/v1/chat/completions", { message });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  return res.data;
};

export const getUserChats = async () => {
  const res = await axios.get("http://localhost:5005/api/v1/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("http://localhost:5005/api/v1/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get("http://localhost:5005/api/v1/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  return res.data;
};
