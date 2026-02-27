import { defineStore } from "pinia";
import axios from "../api/axios";

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("movieapp_token") || "",
    user: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => !!state.user?.isAdmin
  },

  actions: {
    hydrate() {
      if (!this.token) return;

      const decoded = parseJwt(this.token);
      if (!decoded?.id) {
        this.logout();
        return;
      }

      this.user = {
        id: decoded.id,
        isAdmin: !!decoded.isAdmin
      };
    },

    async register({ name, email, password }) {
      const res = await axios.post("/users/register", {
        email,
        password
      });
      return res.data;
    },

    async login({ email, password }) {
      const res = await axios.post("/users/login", {
        email,
        password
      });

      if (res.data?.access) {
        this.token = res.data.access;
        localStorage.setItem("movieapp_token", this.token);
        this.hydrate();
      }

      return res.data;
    },

    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("movieapp_token");
    }
  }
});