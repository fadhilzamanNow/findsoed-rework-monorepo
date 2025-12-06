<script setup lang="ts">
import { Flex, Modal, Table, TableProps } from "ant-design-vue";
import { computed, h, ref, watchEffect } from "vue";
import HistoryAction from "./HistoryAction.vue";
import StatusButton from "./StatusButton.vue";
import {
  deletePost,
  editPost,
  getAllUserPosts,
  getUserPostDetailData,
} from "../../api/Post/Post";

type UserPostTable = {
  id: number;
  postId: string;
  status: number;
  itemName: string;
};

type PostDetailData = {
  id: string;
  itemName: string;
  itemLostDate: string;
  itemDescription: string;
  itemCategory: string;
  itemStatus: string;
};
const currentPage = ref<number>(1);
const postData = ref<UserPostTable[]>([]);
const postDetail = ref<PostDetailData | null>(null);
const isSent = ref(false);
const tableLoading = ref(false);

const getUserPostDetail = async (id: string) => {
  try {
    const response = await getUserPostDetailData(id);
    if (response) {
      postDetail.value = response.data;
    }
  } catch (e) {
    Modal.error({
      title: "Gagal untuk memndapatkan detail post",
      centered: true,
      zIndex: 99999,
    });
  }
};

const handleSubmitDelete = async (id: string) => {
  try {
    const response = await deletePost(id);
    if (response) {
      isSent.value = true;
      Modal.success({
        title: "Post berhasil untuk dihapus",
        centered: true,
        zIndex: 99999,
      });
    }
  } catch (e) {
    Modal.error({
      title: "Post gagal untuk dihapus",
      centered: true,
      zIndex: 99999,
    });
  }
};

const handleSubmitEdit = async (
  date: string,
  status: string,
  itemDetail: string
) => {
  try {
    if (postDetail.value?.id) {
      const response = await editPost(
        {
          ...(date.length > 1 && { itemLostDate: date }),
          ...(status.length > 1 && { itemStatus: status }),
          ...(itemDetail.length > 1 && { itemDetail: itemDetail }),
        },
        postDetail.value.id
      );
      if (response) {
        isSent.value = true;
        Modal.success({
          title: "Data berhasil diedit",
          content: "Berhasil",
          centered: true,
          zIndex: 99999,
        });
      }
    }
  } catch (e) {
    Modal.error({
      title: "Data gagal untuk diedit",
      centered: true,
      zIndex: 99999,
    });
  }
};

const getUserPosts = async () => {
  try {
    tableLoading.value = true;
    const response = await getAllUserPosts();
    if (response) {
      const userPosts: UserPostTable[] = response.data.map(
        (v: Omit<UserPostTable, "id">, i: number) => {
          return {
            id: i + 1,
            postId: v.postId,
            status: v.status,
            itemName: v.itemName,
          };
        }
      );
      postData.value = userPosts;
      tableLoading.value = false;
    }
  } catch (e) {
    Modal.error({
      title: "Gagal mendapatkan post Pengguna",
      centered: true,
      zIndex: 99999,
    });
  }
};

watchEffect(() => {
  getUserPosts();
  if (isSent.value) {
    isSent.value = false;
  }
});

const columns = [
  {
    title: "No",
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "itemName",
    key: "title",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    customRender: ({ text }: { text: string }) => {
      return h(StatusButton, {
        someProp: "foobar",
        text: text,
      });
    },
  },
  {
    title: "Aksi",
    customRender: ({ record }: { _?: string; record: UserPostTable }) => {
      return h(HistoryAction, {
        record: record,
        postData: postDetail.value,
        onDetail: getUserPostDetail,
        onEdit: handleSubmitEdit,
        onDelete: handleSubmitDelete,
      });
    },
  },
];

const tablesProps = computed<TableProps>(() => ({
  columns: columns,
  dataSource: postData.value,
  loading: false,
  bordered: true,
  pagination: {
    current: currentPage.value,
    onChange: (page) => (currentPage.value = page),
    total: postData.value.length,
    pageSize: 7,
  },
}));
</script>

<template>
  <Flex vertical gap="20" class="w-full">
    <h1>Terdapat {{ postData.length }} barang yang ditemukan</h1>
    <div class="w-full p-2">
      <Flex class="min-w-0 lg:w-full overflow-auto h-[800px]" vertical>
        <Table v-bind="tablesProps" />
      </Flex>
    </div>
  </Flex>
</template>
