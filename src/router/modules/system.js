const Layout = () => import('@/layout/index.vue')
const sysUser = () => import('@/views/system/sysUser.vue') //用户管理页面
const sysRole = () => import('@/views/system/sysRole.vue') //角色管理页面
const sysMenu = () => import('@/views/system/sysMenu.vue') //菜单管理页面

export default [
    {
        path: '/system',
        component: Layout,
        name: 'system',
        meta: {
            title: '系统管理',
        },
        icon: 'Setting',
        children: [
            {
                path: 'sysUser',
                name: 'sysUser',
                component: sysUser,
                meta: {
                    title: '用户管理',
                },
            },
            {
                path: 'sysRole',
                name: 'sysRole',
                component: sysRole,
                meta: {
                    title: '角色管理',
                },
            },
            {
                path: 'sysMenu',
                name: 'sysMenu',
                component: sysMenu,
                meta: {
                    title: '菜单管理',
                },
            },
        ],
    },
]