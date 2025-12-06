import { defineStore } from "pinia";
import { ref } from "vue";

type PostType = {
  itemName: string;
  itemDetail: string;
  userName: string;
  itemCategory: string;
  status?: string | undefined;
  images: string[];
  likeNum: number;
  commentNum: number;
  id: string;
  userProfile: string | null;
  statusName?: string;
  categoryName: string;
  created_at: string | null;
  updated_at: string | null;
};

type postStoreState = {
  postData: Array<PostType> | null;
  isLoading: boolean;
  detailPost: PostType | {};
};

export const usePostStore = defineStore("post", () => {
  const postData = ref<PostType[] | null>(null);
  const isLoading = ref<postStoreState["isLoading"]>(false);
  const detailPost = ref<postStoreState["detailPost"]>({});

  const setPost = (posts: postStoreState["postData"]) => {
    postData.value = posts;
  };

  const togglePostLoading = () => {
    isLoading.value = !isLoading.value;
  };

  const setDetailPost = (detail: postStoreState["detailPost"]) => {
    detailPost.value = detail;
  };

  return {
    postData,
    isLoading,
    detailPost,
    setPost,
    togglePostLoading,
    setDetailPost,
  };
});
