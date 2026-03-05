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

function resetCaptcha() {
  if (window.grecaptcha && widgetId.value !== null) {
    window.grecaptcha.reset(widgetId.value);
  }
  recaptchaToken.value = "";
}

function renderCaptcha() {
  if (!window.grecaptcha || !captchaEl.value) return;

  widgetId.value = window.grecaptcha.render(captchaEl.value, {
    sitekey: siteKey,
    callback: (token) => (recaptchaToken.value = token),
    "expired-callback": () => (recaptchaToken.value = ""),
    "error-callback": () => (recaptchaToken.value = "")
  });
}

function loadRecaptchaV2() {
  return new Promise((resolve, reject) => {
    // if already loaded and has render, we’re good
    if (window.grecaptcha?.render) return resolve();

    // define the global callback that Google will call
    window.onRecaptchaLoad = () => resolve();

    // avoid injecting twice
    if (document.querySelector('script[data-recaptcha="v2"]')) return;

    const script = document.createElement("script");
    script.dataset.recaptcha = "v2";
    script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA v2 script"));
    document.head.appendChild(script);
  });
}

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
  } catch (e) {
    status.value = "Something went wrong.";
    resetCaptcha();
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  if (!siteKey) {
    console.warn("Missing VITE_RECAPTCHA_SITE_KEY");
    return;
  }

  await loadRecaptchaV2();
  renderCaptcha();
});

onBeforeUnmount(() => {
  // cleanup global callback reference (optional)
  if (window.onRecaptchaLoad) delete window.onRecaptchaLoad;
});
</script>

<template>
  <section id="contact" class="contact">
    <div class="contactWrap">
      <div class="contactHeader">
        <h2 class="contactTitle">Contact</h2>
        <p class="contactSubtitle">Send me a message and I will get back to you.</p>
      </div>

      <div class="contactCard">
        <form class="contactForm" @submit.prevent="submitForm">
          <div class="formGrid">
            <div class="field">
              <label class="label" for="contact-name">Name</label>
              <input
                id="contact-name"
                v-model="name"
                type="text"
                name="name"
                class="input"
                placeholder="Your name"
                required
              />
            </div>

            <div class="field">
              <label class="label" for="contact-email">Email</label>
              <input
                id="contact-email"
                v-model="email"
                type="email"
                name="email"
                class="input"
                placeholder="you@email.com"
                required
              />
            </div>

            <div class="field fieldFull">
              <label class="label" for="contact-message">Message</label>
              <textarea
                id="contact-message"
                v-model="message"
                name="message"
                class="textarea"
                placeholder="Write your message here"
                required
              />
            </div>

            <div class="field fieldFull">
              <div class="recaptchaRow">
                <div class="recaptchaBox">
                  <div ref="captchaEl"></div>
                </div>

                <button class="btn" type="submit" :disabled="isSubmitting">
                  {{ isSubmitting ? "Sending..." : "Send Message" }}
                </button>
              </div>

              <p v-if="status" class="status">{{ status }}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 90px 16px;
}

.contactWrap {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
}

.contactHeader {
  text-align: center;
  margin-bottom: 26px;
}

.contactTitle {
  font-size: 40px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.contactSubtitle {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
}

.contactCard {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  padding: 22px;
}

.contactForm {
  width: 100%;
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.fieldFull {
  grid-column: 1 / -1;
}

.label {
  display: block;
  font-size: 12px;
  letter-spacing: 0.4px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 8px;
}

.input,
.textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.92);
  padding: 12px 14px;
  outline: none;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

.input:focus,
.textarea:focus {
  border-color: rgba(150, 160, 255, 0.45);
  box-shadow: 0 0 0 3px rgba(120, 130, 255, 0.18);
}

.recaptchaRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.recaptchaBox {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(0, 0, 0, 0.12);
}

.btn {
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(130, 140, 255, 0.20);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status {
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.80);
  font-size: 13px;
}

@media (max-width: 820px) {
  .formGrid {
    grid-template-columns: 1fr;
  }
}
</style>