import Layout from '@/layout'
export default [{
  path: '/plan',
  component: Layout,
  redirect: '/plan/index',
  name: 'plan',
  alwaysShow: true,
  meta: { title: '规划部', icon: 'el-icon-s-help' },
  children: [
    {
      path: 'index',
      name: 'index',
      component: () => import('@/views/plan/index'),
      meta: { title: '规划部首页', icon: 'table' }
    },
    {
      path: 'list',
      name: 'list',
      component: () => import('@/views/plan/list'),
      meta: { title: '需求清单', icon: 'table' }
    },
    {
      hidden: true,
      path: 'detail',
      name: 'detail',
      component: () => import('@/views/plan/detail'),
      meta: { title: '查看数据', icon: 'table' }
    },
     {
      path: 'match',
      name: 'match',
      component: () => import('@/views/plan/match'),
      meta: { title: '入网匹配', icon: 'table' }
    },
  ]
}]
