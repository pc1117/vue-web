<template>
  <a-spin :spinning="loading">
    <div class="about">
      <a-space>
        <a-button type="primary" @click="addHandle">
          <PlusOutlined /> 新增 {{ num }}
        </a-button>
        <a-button
          @click="() => editHandle(selectedRowKeys)"
          :disabled="selectedRowKeys.length !== 1"
        >
          <EditOutlined /> 编辑
        </a-button>
        <a-popconfirm
          title="确定要删除选择项吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="() => deleteHandle(selectedRowKeys)"
          :disabled="selectedRowKeys.length === 0"
        >
          <a-button :disabled="selectedRowKeys.length === 0">
            <DeleteOutlined /> 删除
          </a-button>
        </a-popconfirm>
        <a-button @click="randomHandle">
          <IssuesCloseOutlined /> 随机
        </a-button>
      </a-space>
      <div class="form">
        <a-form
          ref="formRef"
          name="advanced_search"
          class="ant-advanced-search-form"
          :model="formState"
          @finish="onFinish"
        >
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item name="name" label="姓名">
                <a-input
                  v-model:value="formState.name"
                  placeholder="请输入姓名"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="age" label="年龄">
                <a-input-number
                  v-model:value="formState.age"
                  placeholder="请输入年龄"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="address" label="住址">
                <a-input
                  v-model:value="formState.address"
                  placeholder="请输入住址"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24" style="text-align: right">
              <a-space>
                <a-button type="primary" html-type="submit">搜索</a-button>
                <a-button @click="resetForm">清除</a-button>
                <a style="font-size: 12px" @click="expand = !expand">
                  <template v-if="expand"> <UpOutlined /> 折叠</template>
                  <template v-else> <DownOutlined /> 展开</template>
                </a>
              </a-space>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table
        :dataSource="[...carList, ...dataSource.value]"
        rowKey="key"
        :rowSelection="{
          selectedRowKeys,
          onChange: selectedOnChange,
        }"
        :customRow="
          (...args) => ({
            onClick: () => onClickHandle(...args),
          })
        "
        bordered
        size="small"
        :columns="columns"
      >
        <template #bodyCell="{ column, index }">
          <template v-if="column.dataIndex === 'index'">
            {{ index + 1 }}
          </template>
        </template>
      </a-table>
    </div>
  </a-spin>
  <a-modal
    :visible="visible"
    :title="(create ? '新增' : '编辑') + '产品'"
    centered
    :width="600"
    @cancel="onCancel"
    @ok="onOk"
    cancelText="取消"
    okText="确定"
  >
    <a-form
      ref="modalformRef"
      name="modalformRef"
      :model="modalFormState"
      :labelCol="{ span: 3 }"
      :wrapperCol="{ span: 22 }"
    >
      <a-form-item name="key" hidden>
        <a-input hidden readonly v-model:value="modalFormState.key" />
      </a-form-item>
      <a-form-item name="name" label="姓名">
        <a-input v-model:value="modalFormState.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item name="age" label="年龄">
        <a-input-number
          v-model:value="modalFormState.age"
          placeholder="请输入年龄"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item name="address" label="住址">
        <a-textarea
          v-model:value="modalFormState.address"
          placeholder="请输入住址"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import { FormInstance } from "ant-design-vue/es/form";
