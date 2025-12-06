<script lang="ts" setup>
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  WarningFilled,
} from "@ant-design/icons-vue";
import {
  Button,
  ButtonProps,
  DatePicker,
  DatePickerProps,
  Flex,
  Input,
  InputProps,
  Modal,
  ModalProps,
  Select,
  Textarea,
  TextAreaProps,
} from "ant-design-vue";
import { computed, ref, watchEffect } from "vue";

import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/authStore";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { SelectProps } from "ant-design-vue/es/vc-select";
import lodash from "lodash";
dayjs.extend(localizedFormat);

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

type actionPropsType = {
  record: UserPostTable;
  postData: PostDetailData | null;
  onDetail: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (date: string, status: string, itemDetail: string) => Promise<void>;
};

const { record, postData, onDetail, onDelete, onEdit } =
  defineProps<actionPropsType>();
const { userInfo } = storeToRefs(useAuthStore());

const isModalOpen = ref<boolean>(false);
const isEditOpen = ref<boolean>(false);
const isDeleteOpen = ref<boolean>(false);

const editDate = ref("");
const editStatus = ref("");
const editDetail = ref("");

watchEffect(() => {
  if (isModalOpen.value || isEditOpen.value || isDeleteOpen.value) {
    onDetail(record.postId);
  }
});

const option = ["Handphone", "Laptop", "Dompet", "Lain Lain"].map((d) => {
  return {
    value: d,
  };
});

const optionStatus: SelectProps["options"] = ["Hilang", "Ditemukan"].map(
  (d) => {
    return {
      value: d,
      label: d,
    };
  }
);

const modalDetailProps = computed<ModalProps>(() => ({
  open: isModalOpen.value,
  centered: true,
  onOk: () => (isModalOpen.value = !isModalOpen.value),
  title: postData?.itemName,
  footer: null,
  zIndex: 99999,
  onCancel: () => (isModalOpen.value = !isModalOpen.value),
}));

const modalEditProps = computed<ModalProps>(() => ({
  open: isEditOpen.value,
  centered: true,
  onOk: () => {
    isEditOpen.value = !isEditOpen.value;
    onEdit(editDate.value, editStatus.value, editDetail.value);
    editStatus.value = "";
    editDate.value = "";
    editDetail.value = "";
  },
  title: `Edit Informasi ${postData?.itemName}`,
  onCancel: () => {
    isEditOpen.value = !isEditOpen.value;
    editStatus.value = "";
    editDate.value = "";
    editDetail.value = "";
  },
  okButtonProps: {
    disabled: !(
      !lodash.isEmpty(editStatus.value) ||
      !lodash.isEmpty(editDate.value) ||
      !lodash.isEmpty(editDetail.value)
    ),
  },
  mask: true,
}));

const modalDeleteProps = computed<ModalProps>(() => ({
  open: isDeleteOpen.value,
  centered: true,
  onOk: () => (isDeleteOpen.value = !isDeleteOpen.value),
  footer: null,
  zIndex: 99999,
  onCancel: () => (isDeleteOpen.value = !isDeleteOpen.value),
}));

const inputItemNameProps = computed<InputProps>(() => ({
  value: postData?.itemName,
  disabled: true,
}));

const categoryProps = computed<Partial<SelectProps>>(() => ({
  placeholder: postData?.itemCategory,
  options: option,
  disabled: true,
}));

const optionProps = computed<SelectProps>(() => ({
  options: optionStatus,
  onChange: (v) => (editStatus.value = v as string),
  ...(postData?.itemStatus && { placeholder: postData?.itemStatus }),
  ...(editStatus.value && { value: editStatus.value }),
}));

const descProps = computed<TextAreaProps>(() => ({
  placeholder: postData?.itemDescription,
  onInput: (e) => (editDetail.value = (e.target as HTMLInputElement).value),
  ...(editDetail.value && { value: editDetail.value }),
}));

const dateProps = computed<DatePickerProps>(() => ({
  format: "YYYY-MM-DD",
  placement: "bottomRight",
  onChange: (_, date) => (editDate.value = date),
  ...(postData?.itemLostDate && {
    placeholder: postData.itemLostDate.slice(0, 10),
  }),
  ...(editDate.value && { value: dayjs(editDate.value, "YYYY-MM-DD") }),
}));

