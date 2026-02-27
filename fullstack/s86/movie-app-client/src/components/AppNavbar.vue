<template>
    <header class="nav">
      <div class="container nav-row">
        <router-link to="/movies" class="brand">
          <span class="brand-dot"></span>
          <span>StreamBox</span>
        </router-link>
  
        <nav class="nav-links">
          <router-link to="/movies" class="nav-link">Movies</router-link>
  
          <template v-if="!auth.isLoggedIn">
            <router-link to="/register" class="btn btn-ghost">Register</router-link>
            <router-link to="/login" class="btn btn-primary">Login</router-link>
          </template>
  
          <template v-else>
            <span class="pill" :class="auth.isAdmin ? 'pill-admin' : 'pill-user'">
              {{ auth.isAdmin ? "Admin" : "User" }}
            </span>
            <button class="btn btn-danger" @click="onLogout">Logout</button>
          </template>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup>
  import { useAuthStore } from "../stores/auth";
  import { useRouter } from "vue-router";
  
  const auth = useAuthStore();
  const router = useRouter();
  
  auth.hydrate();
  
  function onLogout() {
    auth.logout();
    router.push("/login");
  }
  </script>