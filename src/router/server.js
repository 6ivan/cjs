import Layout from '@/layout'
export default [{
  path: '/server',
  component: Layout,
  redirect: '/server/server',
  name: 'server',
  alwaysShow: true,
  meta: { title: '客服部', icon: 'el-icon-s-help' },
  children: [
    {
      path: 'server',
      name: 'server',
      component: () => import('@/views/server/server'),
      meta: { title: '客服部首页', icon: 'table' }
    },
    {
      path: 'warn',
      name: 'warn',
      component: () => import('@/views/server/warn'),
      meta: { title: '预警分拣', icon: 'table' }
    },{
      path: 'history',
      name: 'history',
      component: () => import('@/views/server/history'),
      meta: { title: '历史查询', icon: 'table' }
    },{
      path: 'manual',
      name: 'manual',
      component: () => import('@/views/server/manual'),
      meta: { title: '手动工单', icon: 'table' }
    },{
      path: 'grid',
      name: 'grid',
      component: () => import('@/views/server/grid'),
      meta: { title: '栅格预警分拣', icon: 'table' }
    },{
      path: 'workOrder',
      name: 'workOrder',
      component: () => import('@/views/server/workOrder'),
      meta: { title: '工单分拣', icon: 'table' }
    },
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
}]
