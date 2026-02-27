<template>
    <div class="modal-backdrop" v-if="open" @click.self="emit('close')">
      <div class="modal">
        <div class="modal-head">
          <div class="modal-title">{{ mode === "edit" ? "Update Movie" : "Add Movie" }}</div>
          <button class="icon-btn" @click="emit('close')">✕</button>
        </div>
  
        <form class="form" @submit.prevent="onSubmit">
          <div class="grid">
            <label class="field">
              <span>Title</span>
              <input v-model.trim="form.title" type="text" placeholder="e.g. Spirited Away" required />
            </label>
  
            <label class="field">
              <span>Director</span>
              <input v-model.trim="form.director" type="text" placeholder="e.g. Hayao Miyazaki" required />
            </label>
  
            <label class="field">
              <span>Year</span>
              <input v-model.number="form.year" type="number" min="1900" max="2100" placeholder="2001" required />
            </label>
  
            <label class="field">
              <span>Genre</span>
              <input v-model.trim="form.genre" type="text" placeholder="Animation" required />
            </label>
          </div>
  
          <label class="field">
            <span>Description</span>
            <textarea v-model.trim="form.description" rows="4" placeholder="Write a short synopsis" required></textarea>
          </label>
  
          <div class="form-actions">
            <button class="btn btn-ghost" type="button" @click="emit('close')">Cancel</button>
            <button class="btn btn-primary" type="submit">
              {{ mode === "edit" ? "Save Changes" : "Create Movie" }}
            </button>
          </div>          
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from "vue";
  
  const props = defineProps({
    open: { type: Boolean, default: false },
    mode: { type: String, default: "create" },
    initial: { type: Object, default: null }
  });
  
  const emit = defineEmits(["close", "submit"]);
  
  const form = reactive({
    title: "",
    director: "",
    year: "",
    description: "",
    genre: ""
  });
  
  watch(
    () => props.open,
    (isOpen) => {
      if (!isOpen) return;
      const m = props.initial || {};
      form.title = m.title || "";
      form.director = m.director || "";
      form.year = m.year || "";
      form.description = m.description || "";
      form.genre = m.genre || "";
    }
  );
  
  function onSubmit() {
    emit("submit", {
      title: form.title,
      director: form.director,
      year: form.year,
      description: form.description,
      genre: form.genre
    });
  }
  </script>