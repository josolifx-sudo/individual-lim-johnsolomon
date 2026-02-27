<template>
  <div class="app-shell">
    <AppNavbar />
    <main class="page">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container">
        <div class="footer-row">
          <div class="footer-brand">ShuttleStream</div>          
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppNavbar from "./components/AppNavbar.vue";
</script>