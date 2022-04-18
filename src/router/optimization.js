import Layout from '@/layout'
export default [{
  path: '/optimization',
  component: Layout,
  redirect: '/optimization/optimization',
  name: 'optimization',
  meta: { title: '优化室', icon: 'el-icon-s-help' },
  children: [
    {
      path: 'optimization',
      name: 'optimization',
      component: () => import('@/views/optimization/optimization'),
      meta: { title: '优化室', icon: 'table' }
    },
    {
      hidden: true,
      path: 'detail',
      name: 'detail',
      component: () => import('@/views/optimization/detail'),
      meta: { title: '状态调整', icon: 'table' }
    },{
      hidden: true,
      path: 'list',
      name: 'list',
      component: () => import('@/views/optimization/list'),
      meta: { title: '清单', icon: 'table' }
    },
  ]
}]
