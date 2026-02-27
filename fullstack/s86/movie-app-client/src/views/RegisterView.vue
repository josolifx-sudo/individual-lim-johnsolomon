<template>
    <section class="container auth">
      <div class="hero-card">
        <div class="hero-kicker">CREATE ACCOUNT</div>
        <h1 class="hero-title">Join ShuttleStream</h1>        
      </div>
  
      <div class="panel">
        <h2 class="panel-title">Register</h2>
  
        <form class="form" @submit.prevent="onRegister">
          <label class="field">
            <span>Name</span>
            <input v-model.trim="name" type="text" placeholder="Your name" required />
          </label>
  
          <label class="field">
            <span>Email</span>
            <input v-model.trim="email" type="email" placeholder="name@email.com" required />
          </label>
  
          <label class="field">
            <span>Password</span>
            <input v-model="password" type="password" placeholder="Minimum 6 characters" minlength="6" required />
          </label>
  
          <button class="btn btn-primary btn-full" type="submit" :disabled="loading">
            {{ loading ? "Creating..." : "Create Account" }}
          </button>
  
          <p class="msg" v-if="msg" :class="ok ? 'ok' : 'bad'">{{ msg }}</p>
  
          <p class="small">
            Already have an account?
            <router-link to="/login" class="link">Login</router-link>
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
  
  const name = ref("");
  const email = ref("");
  const password = ref("");
  
  const loading = ref(false);
  const msg = ref("");
  const ok = ref(false);
  
  async function onRegister() {
    msg.value = "";
    ok.value = false;
    loading.value = true;
  
    try {
      await auth.register({ name: name.value, email: email.value, password: password.value });
      ok.value = true;
      msg.value = "Registered successfully. You can login now.";
      setTimeout(() => router.push("/login"), 700);
    } catch (err) {
      msg.value = err?.response?.data?.message || "Registration failed.";
      ok.value = false;
    } finally {
      loading.value = false;
    }
  }
  </script>