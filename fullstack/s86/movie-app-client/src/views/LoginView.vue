<template>
    <section class="container auth">
      <div class="hero-card">
        <div class="hero-kicker">WELCOME BACK</div>
        <h1 class="hero-title">Login to ShuttleStream</h1>        
      </div>
  
      <div class="panel">
        <h2 class="panel-title">Login</h2>
  
        <form class="form" @submit.prevent="onLogin">
          <label class="field">
            <span>Email</span>
            <input v-model.trim="email" type="email" placeholder="name@email.com" required />
          </label>
  
          <label class="field">
            <span>Password</span>
            <input v-model="password" type="password" placeholder="Your password" required />
          </label>
  
          <button class="btn btn-primary btn-full" type="submit" :disabled="loading">
            {{ loading ? "Logging in..." : "Login" }}
          </button>
  
          <p class="msg" v-if="msg" :class="ok ? 'ok' : 'bad'">{{ msg }}</p>
  
          <p class="small">
            No account yet?
            <router-link to="/register" class="link">Register</router-link>
          </p>
        </form>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useAuthStore } from "../stores/auth";
  import { useRouter } from "vue-router";
  
  const auth = useAuthStore();
  const router = useRouter();
  
  const email = ref("");
  const password = ref("");
  
  const loading = ref(false);
  const msg = ref("");
  const ok = ref(false);
  
  async function onLogin() {
    msg.value = "";
    ok.value = false;
    loading.value = true;
  
    try {
      const res = await auth.login({ email: email.value, password: password.value });
      if (res?.access) {
        ok.value = true;
        msg.value = "Login successful.";
        setTimeout(() => router.push("/movies"), 400);
      } else {
        msg.value = "Login failed.";
      }
    } catch (err) {
      msg.value = err?.response?.data?.message || "Login failed.";
    } finally {
      loading.value = false;
    }
  }
  </script>