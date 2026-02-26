<template>
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">
        <div class="card card-glass">
          <div class="card-body p-4">
            <h3 class="mb-2">Create Account</h3>
            <p class="small-muted mb-4">Register to start logging your workouts.</p>
  
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
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  minlength="8"
                  required
                />
                <div class="form-text text-light opacity-75">
                  Must be at least 8 characters (API rule).
                </div>
              </div>
  
              <button class="btn btn-accent w-100" :disabled="auth.loading">
                {{ auth.loading ? "Creating..." : "Register" }}
              </button>
            </form>
  
            <div class="mt-3 small-muted">
              Already have an account?
              <router-link to="/login">Login</router-link>
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
      await auth.register(email.value, password.value);
      router.push("/login");
    } catch {
      // error already stored in auth.error
    }
  }
  </script>