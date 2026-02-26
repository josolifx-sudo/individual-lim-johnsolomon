import { defineStore } from "pinia";
import api from "../api/axios";

export const useWorkoutsStore = defineStore("workouts", {
  state: () => ({
    workouts: [],
    loading: false,
    error: "",
  }),

  getters: {
    totalCount: (state) => state.workouts.length,
    completedCount: (state) =>
      state.workouts.filter((w) => w.status === "completed").length,
    pendingCount: (state) =>
      state.workouts.filter((w) => w.status !== "completed").length,
    completionRate: (state) => {
      const total = state.workouts.length;
      if (!total) return 0;
      const done = state.workouts.filter((w) => w.status === "completed").length;
      return Math.round((done / total) * 100);
    },
  },

  actions: {
    async fetchMyWorkouts() {
      this.loading = true;
      this.error = "";
      try {
        // S83 API: GET /workouts/getMyWorkouts (protected)
        const res = await api.get("/workouts/getMyWorkouts");
        this.workouts = res.data?.workouts || [];
      } catch (err) {
        this.error = err?.response?.data?.error || "Failed to fetch workouts";
      } finally {
        this.loading = false;
      }
    },

    async addWorkout(name, duration) {
      this.error = "";
      try {
        // S83 API: POST /workouts/addWorkout (protected)
        const res = await api.post("/workouts/addWorkout", { name, duration });
        // add to top (newest)
        this.workouts = [res.data, ...this.workouts];
      } catch (err) {
        this.error = err?.response?.data?.error || "Failed to add workout";
        throw err;
      }
    },

    async completeWorkout(id) {
      this.error = "";
      try {
        // S83 API: PATCH /workouts/completeWorkoutStatus/:id
        const res = await api.patch(`/workouts/completeWorkoutStatus/${id}`);
        const updated = res.data?.updatedWorkout;

        if (updated?._id) {
          this.workouts = this.workouts.map((w) => (w._id === id ? updated : w));
        } else {
          // fallback: refetch if API shape changes
          await this.fetchMyWorkouts();
        }
      } catch (err) {
        this.error = err?.response?.data?.error || "Failed to complete workout";
      }
    },

    async deleteWorkout(id) {
      this.error = "";
      try {
        // S83 API: DELETE /workouts/deleteWorkout/:id
        await api.delete(`/workouts/deleteWorkout/${id}`);
        this.workouts = this.workouts.filter((w) => w._id !== id);
      } catch (err) {
        this.error = err?.response?.data?.error || "Failed to delete workout";
      }
    },
  },
});