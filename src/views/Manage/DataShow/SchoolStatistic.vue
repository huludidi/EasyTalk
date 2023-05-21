<template>
  <div id="container" ref="refContainer"></div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import * as echarts from "echarts";
const { proxy } = getCurrentInstance();
const api = {
  schoolSort: "/school/schoolSort",
};
const refContainer = ref();
const schoolInfo = ref([]);
// 加载信息
const loadSchoolInfo = async () => {
  let result = await proxy.Request({
    url: api.schoolSort,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  schoolInfo.value = result.data;
//   加载图表
  const myChart = echarts.init(refContainer.value, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "学校信息发布统计",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: schoolInfo.value.map(({ ch_name, count }) => ({
          value: count,
          name: ch_name,
        })),
      },
    ],
  };

  if (option && typeof option === "object") {
    myChart.setOption(option);
  }

  window.addEventListener("resize", myChart.resize);
};
onMounted(() => {
  loadSchoolInfo();
});
</script>
<style lang="scss" scoped>
#container {
  height: 400px;
  width: 100%;
}
</style>