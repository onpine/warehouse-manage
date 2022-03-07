<template>
  <div class="home">
    <div id="goods"></div>
    <div id="line">
      <dv-scroll-board :config="config" />
      <dv-scroll-board :config="config2" />
      <dv-scroll-board :config="config3" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getGoodstotal, getAllRecord } from "@/api/index";
import * as echarts from "echarts/core";
import { TreemapChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";

echarts.use([TreemapChart, CanvasRenderer]);
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);
export default {
  name: "home",
  data() {
    return {
      goodsTotal: [],
      records: [],
      records2: [],
      records3: [],
    };
  },
  computed: {
    config() {
      return {
        header: ["车牌号", "货物名称", "进入重量", "进入时间"],
        data: this.records,
        // rowNum: 5,
        columnWidth: [80, 80, 80, 160],
      };
    },
    config2() {
      return {
        header: ["车牌号", "货物名称", "离开重量", "进入时间"],
        data: this.records2,
        // rowNum: 5,
        columnWidth: [80, 80, 80, 160],
      };
    },
    config3() {
      return {
        header: ["车牌号", "货物名称", "物资增减", "进入时间"],
        data: this.records3,
        // rowNum: 5,
        columnWidth: [80, 80, 80, 160],
      };
    },
  },
  created() {
    this.laodData();
  },
  mounted() {},
  methods: {
    laodData() {
      getGoodstotal().then((res) => {
        console.log(res.data.data);
        this.goodsTotal = res.data.data;
        this.initChart();
      });
      getAllRecord().then((res) => {
        let temp = res.data.data.filter((el) => {
          return !el.outdatetime;
        });
        this.records = temp.map((el) => {
          return [
            el.cid,
            goods[el.gid],
            el.inweight + "吨",
            moment(el.indatetime).format("YYYY-MM-DD  HH:mm"),
          ];
        });
        temp = res.data.data.filter((el) => {
          return el.outdatetime;
        });
        this.records2 = temp.map((el) => {
          return [
            el.cid,
            goods[el.gid],
            el.outweight + "吨",
            moment(el.outdatetime).format("YYYY-MM-DD  HH:mm"),
          ];
        });
        temp = res.data.data.filter((el) => {
          return el.outdatetime;
        });
        this.records3 = temp.map((el) => {
          return [
            el.cid,
            goods[el.gid],
            el.inweight - el.outweight + "吨",
            moment(el.indatetime).format("YYYY-MM-DD  HH:mm"),
          ];
        });
        console.log(this.records2);
        // this.initChart2();
      });
    },
    initChart() {
      var chartDom = document.getElementById("goods");
      let option = {
        series: [
          {
            type: "treemap",
            data: this.goodsTotal.map((el) => {
              return {
                name: el.gname,
                value: el.leftWeight,
              };
            }),
            width: "100%",
            height: "100%",
            roam: false,
            breadcrumb: {
              show: false,
            },
            nodeClick: "false",
            label: {
              //   position: "inside",
              formatter: function(params) {
                return `{name|${params.name}}\n{budget|${params.value} 吨}`;
              },
              rich: {
                budget: {
                  fontSize: 20,
                  lineHeight: 30,
                  color: "yellow",
                },
                name: {
                  fontSize: 16,
                  color: "#fff",
                },
              },
            },
          },
        ],
      };
      var myChart = echarts.init(chartDom);
      option && myChart.setOption(option);
    },
    // initChart2() {
    //   var chartDom = document.getElementById("line");
    //   var myChart = echarts.init(chartDom);
    //   var option;

    //   option = {
    //     xAxis: {
    //       type: "category",
    //       data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //     },
    //     yAxis: {
    //       type: "value",
    //     },
    //     series: [
    //       {
    //         data: [820, 932, 901, 934, 1290, 1330, 1320],
    //         type: "line",
    //         smooth: true,
    //       },
    //     ],
    //   };

    //   option && myChart.setOption(option);
    // },
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
  display: flex;
  #goods {
    height: 100%;
    width: calc(100% - 400px);
    // background-color: aquamarine;
  }
  #line {
    height: 100%;
    width: 400px;
    display: flex;
    flex-direction: column;
    div {
      flex-grow: 1;
      width: 100%;
    }
  }
}
</style>
