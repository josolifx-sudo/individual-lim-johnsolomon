<script setup>
import AppNavbar from './components/AppNavbar.vue'
import LandingSection from './components/LandingSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ToolsSection from './components/ToolsSection.vue'
import ContactSection from './components/ContactSection.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <AppNavbar />

  <main>
    <LandingSection />
    <ProjectsSection />
    <ToolsSection />
    <ContactSection />
  </main>

  <AppFooter />
</template>
