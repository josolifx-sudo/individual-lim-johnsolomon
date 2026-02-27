<template>
    <section class="container">
      <div class="page-hero">
        <div class="page-hero-left">
          <div class="hero-kicker">MOVIE CATALOG</div>
          <h1 class="page-title">Browse something to watch</h1>  
          <div class="hero-actions">
            <button class="btn btn-ghost" @click="movies.fetchMovies()" :disabled="movies.loading">
              Refresh
            </button>
  
            <button
              v-if="auth.isAdmin"
              id="addMovie"
              class="btn btn-primary"
              @click="openCreate"
            >
              Add Movie
            </button>
          </div>
        </div>
  
        <div class="page-hero-right">
          <div class="mini-stats">
            <div class="stat">
              <div class="stat-num">{{ movies.movies.length }}</div>
              <div class="stat-label">Titles</div>
            </div>
            <div class="stat">
              <div class="stat-num">{{ auth.isLoggedIn ? (auth.isAdmin ? "Admin" : "User") : "Guest" }}</div>
              <div class="stat-label">Mode</div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="panel">
        <div class="toolbar">
          <input
            v-model.trim="q"
            class="input"
            type="text"
            placeholder="Search title or director"
          />
  
          <select v-model="genre" class="select">
            <option v-for="g in movies.genres" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
  
        <p class="msg bad" v-if="movies.error">{{ movies.error }}</p>
        <p class="msg" v-if="movies.loading">Loading movies...</p>
  
        <template v-if="auth.isAdmin">
          <div class="admin-wrap">
            <h2 class="section-title">Admin Dashboard</h2>
  
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Director</th>
                    <th>Year</th>
                    <th>Genre</th>
                    <th class="th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in filtered" :key="m._id">
                    <td>{{ m.title }}</td>
                    <td>{{ m.director }}</td>
                    <td>{{ m.year }}</td>
                    <td>{{ m.genre }}</td>
                    <td class="td-actions">
                      <button class="btn btn-ghost btn-sm" @click="openEdit(m)">Update</button>
                      <button class="btn btn-danger btn-sm" @click="onDelete(m)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
  
        <h2 class="section-title" v-if="!auth.isAdmin">Now Streaming</h2>
  
        <div class="grid-cards">
          <MovieCard v-for="m in filtered" :key="m._id" :movie="m" />
        </div>
      </div>
  
      <MovieFormModal
        :open="modalOpen"
        :mode="modalMode"
        :initial="activeMovie"
        @close="closeModal"
        @submit="onSubmitMovie"
      />
    </section>
  </template>
  
  <script setup>
  import { computed, onMounted, ref } from "vue";
  import { useAuthStore } from "../stores/auth";
  import { useMoviesStore } from "../stores/movies";
  import MovieCard from "../components/MovieCard.vue";
  import MovieFormModal from "../components/MovieFormModal.vue";
  
  const auth = useAuthStore();
  const movies = useMoviesStore();
  
  auth.hydrate();
  
  const q = ref("");
  const genre = ref("All");
  
  const modalOpen = ref(false);
  const modalMode = ref("create");
  const activeMovie = ref(null);
  
  onMounted(async () => {
    await movies.fetchMovies();
  });
  
  const filtered = computed(() => {
    const query = q.value.toLowerCase();
    return movies.movies.filter((m) => {
      const matchesQuery =
        !query ||
        (m.title || "").toLowerCase().includes(query) ||
        (m.director || "").toLowerCase().includes(query);
  
      const matchesGenre = genre.value === "All" || m.genre === genre.value;
  
      return matchesQuery && matchesGenre;
    });
  });
  
  function openCreate() {
    modalMode.value = "create";
    activeMovie.value = null;
    modalOpen.value = true;
  }
  
  function openEdit(movie) {
    modalMode.value = "edit";
    activeMovie.value = movie;
    modalOpen.value = true;
  }
  
  function closeModal() {
    modalOpen.value = false;
  }
  
  async function onSubmitMovie(payload) {
    try {
      if (modalMode.value === "edit" && activeMovie.value?._id) {
        await movies.updateMovie(activeMovie.value._id, payload);
      } else {
        await movies.addMovie(payload);
      }
      closeModal();
      await movies.fetchMovies();
    } catch (err) {
      alert(err?.response?.data?.message || "Action failed.");
    }
  }
  
  async function onDelete(movie) {
    const ok = confirm(`Delete "${movie.title}"?`);
    if (!ok) return;
  
    try {
      await movies.deleteMovie(movie._id);
      await movies.fetchMovies();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed.");
    }
  }
  </script>