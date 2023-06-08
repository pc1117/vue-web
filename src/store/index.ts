import { createStore } from 'vuex'

export default createStore({
    state: {
        num: 0,
        carList: [
            { name: "毛豆Y", age: 27, address: "重庆 重庆市 沙坪坝区" },
            { name: "极氪001", age: 28, address: "重庆 重庆市 沙坪坝区" },
            { name: "零跑C11", age: 19, address: "重庆 重庆市 沙坪坝区" },
            { name: "比亚迪汉", age: 23, address: "重庆 重庆市 沙坪坝区" }
        ],
        userInfo: {}
    },
    getters: {
        doubleNum(state) {
            return Math.pow(state.num, 2)
        },
        userVipList(state) {
            return state.carList.filter(v => v.address.length > 10)
        }
    },
    mutations: {
        increase(state, { payload = 10 }) {
            state.num += payload
        },
        setCarList(state, { payload }) {
            return state.carList = payload
        },
        delList(state, index) {
            state.carList.splice(index, 1);
        },
        updateUserInfo(state, obj) {
            state.userInfo = obj
            console.log("存储成功", state)
        },

    },
    actions: {
        getActionList(context) {
            // 模拟异步请求
            setTimeout(() => {
                context.commit("setCarList", { payload: [{ carName: "极氪001", price: 28, range: 620 },] })
            }, 1000)
        },
        delCarList(context, index) {
            setTimeout(() => {
                //触发mutations中的方法 变更状态
                context.commit("delList", index);
            }, 1000)
        }
    },
    modules: {}
})