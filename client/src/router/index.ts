import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/LandingPageView.vue"),
      meta: {
        title: "KarirKit",
      },
    },
    {
      path: "/dashboard",
      name: "kanban",
      component: () => import("@/views/KanbanView.vue"),
      meta: {
        title: "Dashboard | KarirKit",
        requiresAuth: true,
      },
    },
    {
      path: "/register",
      name: "signup",
      component: () => import("@/views/RegisterView.vue"),
      meta: {
        title: "Sign up | KarirKit",
      },
    },
    {
      path: "/verify",
      name: "verify",
      component: () => import("@/views/VerifyOtpView.vue"),
      meta: {
        title: "Verify OTP | KarirKit",
      },
    },
    {
      path: "/login",
      name: "signin",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        title: "Sign in | KarirKit",
      },
    },
    {
      path: "/auth/callback",
      name: "auth-callback",
      component: () => import("@/views/AuthCallbackView.vue"),
      meta: {
        title: "Auth Callback | KarirKit",
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
      },
    },
    {
      path: "/settings/cover-letter",
      name: "coverLetter",
      component: () => import("@/components/setting/CoverLetter.vue"),
      meta: {
        title: "Cover Letter | KarirKit",
        requiresAuth: true,
      },
    },
    {
      path: "/settings/change-password",
      name: "changePassword",
      component: () => import("@/components/setting/ChangePassword.vue"),
      meta: {
        title: "Change Password | KarirKit",
        requiresAuth: true,
      },
    },
    {
      path: "/terms-of-service",
      name: "tos",
      component: () => import("@/views/TermsOfService.vue"),
      meta: {
        title: "Terms of Service | KarirKit",
      },
    },
    {
      path: "/privacy-policy",
      name: "privacy",
      component: () => import("@/views/PrivacyPolicy.vue"),
      meta: {
        title: "Privacy Policy | KarirKit",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
      meta: {
        title: "Not Found | KarirKit",
      },
    },
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
