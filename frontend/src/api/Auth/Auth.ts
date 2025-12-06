import axios from "axios";
import basePath from "../baseApi";

export type registerUserType = {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
};

export type loginUserType = Omit<registerUserType, "username" | "phoneNumber">;

export const registerUser = async (data: registerUserType) => {
  try {
    const response = await basePath.post("/auth/register", data);
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const loginUser = async (
  data: Omit<registerUserType, "username" | "phoneNumber">,
) => {
  try {
    const response = await basePath.post("/auth/login", data);
    return response.data;
  } catch (e) {
    throw e
  }
};

export const findUserInfo = async () => {
  try {
    const response = await basePath.get("/auth/find");
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data;
    }
  }
};

export const editProfile = async (data: FormData) => {
  try {
    const response = await basePath.patch("/auth/edit", data);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data;
    }
  }
};

export const editPhotoProfile = async (data: FormData) => {
  try {
    const response = await basePath.patch("/auth/editprofile", data);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data;
    }
  }
};

export const editDataProfile = async (data : {userPhoneNumber? : string, userPassword? : string}) => {
    try{
        const response = await basePath.patch("/auth/editdata", data)
        return response.data
    }catch(e){
        if(axios.isAxiosError(e)){
            throw e.response?.data
        }
    }
}