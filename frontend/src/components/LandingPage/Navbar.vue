<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import logo from "../../assets/icon.png";
import {
  RollbackOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { Dropdown, Flex, Menu, MenuItem } from "ant-design-vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useNavbarStore } from "../../stores/navbarInfo";
import { useAuthStore } from "../../stores/authStore";

const LazyHamburgerMenu = defineAsyncComponent(
  () => import("../Navbar/HamburgerMenu.vue")
);

type navType = {
  href: string;
  label: string;
};

type GabungType = {
  link: string;
  label: string;
};
const navItems: navType[] = [
  {
    href: "#home",
    label: "Home",
  },
  {
    href: "#layanan",
    label: "Layanan",
  },
  {
    href: "#about",
    label: "Tentang Kami",
  },
  {
    href: "#testimoni",
    label: "Testimoni",
  },
];

const gabungOption: GabungType[] = [
  {
    link: "/login",
    label: "Login",
  },
  {
    link: "/register",
    label: "Daftar",
  },
];

const authNavItems: navType[] = [
  {
    href: "/home",
    label: "Home",
  },
  {
    href: "/add",
    label: "Add",
  },
  {
    href: "/setting",
    label: "Setting",
  },
];

const activeLink = ref<navType["href"]>("#home");
const path = useRoute();
const { isNavbarOpen } = storeToRefs(useNavbarStore());
const navigate = useRouter();
const auth = useAuthStore();
const { authToken } = storeToRefs(auth);
const activeLink2 = ref<GabungType["label"]>();

const navItemFilter = computed<navType[]>(() => {
  if (path.path === "/") {
    return [...navItems];
  } else {
    const newPath = { label: "", href: "" };
    return [newPath];
  }
});

const handleChooseLanding = () => {
  if (isNavbarOpen.value) {
    isNavbarOpen.value = !isNavbarOpen.value;
  }
  if (!authToken.value) {
    navigate.push("/");
  } else {
    navigate.push("/home");
  }
};
const handleChooseNav = (item: navType["href"]) => {
  isNavbarOpen.value = !isNavbarOpen.value;
  activeLink.value = item;
};

const handleChooseNav2 = (item: GabungType["link"] | navType["href"]) => {
  isNavbarOpen.value = !isNavbarOpen.value;
  activeLink2.value = item;
  navigate.push(item);
};

const authNav = computed(() => {
  const notAuth = ["/", "/login", "/register"];
  if (notAuth.find((v) => path.path === v)) {
    return false;
  } else {
    return true;
  }
});

const handleLogout = () => {
  auth.setUserInfo(null);
  auth.setAuthToken(null);
  localStorage.removeItem("authToken");
  navigate.push("/");
};

const handleSetting = () => {
  navigate.push("/setting");
};
</script>

<template>
  <nav
    :class="`fixed top-0 left-0 right-0 ${
      authNav ? 'md:ml-16 bg-white ' : ' bg-white/30'
    } backdrop-blur-md  z-50 border-b border-b-gray-100 shadow-sm `"
  >
    <!--  {/* DESKTOP DESIGN */} -->
    <div
      :class="`w-full ${
        authNav ? '' : 'container'
      }   mx-auto flex items-center justify-between h-16 px-4 sm:px-6 md:px-8 `"
    >
      <!-- {/* LOGO */} -->
      <div
        class="flex items-center gap-2 cursor-pointer"
        @click="handleChooseLanding"
      >
        <div class="size-10">
          <img :src="logo" alt="" class="h-full w-full object-contain" />
        </div>
        <div class="flex items-center text-xl font-bold">
          <span class="text-black">Find</span>
          <span class="text-blue-600">Soed</span>
        </div>
      </div>
      <!-- {/* NAV ITEMS [PC] LANDING PAGE */} -->
      <ul class="hidden md:flex items-center gap-10">
        <li
          v-for="(l, i) in navItemFilter"
          :key="i"
          @click="() => (activeLink = l.href)"
          :class="[
            '!text-sm font-medium relative after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 afer:transition-all',
            activeLink === l.href
              ? 'text-blue-600 after:w-full'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          <a :href="l.href">{{ l.label }}</a>
        </li>
      </ul>

      <!-- /* HAMBURGER MENU */} -->
      <button class="p-2 flex gap-2 items-center">
        <!-- {/* GABUNG SEKARANG */} -->

        <Dropdown v-if="!authNav">
          <template #overlay>
            <Menu>
              <MenuItem>
                <RouterLink to="/login">
                  <div class="flex items-center gap-2">
                    <UserOutlined class="text-xs" />
                    <span class="text-xs">Login</span>
                  </div>
                </RouterLink>
              </MenuItem>
              <MenuItem>
                <RouterLink to="/register">
                  <div class="flex items-center gap-2">
                    <UserAddOutlined class="text-xs" />
                    <span class="text-xs">Daftar</span>
                  </div>
                </RouterLink>
              </MenuItem>
            </Menu>
          </template>
          <div class="hidden md:block">
            <div
              className="hidden md:flex  text-white justify-center items-center  text-xs h-max px-4 py-2  transition duration-300 select-none cursor-pointer rounded-md !bg-blue-600 hover:!bg-blue-700"
            >
              Ayo Gabung
            </div>
          </div>
        </Dropdown>

        <!-- SETING / LOG OUT -->
        <div v-if="authNav">
          <Dropdown placement="bottom">
            <template #overlay>
              <Menu>
                <MenuItem>
                  <div @click="handleSetting">
                    <Flex gap="8" align="center">
                      <SettingOutlined />
                      <span>Settings</span>
                    </Flex>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div @click="handleLogout">
                    <Flex gap="8" align="center">
                      <RollbackOutlined />
                      <span>Logout</span>
                    </Flex>
                  </div>
                </MenuItem>
              </Menu>
            </template>
            <div
              class="flex text-2xl size-[40px] bg-white hover:bg-gray-200 justify-center items-center rounded-md"
            >
              <UserOutlined />
            </div>
          </Dropdown>
        </div>

        <!-- HAMBURGER MENU -->
        <div class="md:hidden !bg-transparent">
          <LazyHamburgerMenu />
        </div>
      </button>
    </div>
    <!-- {/* MOBILE DESIGN */} -->
    <div
      :class="[
        'w-full opacity-20',
        isNavbarOpen ? 'visible h-screen bg-black' : 'invisible  h-0',
      ]"
      @click="() => (isNavbarOpen = !isNavbarOpen)"
    ></div>
    <div
      :class="[
        'fixed top-0 left-0 right-0 mt-16 md:hidden bg-white border-t border-t-gray-400  transition-all duration-300 flex flex-col justify-between px-4',
        isNavbarOpen
          ? 'py-4 h-[50vh] visible opacity-100'
          : 'h-0 py-0 invisible opacity-0',
      ]"
    >
      <div class="container mx-auto flex flex-col justify-between">
        <ul v-if="!authNav && path.path === '/'" class="px-4 space-y-4">
          <li
            v-for="(l, i) in navItems"
            :key="i"
            :class="[
              'block text-sm font-medium py-2',
              activeLink === l.href && path.path === '/'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900',
              'cursor-pointer',
            ]"
            @click="() => handleChooseNav(l.href)"
          >
            <a :href="l.href">{{ l.label }}</a>
          </li>
        </ul>
        <ul v-if="authNav" class="px-4 space-y-4">
          <li
            v-for="(l, i) in authNavItems"
            :key="i"
            :class="[
              'block text-sm font-medium py-2',
              path.path === l.href
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900',
              'cursor-pointer',
            ]"
            @click="() => handleChooseNav2(l.href)"
          >
            {{ l.label }}
          </li>
        </ul>
      </div>
      <ul
        class="container mx-auto px-4 flex justify-between items-center"
        v-if="!authNav && !authToken"
      >
        <li
          v-for="(v, i) in gabungOption"
          :key="`list-${i}`"
          :class="`text-sm font-medium py-2 ${
            path.path === v.link
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          } `"
          @click="() => handleChooseNav2(v.link)"
        >
          {{ v.label }}
        </li>
      </ul>
    </div>
  </nav>
</template>
