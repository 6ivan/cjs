<!-- 饼图 -->
<template>
  <div
    :ref="'pieWithScrollableLegend'+defaultData.num"
    :id="'pieWithScrollableLegend'+defaultData.num"
    :style="{ width: defaultData.width, height: '300px' }"
  ></div>
</template>
<script>
export default {
  name: "each",
  props: {
    alarmData: {
      type: Array,
      default: [],
    },
    labelData: {
      type: Object,
      default: {}
    },
    defaultData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      initData: [],
      initLabelData: {},
      option: {
        title: {
          left: "center",
          top: "5%",
          text: ''
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
              let html = '';
              html = '<div style="color: #000;font-size: 14px;background:#fff;border:none;padding:10px;">'+
                      '<div style="margin-bottom:4px;">'+
                        '<span style="background:'+params.color+';border-radius:50%;width:10px;height:10px;display:inline-block;line-height:14px;"></span>'+
                        '<span style="display:line-block;margin-left:14px;line-height:14px;">'+params.name+'</span>'+
                      '</div>'+
                      '<div>'+
                        '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">'+params.value+'</span>'+
                        '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">'+params.percent+'%</span>'+
                      '</div>'+
                    '</div>';
             return html
           },
           extraCssText: 'background: #fff; border-radius: 5;color: #000;',
        },
        legend: {
          orient: "",
          right: "",
          bottom: "",
          data: [],
          itemWidth: 8,
          itemHeight: 8,
          icon: "circle",
        },
        color: [],
        series: [
          {
            name: "占比",
            type: "pie",
            radius: "50%",
            avoidLabelOverlap: true,
            data: [], //数据
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              label: {
                show: false,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    drawLine() {
      var chart;
      var _this = this;
      const pieWithScrollableLegend = this.$refs['pieWithScrollableLegend'+this.defaultData.num];
      if (pieWithScrollableLegend) {
        chart = this.$echarts.init(
          document.getElementById("pieWithScrollableLegend"+this.defaultData.num)
        );
      }
      chart.setOption(_this.option);
      window.addEventListener("resize", function () {
        chart.resize();
      });
    },
    init() {
      this.initData.forEach((item) => {
        this.option.legend.data.push(item.x);
        this.option.series[0].data.push({ name: item.x, value: item.y });
      });
      for(let key in this.initLabelData) {
        if(key == 'title') {
          this.option[key].text = this.initLabelData[key]
        }else if(key == 'legend') {
          this.option[key].orient = this.initLabelData[key][0]
          this.option[key].right = this.initLabelData[key][1]
          this.option[key].bottom = this.initLabelData[key][2]
        }else if (key == 'color'){
          this.option[key] = this.initLabelData[key]
        }else{
          this.option.series[0][key] = this.initLabelData[key]
        }
        
      }
      this.drawLine();
    },
  },
  mounted() {
    this.initData = this.alarmData;
    this.initLabelData = this.labelData;
    this.init();
  },
  watch: {
    alarmData(v) {
      this.initData = v;
      this.initLabelData = this.labelData;
    },
  },
};
</script>

<style scoped>
</style>