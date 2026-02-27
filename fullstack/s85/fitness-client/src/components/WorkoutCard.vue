<template>
  <div class="card card-glass h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="mb-1 fw-bold">{{ workout.name }}</h5>
          <div class="small-muted">
            Duration: <strong>{{ workout.duration }}</strong>
          </div>
        </div>

        <span class="badge" :class="workout.status === 'completed' ? 'badge-done' : 'badge-soft'">
          {{ workout.status }}
        </span>
      </div>

      <div class="mt-3 small-muted">
        Added: {{ formatDate(workout.dateAdded) }}
      </div>

      <div class="d-flex gap-2 mt-3">
        <!-- changed to outline-dark so it stays visible -->
        <button
          class="btn btn-sm btn-outline-dark"
          :disabled="workout.status === 'completed'"
          @click="$emit('complete', workout._id)"
        >
          Mark Completed
        </button>

        <!-- solid red delete always visible -->
        <button class="btn btn-sm btn-danger" @click="$emit('delete', workout._id)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  workout: { type: Object, required: true },
});

function formatDate(d) {
  if (!d) return "N/A";
  const date = new Date(d);
  return date.toLocaleString();
}
</script>