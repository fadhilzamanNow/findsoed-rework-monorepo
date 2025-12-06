<script setup lang="ts">
import { LeafletMouseEvent, Map, Marker } from "leaflet";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import leaflet from "leaflet";
import MarkerPic from "../../assets/marker.png";
import { Flex, Input, InputProps } from "ant-design-vue";
import { ChangeEvent } from "ant-design-vue/es/_util/EventInterface";
import { debounce } from "lodash";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { getMatchLocation } from "../../api/Location/Location";

// @ts-expect-error Type declaration belum ada untuk ini
import("leaflet/dist/leaflet.css");

const emit = defineEmits<{
  (e: "handlePickLocation", info: itemLocationType): void;
}>();

type itemLocationType = {
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
};

const { mapInfo } = defineProps<{ mapInfo: itemLocationType }>();

const myMap = ref<Map | null>(null);
const myMarker = ref<Marker | null>(null);
const searchMap = ref("");
const searchResult = ref<itemLocationType[] | null>([]);
const showSearhResult = ref(false);

const mapRef = useTemplateRef("leafletMap");

onMounted(() => {
  if (mapRef.value) {
    myMap.value = leaflet
      .map(mapRef.value, { zoomControl: false })
      .setView([-7.428846146037751, 109.34005811432314], 10);
    const customMarker = leaflet.icon({
      iconUrl: MarkerPic,
      iconSize: [35, 35],
    });
    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(myMap.value as Map);

    myMarker.value = leaflet
      .marker([-7.397339842404089, 109.35116941228598], {
        icon: customMarker,
        draggable: false,
      })
      .addTo(myMap.value as Map);
    leaflet.control.zoom({ position: "bottomright" }).addTo(myMap.value as Map);

    myMap.value?.on("click", (e: LeafletMouseEvent) => {
      if (myMarker.value) {
        myMarker.value.setLatLng({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        emit("handlePickLocation", {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          locationName: null,
        });
      }
    });
  }
});

const findMap = async () => {
  showSearhResult.value = true;
  searchResult.value = null;
  const response = await getMatchLocation(searchMap.value);
  if (response) {
    searchResult.value = response.data;
  }
};

const debounceSearch = debounce(() => {
  if (searchMap.value.length > 0) {
    findMap();
  }
}, 1000);

const handleSearch = (search: string) => {
  searchMap.value = search;
  debounceSearch();
};

//@ts-ignore
const inputMapProps = computed<InputProps>(() => ({
  placeholder: mapInfo.locationName
    ? mapInfo.locationName
    : mapInfo.latitude && mapInfo.longitude
    ? `${mapInfo.latitude},${mapInfo.longitude}`
    : "Cari Lokasi",
  onInput: (e: ChangeEvent) =>
    handleSearch((e.target as HTMLInputElement).value),
  value: searchMap.value,
}));

const handleChooseMap = (data: itemLocationType) => {
  emit("handlePickLocation", {
    latitude: data.latitude,
    longitude: data.longitude,
    locationName: data.locationName,
  });

  myMarker.value?.setLatLng({
    lat: data.latitude as number,
    lng: data.longitude as number,
  });

  myMap.value
    ?.setView({
      lat: data.latitude as number,
      lng: data.longitude as number,
    })
    .getZoom();
  searchMap.value = "";
  showSearhResult.value = !showSearhResult.value;
};
</script>

<template>
  <Flex vertical class="w-full" gap="8">
    <label for="item" class="text-sm font-semibold w-full"
      >Lokasi Kehilangan <span class="text-red-500">*</span></label
    >
    <div class="w-full h-[20vh] relative">
      <div class="absolute z-[2] top-0 left-0 mt-1 ml-2">
        <div class="w-[250px] md:w-[350px]">
          <div class="relative h-max">
            <div>
              <Input.Search
                class="relative z-[2]"
                enter-button
                v-bind="inputMapProps"
              />
            </div>
            <div
              class="max-h-[10vh] bg-white rounded-md p-2 flex flex-col overflow-auto text-xs"
              v-if="searchMap.length > 0 && showSearhResult"
            >
              <div v-if="searchResult">
                <div v-if="searchResult.length > 0">
                  <div
                    v-for="(v, i) of searchResult"
                    class="hover:bg-slate-100 bg-white transition-all duration-100 ease-in p-1 rounded-md cursor-pointer"
                    :key="i"
                    @click="handleChooseMap(v)"
                  >
                    {{ v.locationName }}
                  </div>
                </div>
                <div v-else>
                  <div class="flex flex-col justify-center items-center">
                    Lokasi yang kamu cari tidak tersedia
                  </div>
                </div>
              </div>
              <div v-else class="flex justify-center">
                <LoadingOutlined />
              </div>
            </div>
          </div>
          <div
            v-if="false"
            class="h-[120px] bg-white overflow-y-scroll p-2"
          ></div>
        </div>
      </div>
      <div
        ref="leafletMap"
        id="map"
        class="w-full h-full rounded-md z-[1]"
      ></div>
    </div>
  </Flex>
</template>
