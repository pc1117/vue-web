import request, { IResponse } from '@/utils/request';
import { FormInstance, message } from 'ant-design-vue';
import { PaginationConfig } from 'ant-design-vue/lib/pagination';
import { Module } from 'vuex';
import RootStateTypes from '../interface';
import { Key } from 'ant-design-vue/lib/table/interface';

export declare interface Record {
    name: string;
    key: string;
    age: number | string;
    address: string;
}

export declare interface AboutStateType {
    dataSource: Array<Record>;
    loading: boolean;
    create: boolean;
    expand: boolean;
    visible: boolean;
    selectedRowKeys: Array<Key>;
    pagination: PaginationConfig;
    doubleColorBall: Array<string>;
    [propName: string]: any
}

/**
 * @param count 生成随机数的个数
 * @param total 生成随机数源池数
 **/
export function createRandom(count: number, total: number) {
    const sourceBox = new Array(total).fill(0).map((_, i) => i + 1);
    const targetBox = [];
    for (let j = 0; j < count; j++) {
        const randomRed = Math.floor(Math.random() * sourceBox.length);
        const targetRed = sourceBox[randomRed];
        targetBox.push(targetRed);
        sourceBox.splice(randomRed, 1);
    }
    return targetBox.sort((a, b) => a - b);
}

const about: Module<AboutStateType, RootStateTypes> = {
    namespaced: true,
    state: {
        dataSource: [],
        loading: false,
        create: false,
        expand: false,
        visible: false,
        selectedRowKeys: [],
        pagination: {},
        doubleColorBall: [],
    },
    mutations: {
        updateState(state, addOn: Partial<AboutStateType>) {
            Object.keys(addOn).map(v => {
                state[v] = addOn[v]
            })
        },
        //新增数据 打开Modal
        addHandle(state) {
            state.create = true;
            state.visible = true;
        },
        //取消操作，关闭Modal
        onCancel(state) {
            state.visible = false
        },
        //编辑数据
        editHandle(state, [selectedRowKey]: Array<string>) {
            const selectedRecord = state.dataSource.find((v) => v.key === selectedRowKey);
            if (!!selectedRecord) {
                state.create = false;
                state.visible = true;
                state.modalFormState = { ...selectedRecord };
            }
        },
        //表格行点击事件
        onClickHandle(state, record: Record) {
            const isSelected = record.key && state.selectedRowKeys.includes(record.key);
            state.selectedRowKeys = isSelected
                ? state.selectedRowKeys.filter((v) => v !== record.key)
                : [...state.selectedRowKeys, record.key];
        },
        //表格行选中取消事件
        selectedOnChange(state, _selectedRowKeys: Array<Key> = []) {
            state.selectedRowKeys = _selectedRowKeys;
        },
        //删除数据
        deleteHandle(state, _selectedRowKeys: Array<Key> = []) {
            const filter = (v: Key) => _selectedRowKeys.every((_v) => _v !== v);
            state.selectedRowKeys = state.selectedRowKeys.filter(filter);
            state.dataSource = state.dataSource.filter((v) => filter(v.key));
        },
        //生成随机双色球号码
        randomHandle(state) {
            const targetRedBox = createRandom(6, 33).map((v) => v < 10 ? `0${v}` : `${v}`
            );
            const targetBlueBox = createRandom(1, 16).map((v) => v < 10 ? `0${v}` : `${v}`
            );
            state.doubleColorBall = [...targetRedBox, ...targetBlueBox];
            console.log(...targetRedBox, ...targetBlueBox);
        }
    },
    actions: {
        //数据请求
        fetchData({ commit, state }, params = {}) {
            commit("updateState", { loading: true })
            state.loading = true;
            request<any, IResponse<Record>>({
                url: "/api/products",
                params,
            }).then((res) => {
                if (res.success) {
                    commit("updateState", { dataSource: res.data.rows || [] })
                } else {
                    message.error(res.message);
                }
            }).catch((error) => {
                console.log("error", error);
            });
            setTimeout(() => {
                commit("updateState", { loading: false })
            }, 500);
        },
        //新增编辑提交
        onOk({ state, commit }, modalformRef: FormInstance) {
            modalformRef?.validateFields().then((values: any) => {
                commit("updateState", { loading: true })
                if (state.create) {
                    commit("updateState", { loading: false, dataSource: [{ ...values, key: (state.dataSource.length + 1).toFixed() }, ...state.dataSource] })
                } else {
                    commit("updateState", {
                        loading: false,
                        dataSource: state.dataSource.map((v) => ({
                            ...(v.key === values.key ? values : v),
                        }))
                    })
                }
                setTimeout(() => commit("updateState", { visible: false }), 500)
            });
        },
        //重置表单
        resetForm({ dispatch }, formRef: FormInstance) {
            formRef.resetFields();
            dispatch("fetchData")
        }
    }
}

export default about