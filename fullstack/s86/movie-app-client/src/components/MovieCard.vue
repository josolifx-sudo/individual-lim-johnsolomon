<template>
    <article class="card">
      <div class="card-poster">
        <div class="poster-badge">{{ movie.genre || "Movie" }}</div>
        <div class="poster-title">{{ movie.title }}</div>
      </div>
  
      <div class="card-body">
        <div class="meta">
          <div class="meta-line"><span class="label">Director</span> {{ movie.director }}</div>
          <div class="meta-line"><span class="label">Year</span> {{ movie.year }}</div>
        </div>
  
        <p class="desc">
          {{ shortDesc }}
        </p>
  
        <div class="card-actions">
          <router-link
            :to="`/movies/${movie._id}`"
            class="btn btn-primary"
          >
            View Movie
          </router-link>
        </div>
      </div>
    </article>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const props = defineProps({
    movie: { type: Object, required: true }
  });
  
  const shortDesc = computed(() => {
    const t = props.movie.description || "";
    return t.length > 120 ? t.slice(0, 120) + "..." : t;
  });
  </script>