import request, { IResponse } from "@/utils/request";
import {
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  RedoOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";

export interface Record {
  name: string;
  key: string;
  age: number;
  address: string;
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

export default {
  components: {
    DownOutlined,
    UpOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    RedoOutlined,
    IssuesCloseOutlined,
  },
  computed: {
    ...mapState(["num", "carList"]),
    ...mapActions(["increase"]),
    ...mapGetters(["doubleNum"]),
  },
  setup() {
    const pagination = ref({ current: 1, pageSize: 15 });
    const expand = ref(false);
    const visible = ref(false);
    const loading = ref(false);
    const create = ref(false);
    const formRef = ref<FormInstance>();
    const modalformRef = ref<FormInstance>();
    const formState = ref({
      name: "",
      age: "",
      address: "",
    });
    const selectedRowKeys = ref<Array<string>>([]);
    const modalFormState = ref<Record>({
      key: "0",
      name: "胡图图",
      age: 34,
      address: "西湖区湖底公园1号",
    });
    const dataSource = reactive<{ value: Array<Record> }>({ value: [] });

    //重置搜索表单
    const resetForm = () => {
      formRef.value?.resetFields();
      fetchData();
    };

    const fetchData = (params = {}) => {
      loading.value = true;
      request<any, IResponse<Record>>({
        url: "/api/products",
        params,
      })
        .then((res) => {
          if (res.success) {
            store.commit("increase", {
              payload: 1,
            });
            dataSource.value = res.data.rows || [];
          } else {
            message.error(res.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
      setTimeout(() => {
        loading.value = false;
      }, 500);
    };

    fetchData();

    //搜素
    const onFinish = (values = {}) => {
      fetchData(values);
    };

    //表格行选中取消事件
    const selectedOnChange = (_selectedRowKeys = []) => {
      selectedRowKeys.value = _selectedRowKeys;
    };

    //表格行点击事件
    const onClickHandle = (record: Record) => {
      const isSelected =
        record.key && selectedRowKeys.value.includes(record.key);
      selectedRowKeys.value = isSelected
        ? selectedRowKeys.value.filter((v) => v !== record.key)
        : [...selectedRowKeys.value, record.key];
    };

    //新增编辑提交
    const onOk = () => {
      modalformRef.value?.validateFields().then((values: any) => {
        if (create.value) {
          dataSource.value.push({
            ...values,
            key: (dataSource.value.length + 1).toFixed(),
          });
        } else {
          dataSource.value = dataSource.value.map((v) => ({
            ...(v.key === values.key ? values : v),
          }));
        }
        visible.value = false;
      });
    };

    //新增
    const addHandle = () => {
      create.value = true;
      visible.value = true;
    };

    //关闭弹窗
    const onCancel = () => {
      visible.value = false;
    };

    //删除数据
    const deleteHandle = (_selectedRowKeys = []) => {
      const filter = (v: string) => _selectedRowKeys.every((_v) => _v !== v);
      selectedRowKeys.value = selectedRowKeys.value.filter(filter);
      dataSource.value = dataSource.value.filter((v) => filter(v.key));
    };

    //编辑数据
    const editHandle = ([selectedRowKey]: Array<string>) => {
      const selectedRecord = dataSource.value.find(
        (v) => v.key === selectedRowKey
      );
      if (!!selectedRecord) {
        create.value = false;
        visible.value = true;
        modalFormState.value = { ...selectedRecord };
      }
    };

    //生成随机双色球号码
    const randomHandle = () => {
      const targetRedBox = createRandom(6, 33).map((v) =>
        v < 10 ? `0${v}` : `${v}`
      );
      const targetBlueBox = createRandom(1, 16).map((v) =>
        v < 10 ? `0${v}` : `${v}`
      );
      console.log(...targetRedBox, ...targetBlueBox);
    };

    return {
      pagination,
      randomHandle,
      fetchData,
      loading,
      resetForm,
      editHandle,
      deleteHandle,
      onClickHandle,
      modalFormState,
      selectedOnChange,
      selectedRowKeys,
      onOk,
      onCancel,
      create,
      visible,
      addHandle,
      formRef,
      modalformRef,
      formState,
      expand,
      onFinish,
      dataSource,

      columns: [
        {
          title: "序号",
          width: 60,
          dataIndex: "index",
          align: "center",
        },
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "年龄",
          dataIndex: "age",
          key: "age",
        },
        {
          title: "住址",
          dataIndex: "address",
          key: "address",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.about {
  display: flex;
  flex-flow: column nowrap;
  gap: 16px;
}

.form .ant-form {
  max-width: none;
}
.form .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 2px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
[data-theme="dark"] .ant-advanced-search-form {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #434343;
  padding: 24px;
  border-radius: 2px;
}
[data-theme="dark"] .form .search-result-list {
  border: 1px dashed #434343;
  background: rgba(255, 255, 255, 0.04);
}

.my-popconfirm .ant-popover-buttons {
  text-align: center;
}
</style>