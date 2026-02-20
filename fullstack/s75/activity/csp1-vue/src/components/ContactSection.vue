<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const name = ref("");
const email = ref("");
const message = ref("");

const status = ref("");
const isSubmitting = ref(false);

const recaptchaToken = ref("");
const widgetId = ref(null);
const captchaEl = ref(null);

function loadRecaptchaScript() {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) return resolve();

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(script);
  });
}

function renderCaptcha() {
  if (!window.grecaptcha || !captchaEl.value) return;

  widgetId.value = window.grecaptcha.render(captchaEl.value, {
    sitekey: siteKey,
    callback: (token) => {
      recaptchaToken.value = token;
    },
    "expired-callback": () => {
      recaptchaToken.value = "";
    },
    "error-callback": () => {
      recaptchaToken.value = "";
    }
  });
}

function resetCaptcha() {
  if (window.grecaptcha && widgetId.value !== null) {
    window.grecaptcha.reset(widgetId.value);
  }
  recaptchaToken.value = "";
}

onMounted(async () => {
  if (!siteKey) {
    console.warn("Missing VITE_RECAPTCHA_SITE_KEY");
    return;
  }
  await loadRecaptchaScript();
  renderCaptcha();
});

onBeforeUnmount(() => {
  // optional cleanup, grecaptcha has no official destroy API
});

async function verifyCaptchaServerSide() {
  const res = await fetch("/api/verify-recaptcha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: recaptchaToken.value })
  });

  const data = await res.json();
  return !!data.success;
}

async function submitForm() {
  status.value = "";
  isSubmitting.value = true;

  try {
    if (!recaptchaToken.value) {
      status.value = "Please complete the reCAPTCHA checkbox.";
      isSubmitting.value = false;
      return;
    }

    const verified = await verifyCaptchaServerSide();
    if (!verified) {
      status.value = "reCAPTCHA verification failed. Please try again.";
      resetCaptcha();
      isSubmitting.value = false;
      return;
    }

    const payload = {
      access_key: accessKey,
      name: name.value,
      email: email.value,
      message: message.value
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      status.value = data.message || "Message sent.";
      name.value = "";
      email.value = "";
      message.value = "";
    } else {
      status.value = data.message || "Submission failed.";
    }

    resetCaptcha();
  } catch (err) {
    status.value = "Something went wrong.";
    resetCaptcha();
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section id="contact">
    <form @submit.prevent="submitForm">
      <input v-model="name" type="text" name="name" placeholder="Name" required />
      <input v-model="email" type="email" name="email" placeholder="Email" required />
      <textarea v-model="message" name="message" placeholder="Message" required />

      <!-- reCAPTCHA checkbox -->
      <div ref="captchaEl"></div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Sending..." : "Send" }}
      </button>

      <p v-if="status">{{ status }}</p>
    </form>
  </section>
</template>