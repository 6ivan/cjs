import Layout from '@/layout'
export default [{
  path: '/maintain',
  component: Layout,
  redirect: '/maintain/maintain',
  name: 'maintain',
  meta: { title: '维护室', icon: 'el-icon-s-help' },
  children: [
    {
      path: 'maintain',
      name: 'maintain',
      component: () => import('@/views/maintain/maintain'),
      meta: { title: '维护室', icon: 'table' }
    },
    {
      hidden: true,
      path: 'detail',
      name: 'detail',
      component: () => import('@/views/maintain/detail'),
      meta: { title: '状态调整', icon: 'table' }
    },{
      hidden: true,
      path: 'list',
      name: 'list',
      component: () => import('@/views/maintain/list'),
      meta: { title: '清单', icon: 'table' }
    },
  ]
}]
