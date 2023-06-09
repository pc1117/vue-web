import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import store, { key } from './store'
import './mock';

createApp(App).use(router).use(Antd).use(store, key).mount("#app");
