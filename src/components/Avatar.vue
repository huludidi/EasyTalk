<template>
  <div class="avatar">
    <v-menu min-width="100px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar color="brown" size="large">
            <v-img
              alt="Avatar"
              cover
              :src="proxy.globalInfo.avatarUrl + userInfo.userId + '.jpg'"
            ></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="brown">
              <v-img
                alt="Avatar"
                cover
                :src="proxy.globalInfo.avatarUrl + userInfo.userId + '.jpg'"
              ></v-img>
            </v-avatar>
            <h2>{{ userInfo.nickName }}</h2>
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text" @click="goToUcenter"> 我的主页</v-btn>
            <v-divider v-if="userInfo.isAdmin" class="my-3"></v-divider>
            <v-btn
              v-if="userInfo.isAdmin"
              rounded
              variant="text"
              @click="goTomanage"
            >
              管理网站</v-btn
            >
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text"> 退出</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const props = defineProps({
  userInfo: {
    type: Object,
  },
  width: {
    type: Number,
    default: 50,
  },
  addLink: {
    type: Boolean,
    default: true,
  },
});
const goToUcenter = () => {
  if (props.addLink) {
    router.push("/user/" + proxy.userInfo.userId);
  }
};
const goTomanage = () => {
  nextTick(() => {
    router.push("/manage");
  });
};
</script>

<style lang="scss">
</style>