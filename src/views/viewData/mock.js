
export const timeForMat = (count)=> {
  // 拼接时间
  let curTimestamp = Date.now()
  let list = []

  for(let i=0;i<count;i++){
    list.push(new Date(curTimestamp - i * 86400000).getDate())
  }
  return list.reverse()
}

export const build = {
  lineData: [{
    name: '待审核验单报告',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(240-160+1)+160,10);
      }),
  }, {
    name: '已审核验单报告',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(160-100+1)+100,10);
      }),
  }, {
    name: '入网基站',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(100-40+1)+40,10);
      }),
  }, {
    name: '监控基站',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(60-10+1)+10,10);
      }),
  }]
}

export const plan = {
  lineData: [{
    name: '工单数',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(240-100+1)+100,10);
      }),
  }, {
    name: '完结数',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(140-40+1)+40,10);
      })
  }, {
    name: '催办数',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(60-10+1)+10,10);
      })
  }]
}

export const optimize = {
  lineData: [{
    name: '工单数',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(240-200+1)+200,10);
      }),
  }, {
    name: '完结数',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: (new Array(30)).fill(null).map(()=>{
          return parseInt(Math.random()*(200-160+1)+160,10);
      }),
  }]
}

export const server = {
  lineData: [{
    name: '工单数',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: [200, 282, 101, 184, 290, 230, 210],
  }, {
    name: '完结数',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: [180, 182, 100, 150, 240, 200, 180]
  }, {
    name: '催办数',
    type: 'line',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: [20, 100, 1, 34, 50, 30, 30]
  }]
}