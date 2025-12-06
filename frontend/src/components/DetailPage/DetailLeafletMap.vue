<script setup lang="ts">
import { Map, Marker } from "leaflet";
import { onMounted, ref, useTemplateRef, watchEffect } from "vue";
import leaflet from "leaflet";
import MarkerPic from "../../assets/marker.png";
import { SkeletonInput } from "ant-design-vue";

import { getReverseLocation } from "../../api/Location/Location";

// @ts-expect-error Type declaration buat ini gak ada
import("leaflet/dist/leaflet.css");

type itemLocationType = {
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
};

const { latitude, longitude, locationName } = defineProps<itemLocationType>();

/* const mapInfo = toRefs(map);
 */
const myMap = ref<Map | null>(null);
const myMarker = ref<Marker | null>(null);
const newLocationName = ref("ad");

const mapRef = useTemplateRef("leafletMap");
const isReverseSent = ref(true);

onMounted(() => {
  if (mapRef.value) {
    myMap.value = leaflet
      .map(mapRef.value, { zoomControl: false })
      .setView(
        [
          latitude ? latitude : -7.428846146037751,
          longitude ? longitude : 109.34005811432314,
        ],
        10
      );
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
      .marker(
        [
          latitude ? latitude : -7.397339842404089,
          longitude ? longitude : 109.35116941228598,
        ],
        {
          icon: customMarker,
          draggable: false,
        }
      )
      .addTo(myMap.value as Map);
    leaflet.control.zoom({ position: "bottomright" }).addTo(myMap.value as Map);
  }
  watchEffect(() => {
    if (!locationName) {
      findReverseInfo();
    }
  });
});

const findReverseInfo = async () => {
  try {
    if (latitude && longitude) {
      const response = await getReverseLocation(latitude, longitude);
      if (response) {
        isReverseSent.value = false;
        console.log("isi response : ", response.data);
        newLocationName.value = response.data;
      }
    }
  } catch (e) {
    console.log("Terdapat kesalahan");
  }
};
</script>

<template>
  <Flex vertical class="w-full" gap="8">
    <div class="grid grid-cols-2 my-2 gap-8">
      <Flex vertical gap="4">
        <h1 class="text-xs font-medium">Lokasi</h1>
        <span v-if="locationName" class="font-light text-xs">{{
          locationName
        }}</span>
        <span v-else class="font-light text-xs">
          <span v-if="!isReverseSent">{{ newLocationName }}</span>
          <SkeletonInput v-else active />
        </span>
      </Flex>
      <Flex vertical gap="4">
        <h1 class="text-xs font-medium">Koordinat</h1>
        <span class="font-light text-xs overflow-x-hidden">
          <span v-if="!isReverseSent">{{ latitude }},{{ longitude }}</span>
          <SkeletonInput v-else active />
        </span>
      </Flex>
    </div>
    <div class="w-full h-[20vh] relative">
      <div
        ref="leafletMap"
        id="map"
        class="w-full h-full rounded-md z-[1]"
      ></div>
    </div>
  </Flex>
</template>
