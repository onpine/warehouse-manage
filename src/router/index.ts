import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Login from "../views/login.vue";
import Register from "../views/register.vue";
import Layout from "../views/layout.vue";

import Home from "../views/home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/record",
        name: "record",
        component: () => import("../views/record.vue"),
        meta: {
          title: "出入信息-物流信息管理系统",
        },
      },
      {
        path: "permit",
        name: "permit",
        component: () => import("../views/permit.vue"),
        meta: {
          title: "通行证管理-物流信息管理系统",
        },
      },
      {
        path: "/home",
        name: "home",
        component: Home,
        meta: {
          title: "物流信息管理系统",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Login,
    meta: {
      title: "登录",
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      title: "注册",
    },
  },
];

const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login，校验登陆状态
  // 如果没有登录，则跳转到登陆页面
  // 如果登陆了，则允许通过
  // 是 /login 允许通过
  const token = window.localStorage.getItem("token");
  // 校验非登录页面的登陆状态
  if (to.path !== "/login" && to.path !== "/register") {
    if (token) {
      next();
    } else {
      // 没有登陆，跳转到登陆页面
      next("/login");
    }
  } else {
    // 登陆页面。允许通过
    next();
  }
});
router.afterEach(function(to, from) {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});
export default router;
