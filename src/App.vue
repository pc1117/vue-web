<template>
  <a-layout class="my-layout">
    <a-layout-sider :collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu
        :selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @select="menuChange"
      >
        <a-menu-item v-for="item in routers" :key="item.path">
          <router-link :to="item.path">{{ item.name }}</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="collapsedHandle"
        />
        <menu-fold-outlined v-else class="trigger" @click="collapsedHandle" />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '8px',
          padding: '16px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import router from "./router";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { RouteRecordRaw } from "vue-router";

export default defineComponent({
  components: {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  props: {},
  setup() {
    const collapsed = ref<boolean>(false);
    const activeSelected = router.options.history.location;
    const selectedKeys = ref<Array<string>>([activeSelected]);
    return {
      routers: ref<Array<RouteRecordRaw>>(router.getRoutes()),
      selectedKeys,
      collapsed,
      collapsedHandle: () => (collapsed.value = !collapsed.value),
      menuChange: ({ key }: any) => {
        selectedKeys.value = [key];
      },
    };
  },
});
</script>

<style>
#app {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}

.my-layout .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s;
}

.my-layout .trigger:hover {
  color: #1890ff;
}

.my-layout .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
