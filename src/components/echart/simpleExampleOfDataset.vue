<!-- 柱状图 -->
<template>
  <div
    :ref="idRef"
    :id="idRef"
    :style="{ width: '100%', height: '300px' }"
    v-if="chartData"
  ></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "each",
  props: {
    chartData: {
      // 表格数据 一个系列一个数组
      type: Object,
      default: {},
    },
    idRef: {
      // 组件id和ref
      type: String,
    },
    barColorsLg: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      initData: [],
      option: {
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     type: "cross",
        //     crossStyle: {
        //       color: "#999",
        //     },
        //   },
        // },
        legend: {
          data: [],
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            
            let html = "";
            html =
              '<div style="color: #000;font-size: 14px;background:#fff;border:none;padding:10px;">' +
              '<div style="margin-bottom:4px;">' +
              '<span style="background:' +
              params.color.colorStops[1].color +
              ';border-radius:50%;width:10px;height:10px;display:inline-block;line-height:14px;"></span>' +
              '<span style="display:line-block;margin-left:14px;line-height:14px;">' +
              params.seriesName +
              "</span>" +
              "</div>" +
              "<div>" +
              '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">' +
              params.name +
              "</span>" +
              '<span style="font-size: 18px;margin-left:5px;font-weight:bold;">' +
              params.value +
              "</span>" +
              "</div>" +
              "</div>";
            return html;
          },
          extraCssText: "background: #fff; border-radius: 5;color: #000;",
        },
        grid: {
          top: "16%", // 等价于 y: '16%'
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              color: "#bdd6fa",
              interval: 0
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#f3f5f7"],
              },
            },
            // axisLine: {
            //   lineStyle: {
            //     color: "#bdd6fa",
            //   },
            // },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "个",
            min: 0,
            max: 40,
            interval: 10,
            axisLabel: {
              formatter: "{value}",
              color: "#445d83",
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: ["#f3f5f7"],
              },
            },
          },
        ],
        series: [
        ],
      },
    };
  },
  methods: {
    drawLine() {
      var chart;
      var _this = this;
      const simpleExampleOfDataset = this.$refs[this.$props.idRef];
      if (simpleExampleOfDataset) {
        chart = this.$echarts.init(document.getElementById(this.$props.idRef));
      }
      chart.setOption(_this.option);
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
            itemStyle: {
              normal: {
                // color: new echarts.graphic.LinearGradient(
                //   0,
                //   1,
                //   0,
                //   0,
                //   [
                //     {
                //       offset: 0,
                //       color: "#a0cdff", // 0% 处的颜色
                //     },
                //     {
                //       offset: 1,
                //       color: "#656dff", // 100% 处的颜色
                //     },
                //   ],
                //   false
                // ),
              },
            },
            data: [],
            barWidth: "16",
          }
          this.option.series.push(serise)
        this.option.legend.data.push(objItem.name);
        if (objItem.data && objItem.data.length) {
          for (let i = 0; i < objItem.data.length; i += 1) {
            let arrItem = objItem.data[i];
            if (objIndex == 0) {
              this.option.xAxis[0].data.push(arrItem.x);
            }

            this.option.series[objIndex].data.push(arrItem.y);
          }
        }
        objIndex += 1;
      }
      let colors = this.barColorsLg;
      for (let j = 0; j < colors.length; j += 1) {
        let color = colors[j];
        this.option.series[j].itemStyle.normal["color"] =
          new this.$echarts.graphic.LinearGradient(
            0,
            1,
            0,
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
          );
      }
      // this.chartData.forEach((item) => {
      //   this.option.xAxis[0].data.push(item.x);
      //   this.option.series[0].data.push(item.y);
      // });
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