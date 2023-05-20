<template>
  <div :style="{ 'max-height': '635px', 'overflow-y': 'auto' }">
    <v-row no-gutters>
      <v-col cols="6">
        <v-card>
          <div class="map-container" ref="mapContainer"></div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card :style="{ 'margin-left': '10px', height: '400px' }">
          <v-card-title>最近注册用户</v-card-title>
          <v-divider></v-divider>
          <div class="user-box">
            <v-row>
              <v-col cols="3" v-for="(item, key) in userInfo" :key="key">
                <div class="user-info">
                  <v-avatar
                    size="100"
                    :image="proxy.globalInfo.avatarUrl + item.user_id"
                    class="animate__animated animate__rotateIn"
                  ></v-avatar>
                  <span>{{ item.join_time }}</span>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from "vue";
const { proxy } = getCurrentInstance();

import L from "leaflet";
const api = {
  recentJoinUser: "/statistics/recentJoinUser",
  scatterPlot: "/statistics/scatterPlot",
  articleTypeData: "/statistics/articleTypeData",
};

// 散点图
const mapContainer = ref(null);
let map;
onMounted(() => {
  loadMarkerData();
  loadArticleStatisticData();
});
onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
const markerData = ref([]);
const loadMarkerData = async () => {
  var corner1 = L.latLng(-90, -180);
  var corner2 = L.latLng(90, 180);
  var bounds = L.latLngBounds(corner1, corner2);
  // 创建地图实例
  map = L.map(mapContainer.value, {
    maxBounds: bounds,
    maxZoom: 15,
    minZoom: 1,
  }).setView([0, 0], 1);

  // 添加底图瓦片图层
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors",
  }).addTo(map);

  let result = await proxy.Request({
    url: api.scatterPlot,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  // 根据国家的名称和经纬度数据创建散点标记
  const markerDataArr = [];
  for (let item of result.data) {
    markerDataArr.push({
      name: item.ch_name + " " + item.count,
      latlng: [item.latitude, item.longitude],
    });
  }
  markerData.value = markerDataArr;
  markerData.value.forEach(({ name, latlng }) => {
    L.marker(latlng).bindPopup(name).addTo(map);
  });
};

// 文章统计信息
const ArticleStatisticData = ref([]);
const loadArticleStatisticData = async () => {
  let result = await proxy.Request({
    url: api.articleTypeData,
    showLoading: false,
  });
  ArticleStatisticData.value = result.data;
};

// 注册用户信息
const userInfo = ref({});
const loadRecenUserInfo = async () => {
  let result = await proxy.Request({
    url: api.recentJoinUser,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data.slice(0, 8);
};
loadRecenUserInfo();
</script>

<style lang="scss" scoped>
@import "https://unpkg.com/leaflet@1.0.3/dist/leaflet.css";
.map-container {
  height: 400px;
}
.ma1 {
  margin-top: 8px;
  margin-right: 8px;
}
.ma2 {
  margin-top: 8px;
  margin-left: 8px;
}
.user-box {
  padding: 0 10px 0 10px;
  display: flex;
  .user-info {
    padding: 5px 10px 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 150px;
    justify-content: space-around;
  }
}
</style>