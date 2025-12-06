<script setup lang="ts">
import { Tabs, TabPane } from "ant-design-vue";
import PersonalisationSettings from "./PersonalisationSettings.vue";
import HistorySettings from "./HistorySettings.vue";
import BreadCrumbComp from "../BreadCrumb/BreadCrumbComp.vue";
</script>

<template>
  <div class="md:ml-16 mt-16 pt-5.5 px-4 sm:px-6 md:px-8 w-full">
    <BreadCrumbComp title="Pengaturan" />
    <div class="flex flex-col h-full w-full">
      <div class="h-full flex flex-col w-full" justify="center">
        <Tabs>
          <TabPane key="2" tab="Personalisasi Akun">
            <PersonalisationSettings />
          </TabPane>
          <TabPane key="1" tab="Daftar Barang">
            <HistorySettings />
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
