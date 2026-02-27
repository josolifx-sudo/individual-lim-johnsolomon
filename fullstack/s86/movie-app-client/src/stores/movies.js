import { defineStore } from "pinia";
import axios from "../api/axios";

export const useMoviesStore = defineStore("movies", {
  state: () => ({
    movies: [],
    loading: false,
    error: ""
  }),

  getters: {
    genres(state) {
      const set = new Set(state.movies.map((m) => m.genre).filter(Boolean));
      return ["All", ...Array.from(set)];
    }
  },

  actions: {
    async fetchMovies() {
      this.loading = true;
      this.error = "";

      try {
        const res = await axios.get("/movies/getMovies");
        this.movies = res.data?.movies || [];
      } catch (err) {
        this.error = err?.response?.data?.message || "Failed to load movies";
      } finally {
        this.loading = false;
      }
    },

    async fetchMovieById(id) {
      const res = await axios.get(`/movies/getMovie/${id}`);
      return res.data;
    },

    async addMovie(payload) {
      const res = await axios.post("/movies/addMovie", payload);
      return res.data;
    },

    async updateMovie(id, payload) {
      const res = await axios.patch(`/movies/updateMovie/${id}`, payload);
      return res.data;
    },

    async deleteMovie(id) {
      const res = await axios.delete(`/movies/deleteMovie/${id}`);
      return res.data;
    },

    async addComment(movieId, comment) {
      const res = await axios.patch(`/movies/addComment/${movieId}`, {
        comment
      });
      return res.data;
    },

    async getComments(movieId) {
      const res = await axios.get(`/movies/getComments/${movieId}`);
      return res.data?.comments || [];
    }
  }
});