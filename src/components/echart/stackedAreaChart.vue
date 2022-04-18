<!-- 折线图 -->
<template>
  <div
    :ref="data.name"
    :id="data.name"
    :style="{ width: '100%', height: '100%[' }"
  ></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "each",
  props: {
    data: {
      type: Object,
    },
  },
  watch: {
    data: {
      handler(newV, oldV) {
        // do something, 可使用this
        this.drawLine();
      },
      deep: true,
    },
  },
  data() {
    return {
      color: ["#8297ff", "#ffc485", "#ff9ac0", '#666eff'],
      option: {
        color: ["#8297ff", "#ffc485", "#ff9ac0", '#666eff'],
        grid: {
          top: "16%", // 等价于 y: '16%'
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          top: "top",
          left: "right",
          data: [],
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          padding: 8,
          textStyle: {
            color: "#302f62",
          },
          extraCssText: "box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);",
          formatter: null,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            color: "#8995cb",
            fontSize: 14,
            interval: 0
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#f3f5f7"],
            },
          },
          data: [],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#8995cb",
            fontSize: 14,
          },
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
        },
        series: [],
      },
    };
  },
  methods: {
    drawLine() {
      var chart;
      var _this = this;
      const simpleExampleOfDataset = this.$refs[this.data.name];
      if (simpleExampleOfDataset) {
        chart = this.$echarts.init(document.getElementById(this.data.name));
      }

      //设置series和legend
      this.option.xAxis.data = this.data.data_x;
      this.option.series = [];
      this.option.legend.data = [];
      this.data.data_y.forEach((item, index) => {
        let obj = {
          name: item.name,
          type: "line",
          symbol: "none",
          smooth: true,
          lineStyle: {
            width: 1.5,
          },
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: _this.color[index],
              },
              {
                offset: 1,
                color: "#fff",
              },
            ]),
          },
          data: item.data,
        };
        this.option.legend.data.push(item.name);
        this.option.series.push(obj);
      });

      //单独设置tooltip
      if (this.data.name == "stackedAreaChart") {
        this.option.tooltip.formatter = function (params) {
          let nowDate = new Date();
          let date = {
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            date: nowDate.getDate(),
          };
          let str = '<span style="font-size:18px;">'+date.month +'月数据</span><span style="color:#a7b1ca;margin-left:20px;">'+date.year + "-" + date.month + "-" + params[0].axisValue+"</span><br />";
          params.forEach((item) => {
            str +=
              '<div style="line-height:25px;"><span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:' +
              item.color +
              '"></span>' +
              item.seriesName +
              " : " +
              item.value +
              "</div>";
          });
          return str;
        };
      }
      chart.setOption(this.option);
      window.addEventListener("resize", function () {
        chart.resize();
      });
    },
  },
  mounted() {
    this.drawLine();
  },
};
</script>

<style scoped>
</style>