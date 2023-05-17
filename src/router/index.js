import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: "layout",
      component: () => import('@/views/Layout.vue'),
      children: [
        {
          path: '/',
          name: "所有文章",
          component: () => import('@/views/forum/ArticleList.vue'),
        },
        {
          path: '/forum/:pBoardId',
          name: "一级板块",
          component: () => import('@/views/forum/ArticleList.vue'),
        }, {
          path: '/forum/:pBoardId/:boardId/',
          name: "二级板块",
          component: () => import('@/views/forum/ArticleList.vue'),
        },
        {
          path: '/user/:userId',
          name: "用户中心",
          component: () => import('@/views/Ucenter/Ucenter.vue'),
        },
        {
          path: '/user/message/:type',
          name: "消息中心",
          component: () => import('@/views/Ucenter/MessageList.vue'),
        },
        {
          path: '/post/:articleId/',
          name: "文章详情",
          component: () => import('@/views/forum/ArticleDetail.vue'),
        },
        {
          path: '/newPost',
          name: "发帖",
          component: () => import('@/views/forum/EditPost.vue'),
        },
        {
          path: '/editPost/:articleId',
          name: "编辑帖子",
          component: () => import('@/views/forum/EditPost.vue'),
        },
      ]
    },
    {
      path: '/manage',
      name: "管理端",
      redirect:"/manage/forum/article",
      component: () => import('@/views/Manage/Manage.vue'),
      children: [
        {
          path: '/manage/datashow',
          name: "数据统计",
          children: [
            {
              path: '/manage/datashow/show',
              name: "数据页",
              component: () => import('@/views/Manage/DataShow/Show.vue'),
            },
          ]
        },
        {
          path: '/manage/forum',
          name: "内容管理",
          children: [
            {
              path: '/manage/forum/article',
              name: "帖子管理",
              component: () => import('@/views/Manage/ForumManage/ArticleList.vue'),
            },
            {
              path: '/manage/forum/comment',
              name: "评论管理",
              component: () => import('@/views/Manage/ForumManage/CommentList.vue'),
            },
            {
              path: '/manage/forum/board',
              name: "板块管理",
              component: () => import('@/views/Manage/ForumManage/BoardList.vue'),
            },
          ]
        },
        {
          path: '/manage/user',
          name: "用户管理",
          children: [
            {
              path: '/manage/user/list',
              name: "用户列表",
              component: () => import('@/views/Manage/UserManage/UserList.vue'),
            },
          ]
        },
        {
          path: '/manage/settings',
          name: "设置",
          children: [
            {
              path: '/manage/settings/sys',
              name: "系统设置",
              component: () => import('@/views/Manage/Setting/SysSetting.vue'),
            }
          ]
        },
      ]
    },

  ]
})

export default router
