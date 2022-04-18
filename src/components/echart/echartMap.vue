<!-- 横排柱状图 -->
<template>
  <div
    :ref="idRef"
    :id="idRef"
    :style="{ width: '100%', height: chartData.style.height}"
  ></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "each",
  props: {
    chartData: {
      type: Object,
      default: {},
    },
    idRef: {
      type: String,
    },
    barColorsLg: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
          formatter: function(params) {
              let html = '';
              html = '<div style="color: #000;font-size: 14px;background:#fff;border:none;padding:10px;">'+
                      '<div style="margin-bottom:4px;">'+
                        '<span style="background:'+params.color.colorStops[1].color+';border-radius:50%;width:10px;height:10px;display:inline-block;line-height:14px;"></span>'+
                        '<span style="display:line-block;margin-left:14px;line-height:14px;">'+params.seriesName+'</span>'+
                      '</div>'+
                      '<div>'+
                        '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">'+params.name+'</span>' +
                        '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">'+params.value+'</span>'+
                      '</div>'+
                    '</div>';
             return html
           },
           extraCssText: 'background: #fff; border-radius: 5;color: #000;',
        },
        legend: {
          data: [],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          splitLine: {
            show:true,
            lineStyle: {
              color: ["#f3f5f7"],
            },
          },
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: ["#f3f5f7"],
            },
          },
          data: [],
        },
        series: [
          
        ],
      }
    };
  },
  methods: {
    drawLine() {
      var chart;
      let that = this
      const echartMap = this.$refs[this.idRef];
      if (echartMap) {
        chart = this.$echarts.init(document.getElementById(this.idRef));
      }
      chart.setOption(that.option);
      window.addEventListener("resize", function () {
        chart.resize();
      });
    },
    init() {
      let chartdata = this.chartData;
      let objIndex = 0;
      for (let pro in chartdata) {
        let objItem = chartdata[pro];
        let serise = {
            name: objItem.name,
            type: "bar",
            barWidth: 20,
            itemStyle: {
              normal: {
                barBorderRadius:[0, 15, 15, 0]
              },
            },
            data: [],
          }
          this.option.series.push(serise)
          this.option.legend.data.push(objItem.name)
        if (objItem.data && objItem.data.length) {
          for (let i = 0; i < objItem.data.length; i += 1) {
            let arrItem = objItem.data[i];
            if (objIndex == 0) {
              this.option.yAxis.data.push(arrItem.x);
            }

            this.option.series[objIndex].data.push(arrItem.y);
          }
        }
        objIndex += 1;
      }
      let colors = this.barColorsLg
      for(let j = 0;j < colors.length;j += 1) {
        let color = colors[j]
        if(this.option.series[j]) {
          this.option.series[j].itemStyle.normal['color'] = new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: color.lgStart, // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: color.lgEnd, // 100% 处的颜色
                    },
                  ],
                  false
                )
        }
        
      }
      this.drawLine();
    },
  },
  mounted() {
     this.initData = this.chartData;
    let that = this;
    setTimeout(function () {
      that.init();
    }, 100);
  },
  watch: {
    chartData(v) {
      this.initData = v;
    },
  },
};
</script>

<style scoped>
</style>