<template>
  <div class="item-body">
    <v-hover v-slot="{ isHovering, props }">
      <v-card
      color="blue-lighten-5"
        v-ripple="{ center: true }"
        v-bind="props"
        :elevation="isHovering ? 20 : 1"
        :class="{ 'on-hover': isHovering }"
        class="mx-auto"
        min-height="200px"
        @click="clickitem()"
      >
        <v-card-title>
          {{ data.name }}
          <div :style="{ color: '#F9A825' }">
            <v-icon icon="mdi-star-outline"></v-icon>
            <span>{{ data.detail_info.overall_rating? data.detail_info.overall_rating:"暂无评分"}}</span>
          </div>
        </v-card-title>
        <v-card-subtitle>
          <span> 电话：{{ data.telephone? data.telephone:"未知"}} </span>
        </v-card-subtitle>
        <v-card-text> {{ data.address }} </v-card-text>
        <v-card-actions>
          <v-list-item class="w-100">
            <template v-slot:prepend>
                <v-icon color="blue-accent-4" icon="mdi-map-marker-distance"></v-icon>
                <span>{{data.detail_info.distance}}米</span>
            </template>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </v-hover>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const props = defineProps({
  data: {
    type: Object,
  },
});

const clickitem = () => {
    window.open(props.data.detail_info.detail_url, '_blank');
};
</script>

<style lang="scss" scoped>
</style>