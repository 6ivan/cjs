import Layout from '@/layout'

export default [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/register/index'),
        hidden: true
    },
    {
        path: '/server',
        component: Layout,
        children: [
            {
                hidden: true,
                path: 'add',
                name: 'add',
                component: () => import('@/views/server/add'),
                meta: { title: '添加工单', icon: 'table' }
            },
            {
                hidden: true,
                path: 'detail',
                name: 'detail',
                component: () => import('@/views/server/detail'),
                meta: { title: '工单详情', icon: 'table' }
            },
        ]
    },
    {
        path: '/optimization',
        component: Layout,
        children: [
            {
                hidden: true,
                path: 'detail',
                name: 'detail',
                component: () => import('@/views/optimization/detail'),
                meta: { title: '状态调整', icon: 'table' }
            },
            {
                hidden: true,
                path: 'list',
                name: 'list',
                component: () => import('@/views/optimization/list'),
                meta: { title: '清单', icon: 'table' }
            },
        ]
    },
    {
        path: '/maintain',
        component: Layout,
        children: [
            {
                hidden: true,
                path: 'detail',
                name: 'detail',
                component: () => import('@/views/maintain/detail'),
                meta: { title: '状态调整', icon: 'table' }
            }, {
                hidden: true,
                path: 'list',
                name: 'list',
                component: () => import('@/views/maintain/list'),
                meta: { title: '清单', icon: 'table' }
            },
        ]
    },
    {
        path: '/permission',
        component: Layout,
        children: [
            {
                path: 'editUser',
                name: 'editUser',
                hidden: true,
                component: () => import('@/views/permission/editUser'),
                meta: { title: '修改用户信息', icon: 'table' }
            },
            {
                path: 'editRole',
                name: 'editRole',
                hidden: true,
                component: () => import('@/views/permission/editRole'),
                meta: { title: '新增角色', icon: 'table' }
            },
            {
                path: 'addPermission',
                name: 'addPermission',
                hidden: true,
                component: () => import('@/views/permission/addPermission'),
                meta: { title: '新增权限', icon: 'table' }
            },
            {
                path: 'editPermission',
                name: 'editPermission',
                hidden: true,
                component: () => import('@/views/permission/editPermission'),
                meta: { title: '修改权限配置', icon: 'table' }
            },
            {
                path: 'editDepartment',
                name: 'editDepartment',
                hidden: true,
                component: () => import('@/views/permission/editDepartment'),
                meta: { title: '修改部门信息', icon: 'table' }
            },
        ]
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
]