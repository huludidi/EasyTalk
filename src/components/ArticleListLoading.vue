<template>
  <div>
    <v-card class="mx-auto" :style="{'margin-top':'10px'}">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div class="detail">
            <div class="content-side">
              <el-skeleton-item
                variant="h1"
                :style="{ width: '150px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '30px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>

              <el-skeleton
                :style="{
                  '--el-skeleton-circle-size': '45px',
                  margin: '20px 0 0 10px',
                }"
              >
                <template #template>
                  <el-skeleton-item variant="circle" />
                  <el-skeleton-item
                    variant="text"
                    :style="{ width: '100px', margin: '0 0 15px 10px' }"
                  ></el-skeleton-item>
                  <el-skeleton-item
                    variant="text"
                    :style="{ width: '350px', margin: '0 0 15px 30px' }"
                  ></el-skeleton-item>
                </template>
              </el-skeleton>
            </div>
            <div class="cover-side">
              <el-skeleton-item
                variant="image"
                style="width: 200px; height: 200px"
              />
            </div>
          </div>
        </template>
      </el-skeleton>
    </v-card>
    <v-card class="mx-auto"  :style="{'margin-top':'5px'}">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div class="detail">
            <div class="content-side">
              <el-skeleton-item
                variant="h1"
                :style="{ width: '150px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '30px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>

              <el-skeleton
                :style="{
                  '--el-skeleton-circle-size': '45px',
                  margin: '20px 0 0 10px',
                }"
              >
                <template #template>
                  <el-skeleton-item variant="circle" />
                  <el-skeleton-item
                    variant="text"
                    :style="{ width: '100px', margin: '0 0 15px 10px' }"
                  ></el-skeleton-item>
                  <el-skeleton-item
                    variant="text"
                    :style="{ width: '350px', margin: '0 0 15px 30px' }"
                  ></el-skeleton-item>
                </template>
              </el-skeleton>
            </div>
            <div class="cover-side">
              <el-skeleton-item
                variant="image"
                style="width: 200px; height: 200px"
              />
            </div>
          </div>
        </template>
      </el-skeleton>
    </v-card>
    <v-card class="mx-auto"  :style="{'margin-top':'5px'}">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div class="detail">
            <div class="content-side">
              <el-skeleton-item
                variant="h1"
                :style="{ width: '150px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '30px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>
              <el-skeleton-item
                variant="text"
                :style="{ width: '500px', margin: '10px 0 0 5px' }"
              ></el-skeleton-item>

              <el-skeleton
                :style="{
                  '--el-skeleton-circle-size': '45px',
                  margin: '20px 0 0 10px',
                }"
              >
                <template #template>
                  <el-skeleton-item variant="circle" />
                  <el-skeleton-item
                    variant="text"
                    :style="{ width: '100px', margin: '0 0 15px 10px' }"
                  ></el-skeleton-item>
                  <el-skeleton-item
                    variant="text"
                    :style="{ width: '350px', margin: '0 0 15px 30px' }"
                  ></el-skeleton-item>
                </template>
              </el-skeleton>
            </div>
            <div class="cover-side">
              <el-skeleton-item
                variant="image"
                style="width: 200px; height: 200px"
              />
            </div>
          </div>
        </template>
      </el-skeleton>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const props = defineProps({
  loading: {
    type: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  justify-content: space-between;
  .content-side {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    .message-info {
      display: flex;
      align-items: center;
    }
  }
}
</style>