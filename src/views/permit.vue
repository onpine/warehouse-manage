<template>
  <div class="activity">
    <a-form-model layout="inline" :model="search">
      <a-form-model-item>
        <a-input v-model="search.cid" placeholder="车牌号"> </a-input>
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
      <span
        slot="PartyFeeSubmitTime"
        slot-scope="time, record"
        @click="click(record.uid)"
      >
        <a-date-picker
          :default-value="moment(time || null, 'YYYY-MM-DD')"
          @change="onChange"
        />
      </span>
      <span slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">
          {{ text ? "有效" : "无效" }}
        </a-tag>
      </span>

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
    title: "公司",
    dataIndex: "company",
  },
  {
    title: "联系方式",
    dataIndex: "phone",
  },
  {
    title: "开始时间",
    dataIndex: "opendts",
  },
  {
    title: "结束时间",
    dataIndex: "opendte",
  },

  {
    title: "货物种类",
    dataIndex: "gid",
    customRender: (text, record) => {
      return goods[text];
    },
  },
  {
    title: "标准载重",
    dataIndex: "standardLoad",
    scopedSlots: { customRender: "standardLoad" },
  },
  {
    title: "有效状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
    fixed: "right",
  },
];
import { getPermits } from "@/api/index.ts";
import moment from "moment";
import { goods } from "@/utils/enum";
export default {
  name: "permit",
  components: {},
  props: {},
  data() {
    return {
      data: [],
      filterDate: [],
      search: {
        cid: "",
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
      getPermits()
        .then((res) => {
          this.data = res.data.effective.map((el) => {
            return {
              ...el,
              status: (() => {
                let cur = moment().unix();
                let opendts = moment(el.opendts).unix();
                let opendte = moment(el.opendte).unix();
                // console.log(opendts, cur, opendte);
                if (cur < opendts || cur > opendte) {
                  return false;
                } else {
                  return true;
                }
              })(),
            };
          });
          console.log(res.data);
          this.filterDate = [...this.data];
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSearch() {
      // console.log(this.search);
      if (!this.search.cid) {
        return (this.filterDate = [...this.data]);
      }
      this.filterDate = [
        ...this.filterDate.filter((item) => {
          return item.cid === this.search.cid;
        }),
      ];
      // console.log(this.filterDate);
    },
    handleChange(value) {
      console.log(`selected ${value}`);
      this.type = value;
    },
    handleSubmit() {
      const key = "_addActivity";
      addActivity(this.form)
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.$message.success({ content: "添加成功!", key, duration: 2 });
            // this.resetForm();
          } else {
            this.$message.warning({ content: "添加失败了!", key, duration: 2 });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message.error({ content: "请求失败!", key, duration: 2 });
        });
    },
    onTimeChange(date, dateString) {
      this.form.time = dateString;
    },
    callback(key) {
      console.log(key);
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
    deleteActivity(id) {
      const _this = this;
      const key = "_delete";
      this.$message.loading({ content: "Loading...", key, duration: 0 });
      deleteActivity(id)
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.$message.success({ content: "删除成功!", key, duration: 2 });
            for (let index = 0; index < _this.data.length; index++) {
              if (_this.data[index].id == id) {
                _this.data.splice(index, 1);
              }
            }
            for (let index = 0; index < _this.filterDate.length; index++) {
              if (_this.filterDate[index].id == id) {
                _this.filterDate.splice(index, 1);
              }
            }
          } else {
            this.$message.warning({ content: "添加失败!", key, duration: 2 });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({ content: "请求失败!", key, duration: 2 });
        });
    },
    // disabledDate(current) {
    //   // Can not select days before today and today
    //   return current && current < moment().endOf("day");
    // },
    // disabledDateTime() {
    //   return {
    //     disabledHours: () => this.range(0, 24).splice(4, 20),
    //     disabledMinutes: () => this.range(30, 60),
    //     disabledSeconds: () => [55, 56],
    //   };
    // },
    // range(start, end) {
    //   const result = [];
    //   for (let i = start; i < end; i++) {
    //     result.push(i);
    //   }
    //   return result;
    // },
    // disabledRangeTime(_, type) {
    //   if (type === "start") {
    //     return {
    //       disabledHours: () => this.range(0, 60).splice(4, 20),
    //       disabledMinutes: () => this.range(30, 60),
    //       disabledSeconds: () => [55, 56],
    //     };
    //   }
    //   return {
    //     disabledHours: () => this.range(0, 60).splice(20, 4),
    //     disabledMinutes: () => this.range(0, 31),
    //     disabledSeconds: () => [55, 56],
    //   };
    // },
  },
};
</script>

<style scoped lang="less"></style>
