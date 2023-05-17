<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <v-hover v-slot="{ isHovering, props }" close-delay="200">
            <v-card
              :elevation="isHovering ? 16 : 1"
              :class="{ 'on-hover': isHovering }"
              v-ripple="{ center: true }"
              v-bind="props"
              class="mx-auto"
              max-width="1300"
              max-height="200px"
              @click="loadArticleDetail()"
            >
              <div class="flex-no-wrap justify-space-between">
                <div class="detail">
                  <div class="content-side">
                    <v-card-title class="text-h5">
                      <v-chip color="#FB3624">
                        <v-icon icon="mdi mdi-format-title"></v-icon>
                      </v-chip>
                      <span :style="{ 'margin-left': '5px' }">
                        {{
                          data.title?.substring(0, 20) +
                          (data.title && data.title.length > 20 ? "..." : "")
                        }}
                      </span>
                    </v-card-title>
                    <v-card-text class="text-h6 py-2">
                      {{
                        data.summary?.substring(0, 90) +
                        (data.summary && data.summary.length > 90 ? "..." : "")
                      }}
                    </v-card-text>

                    <v-card-actions>
                      <v-list-item class="w-100">
                        <template v-slot:prepend>
                          <v-avatar
                            color="grey-darken-3"
                            :image="
                              proxy.globalInfo.avatarUrl +
                              data.authorId +
                              '.jpg'
                            "
                          ></v-avatar>
                        </template>
                        <v-list-item-title>{{
                          data.nickName
                        }}</v-list-item-title>

                        <!-- <v-list-item-subtitle>{{
                          data.authorSchool
                        }}</v-list-item-subtitle> -->

                        <template v-slot:append>
                          <div class="message-info">
                            <span
                              :style="{
                                'font-size': '15px',
                                padding: '0 0 0 10px',
                              }"
                              >{{ data.postTime }}</span
                            >
                            <span> - </span>
                            <v-breadcrumbs
                              :items="[data.pBoardName, data.boardName]"
                            ></v-breadcrumbs>
                          </div>
                          <v-divider
                            :thickness="3"
                            class="border-opacity-100"
                            vertical
                            :style="{
                              'margin-left': '5px',
                              'margin-right': '5px',
                            }"
                          ></v-divider>
                          <div class="justify-self-end">
                            <v-icon class="me-1" icon="mdi-heart"></v-icon>
                            <span class="subheading me-2">{{
                              data.goodCount
                            }}</span>
                            <span class="me-1">·</span>
                            <v-icon class="me-1" icon="mdi-comment"></v-icon>
                            <span class="subheading">{{
                              data.commentCount
                            }}</span>
                          </div>
                        </template>
                      </v-list-item>
                    </v-card-actions>
                  </div>
                  <div class="cover-side">
                    <el-image
                      style="width: 200px; height: 200px; display: block"
                      :src="proxy.globalInfo.imageUrl + (data.cover ? data.cover : '1/1')"
                      fit="fill"
                    />
                  </div>
                </div>
              </div>
            </v-card>
          </v-hover>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const store = useStore();
const route = useRoute();
const router = useRouter();
const props = defineProps({
  data: {
    type: Object,
  },
});

const loadArticleDetail=()=>{
  window.scrollTo(0, 0);
  store.commit("setActiveBoard",props.data.pBoardId)
  router.push("/post/"+props.data.articleId)
}
</script>

<style lang="scss" scoped>
.v-list-item-subtitle {
  line-height: unset;
}
.v-breadcrumbs {
  padding: 0;
}
.article-item {
  margin-top: 5px;
  .detail {
    display: flex;

    .content-side {
      display: flex;
      flex-direction: column;
      width: 800px;
      .message-info {
        display: flex;
        align-items: center;
      }
    }
  }
}

.v-card-title {
  display: flex;
  align-items: center;
}
</style>