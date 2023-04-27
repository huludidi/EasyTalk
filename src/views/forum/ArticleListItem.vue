<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <!-- <avatar :userId="data.userId"></avatar>
                 -->
          <v-hover v-slot="{ isHovering, props }" close-delay="200">
            <v-card
              :elevation="isHovering ? 16 : 1"
              :class="{ 'on-hover': isHovering }"
              v-ripple="{ center: true }"
              v-bind="props"
              class="mx-auto"
              max-width="1300"
              title="这是标题"
              to="/post/qwer"
            >
              <template v-slot:prepend>
                <!-- <v-icon icon="mdi-help" color="error"></v-icon> -->
                <v-chip color="#FB3624">
                  <v-icon icon="mdi-help"></v-icon>
                </v-chip>
              </template>

              <v-card-text class="text-h5 py-2">
                "Turns out semicolon-less style is easier and safer in TS
                because most gotcha edge cases are type invalid as well."
              </v-card-text>

              <v-card-actions>
                <v-list-item class="w-100">
                  <template v-slot:prepend>
                    <v-avatar
                      color="grey-darken-3"
                      image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                    ></v-avatar>
                  </template>
                  <v-list-item-title>葫芦弟弟</v-list-item-title>

                  <v-list-item-subtitle>剑桥大学</v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="message-info">
                      <span :style="{ 'font-size': '17px' ,'padding':'0 4px'}">2023-04-08</span>
                      <span class="me-1">-</span>
                      <v-breadcrumbs :items="items"></v-breadcrumbs>
                    </div>
                    <v-divider
                      :thickness="3"
                      class="border-opacity-100"
                      vertical
                      :style="{ 'margin-left': '5px', 'margin-right': '5px' }"
                    ></v-divider>
                    <div class="justify-self-end">
                      <v-icon class="me-1" icon="mdi-heart"></v-icon>
                      <span class="subheading me-2">256</span>
                      <span class="me-1">·</span>
                      <v-icon class="me-1" icon="mdi-comment"></v-icon>
                      <span class="subheading">45</span>
                    </div>
                  </template>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-hover>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  data: {
    type: Object,
  },
});
const items = ref([
  {
    title: "求助",
  },
  {
    title: "找室友 ",
  },
]);
</script>

<style lang="scss" scoped>
.article-item {
  margin-top: 5px;
}
.message-info {
  display: flex;
  align-items: center;
}
</style>