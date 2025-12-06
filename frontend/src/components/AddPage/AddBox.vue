<script setup lang="ts">
import { Flex, message, Modal } from "ant-design-vue";
import { computed, defineAsyncComponent, reactive, ref } from "vue";
import { Input, Select, Textarea, DatePicker, Button } from "ant-design-vue";
import type { DatePickerProps, UploadProps } from "ant-design-vue";
import { Upload } from "ant-design-vue";
import { isEmpty } from "ramda";
import { createPost, itemLocationType } from "../../api/Post/Post";
import { useRouter } from "vue-router";
import BreadCrumbComp from "../BreadCrumb/BreadCrumbComp.vue";
import { CustomErrorResponse } from "../../api/baseApi";

const mapInfo = reactive<itemLocationType>({
  latitude: null,
  longitude: null,
  locationName: null,
});
const itemName = ref<string>("");
const itemCategory = ref<string>();
const itemDescription = ref<string>("");
const itemDate = ref<string | string[]>();

const LazyLeafletMap = defineAsyncComponent(() => import("./LeafletMap.vue"));

const navigate = useRouter();

const option = ["Handphone", "Laptop", "Dompet", "Lain Lain"].map((d) => {
  return {
    value: d,
  };
});

const fileList = ref<UploadProps["fileList"]>([]);

const handleRemove: UploadProps["onRemove"] = (file) => {
  const index = fileList?.value?.indexOf(file);
  const newFileList = fileList?.value?.slice();
  newFileList?.splice(index as number, 1);
  fileList.value = newFileList;
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const isPNG = file.type === "image/png" || file.type === "image/jpeg";
  if (isPNG) {
    fileList.value = [...(fileList.value || []), file];
    return false;
  } else {
    message.error(`File bukan sebuah gambar`);
    return false || Upload.LIST_IGNORE;
  }
};

const isDisabled = computed(() => {
  return (
    !isEmpty(
      itemName.value &&
        itemCategory.value &&
        itemDescription.value &&
        itemDate.value
    ) &&
    mapInfo.latitude &&
    (fileList.value?.length as number) > 0
  );
});

const handleSubmit = async () => {
  try {
    const newPost = new FormData();
    newPost.append("itemName", itemName.value);
    newPost.append("itemCategory", itemCategory.value as string);
    newPost.append("itemDetail", itemDescription.value);
    newPost.append("itemLostDate", itemDate.value as string);
    newPost.append("itemLatitude", String(mapInfo?.latitude));
    newPost.append("itemLongitude", String(mapInfo?.longitude));
    newPost.append("locationName", mapInfo?.locationName as string);
    if (fileList.value) {
      fileList.value.forEach((v) => {
        // @ts-expect-error V soalnya any
        newPost.append("postImage", v);
      });
    }

    const response = await createPost(newPost);
    if (response) {
      Modal.success({
        title: "Barang Hilang Ditambahkan",
        content: "Barang berhasil ditambahkan",
        centered: true,
        zIndex: 999999,
        onOk: () => {
          navigate.push("/home");
        },
      });
    }
  } catch (err: any) {
    Modal.error({
      title: "Barang Gagal Ditambahkan",
      content: (err as CustomErrorResponse).message,
      centered: true,
      zIndex: 999999,
    });
  }
};

const dateProps = computed<DatePickerProps | { placement?: string }>(() => ({
  format: "YYYY-MM-DD",
  onChange: (_, date) => (itemDate.value = date),
  placement: "bottomRight",
}));

const uploadProps = computed<UploadProps>(() => ({
  listType: "picture",
  beforeUpload: beforeUpload,
  onRemove: handleRemove,
  defaultFileList: fileList.value,
  accept: ".png,.jpeg,.jpg",
}));

const handlePickLocation = (info: itemLocationType) => {
  mapInfo.latitude = info.latitude;
  mapInfo.longitude = info.longitude;
  mapInfo.locationName = info.locationName;
};
</script>

<template>
  <div class="md:ml-16 mt-16 pt-5.5 px-4 sm:px-6 md:px-8">
    <BreadCrumbComp title="Tambah Barang" />
    <div class="flex flex-col h-full mt-2">
      <div class="flex flex-col items-center justify-center gap-6 w-full">
        <div
          class="flex flex-col gap-4 sm:max-w-[800px] border-gray-300 w-full justify-center rounded-md pt-4 p-4 border"
        >
          <Flex vertical class="w-full" gap="8">
            <label for="item" class="text-sm w-full font-semibold"
              >Nama Barang <span class="text-red-500">*</span></label
            >
            <Input placeholder="Nama Barang" v-model:value="itemName" />
          </Flex>
          <Flex vertical class="w-full" gap="8">
            <label for="item" class="text-sm font-semibold w-full"
              >Kategori Barang <span class="text-red-500">*</span></label
            >
            <Select
              placeholder="Pilih Kategori Barang"
              :options="option"
              v-model:value="itemCategory"
            />
          </Flex>
          <Flex vertical class="w-full" gap="8">
            <label for="item" class="text-sm font-semibold w-full"
              >Deskripsi Barang <span class="text-red-500">*</span></label
            >
            <Textarea
              placeholder="Deskripsi Barang"
              v-model:value="itemDescription"
            />
          </Flex>
          <Flex vertical class="w-full" gap="8">
            <label for="item" class="text-sm font-semibold w-full"
              >Tanggal Kehilangan <span class="text-red-500">*</span>
            </label>
            <!-- @vue-ignore -->
            <DatePicker v-bind="dateProps" />
          </Flex>
          <Flex vertical class="w-full" gap="8">
            <label for="item" class="text-sm font-semibold w-full"
              >Foto Barang <span class="text-red-500">*</span></label
            >
            <div class="h-[10vh] overflow-auto">
              <Upload v-bind="uploadProps" multiple>
                <Button>Upload Gambar</Button>
              </Upload>
            </div>
          </Flex>

          <LazyLeafletMap
            :mapInfo="mapInfo"
            @handle-pick-location="handlePickLocation"
          />

          <Flex justify="end">
            <div class="w-max">
              <Button
                type="primary"
                @click="handleSubmit"
                :disabled="!isDisabled"
                >Submit</Button
              >
            </div>
          </Flex>
        </div>
      </div>
    </div>
  </div>
</template>
