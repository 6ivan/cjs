import Layout from '@/layout'
export default [{
  path: '/viewData',
  component: Layout,
  redirect: '/viewData/build',
  name: 'viewData',
  meta: { title: '查看数据', icon: 'el-icon-s-help' },
  children: [
    {
      path: 'build',
      name: 'build',
      component: () => import('@/views/viewData/build'),
      meta: { title: '查看数据-建设', icon: 'table' }
    },
    {
      path: 'plan',
      name: 'plan',
      component: () => import('@/views/viewData/plan'),
      meta: { title: '查看数据-规划', icon: 'table' }
    },
    {
      path: 'optimize',
      name: 'optimize',
      component: () => import('@/views/viewData/optimize'),
      meta: { title: '查看数据-优化', icon: 'table' }
    },{
      path: 'maintain',
      name: 'maintain',
      component: () => import('@/views/viewData/maintain'),
      meta: { title: '查看数据-维护', icon: 'table' }
    },{
      path: 'server',
      name: 'server',
      component: () => import('@/views/viewData/server'),
      meta: { title: '查看数据-客服', icon: 'table' }
    }
  ]
}]
