import { createApp } from "vue";
import { createPinia } from "pinia";
import AnalyticsDashboard from "./AnalyticsDashboard.vue";

const app = createApp(AnalyticsDashboard);
app.use(createPinia());
app.mount("#app");
