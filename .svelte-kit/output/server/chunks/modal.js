import { w as writable } from "./index.js";
const modalStore = writable({
  open: false,
  title: "",
  content: "",
  component: null,
  autoclose: false,
  outsideclose: false,
  size: "md",
  toggle() {
    modalStore.update((x) => {
      x.open = !x.open;
      return x;
    });
  },
  registerConfig(config) {
    modalStore.update((x) => {
      x.content = "";
      x.component = null;
      Object.keys(config).forEach((key) => {
        if (config[key] !== void 0) {
          x[key] = config[key];
        }
      });
      return x;
    });
  }
});
export {
  modalStore as m
};
