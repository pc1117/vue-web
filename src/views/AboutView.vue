<template>
  <div class="about">
    <a-space>
      <a-button type="primary" @click="addHandle">
        <PlusOutlined /> 新增</a-button
      >
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
          <template v-for="i in 10" :key="i">
            <a-col v-show="expand || i <= 3" :span="8">
              <a-form-item :name="`field-${i}`" :label="`字段${i}`">
                <a-input
                  v-model:value="formState[`field-${i}`]"
                  :placeholder="`请输入字段${i}`"
                ></a-input>
              </a-form-item>
            </a-col>
          </template>
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
      :dataSource="dataSource"
      rowKey="key"
      :rowSelection="{
        selectedRowKeys,
        onChange: selectedOnChange,
      }"
      :customRow="
        (...args) => ({
          onClick: () => onClickHandle(...args), // 点击表头行
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
    <a-modal
      :visible="visible"
      :title="create ? '新增' : '编辑' + '产品'"
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
        <a-form-item name="name" label="姓名">
          <a-input
            v-model:value="modalFormState.name"
            placeholder="请输入姓名"
          />
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
  </div>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
import { FormInstance } from "ant-design-vue/es/form";
import {
  DownOutlined,
  UpOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";

export interface Record {
  name: string;
  key: string;
  age: number;
  address: string;
}

export default {
  components: {
    DownOutlined,
    UpOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
  setup() {
    const expand = ref(false);
    const visible = ref(false);
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
    const dataSource = ref<Array<Record>>([
      {
        key: "1",
        name: "胡彦斌",
        age: 32,
        address: "西湖区湖底公园1号",
      },
      {
        key: "2",
        name: "胡彦祖",
        age: 42,
        address: "西湖区湖底公园1号",
      },
    ]);

    const resetForm = () => {
      console.log("formRef", formRef.value);
      formRef.value?.resetFields();
    };

    const onFinish = (values: any) => {
      console.log("values", values);
    };

    const selectedOnChange = (_selectedRowKeys = []) => {
      selectedRowKeys.value = _selectedRowKeys;
    };

    const onClickHandle = (record: Record) => {
      const isSelected =
        record.key && selectedRowKeys.value.includes(record.key);
      selectedRowKeys.value = isSelected
        ? selectedRowKeys.value.filter((v) => v !== record.key)
        : [...selectedRowKeys.value, record.key];
    };

    const onOk = () => {
      modalformRef.value?.validateFields().then((values: any) => {
        dataSource.value.push({
          key: (dataSource.value.length + 1).toFixed(),
          ...values,
        });
        visible.value = false;
      });
    };

    const addHandle = () => {
      visible.value = true;
    };

    const onCancel = () => {
      visible.value = false;
    };

    const deleteHandle = (_selectedRowKeys = []) => {
      const filter = (v: string) => _selectedRowKeys.every((_v) => _v !== v);
      selectedRowKeys.value = selectedRowKeys.value.filter(filter);
      dataSource.value = dataSource.value.filter((v) => filter(v.key));
    };

    const editHandle = ([selectedRowKey]: Array<string>) => {
      const selectedRecord = dataSource.value.find(
        (v) => v.key === selectedRowKey
      );
      if (!!selectedRecord) {
        console.log("modalformRef.value", modalformRef.value);
        visible.value = true;
        modalFormState.value = { ...selectedRecord };
      }
    };

    return {
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