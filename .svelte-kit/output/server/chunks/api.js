import { w as writable } from "./index.js";
const token = writable(typeof window !== "undefined" ? sessionStorage.token : null);
if (token) {
  token.subscribe((t) => {
  });
}
