<script setup lang="ts">
import {
  Avatar,
  Empty,
  Flex,
  Image,
  ImageProps,
  InputProps,
  Modal,
} from "ant-design-vue";
import {
  computed,
  defineAsyncComponent,
  nextTick,
  ref,
  useTemplateRef,
  watchEffect,
} from "vue";
import { Input, Button } from "ant-design-vue";
import type { AvatarProps, ModalProps } from "ant-design-vue";
import { getDetailPost, itemLocationType } from "../../api/Post/Post";
import { useRoute } from "vue-router";
import BreadCrumbComp from "../BreadCrumb/BreadCrumbComp.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import {
  LeftOutlined,
  LoadingOutlined,
  RightOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import CommentCard from "./CommentCard.vue";
import { createComment, getComments } from "../../api/Comment/Comment";
import { watch } from "vue";

type PostType = {
  itemName: string;
  itemDetail: string;
  userName: string;
  itemCategory: string;
  status: string;
  images: string[];
  likeNum: number;
  commentNum: number;
  id: string;
  userProfile: string;
  coordinate: itemLocationType;
};

interface DetailPostTypes extends PostType {
  itemLostDate: string;
  phoneNumber: string;
  statusName: string;
}

type CommentType = {
  userName: string;
  userProfile: string;
  message: string;
  created_at: string;
};

const LazyDetailLeafletMap = defineAsyncComponent(
  () => import("./DetailLeafletMap.vue")
);

const isModalOpen = ref<boolean>(false);
const commentVal = ref<string>("");
const isBeingSent = ref<boolean>(false);
const route = useRoute();
const postDetail = ref<DetailPostTypes>();
const isCommentLoading = ref(true);
const postComment = ref<CommentType[]>([]);
const commenBlock = useTemplateRef("commentBlock");
const isModalOpenMap = ref(false);
const firstSent = ref(false);

const findDetailUserPost = async (id: string) => {
  try {
    const response = await getDetailPost(id);
    if (response) {
      window.scrollTo(0, 0);
      postDetail.value = response.data;
      isBeingSent.value = true;
    }
  } catch (e) {}
};

const handleGetPostComment = async () => {
  try {
    isCommentLoading.value = true;
    const response = await getComments(postDetail.value?.id as string);
    if (response) {
      postComment.value = response.data;
      isCommentLoading.value = false;
    }
  } catch (e) {}
};

watchEffect(() => {
  if (route.params.id) {
    findDetailUserPost(route.params.id as string);
  }
});

watchEffect(() => {
  if (postDetail.value?.id) {
    handleGetPostComment();
  }

  if (isBeingSent.value) {
    isBeingSent.value = false;
  }
});

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

const toggleModalMap = () => {
  isModalOpenMap.value = !isModalOpenMap.value;
};

const inputProps = computed<InputProps>(() => ({
  placeholder: "Masukkan komentarmu",
  onPressEnter: async () => {
    await handleAddComment();
  },
  value: commentVal.value,
  onInput: (e) => (commentVal.value = (e.target as HTMLInputElement).value),
}));

const handleAddComment = async () => {
  try {
    const response = await createComment(
      commentVal.value,
      postDetail.value?.id as string
    );
    if (response) {
      isBeingSent.value = true;
      commentVal.value = "";
      firstSent.value = true;
      await nextTick();
      return true;
    }
  } catch (e) {
    return false;
  }
};

const imageDetailProps = computed(() => {
  return (imageName: string): ImageProps => {
    return {
      /* @ts-ignore */
      src: `${BACKEND_URL}static/images/${imageName}`,
      width: "100%",
      height: "100%",
      class:
        "object-cover h-full w-full border-2 border-gray-300 rounded-md object-center",
      alt: `Gambar Detail ${imageName}`,
    };
  };
});

const detailCreateProps = computed<AvatarProps>(() => ({
  src: `http://localhost:3500/static/images/${postDetail.value?.userProfile}`,
  shape: "square",
}));

const modalDetailProps = computed<ModalProps>(() => ({
  open: isModalOpen.value,
  title: postDetail.value?.itemName,
  centered: true,
  footer: null,
  onCancel: toggleModal,
}));

