import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import MoviesView from "../views/MoviesView.vue";
import MovieDetailsView from "../views/MovieDetailsView.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/movies" },
    { path: "/register", component: RegisterView },
    { path: "/login", component: LoginView },
    { path: "/movies", component: MoviesView },
    {
      path: "/movies/:id",
      component: MovieDetailsView,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return "/login";
  }

  if ((to.path === "/login" || to.path === "/register") && auth.isLoggedIn) {
    return "/movies";
  }
});

export default router;