import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@src/views/Home.vue';
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const settings = cookies.get('settings');

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: 'login',
        },
        component: () => import('@src/views/Login.vue'),
    },
    { path: '/403', name: '403', meta: { title: '403' }, component: () => import('@src/views/error/403.vue') },
    { path: '/500', name: '500', meta: { title: '403' }, component: () => import('@src/views/error/500.vue') },
    { path: '/:pathMatch(.*)*', name: '404', meta: { title: '404' }, component: () => import('@src/views/error/404.vue') },
    {
        path: '/',
        name: '',
        component: Home,
        children: [
            {
                path: '/main',
                name: 'main',
                meta: {
                    title: 'main',
                    auth: true,
                },
                component: () => import('@src/views/main/Main.vue'),
            },
            // 프로그램으로 만들지 않는...
            { path: '/cr/calendar', name: 'calendar', meta: { title: 'calendar', auth: true, }, component: () => import( '@src/views/cr/Calendar.vue'), },
            { path: '/cr/dictionary', name: 'dictionary', meta: { title: 'dictionary', auth: true, }, component: () => import( '@src/views/cr/Dictionary.vue'), },
            // 프로그램으로 자동생성
        ],
    },
];

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `kaisa ${to.meta.title}`;

    /*const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const codeList = JSON.parse(localStorage.getItem('codeList') || '{}');
    const menuList = JSON.parse(localStorage.getItem('menuList') || '[]');

    const isUser = (
           userInfo.cmpId
        && codeList
        && settings
        && menuList.length > 0
        && userInfo.token
    );

    let isRole = (to.path == '/' || to.path == '/main') ? true : false;
    if(!isRole) {
        for(let o of menuList) {
            if(to.path === o.url) {
                isRole = true;
                break;
            }
        }
    }
    */
    const isUser = false;
    if (!isUser && to.path !== '/login') {
        next('/login');
    } else if (to.meta.auth && !isUser) {
        next('/403');
    } else if (to.path === '/') {
        next('/');
    } else {
        next();
    }
});

export default router;
