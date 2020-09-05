<template>
  <el-dialog title="选择活动模版" :visible.sync="showDialog" width="45%" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-table
      ref="special"
      :data="dataList"
      @current-change="currentChange"
      style="width: 100%;min-height:420px"
      v-loading="loading"
      highlight-current-row>
      <el-table-column prop="activity_id" label="选择" width="60">
        <template slot-scope="scope">
        <i class="el-icon-check" style="color: #66b1ff;font-size: 25px!important;font-weight: bold"
           v-if="nowId==scope.row.activity_id"></i>
        </template>
      </el-table-column>
      <el-table-column prop="activity_id" label="活动ID" ></el-table-column>
      <el-table-column prop="activity_name" label="活动名称" ></el-table-column>
      <el-table-column prop="pc_navigation_map" label="PC楼层导航图" >
        <template slot-scope="scope">
          <img :src="scope.row.pc_navigation_map" alt="" height="50">
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-style">
      <el-pagination
        background
        @current-change="(res)=>{this.page=res;this.getList()}"
        :page-size="size"
        layout="total, prev, pager, next"
        :total=total>
      </el-pagination>
    </div>
    <div class="submit-cont" v-show="nowId || false">
      <el-badge :value="nowId ? 1 : 0" class="item">
        <el-button type="primary" @click="confirmOk">确认选择{{lower ?
        '（'+lower+'）' : ''}}
        </el-button>
      </el-badge>
    </div>
  </el-dialog>
</template>

<script lang="ts">
    import {Vue, Component, Watch} from "vue-property-decorator";

    @Component({name: "DialogActivity"})
    export default class DialogActivity extends Vue {
        name: 'dialogActivity';

        showDialog: boolean = false;

        dataList: any = [];
        loading:boolean = false;
        total:number = 0;
        page: number = 1;
        size: number = 10;
        nowId: string = '';
        lower: string = '';


        setData(state, data) {
            this.showDialog = state;
            this.lower = data.lower;
            this.nowId = data.id;
            state && this.getList().then();
        }

        async getList() {
            this.loading = true;
            let res = await this.$request.get(this.$API.common_api, {
                pageNo: this.page,
                pageSize: this.size,
            }, 'main', {
                router_path: 'activity/activityList',
                request_host: 'CATEGORY_SERVER_HOST',
                handle_desc: ';'
            });
            this.dataList = res.data;
            this.total = res.total ? res.total : 20;
            this.loading = false;
        }

        confirmOk(){
            this.$emit('selectActivity',this.nowId,this.lower);
            this.showDialog = false
        }

        currentChange(e){
            if(e && e['activity_id']){
                this.nowId = e['activity_id'];
                this.lower = e['activity_name'];
            }
        }

        @Watch('showDialog', {immediate: true, deep: true})
        onPersonChanged(val: Person, oldVal: Person) {
            if(!val){
                this.total = 0;
                this.page = 1;
                this.size = 10;
                this.dataList = [];
                this.lower = '';
                this.nowId = '';
            }
        }

    }
</script>

<style scoped>

</style>