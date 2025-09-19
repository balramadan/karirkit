import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/kanban",
      name: "kanban",
      component: () => import("@/views/KanbanView.vue"),
      meta: {
        title: "Kanban | KarirKit",
        requiresAuth: true,
      },
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        title: "Sign in | KarirKit",
      },
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/views/LogoutView.vue"),
      meta: {
        title: "Logout | KarirKit",
        requiresAuth: true,
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/SettingView.vue"),
      meta: {
        title: "Settings | KarirKit",
        requiresAuth: true,
      },
    },
    {
      path: "/settings/cv",
      name: "cv",
      component: () => import("@/components/setting/CV.vue"),
      meta: {
        title: "Curriculum Vitae | KarirKit",
        requiresAuth: true,
      }
    },
    {
      path: "/settings/cover-letter",
      name: "coverLetter",
      component: () => import("@/components/setting/CoverLetter.vue"),
      meta: {
        title: "Cover Letter | KarirKit",
        requiresAuth: true,
      }
    }
  ],
});

router.beforeEach((to, from, next) => {
  // Pengaturan Judul
  const defaultTitle = "KarirKit";
  document.title = to.meta.title ? `${to.meta.title}` : defaultTitle;

  // Pengaturan Authentikasi
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authStore.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next({ name: "signin" });
  } else if (
    (to.name === "signin" || to.name === "signup") &&
    isAuthenticated
  ) {
    next({ name: "kanban" });
  } else {
    next();
  }
});

export default router;
