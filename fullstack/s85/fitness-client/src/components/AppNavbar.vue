<template>
  <nav class="navbar navbar-expand-lg navbar-light navbar-glass sticky-top">
    <div class="container py-2">
      <router-link class="navbar-brand fw-bold" to="/workouts">
        WhateverFitness        
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li v-if="!auth.isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="!auth.isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>

          <li v-if="auth.isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/workouts">Workouts</router-link>
          </li>

          <li v-if="auth.isLoggedIn" class="nav-item">
            <span class="nav-link small-muted">
              {{ auth.user?.email || "Logged In" }}
            </span>
          </li>

          <li v-if="auth.isLoggedIn" class="nav-item">
            <button class="btn btn-sm btn-danger ms-2" @click="doLogout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function doLogout() {
  auth.logout();
  router.push("/login");
}
</script>