<template>
  <div id="container" ref="refContainer"></div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
const { proxy } = getCurrentInstance();
const api = {
  articleTypeData: "/statistics/articleTypeData",
};
// 文章统计信息
const refContainer = ref(null);
const ArticleStatisticData = ref([]);
const loadArticleStatisticData = async () => {
  let result = await proxy.Request({
    url: api.articleTypeData,
    showLoading: false,
  });
  ArticleStatisticData.value = result.data;

  //   加载饼状图
  const myChart = echarts.init(refContainer.value, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });

  const boardData = ArticleStatisticData.value.map((board) => {
    return { value: board.count, name: board.boardName };
  });

  const option = {
    title: {
      text: "文章类别统计",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      left: "center",
      top: "bottom",
      data: boardData.map((data) => data.name),
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "EasyTalk",
        type: "pie",
        radius: [20, 140],
        center: ["50%", "50%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 5,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        data: boardData,
      },
    ],
  };
  if (option && typeof option === "object") {
    myChart.setOption(option);
  }
  window.addEventListener("resize", myChart.resize);
};

onMounted(() => {
  loadArticleStatisticData();
});
</script>

<style lang="scss" scoped>
#container {
  height: 400px;
  width: 100%;
}
</style>