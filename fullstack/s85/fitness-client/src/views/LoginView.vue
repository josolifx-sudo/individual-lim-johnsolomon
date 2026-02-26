<template>
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">
        <div class="card card-glass">
          <div class="card-body p-4">
            <h3 class="mb-2">Welcome Back</h3>
            <p class="small-muted mb-4">Login to track your progress.</p>
  
            <div v-if="auth.error" class="alert alert-danger">
              {{ auth.error }}
            </div>
  
            <form @submit.prevent="submit">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" required />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control" required />
              </div>
  
              <button class="btn btn-accent w-100" :disabled="auth.loading">
                {{ auth.loading ? "Logging in..." : "Login" }}
              </button>
            </form>
  
            <div class="mt-3 small-muted">
              No account yet?
              <router-link to="/register">Register</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../stores/auth";
  
  const auth = useAuthStore();
  const router = useRouter();
  
  const email = ref("");
  const password = ref("");
  
  async function submit() {
    try {
      await auth.login(email.value, password.value);
      router.push("/workouts");
    } catch {
      // error already stored in auth.error
    }
  }
  </script>