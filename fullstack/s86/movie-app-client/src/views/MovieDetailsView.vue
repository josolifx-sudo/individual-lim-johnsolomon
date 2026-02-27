<template>
    <section class="container">
      <div class="panel" v-if="loading">
        <p class="msg">Loading movie...</p>
      </div>
  
      <div class="panel" v-else>
        <div class="details-top">
          <div class="details-poster">
            <div class="poster-badge">{{ movie.genre || "Movie" }}</div>
            <div class="poster-title">{{ movie.title }}</div>
          </div>
  
          <div class="details-info">
            <h1 class="details-title">{{ movie.title }}</h1>
  
            <div class="details-meta">
              <div class="meta-chip"><span class="label">Director</span> {{ movie.director }}</div>
              <div class="meta-chip"><span class="label">Year</span> {{ movie.year }}</div>
              <div class="meta-chip"><span class="label">Genre</span> {{ movie.genre }}</div>
            </div>
  
            <p class="details-desc">{{ movie.description }}</p>
  
            <div class="details-actions">
              <router-link to="/movies" class="btn btn-ghost">Back to Movies</router-link>
            </div>
          </div>
        </div>
  
        <div class="divider"></div>
  
        <div class="comments">
          <h2 class="section-title">Comments</h2>
  
          <form class="comment-form" @submit.prevent="onAddComment">
            <input
              v-model.trim="comment"
              class="input"
              type="text"
              placeholder="Write a comment"
              required
            />
            <button id="addComment" class="btn btn-primary" type="submit" :disabled="saving">
              {{ saving ? "Adding..." : "Add Comment" }}
            </button>
          </form>
  
          <p class="msg bad" v-if="error">{{ error }}</p>
  
          <div class="comment-list">
            <div class="comment" v-for="(c, idx) in comments" :key="idx">
              <div class="comment-head">
                <span class="comment-user">User</span>
                <span class="comment-id muted">#{{ idx + 1 }}</span>
              </div>
              <div class="comment-body">{{ c.comment }}</div>
            </div>
  
            <p class="small muted" v-if="comments.length === 0">
              No comments yet. Be the first.
            </p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useMoviesStore } from "../stores/movies";
  
  const route = useRoute();
  const movies = useMoviesStore();
  
  const movie = ref({});
  const comments = ref([]);
  
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");
  const comment = ref("");
  
  async function load() {
    loading.value = true;
    error.value = "";
    try {
      const id = route.params.id;
      movie.value = await movies.fetchMovieById(id);
      comments.value = await movies.getComments(id);
    } catch (err) {
      error.value = err?.response?.data?.message || "Failed to load movie.";
    } finally {
      loading.value = false;
    }
  }
  
  onMounted(load);
  
  async function onAddComment() {
    saving.value = true;
    error.value = "";
    try {
      await movies.addComment(route.params.id, comment.value);
      comment.value = "";
      comments.value = await movies.getComments(route.params.id);
    } catch (err) {
      error.value = err?.response?.data?.message || "Failed to add comment.";
    } finally {
      saving.value = false;
    }
  }
  </script>