import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null,
    loading: false,
    error: "",
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async register(email, password) {
      this.loading = true;
      this.error = "";
      try {
        // S83 API: POST /users/register
        const res = await api.post("/users/register", { email, password });
        return res.data;
      } catch (err) {
        this.error =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Registration failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = "";
      try {
        // S83 API: POST /users/login
        const res = await api.post("/users/login", { email, password });
        const token = res.data?.access;

        if (!token) throw new Error("No token returned by API");

        this.token = token;
        localStorage.setItem("token", token);

        await this.fetchUser();
      } catch (err) {
        this.error =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        // S83 API: GET /users/details (protected)
        const res = await api.get("/users/details");
        this.user = res.data?.user || null;
      } catch (err) {
        // token invalid, auto logout
        this.logout();
      }
    },

    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
    },
  },
});