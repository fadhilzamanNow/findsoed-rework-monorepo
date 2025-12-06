import axios from "axios";
import basePath from "../baseApi";

export type messageType = {
  message: string;
  postId: string;
  userId: string;
};

export const getComments = async (commentId: string) => {
  try {
    const response = await basePath.get(`/comment/${commentId}`);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return err.response?.data;
    }
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const response = await basePath.delete(`/comment/${commentId}`);
    return response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return err.response?.data;
    }
  }
};

export const editComment = async (commentId: string, data: string) => {
  try {
    const response = await basePath.patch(`/comment/edit/${commentId}`, {
      data,
    });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return err.response?.data;
    }
  }
};

export const createComment = async (message: string, postId: string) => {
  try {
    const response = await basePath.post(`/comment/create/${postId}`, {
      message: message,
    });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return err.response?.data;
    }
  }
};
