import axios from "axios";
import basePath from "../baseApi";

export type itemCategoryType =
  | "Handphone"
  | "Laptop"
  | "Dompet"
  | "Kartu"
  | "Lain-Lain";
export type itemLocationType = {
  latitude: number | null;
  longitude: number | null;
  locationName : string | null
};

export type itemStatusType = "Ditemukan" | "Hilang";

export type createPostType = {
  itemName: string;
  itemDetail: string;
  itemCategory: itemCategoryType;
  itemLatitude : number,
  itemLongitude : number,
  locationName : string,
  itemStatus: itemStatusType;
  itemLostDate : string;
  postImage : any[]
};

export type editPostType = {
    itemName?: string;
    itemDetail?: string;
    itemCategory?: itemCategoryType;
    itemLocation?: itemLocationType;
    itemStatus? : string;
    itemLostDate? : string
  };


export const createPost = async (data: FormData) => {
  try {
    const response = await basePath.post("/post/create", data);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data;
    }
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await basePath.delete(`/post/${postId}`);
    return response.data;
  } catch (err) {
    if(axios.isAxiosError(err)){
        return err.response?.data
    }
  }
};

export const editPost = async (data : editPostType, postId : string) => {
    try{
        console.log("here")
        const response = await basePath.patch(`/post/edit/${postId}`, data)
        return response.data
    }catch(err){
        if(axios.isAxiosError(err)){
            throw err.response?.data
        }
    }
};

export const getAllPost = async () => {
    try{
        const response = await basePath.get("/post")
        return response.data
    }catch(err){
        if(axios.isAxiosError(err)){
            throw err.response?.data
        }
    }
};

export const findPost = async (postSearch : string) => {
    try{
        const response = await basePath.get(`/post/${postSearch}`)
        return response.data 
    }catch(err){
        if(axios.isAxiosError(err)){
            throw err.response?.data
        }
    }
};

export const getDetailPost = async (postId : string) => {
    try{
        const response = await basePath.get(`/post/detail/${postId}`)
        return response.data
    }catch(err){
        if(axios.isAxiosError(err)){
            throw err.response?.data
        }
    }
};

export const getAllUserPosts = async () => {
  try{
    const response = await basePath.get(`/post/userpost`)
    return response.data
  }catch(e){
    if(axios.isAxiosError(e)){
      throw(e.response?.data)
    }
  }
}

export const getUserPostDetailData = async (id : string) => {
  try{
    const response = await basePath.get(`/post/userpostdetail/${id}`)
    return response.data
  }catch(e){
    if(axios.isAxiosError(e)){
      throw(e.response?.data)
    }
  }
}