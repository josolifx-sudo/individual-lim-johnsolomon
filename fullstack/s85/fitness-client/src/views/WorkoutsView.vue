<template>
    <!-- Hero -->
    <div
      class="hero-strip mb-4"
      style="--hero-img: url('https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=1600&q=80');"
    >
      <div class="hero-content">
        <span class="hero-kicker">TRAINING LOG</span>
        <div class="hero-title">BUILT TO PUSH<br />YOU FURTHER</div>
        <div class="hero-subtitle">
          Log your workouts, track completion, and stay consistent week after week.
        </div>

        <div class="d-flex gap-2 mt-4 flex-wrap">
          <button
            id="addWorkout"
            class="btn btn-accent"
            data-bs-toggle="modal"
            data-bs-target="#addWorkoutModal"
          >
            + Add Workout
          </button>

          <button class="btn btn-outline-light" @click="workouts.fetchMyWorkouts()">
            Refresh
          </button>
        </div>
      </div>
    </div>
  
    <!-- Dashboard Summary -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-4">
        <div class="card card-glass">
          <div class="card-body">
            <div class="small-muted">Total Workouts</div>
            <div class="display-6 fw-bold">{{ workouts.totalCount }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card card-glass">
          <div class="card-body">
            <div class="small-muted">Completed</div>
            <div class="display-6 fw-bold">{{ workouts.completedCount }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card card-glass">
          <div class="card-body">
            <div class="small-muted">Completion Rate</div>
            <div class="display-6 fw-bold">{{ workouts.completionRate }}%</div>
            <div class="progress mt-2" role="progressbar" aria-label="progress">
              <div class="progress-bar" :style="{ width: workouts.completionRate + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Controls -->
    <div class="row g-2 mb-3">
      <div class="col-12 col-md-6">
        <input
          v-model="search"
          class="form-control"
          placeholder="Search workout name..."
        />
      </div>
      <div class="col-12 col-md-3">
        <select v-model="filter" class="form-select">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div class="col-12 col-md-3">
        <select v-model="sort" class="form-select">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>
    </div>
  
    <div v-if="workouts.error" class="alert alert-danger">
      {{ workouts.error }}
    </div>
  
    <div v-if="workouts.loading" class="small-muted">Loading workouts...</div>
  
    <div v-else class="row g-3">
      <div v-if="visibleWorkouts.length === 0" class="col-12">
        <div class="card card-glass">
          <div class="card-body">
            <div class="fw-semibold">No workouts yet</div>
            <div class="small-muted">Click “Add Workout” to create your first log.</div>
          </div>
        </div>
      </div>
  
      <div v-for="w in visibleWorkouts" :key="w._id" class="col-12 col-md-6 col-lg-4">
        <WorkoutCard
          :workout="w"
          @complete="workouts.completeWorkout"
          @delete="workouts.deleteWorkout"
        />
      </div>
    </div>
  
    <!-- Add Workout Modal -->
    <div class="modal fade" id="addWorkoutModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content card-glass">
          <div class="modal-header border-0">
            <h5 class="modal-title">Add Workout</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
  
          <div class="modal-body">
            <form @submit.prevent="submitAdd">
              <div class="mb-3">
                <label class="form-label">Workout Name</label>
                <input v-model="name" class="form-control" placeholder="e.g. Chest Day" required />
              </div>
  
              <div class="mb-2">
                <label class="form-label">Duration</label>
                <input
                  v-model="duration"
                  class="form-control"
                  placeholder="e.g. 45 minutes"
                  required
                />
                <div class="form-text text-light opacity-75">
                  Your API expects duration as a string (example: “45 minutes”).
                </div>
              </div>
  
              <div class="d-flex gap-2 mt-3">
                <button class="btn btn-accent w-100" type="submit">
                  Add
                </button>
                <button class="btn btn-outline-light w-100" type="button" data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </form>
          </div>
  
          <div class="modal-footer border-0 small-muted">
            Tip: Keep logs consistent for better progress tracking.
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, ref } from "vue";
  import { useWorkoutsStore } from "../stores/workouts";
  import WorkoutCard from "../components/WorkoutCard.vue";
  
  const workouts = useWorkoutsStore();
  
  const name = ref("");
  const duration = ref("");
  
  const search = ref("");
  const filter = ref("all");
  const sort = ref("newest");
  
  onMounted(async () => {
    await workouts.fetchMyWorkouts();
  });
  
  const visibleWorkouts = computed(() => {
    let list = [...workouts.workouts];
  
    // filter
    if (filter.value !== "all") {
      list = list.filter((w) => w.status === filter.value);
    }
  
    // search
    const q = search.value.trim().toLowerCase();
    if (q) {
      list = list.filter((w) => (w.name || "").toLowerCase().includes(q));
    }
  
    // sort
    if (sort.value === "newest") {
      list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sort.value === "oldest") {
      list.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    } else if (sort.value === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
  
    return list;
  });
  
  async function submitAdd() {
    await workouts.addWorkout(name.value, duration.value);
  
    name.value = "";
    duration.value = "";
  
    // close modal (bootstrap)
    const el = document.getElementById("addWorkoutModal");
    const modal = window.bootstrap?.Modal.getInstance(el);
    modal?.hide();
  }
  </script>