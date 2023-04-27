<template>
  <div class="avatar">
    <!-- <el-image
      v-if="userId"
      :style="
        {
          width: width + 'px',
          height: width + 'px',
          'border-radius': width / 2+ 'px',
        } 
      "
      :src="proxy.globalInfo.avatarUrl"
      :zoom-rate="1.2"
      loading="lazy"
      @click="goToUcenter"
    >
    </el-image> -->
    <!-- <v-container fluid>
      <v-row justify="center"> -->
        <v-menu min-width="100px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="brown" size="large">
                <!-- <span class="text-h5">HD</span>
                 -->
                <v-img
                  alt="Avatar"
                  cover
                  :src="proxy.globalInfo.avatarUrl"
                ></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="brown">
                  <!-- <span class="text-h5">HD</span> -->
                  <v-img
                    alt="Avatar"
                    cover
                    :src="proxy.globalInfo.avatarUrl"
                  ></v-img>
                </v-avatar>
                <h3>{{ userInfo.userName }}</h3>
                <p class="text-caption mt-1">{{ userInfo.email }}</p>
                <v-divider class="my-3"></v-divider>
                <v-btn rounded variant="text" @click="goToUcenter">
                  我的主页</v-btn
                >
                <v-divider v-if="userInfo.isAdmin" class="my-3"></v-divider>
                <v-btn v-if="userInfo.isAdmin" rounded variant="text" @click="goTomanage">
                  管理网站</v-btn
                >
                <v-divider class="my-3"></v-divider>
                <v-btn rounded variant="text"> 退出</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      <!-- </v-row>
    </v-container> -->
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
    default(rawprops) {
      return {
        userId: "123",
        userName: "葫芦弟弟",
        email: "test@qq.com",
        isAdmin:1
      };
    },
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
const goTomanage=()=>{
  nextTick(()=>{
    router.push("/manage")

  })
}
</script>

<style lang="scss">
</style>