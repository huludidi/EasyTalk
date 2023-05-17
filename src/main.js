import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Message from './utils/Message'
import Request from './utils/Request'
import Confirm from './utils/Confirm'
import VueCookies from 'vue-cookies'
import { loadFonts } from './plugins/webfontloader'
import ElementPlus from 'element-plus'
// import animate from 'animate.css'
import 'animate.css';
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'
import './assets/base.scss'

import Verify from '@/utils/Verify'
import Dialog from '@/components/Dialog.vue'
import Avatar from '@/components/Avatar.vue'
import DataList from '@/components/DataList.vue'
import ImageViewer from '@/components/ImageViewer.vue'
import EditorHtml from '@/components/EditorHtml.vue'
import EditorMarkdown from '@/components/EditorMarkdown.vue'
import AttachmentSelector from '@/components/AttachmentSelector.vue'
import CoverUpload from '@/components/CoverUpload.vue'
import Table from '@/components/Table.vue'
import NoData from '@/components/NoData.vue'


loadFonts()

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(vuetify)
app.use(store)
// app.use(animate)

app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.globalInfo = {
    bodyWidth: 1100,
    avatarUrl: "/api/file/getAvatar/",
    imageUrl:"/api/file/getImage/",
    webDomain:"http://localhost:3004/"
}

app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Request = Request;
app.config.globalProperties.Confirm = Confirm;

app.component("Dialog", Dialog)
app.component("Avatar", Avatar)
app.component("DataList",DataList)
app.component("ImageViewer", ImageViewer)
app.component("EditorHtml",EditorHtml)
app.component("EditorMarkdown",EditorMarkdown)
app.component("AttachmentSelector",AttachmentSelector)
app.component("CoverUpload",CoverUpload)
app.component("Table",Table)
app.component("NoData",NoData)

app.mount('#app')
