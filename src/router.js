import { createRouter, createWebHashHistory } from "vue-router";
import LoginPage from "./components/LoginPage/LoginPage.vue";
import MainPage from "./components/UserPage/MainPage.vue";
import AdminPage from "./components/AdminPage/AdminPage.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: "/login", component: LoginPage, alias: "/" },
		{ path: "/mainpage", component: MainPage },
		{ path: "/admin", component: AdminPage }
	],
});
router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token');
	if (to.path !== "/login" && !token) {
		next("/login");
	} else {
		next()
	}
})
export default router;