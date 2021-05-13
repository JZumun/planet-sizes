import { createApp } from "vue";
import { createMetaManager } from "vue-meta";
import App from "./App.vue";

createApp(App).use(createMetaManager()).mount("#app");
