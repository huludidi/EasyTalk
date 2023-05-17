import {createStore} from "vuex";

export default createStore({
    state:{
        // 用户信息
        loginUserInfo:null,
        // 是否显示登录弹窗
        showLogin:false,
        // 当前一级板块信息
        activeBoard:0
    },
    getters:{
        getLoginUserInfo:(state)=>{
            return state.loginUserInfo;
        },
        getActiveBoard:(state)=>{
            return state.activeBoard;
        }
    },
    mutations:{
        updateloginUserInfo(state,value){
            state.loginUserInfo=value;
        },
        showLogin(state,value){
            state.showLogin=value
        },
        setActiveBoard(state,value){
            state.activeBoard=value
        }
    },
    actions:{},
    modules:{}
})