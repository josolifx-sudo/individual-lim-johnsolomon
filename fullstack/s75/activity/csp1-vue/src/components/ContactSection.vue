<script setup>
import { ref } from 'vue'

const fullName = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')

const isSending = ref(false)
const status = ref({ type: '', text: '' })

const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

async function handleSubmit() {
  status.value = { type: '', text: '' }

  if (!accessKey) {
    status.value = {
      type: 'danger',
      text: 'Missing Web3Forms access key. Add VITE_WEB3FORMS_ACCESS_KEY in your .env file.',
    }
    return
  }

  isSending.value = true

  try {
    const payload = {
      access_key: accessKey,
      name: fullName.value,
      email: email.value,
      subject: subject.value,
      message: message.value,
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (data?.success) {
      status.value = { type: 'success', text: 'Message sent. Thank you!' }
      fullName.value = ''
      email.value = ''
      subject.value = ''
      message.value = ''
    } else {
      status.value = { type: 'danger', text: data?.message || 'Failed to send message.' }
    }
  } catch (err) {
    status.value = { type: 'danger', text: 'Network error. Please try again.' }
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <section id="contact" class="sectionPad">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="sectionHeader text-center mb-4">
            <h2 class="sectionTitle mb-2">Contact</h2>
            <p class="sectionSubtitle mb-0">Send me a message using the form below.</p>
          </div>

          <div class="card appCard">
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <div class="col-12 col-md-6">
                    <label for="fullName" class="form-label appLabel">Full Name</label>
                    <input
                      id="fullName"
                      v-model.trim="fullName"
                      type="text"
                      class="form-control appInput"
                      name="fullName"
                      required
                      autocomplete="name"
                    />
                  </div>

                  <div class="col-12 col-md-6">
                    <label for="email" class="form-label appLabel">Email</label>
                    <input
                      id="email"
                      v-model.trim="email"
                      type="email"
                      class="form-control appInput"
                      name="email"
                      required
                      autocomplete="email"
                    />
                  </div>

                  <div class="col-12">
                    <label for="subject" class="form-label appLabel">Subject</label>
                    <input
                      id="subject"
                      v-model.trim="subject"
                      type="text"
                      class="form-control appInput"
                      name="subject"
                      required
                    />
                  </div>

                  <div class="col-12">
                    <label for="message" class="form-label appLabel">Message</label>
                    <textarea
                      id="message"
                      v-model.trim="message"
                      class="form-control appInput"
                      name="message"
                      rows="6"
                      required
                    ></textarea>
                  </div>

                  <div v-if="status.text" class="col-12">
                    <div class="alert mb-0" :class="`alert-${status.type}`" role="alert">
                      {{ status.text }}
                    </div>
                  </div>

                  <div class="col-12">
                    <button class="btn appBtnPrimary w-100" type="submit" :disabled="isSending">
                      <span v-if="isSending">Sending...</span>
                      <span v-else>Send Message</span>
                    </button>
                  </div>
                </div>
              </form>

              <p class="text-muted small mt-3 mb-0">
                Powered by Web3Forms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
