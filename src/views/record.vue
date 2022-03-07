<template>
  <div class="activity">
    <a-form-model layout="inline" :model="search">
      <a-form-model-item>
        <a-input v-model="search.cid" placeholder="车牌号"> </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-select v-model="search.type" style="width: 120px">
          <a-select-option :value="0">
            全部
          </a-select-option>
          <a-select-option :value="1">
            进入
          </a-select-option>
          <a-select-option :value="2">
            离开
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="button"
          :disabled="search.user === '' || search.id === ''"
          @click="handleSearch"
          >搜索
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <a-table :columns="columns" :data-source="filterDate" rowKey="time">
      <span slot="standardLoad" slot-scope="text">{{ text }} 吨</span>
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="datetime" slot-scope="text">{{
        moment(text).format("YYYY-MM-DD  HH:mm")
      }}</span>

      <span slot="select" slot-scope="text, record">
        <!-- <a-button
              type="primary"
              shape="circle"
              icon="edit"
              @click="showEditModal(record.id)"
            /> -->
        <a-popconfirm
          :title="'确认删除' + record.id"
          ok-text="Yes"
          cancel-text="No"
          @confirm="confirm(record.id)"
          @cancel="cancel"
        >
          <a-button type="danger" shape="circle" icon="delete" />
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: "车牌号",
    dataIndex: "cid",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "进入时间",
    dataIndex: "indatetime",
    scopedSlots: {
      customRender: "datetime",
    },
  },
  {
    title: "离开时间",
    dataIndex: "outdatetime",
    scopedSlots: {
      customRender: "datetime",
    },
  },

  {
    title: "货物种类",
    dataIndex: "gid",
    customRender: (text, record) => {
      return goods[text];
    },
  },
  {
    title: "进入重量",
    dataIndex: "inweight",
    scopedSlots: { customRender: "standardLoad" },
  },
  {
    title: "离开重量",
    dataIndex: "outweight",
    scopedSlots: { customRender: "standardLoad" },
  },
];
import { getAllRecord } from "@/api/index.ts";
import moment from "moment";
import { goods } from "@/utils/enum";
export default {
  name: "record",
  components: {},
  props: {},
  data() {
    return {
      data: [],
      filterDate: [],
      search: {
        cid: "",
        type: 0,
      },
      columns,
      form: {
        organizer: "",
        time: "",
        area: "",
        type: "",
        subject: "",
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.loadPermit();
  },
  methods: {
    moment,
    loadPermit() {
      getAllRecord()
        .then((res) => {
          this.data = [...res.data.data];
          console.log(res.data);
          this.filterDate = [...res.data.data];
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSearch() {
      //   console.log(this.search);
      var temp = this.data;
      if (this.search.type == 1) {
        temp = temp.filter((item) => {
          return !item.outdatetime;
        });
      } else if (this.search.type == 2) {
        temp = temp.filter((item) => item.outdatetime);
      }

      if (!this.search.cid) {
        temp = [...temp];
      } else {
        temp = temp.filter((item) => item.cid === this.search.cid);
      }

      this.filterDate = [...temp];
    },

    cancel(e) {
      console.log(e);
      this.$message.error("Click on No");
    },
    showEditModal(uid) {
      // this.editUid = uid;
      // this.editVisible = true;
    },
    confirm(e) {
      console.log(e);
      this.deleteActivity(e);
    },
  },
};
</script>

<style scoped lang="less"></style>
