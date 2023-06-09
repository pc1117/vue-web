import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { InjectionKey } from 'vue'
import about from './modules/about'
import RootStateTypes from './interface';

const debug = process.env.NODE_ENV !== 'production'

export default createStore<RootStateTypes>({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        about: { ...about, namespaced: true }
    },
    strict: debug
});

export const key: InjectionKey<Store<RootStateTypes>> = Symbol("vue-store");

export function useStore() {
    return baseUseStore(key)
}