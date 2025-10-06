import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice';
import "./assets/style.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".dark",
      lightModeSelector: ".light",
    },
  },
});
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.mount("#app");