const deleteButtonProps = computed<ButtonProps>(() => ({
  onClick: () => {
    onDelete(record.postId as string);
    isDeleteOpen.value = !isDeleteOpen.value;
  },
  danger: true,
  type: "primary",
}));
</script>

<template>
  <Flex class="max-w-max" gap="8" align="center">
    <Button type="primary" @click="() => (isModalOpen = !isModalOpen)">
      <Flex align="center" gap="8">
        <EyeOutlined />
        <span>See</span>
      </Flex>
    </Button>
    <Button
      type="primary"
      class="flex align-center justify-center text-white !bg-yellow-400 hover:!bg-yellow-300 transition duration-50"
      @click="() => (isEditOpen = !isEditOpen)"
    >
      <Flex align="center" gap="8">
        <EditOutlined />
        <span>Edit</span>
      </Flex>
    </Button>
    <Button type="primary" danger @click="() => (isDeleteOpen = !isDeleteOpen)">
      <Flex align="center" gap="8">
        <DeleteOutlined />
        <span>Delete</span>
      </Flex>
    </Button>
  </Flex>
  <Modal v-bind="modalDetailProps">
    <Flex vertical gap="20">
      <div class="grid grid-cols-2">
        <Flex vertical gap="4">
          <h1 class="text-xs font-medium">Kategori</h1>
          <span class="font-light text-xs">{{ postData?.itemCategory }}</span>
        </Flex>
        <Flex vertical gap="4">
          <h1 class="text-xs font-medium">Kontak</h1>
          <span class="font-light text-xs">{{ userInfo?.phoneNumber }}</span>
        </Flex>
      </div>
      <div class="grid grid-cols-2">
        <Flex vertical gap="4">
          <h1 class="text-xs font-medium">Tanggal Hilang</h1>
          <span class="font-light text-xs">{{
            dayjs(postData?.itemLostDate, "YYYY-MM-DD").format("lll")
          }}</span>
        </Flex>
        <Flex vertical gap="4">
          <h1 class="text-xs font-medium">Status Barang</h1>
          <span
            :class="[
              'px-2 py-0.5 rounded-md text-white max-w-max text-xs',
              postData?.itemStatus === 'Hilang' ? 'bg-red-500' : 'bg-green-400',
            ]"
            >{{ postData?.itemStatus }}</span
          >
        </Flex>
      </div>
      <Flex vertical gap="4">
        <h1 class="text-xs font-medium">Deskripsi</h1>
        <span
          class="max-w-[350px] overflow-x-hidden hover:overflow-y-scroll text-xs font-light"
          >{{ postData?.itemDescription }}</span
        >
      </Flex>
    </Flex>
  </Modal>

  <Modal v-bind="modalDeleteProps">
    <Flex vertical gap="20">
      <Flex align="center" gap="20">
        <div class="text-red-500">
          <WarningFilled :style="{ fontSize: '26px' }" />
        </div>
        <span>Are you sure you want to delete {{ postData?.itemName }}</span>
      </Flex>
      <Flex justify="end" gap="10">
        <Button
          type="default"
          class="hover:!border-gray-300"
          @click="isDeleteOpen = !isDeleteOpen"
          >Cancel</Button
        >
        <Button v-bind="deleteButtonProps">Delete</Button>
      </Flex>
    </Flex>
  </Modal>

  <Modal v-bind="modalEditProps" ref="editModal" id="editModal">
    <Flex vertical gap="16" justify="center" class="w-full">
      <Flex vertical class="w-full" gap="8">
        <label for="item">Nama Barang</label>
        <Input v-bind="inputItemNameProps" />
      </Flex>
      <Flex vertical class="w-full" gap="8">
        <label for="item">Kategori Barang</label>
        <!-- @vue-ignore -->
        <Select v-bind="categoryProps" />
      </Flex>
      <Flex vertical class="w-full" gap="8">
        <label for="item">Status Barang</label>
        <!-- @vue-ignore -->
        <Select v-bind="optionProps" />
      </Flex>
      <Flex vertical class="w-full" gap="8">
        <label for="item">Deskripsi Barang</label>
        <Textarea v-bind="descProps" />
      </Flex>
      <Flex vertical class="w-full" gap="8">
        <label for="item">Tanggal Kehilangan</label>
        <!-- @vue-ignore -->
        <DatePicker v-bind="dateProps" placement="bottomRight" />
      </Flex>
    </Flex>
  </Modal>
</template>