const modalDetailMapProps = computed<ModalProps>(() => ({
  open: isModalOpenMap.value,
  title: "Lokasi Kehilangan",
  centered: true,
  footer: null,
  onCancel: toggleModalMap,
}));

const pindahkeBawah = async () => {
  await nextTick();
  if (commenBlock.value) {
    commenBlock.value.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    window.scrollTo(0, 100000);
  }
};

watch(
  postComment,
  () => {
    if (firstSent.value) {
      pindahkeBawah();
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="md:ml-16 mt-16 pt-5.5 px-4 sm:px-6 md:px-8">
    <BreadCrumbComp title="Detail Barang" />

    <!-- KOTAK -->
    <div class="lg:max-w-7xl mx-auto p-4 rounded border border-gray-300 mt-2">
      <!-- FOTO + DETAIL  -->
      <div class="flex flex-col lg:flex-row gap-2">
        <!-- FOTO -->
        <Swiper
          :slides-per-view="1"
          :space-between="0"
          :navigation="{
            nextEl: '.detail-next-custom',
            prevEl: '.detail-prev-custom',
          }"
          :scrollbar="{ draggable: true }"
          :modules="[Navigation, Pagination]"
          class="w-full lg:w-3/5 h-[300px] rounded-md relative detail-swiper"
        >
          <!-- SLIDE -->
          <SwiperSlide v-for="(v, i) in postDetail?.images" :key="i" class="  ">
            <!-- @vue-ignore -->
            <Image v-bind="imageDetailProps(v)" />
          </SwiperSlide>

          <!-- NAVIGAITON -->
          <!-- PREV -->
          <button
            class="detail-prev-custom size-8 absolute z-1 top-1/2 left-2 -translate-y-1/2 rounded-full border bg-white border-gray-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          >
            <LeftOutlined />
          </button>
          <!-- NEXT -->
          <button
            class="detail-next-custom size-8 absolute z-1 top-1/2 right-2 -translate-y-1/2 rounded-full border bg-white border-gray-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          >
            <RightOutlined />
          </button>
        </Swiper>

        <!-- DETAIL -->
        <div class="flex flex-col gap-1 lg:gap-5 w-full lg:w-2/5">
          <Flex gap="10" align="center" class="w-full sm:min-w-[400px] pb-2">
            <Avatar v-if="postDetail?.userProfile" v-bind="detailCreateProps" />
            <Avatar v-else>{{ postDetail?.userName.slice(0, 2) }}</Avatar>
            <span class="text-[#6b6969] text-xs font-semibold">{{
              postDetail?.userName
            }}</span>
          </Flex>
          <div class="grid grid-cols-2">
            <Flex vertical gap="4">
              <h1 class="text-xs font-medium">Nama</h1>
              <span class="font-light text-xs">{{ postDetail?.itemName }}</span>
            </Flex>
            <Flex vertical gap="4">
              <h1 class="text-xs font-medium">Kategori</h1>
              <span class="font-light text-xs">{{
                postDetail?.itemCategory
              }}</span>
            </Flex>
          </div>
          <div class="lg:grid grid-cols-2 hidden">
            <Flex vertical gap="4">
              <h1 class="text-xs font-medium">Tanggal Hilang</h1>
              <span class="font-light text-xs">{{
                postDetail?.itemLostDate
              }}</span>
            </Flex>
            <Flex vertical gap="4">
              <h1 class="text-xs font-medium">Status Barang</h1>
              <span
                :class="[
                  'px-2 py-0.5 rounded-md text-white  max-w-max text-xs',
                  postDetail?.statusName === 'Hilang'
                    ? 'bg-red-500'
                    : 'bg-green-400',
                ]"
                >{{ postDetail?.statusName }}</span
              >
            </Flex>
          </div>
          <div class="grid grid-cols-2">
            <Flex vertical gap="4" class="pb-2">
              <h1 class="text-xs font-medium">Detail</h1>
              <Button
                type="primary"
                class="font-light text-xs max-w-max px-2 py-1 rounded-sm select-none"
                size="small"
                :style="{ fontSize: '12px' }"
                @click="toggleModal"
                >Lihat Detail</Button
              >
            </Flex>
            <Flex vertical gap="4" class="pb-2">
              <h1 class="text-xs font-medium">Lokasi Map</h1>
              <Button
                type="primary"
                class="font-light text-xs max-w-max px-2 py-1 rounded-sm select-none"
                size="small"
                :style="{ fontSize: '12px' }"
                @click="toggleModalMap"
                >Lihat Detail</Button
              >
            </Flex>
          </div>
        </div>
      </div>

      <!-- COMMNET SECTION -->
      <div class="my-4 py-4 border-y border-y-gray-300 relative">
        <div
          v-if="isCommentLoading"
          class="absolute z-2 w-full h-full bg-black/3 opacity-50 flex justify-center items-center text-7xl text-gray-400 rounded-md"
        >
          <LoadingOutlined />
        </div>

        <div class="h-[200px] lg:h-[calc(100vh-600px)] overflow-auto">
          <div
            :class="`${
              postComment.length < 1 ? 'flex justify-center items-center ' : ''
            } `"
            ref="commentBlock"
          >
            <div class="h-max w-full" v-if="postComment.length > 0">
              <CommentCard
                v-for="(v, i) in postComment"
                :key="i"
                :message="v.message"
                :userName="v.userName"
                :userProfile="v.userProfile"
                :created_at="v.created_at"
              >
                <template v-slot:name>
                  {{ v.userName }}
                </template>
              </CommentCard>
            </div>
            <div v-if="postComment.length < 1 && !isCommentLoading">
              <Empty :description="false">
                <span class="text-gray-400"
                  >Belum terdapat komentar, yuk tanya</span
                >
              </Empty>
            </div>
          </div>
        </div>
      </div>

      <!-- INPUT COMMENT SECTION -->
      <div class="w-full h-full mt-4 relative">
        <Input v-bind="inputProps" />
        <div
          class="absolute right-2 top-0 max-w-max h-full flex justify-center items-center text-gray-400"
          @click="handleAddComment"
        >
          <SendOutlined />
        </div>
      </div>
    </div>
  </div>
  <Modal v-bind="modalDetailProps">
    <Flex vertical gap="20">
      <div class="grid grid-cols-2">
        <Flex vertical gap="4">
          <h1 class="text-xs font-medium">Kategori</h1>
          <span class="font-light text-xs">
            {{ postDetail?.itemCategory }}
          </span>
        </Flex>
        <Flex vertical gap="4">
          <h1 class="text-xs font-medium">Kontak</h1>
          <span class="font-light text-xs">
            {{ postDetail?.phoneNumber }}
          </span>
        </Flex>
      </div>
      <div class="grid grid-cols-2">
        <Flex vertical gap="4">
          <h1 class="text-xs font-medium">Tanggal Hilang</h1>
          <span class="font-light text-xs">
            {{ postDetail?.itemLostDate }}
          </span>
        </Flex>
        <Flex vertical gap="4">
          <h1 class="text-xs font-medium">Status Barang</h1>
          <span
            :class="`px-2 py-0.5 rounded-md text-white  max-w-max text-xs',
            ${
              postDetail?.statusName === 'Hilang'
                ? 'bg-red-500'
                : 'bg-green-400'
            }
            `"
          >
            {{ postDetail?.statusName }}
          </span>
        </Flex>
      </div>
      <Flex vertical gap="4">
        <h1 class="text-xs font-medium">Deskripsi</h1>
        <span
          class="max-w-[350px] overflow-x-hidden hover:overflow-y-scroll text-xs font-light"
        >
          {{ postDetail?.itemDetail }}
        </span>
      </Flex>
    </Flex>
  </Modal>
  <Modal v-bind="modalDetailMapProps">
    <div class="">
      <!-- @vue-ignore -->
      <LazyDetailLeafletMap
        :latitude="postDetail?.coordinate.latitude"
        :longitude="postDetail?.coordinate.longitude"
        :location-name="postDetail?.coordinate.locationName"
      />
    </div>
  </Modal>
</template>
