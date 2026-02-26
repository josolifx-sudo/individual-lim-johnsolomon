import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import WorkoutsView from "../views/WorkoutsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/workouts" },

    { path: "/register", component: RegisterView, meta: { guestOnly: true } },
    { path: "/login", component: LoginView, meta: { guestOnly: true } },

    { path: "/workouts", component: WorkoutsView, meta: { requiresAuth: true } },

    { path: "/:pathMatch(.*)*", redirect: "/workouts" },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // if user refreshes, try to fetch user if token exists
  if (auth.isLoggedIn && !auth.user) {
    await auth.fetchUser();
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return "/login";
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return "/workouts";
  }
});

export default router;