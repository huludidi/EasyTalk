import {createStore} from "vuex";

export default createStore({
    state:{
        loginUserInfo:{
            userId:'123',
            username:"葫芦弟弟",
            email:"test@qq.com",
            isAdmin:1
        },
    },
    getters:{
        getLoginUserInfo:(state)=>{
            return state.loginUserInfo;
        }
    },
    mutations:{
        updateloginUserInfo(state,value){
            state.loginUserInfo=value
        }
    },
    actions:{},
    modules:{}
})