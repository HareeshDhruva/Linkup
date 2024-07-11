import axios from "axios";

export const login = () => {};

export const logout = () => {};

export const register = () => {};

export const getMessage = async (id) => {
  try {
    const {data} = await axios.get(`/api/message/${id}`);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch message: ${error.message}`);
  }
};

// export const sendMessage = async (data) => {
//     const postData = {message:data.data};
//     try {
//     const response = await axios.post(`/api/message/send/${data.id}`, postData);
//     return response;
//     } catch (error) {
//       throw new Error(`Failed to fetch message: ${error.message}`);
//     }
//   };


export const getUsers = async () => {
  const response = await axios.get(`/api/users/`);
  const users = response.data;
  return users;
};
