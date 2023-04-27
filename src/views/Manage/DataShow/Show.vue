<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
import { onMounted, ref } from "vue";
import L from "leaflet";

export default {
  name: "CountryMap",
  setup() {
    const mapContainer = ref(null);

    onMounted(() => {
      var corner1 =  L.latLng(-90, -180); //设置左上角经纬度
    var corner2 = L.latLng(90, 180);	//设置右下点经纬度
    var bounds = L.latLngBounds(corner1, corner2); //构建视图限制范围
      // 创建地图实例
      const map = L.map(mapContainer.value,{
        maxBounds:bounds,
        maxZoom:5,
        minZoom:2
      }).setView([0, 0], 2);

      // 添加底图瓦片图层
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data © OpenStreetMap contributors",
      }).addTo(map);

      // 根据国家的名称和经纬度数据创建散点标记
      const markerData = [
        { name: "中国 12", latlng: [35.86166, 104.195397] },
        { name: "沈阳 1", latlng: [41.796767,123.429096] },
        { name: "美国", latlng: [37.09024, -95.712891] },
        { name: "日本", latlng: [36.204824, 138.252924] },
        { name: "法国", latlng: [46.227638, 2.213749] },
        { name: "德国", latlng: [51.165691, 10.451526] },
        { name: "加拿大", latlng: [56.130366, -106.346771] },
        { name: "澳大利亚", latlng: [-25.274398, 133.775136] },
      ];
      markerData.forEach(({ name, latlng }) => {
        L.marker(latlng).bindPopup(name).addTo(map);
      });
    });

    return {
      mapContainer,
    };
  },
};
</script>

<style scoped>
  @import "https://unpkg.com/leaflet@1.0.3/dist/leaflet.css";
.map-container {
  height: 500px;
}
</style>
