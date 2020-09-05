<template>
  <div class="content">
    <div class="pages-header">
      <div><router-link to="/activity/tg" style="text-decoration:none;color:#000000;">团购管理</router-link>/编辑团购</div>
    </div>
    <div class="content-cont table-content">
      <div class="pages-inline">
        团购信息
      </div>
      <el-form ref="form" :model="form" :rules="rules1" label-width="120px">
        <el-form-item label="团购时间" prop="time" required>
          <el-date-picker
            v-model="time2"
            @change="changeDate"
            type="datetimerange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <div class="pages-inline">
          商品信息
        </div>
        <el-form-item  label="添加商品">
          <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showAdd=true">编辑商品</el-button>
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name" required>
          {{addForm.goods_name}}
          <el-button size="mini" type="danger" v-if="addForm.goods_name" @click="resetForm">删除</el-button>
        </el-form-item>
        <div style="margin: 20px">
          <el-table :data="skuArrList1" stripe border style="width: 100%">
            <el-table-column prop="attr_desc" label="已添加属性" ></el-table-column>
            <el-table-column prop="price" label="商品价格" >
              <template slot-scope="scope">
                ￥{{scope.row.price}}
              </template>
            </el-table-column>
            <el-table-column prop="activity_price" label="团购价格" >
              <template slot-scope="scope">
                ￥{{scope.row.activity_price}}
              </template>
            </el-table-column>
            <el-table-column prop="subsidy_precent" label="平台补贴比例" >
              <template slot-scope="scope">
                {{scope.row.subsidy_precent}}%
              </template>
            </el-table-column>
            <el-table-column prop="subsidy_money" label="预计补贴金额" >
              <template slot-scope="scope">
                ￥{{scope.row.subsidy_money}}/{{tableData.unit}}
              </template>
            </el-table-column>
            <el-table-column prop="limit_num" label="限购" ></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="mini" type="danger"  @click="delete_attr_arr(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in status_list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述:" prop="goods_desc" required>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="form.goods_desc"
            maxlength="50"
            show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit_form_add('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="编辑商品" :visible.sync="showAdd"   width="70%">
      <el-form  :model="addForm" ref="addForm" :rules="rules" class="demo-form-inline">
        <el-form-item label="商品名称:"  label-width="120px" required>
          <el-autocomplete
            v-model="addForm.goods_name"
            :fetch-suggestions="querySearchAsync"
            value-key="goods_name"
            placeholder="请输入商品名称"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="属性:"  label-width="120px" >
          <template v-if="tableData && tableData['shop_default_attr_value']">
            <div v-for="(item,index) in tableData['shop_default_attr_value']['specification']" class="attr_item">
              <p><span>{{item['attr']['attr_name']}}:</span>
                <span class="attr_value"  :class="{attr_value_active:cld.is_default}" @click="selectAttr(cld,index,idx,item['attr']['attr_name'])" v-for="(cld,idx) in item['attr_value']">{{cld['attr_value']}}</span>
              </p>
            </div>
            <div v-if="skuPri">价格:{{skuPri}}</div>
            <template>
              <el-button size="mini" @click="add_attr_arr">添加属性组合</el-button>
              <el-button size="mini" @click="add_attr_arr_all">添加所有属性组合</el-button>
            </template>
          </template>
        </el-form-item>
        <el-form-item>
          <el-table :data="skuArrList" stripe height="280" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column prop="attr_desc" label="已添加属性" ></el-table-column>
            <el-table-column prop="price" label="商品价格" width="100px"></el-table-column>
            <el-table-column prop="activity_price" label="团购价格" width="220px">
              <template slot-scope="scope">
                <el-form-item  >
                  <el-col :span="14">
                    <el-input v-model="addForm.activity_price[scope.$index]" value="this.test2" placeholder="请输入团购价格"></el-input>
                  </el-col>
                  <el-button  type="text"  size="mini"  @click="setAllPrince(scope.$index)">设置全部</el-button>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column  prop="subsidy_precent" label="平台补贴比例"  width="240px">
              <template slot-scope="scope" >
                <el-form-item  >
                  <el-input-number v-model="addForm.subsidy_precent[scope.$index]"  :min="0" :max="100" placeholder="请输入平台补贴比例"></el-input-number>
                  <el-button type="text" size="mini"  @click="setAllsubsidy_precent(scope.$index)">设置全部</el-button>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="限购" prop="limit_num" width="240px" >
              <template slot-scope="scope">
                <el-form-item  prop="limit_num">
                  <el-col :span="16">
                    <el-input v-model="addForm.limit_num[scope.$index]"  placeholder="不输入或0表示不限购"></el-input>
                  </el-col>
                  <el-button type="text" size="mini"  @click="setAllNum(scope.$index)">设置全部</el-button>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="mini" type="danger"  @click="delete_attr_arr(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item>
            <el-button type="primary" style="margin: 10px 0px 0px 200px" @click="resetForm()">重置</el-button>
            <el-button type="primary"   @click="submit_form('addForm')">立即提交</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        test2:"",
        time2:[],
        skuArrList:[],
        skuArrList1:[],
        tableData: [],
        skuArr:[],
        skuPri:null,
        form:{
          goods_name:'',
          goods_id:'',
          goods_pic:'',
          goods_price:'',
          goods_activity_price:'',
          spu_id:'',
          shop_id:'',
          time:[],
          goods_desc:'',
          status:'',
        },
        status_list:[
          {
            value: 1,
            label: '正常'
          },
          {
            value: 2,
            label: '草稿'
          }
        ],
        activityInfo:{
          time:[]
        },
        rules1:{
          goods_name: [
            {required: true, message: '请选择商品', trigger: 'blur'},
          ],
          time: [
            {required: true, message: '请选择团购时间', trigger: 'blur'},
          ],
          goods_desc: [
            {required: true, message: '请填写商品描述', trigger: 'blur'},
            { min: 0, max: 50, message: '商品描述长度在 0 到 50 个字符', trigger: 'blur' }
          ],
        },
        addForm:{
          goods_name:'',
          activity_price:[],
          subsidy_precent:[],
          subsidy_money:[],
          limit_num:[],
          goods_desc:''
        },
        showAdd:false,
        goods_name:'',
        selectRows:[],
        multipleSelection: [],
      }
    },
    created() {
      this.get_tg_info();
    },
    methods: {
      //生产Sku组合
      createAllSku(arr){
        //初始化结果为第一个数组
        var result= new Array();
        //字符串形式填充数组
        for(var i=0;i<arr[0].length;i++){
          result.push(JSON.stringify(arr[0][i]));
        }
        //从下标1开始遍历二维数组
        for(var i=1;i<arr.length;i++){
          //使用临时遍历替代结果数组长度(这样做是为了避免下面的循环陷入死循环)
          var size= result.length;
          //根据结果数组的长度进行循环次数,这个数组有多少个成员就要和下一个数组进行组合多少次
          for(var j=0;j<size;j++){
            //遍历要进行组合的数组
            for(var k=0;k<arr[i].length;k++){
              //把组合的字符串放入到结果数组最后一个成员中
              //这里使用下标0是因为当这个下标0组合完毕之后就没有用了，在下面我们要移除掉这个成员
              //组合下一个json字符串
              var temp= result[0]+","+JSON.stringify(arr[i][k]);
              result.push(temp);
            }
            //当第一个成员组合完毕，删除这第一个成员
            result.shift();
          }
        }
        //转换字符串为json对象
        for(var i=0;i<result.length;i++){
          result[i]= JSON.parse("["+result[i]+"]");
        }

        // let _arr = "";
        // let _id = "";
        // let _desc = "";
        let _obj={
          arr : []
        };
        let _value=""
        let _id=""
        let _price=0;
        let _desc="";
        let _attr_value_id="";
        let newResult = [];
        let _arr=[];
        result.forEach((item,index)=>{
          item.forEach((item2,index2)=>{
            _id  += item2.attr_value_id;
            _price = Number(item2.price)+Number(_price);
            _desc += item2.attr_value;
            _attr_value_id += item2.attr_value_id;
            name = item2.attr_name
            _arr.push({
              attr_id: item2.attr_id,
              attr_name: item2.attr_name,
              attr_value: item2.attr_value,
              attr_value_id:item2.attr_value_id,
              is_default: 1,
              price: item2.price,
            })
          });
          _obj = {
            attr_desc: _desc,
            goods_attr_id:_id,
            price: _price==0?this.tableData.benchmark_unit_price:_price,
            arr : _arr
          }
          newResult.push(_obj);
          _id = "";
          _price="";
          _desc="";
          _arr=[]
        });
        this.skuArrList = newResult;
        // return newResult;
      },
      async get_tg_info(){
        let aid = this.$route.query.aid;
        let res = await this.$request.post(this.$API.get_tg_info,
          {
            aid: aid,
          },'main',
          {
          });
        this.form=res.data;
        this.time2.push(this.form.start_time*1000);
        this.time2.push(this.form.end_time*1000);
        this.form.time=this.time2;
        this.addForm.goods_name=res.data.goods_name;

        res.data.attr_info.forEach((item,index)=>{
            this.addForm.activity_price.push(item.activity_price);
            this.addForm.subsidy_precent.push(item.subsidy_precent);
            this.addForm.limit_num.push(item.limit_num);
            item.arr = JSON.parse(item.goods_attr)
        });
        this.skuArrList=res.data.attr_info;
        this.skuArrList1=res.data.attr_info;
        this.get_goods_info(this.form.spu_id)
      },

      //重新修改tableData的值
      changeTableData(ind1,ind2){
        let data = JSON.parse(JSON.stringify(this.tableData))
        if(data.shop_default_attr_value.specification.length >= 1){
          data.shop_default_attr_value.specification.map((item1,index1)=>{
            if(ind1  == index1){
              item1.attr_value.map((item2,index2)=>{
                if(index2 == ind2){
                  item2.is_default = 1;
                }else{
                  item2.is_default = 0;
                }
              })
            }
          })
        }
        this.tableData = data;
      },

      //选择属性
      selectAttr(item,idx,cld_idx,attr_name){
        this.changeTableData(idx,cld_idx);
        let attr = this.tableData['shop_default_attr_value']['specification'][idx];
        let attrVal = attr["attr_value"][cld_idx];
        typeof this.skuArr[idx] == "undefined" && (this.skuArr[idx] = []);
        this.skuArr[idx]=attrVal;
        this.skuArr[idx]['attr_name']=attr_name;
        // if(this.skuArr[idx].findIndex(itemCld => itemCld['attr_value_id'] == attrVal['attr_value_id'])==-1){
        //   this.skuArr[idx].push(attrVal);
        // }

        let price = this.skuArr.reduce((a,b) => {return Number(a) +Number(b.price)},0);
        this.skuPri = price==0?this.tableData.benchmark_unit_price:price;
      },

      add_attr_arr_all(){
        this.skuArrList=[];
        let arr =[];
        this.tableData['shop_default_attr_value']['specification'].forEach((item,index)=>{
          arr[index]=item['attr_value'];
          item['attr_value'].forEach((item1,index1)=>{
            arr[index][index1]['attr_name']=item['attr']['attr_name']
          })
        });
        this.createAllSku(arr)
      },
      add_attr_arr(){
        if(this.skuArr.length !=this.tableData['shop_default_attr_value']['specification'].length){
          SendMessage({
            message: '请选择完整属性',
            type:'error'
          });
          return;
        }

        let _arr = JSON.parse(JSON.stringify({val:this.skuArr}))["val"];
        let _id = _arr.reduce((a,b) => a + b.attr_value_id,"")
        let _desc = _arr.reduce((a,b) => a + b.attr_value,"");
        if(this.skuArrList.findIndex(item => item.goods_attr_id == _id)>-1){
          SendMessage({
            message: '您已经添加该属性组合，请勿重复添加',
            type:'error'
          });
          return;
        }
        this.skuArrList.push({arr:_arr,price:this.skuPri,attr_desc:_desc,goods_attr_id:_id});
        //this.skuArr = [];
      },

      delete_attr_arr(index){
        this.skuArrList.splice(index,1);
      },
      changeDate(val){
        this.form.time=val;
      },

      setAllPrince(index){
        if(this.addForm.activity_price[index]==undefined){
          SendMessage({
            message: '请先填写该行价格',
            type:'error'
          });
          return;
        }
        let copy_form = JSON.parse(JSON.stringify(this.addForm));
        this.skuArrList.forEach((item,idx)=>{
          copy_form.activity_price[idx]=this.addForm.activity_price[index];
        })
        this.addForm = copy_form;
      },
      setAllsubsidy_precent(index){
        if(this.addForm.subsidy_precent[index]==undefined){
          SendMessage({
            message: '请先填写该行分成百分比',
            type:'error'
          });
          return;
        }
        let copy_form = JSON.parse(JSON.stringify(this.addForm));
        this.skuArrList.forEach((item,idx)=>{
          copy_form.subsidy_precent[idx]=this.addForm.subsidy_precent[index];
        });
        this.addForm = copy_form;
      },
      setAllNum(index){
        if(this.addForm.limit_num[index]==undefined){
          SendMessage({
            message: '请先填写该行限购数量',
            type:'error'
          });
          return;
        }
        let copy_form = JSON.parse(JSON.stringify(this.addForm));
        this.skuArrList.forEach((item,idx)=>{
          copy_form.limit_num[idx]=this.addForm.limit_num[index];
        });
        this.addForm = copy_form;
      },
      submit_form(){
        this.skuArrList.forEach((item,index)=>{
          item.limit_num=this.addForm.limit_num[index];
          if((item.limit_num!=='' || item.limit_num!==null || item.limit_num!=undefined) && Number(item.limit_num)>0){
            if(this.tableData.benchmark_num && Number(item.limit_num)<Number(this.tableData.benchmark_num)){
              SendMessage({
                message: '该商品基础购买数量为'+this.tableData.benchmark_num+',第'+(index+1)+'行限购数量错误',
                type:'error'
              });
              throw Error();
            }
          }
          item.activity_price=this.addForm.activity_price[index];
          if(item.activity_price==='' || item.activity_price===null || item.activity_price==undefined ){
            SendMessage({
              message: '请请填写第'+(index+1)+'行秒杀价格',
              type:'error'
            });
            throw Error();
          }
          item.subsidy_precent=this.addForm.subsidy_precent[index];
          if(item.subsidy_precent==='' || item.subsidy_precent===null || item.subsidy_precent==undefined ){
            SendMessage({
              message: '请请填写第'+(index+1)+'行补贴比例',
              type:'error'
            });
            throw Error();
          }
          let  subsidy_money=(item.price-this.addForm.activity_price[index]) * this.addForm.subsidy_precent[index]/100;
          item.subsidy_money = subsidy_money  < 0.01 ? (subsidy_money <= 0 ? 0 : 0.01) : Math.floor(subsidy_money  * 100) / 100
        });
        this.skuArrList1=this.skuArrList;
        this.form.goods_price=this.skuArrList[0]['price'];
        this.form.goods_activity_price=this.skuArrList[0]['activity_price'];
        this.showAdd=false;

      },
      resetForm(){
        this.addForm.goods_name='';
        this.addForm.activity_price=[];
        this.addForm.limit_num=[];
        this.addForm.subsidy_precent=[];
        this.skuArrList=[];
        this.skuArrList1=[];
        this.tableData=[];
      },
      submit_form_add(ruleForm){
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {
            if(this.skuArrList1.length<1){
              SendMessage({
                message: '请选择商品属性',
                type:'error'
              });
              return;
            }
            this.form.skuArrList=this.skuArrList1;
            this.form.specification = this.get_specification(this.skuArrList1);
            let res = await this.$request.post(this.$API.edit_tg,
              this.form,
              '',
              {
                handle_desc:'编辑团购;'+this.form.aid
              });
            if(res.code==200){
              SendMessage({
                message: '操作成功',
                type:'success'
              });
              this.$router.push({
                path: '/activity/tg',
              })
            }else{
              SendMessage({
                message: res.msg,
                type:'error'
              });
            }
          }
        });
      },

      get_specification(skuArrList){
        let arr = skuArrList.reduce((a,b)=>a.concat([b['arr']]),[]);
        let _arr = Array(arr[0].length).fill("");
        arr.forEach(item=>{
          let _obj = null;
          let _idx = null;
          item.forEach((cld,idx)=>{
            if(_arr[idx]==""){
              _arr[idx]=[];
            }
            if(_arr[idx].length==0 || _arr[idx].findIndex(item => item["attr_value_id"] == cld.attr_value_id)==-1){
              _obj = cld;
              _idx=idx;
              _arr[idx].push(cld);
            }
          });
        });
        let specification = JSON.parse(JSON.stringify({val:this.tableData['shop_default_attr_value']['specification']}))["val"];
        _arr.forEach((i,k)=>{
          specification[k]["attr_value"]=_arr[k]
        });
        return  specification;
      },

      async get_goods_list(goods_name){
        let param={};
        param['goods_name']=goods_name;
        param['goods_status']=0;
        param['audit_status']=1;
        let data = await this.$request.get(this.$API.common_api,
          param
          ,'main',
          {
            router_path: 'goods/goods',
            request_host: 'GOODS_SERVER_HOST',
          });
        return  data.data;
      },
      async querySearchAsync(queryString, cb) {
        if(queryString!='' && queryString!=null){
          let results = await this.get_goods_list(queryString);
          console.log(results);
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 1000 * Math.random());
        }

      },
      handleSelect(item) {
        console.log(item);
        this.get_goods_info(item.spu_id)
      },

      handleSelectionChange(val) {
        this.selectRows=val;
        this.multipleSelection = val;
      },
      async get_goods_info(spu_id){
        let param={};
        param['spu_id']=spu_id;
        let data = await this.$request.get(this.$API.common_api,
          param
          ,'main',
          {
            router_path: 'goods/goodsInfo',
            request_host: 'GOODS_SERVER_HOST',
          });
        console.log(data.data);
        //debugger

        //默认数据重置第一位 is_defaule = 0
        if(data.data.shop_default_attr_value.specification.length >= 1){
          data.data.shop_default_attr_value.specification.map((item1,index1)=>{
            item1.attr_value.map((item2,index2)=>{
              if(item2.is_default){
                item2.is_default = 0;
              }
            })
          })
        }
        this.tableData=data.data;
        this.form.goods_name=data.data.goods_name;
        this.form.goods_id=data.data.goods_id;
        this.form.spu_id=data.data.spu_id;
        this.form.shop_id=data.data.shop_id;
        this.form.goods_pic=data.data.goodspicture_set[0]['pic_url'];

      },
      formatDate(time) {
        let times = time * 1000;
        let date = new Date(times);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s
      }
    },
    filters:{
      filterT(str){
        if(str){
          return str.replace('T', ' ')
        }else{
          return  '';
        }

      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .content-cont {
    width: calc(~"100% - 30px");
    margin: 15px;
    min-height: 10px;
    background: #ffffff;
  }

  .form-search {
    margin: 15px;
  }
  .attr_value {
    border: 1px solid #d1d1d1;
    margin-left: 6px;
    padding: 2px 12px;
    cursor: pointer;
  }
  .attr_value_active {
    color: #d13a26;
    border-color: #d13a26;
    border: 1px solid;
    padding: 2px 12px;
  }
  .pages-inline {
    width: calc(100% - 48px);
    height: 40px;
    background: #cccccc;
    margin-left: 15px;
    line-height: 40px;
    padding-left: 18px;
  }
</style>
