<template>
  <div class="content">
    <div class="pages-header">
      <div>im对话监控</div>
    </div>
    <div class="content-cont table-content">
      <div class="form-search">
        <el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
          <el-form-item label="用户" prop="user_id">
            <el-autocomplete
              v-model="state"
              :fetch-suggestions="querySearchAsync"
              :debounce=1000
              placeholder="请输入内容搜索后选择"
              @select="handleSelect"
            >
              <template slot-scope="{item}">
                <div class="name" v-if="item.email!=''">{{item.value=item.email}}</div>
                <div class="name" v-else>{{item.value=item.mobile}}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="店铺名称" prop="shop_id">
            <el-select v-model="searchForm.shop_id" id="select" @change="changeSelect" filterable placeholder="店铺名称,输入名称可搜索" >
              <el-option
                v-for="item in shop_list"
                :key="item.shop_id"
                :label="item.shop_name"
                :value="item.shop_id"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间" prop="operator_time">
            <el-date-picker
              v-model="searchForm.operator_time"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" >筛选</el-button>
            <el-button @click="resetForm('searchForm')">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </div>
    <div class="table-content">


      <div class="msg-content">
        <div class="msg-list" v-if="item.from.indexOf('s')>-1 " v-for="(item,index) in tableData">
          <div>
            <div class="msg-box" v-if="item.type==0" v-html="filterEmoji(item.body.msg)">{{filterEmoji(item.body.msg)}}</div>
            <div class="msg-box" v-else-if="item.type==1" ><preview-image :image="item.body.url" key="key" width="200px" ></preview-image></div>
            ：{{shop_name}}
          </div>

          <div class="msg-time">{{item.sendtime|formatDate}}</div>
        </div>
        <div class="msg-list-left" v-else >
          <div>
            {{user_name}}：
            <div class="msg-box" v-if="item.type==0" v-html="filterEmoji(item.body.msg)">{{filterEmoji(item.body.msg)}}</div>
            <div class="msg-box" v-else-if="item.type==1" ><preview-image :image="item.body.url" key="key" width="200px" ></preview-image></div>
            <div class="msg-box" v-else-if="item.type==100" >
              <div v-if="item.body.type==100" @click="show_goods_info(item.body.data.goodsId,item.body.data.shopId)">
                <img :src="item.body.data.imageUrl" style="float: left;width:60px;height:60px; " >
                <div style="float: left;font-size: 14px; margin-left: 10px; width: 300px;">
                  <p style="margin-bottom: 10px;margin-top: 5px;">{{item.body.data.goodsName}}</p>
                  <p>{{item.body.data.price}}/{{item.body.data.unit}}</p>

                </div>

              </div>
              <div v-if="item.body.type==101">
                <div class="clearfix" style="border-bottom: 1px dashed #fff; font-size: 14px; padding-bottom: 10px;margin-bottom: 10px;">
                  <img :src="item.body.data.imageUrl" style="float: left;width:60px;height:60px; display: block">
                  <div style="float: left;margin-left: 10px;">
                    <p style="margin-top: 5px;"> {{item.body.data.goodsName}}</p>
                    <p style=" margin-top: 5px;">共{{item.body.data.goodsNum}}件商品 {{item.body.data.should_money}}元</p>
                  </div>
                </div>

                <p class="msg-order"><span>订单号:</span>{{item.body.data.order_sn}}</p>
                <p class="msg-order"><span>下单时间:</span>{{item.body.data.orderTime}}</p>
                <p class="msg-order"><span>收货人:</span>{{item.body.data.consignee}}</p>
                <p class="msg-order"><span>收货地址:</span>{{item.body.data.address}}</p>

              </div>
            </div>
            <div class="msg-time">{{item.sendtime|formatDate}}</div>
          </div>
        </div>
      </div>

    </div>

  </div>
  </div>

</template>
<script>
  import tagList from '../../components/TagList';
  import PreviewImage from '../../components/PreviewImage'
  export default {
    data () {
      return {
        ppy_host:CUSTOM_CONFIG.PPY_HOST,
        showEdit: false,
        searchForm: {
          shop_id: '',
          user_id: '',
        },
        tableData: [],
        userData: [],
        shop_list:[],
        userInfo:[],
        restaurants: [],
        user_name:'',
        shop_name:'',
        show_key:'',
        state: '',
        timeout:  null,
        emoji:{"[大笑]":{file:"emoji_0.png"},"[可爱]":{file:"emoji_01.png"},"[色]":{file:"emoji_02.png"},"[嘘]":{file:"emoji_03.png"},"[亲]":{file:"emoji_04.png"},"[呆]":{file:"emoji_05.png"},"[口水]":{file:"emoji_06.png"},"[汗]":{file:"emoji_145.png"},"[呲牙]":{file:"emoji_07.png"},"[鬼脸]":{file:"emoji_08.png"},"[害羞]":{file:"emoji_09.png"},"[偷笑]":{file:"emoji_10.png"},"[调皮]":{file:"emoji_11.png"},"[可怜]":{file:"emoji_12.png"},"[敲]":{file:"emoji_13.png"},"[惊讶]":{file:"emoji_14.png"},"[流感]":{file:"emoji_15.png"},"[委屈]":{file:"emoji_16.png"},"[流泪]":{file:"emoji_17.png"},"[嚎哭]":{file:"emoji_18.png"},"[惊恐]":{file:"emoji_19.png"},"[怒]":{file:"emoji_20.png"},"[酷]":{file:"emoji_21.png"},"[不说]":{file:"emoji_22.png"},"[鄙视]":{file:"emoji_23.png"},"[阿弥陀佛]":{file:"emoji_24.png"},"[奸笑]":{file:"emoji_25.png"},"[睡着]":{file:"emoji_26.png"},"[口罩]":{file:"emoji_27.png"},"[努力]":{file:"emoji_28.png"},"[抠鼻孔]":{file:"emoji_29.png"},"[疑问]":{file:"emoji_30.png"},"[怒骂]":{file:"emoji_31.png"},"[晕]":{file:"emoji_32.png"},"[呕吐]":{file:"emoji_33.png"},"[拜一拜]":{file:"emoji_160.png"},"[惊喜]":{file:"emoji_161.png"},"[流汗]":{file:"emoji_162.png"},"[卖萌]":{file:"emoji_163.png"},"[默契眨眼]":{file:"emoji_164.png"},"[烧香拜佛]":{file:"emoji_165.png"},"[晚安]":{file:"emoji_166.png"},"[强]":{file:"emoji_34.png"},"[弱]":{file:"emoji_35.png"},"[OK]":{file:"emoji_36.png"},"[拳头]":{file:"emoji_37.png"},"[胜利]":{file:"emoji_38.png"},"[鼓掌]":{file:"emoji_39.png"},"[握手]":{file:"emoji_200.png"},"[发怒]":{file:"emoji_40.png"},"[骷髅]":{file:"emoji_41.png"},"[便便]":{file:"emoji_42.png"},"[火]":{file:"emoji_43.png"},"[溜]":{file:"emoji_44.png"},"[爱心]":{file:"emoji_45.png"},"[心碎]":{file:"emoji_46.png"},"[钟情]":{file:"emoji_47.png"},"[唇]":{file:"emoji_48.png"},"[戒指]":{file:"emoji_49.png"},"[钻石]":{file:"emoji_50.png"},"[太阳]":{file:"emoji_51.png"},"[有时晴]":{file:"emoji_52.png"},"[多云]":{file:"emoji_53.png"},"[雷]":{file:"emoji_54.png"},"[雨]":{file:"emoji_55.png"},"[雪花]":{file:"emoji_56.png"},"[爱人]":{file:"emoji_57.png"},"[帽子]":{file:"emoji_58.png"},"[皇冠]":{file:"emoji_59.png"},"[篮球]":{file:"emoji_60.png"},"[足球]":{file:"emoji_61.png"},"[垒球]":{file:"emoji_62.png"},"[网球]":{file:"emoji_63.png"},"[台球]":{file:"emoji_64.png"},"[咖啡]":{file:"emoji_65.png"},"[啤酒]":{file:"emoji_66.png"},"[干杯]":{file:"emoji_67.png"},"[柠檬汁]":{file:"emoji_68.png"},"[餐具]":{file:"emoji_69.png"},"[汉堡]":{file:"emoji_70.png"},"[鸡腿]":{file:"emoji_71.png"},"[面条]":{file:"emoji_72.png"},"[冰淇淋]":{file:"emoji_73.png"},"[沙冰]":{file:"emoji_74.png"},"[生日蛋糕]":{file:"emoji_75.png"},"[蛋糕]":{file:"emoji_76.png"},"[糖果]":{file:"emoji_77.png"},"[葡萄]":{file:"emoji_78.png"},"[西瓜]":{file:"emoji_79.png"},"[光碟]":{file:"emoji_80.png"},"[手机]":{file:"emoji_81.png"},"[电话]":{file:"emoji_82.png"},"[电视]":{file:"emoji_83.png"},"[声音开启]":{file:"emoji_84.png"},"[声音关闭]":{file:"emoji_85.png"},"[铃铛]":{file:"emoji_86.png"},"[锁头]":{file:"emoji_87.png"},"[放大镜]":{file:"emoji_88.png"},"[灯泡]":{file:"emoji_89.png"},"[锤头]":{file:"emoji_90.png"},"[烟]":{file:"emoji_91.png"},"[炸弹]":{file:"emoji_92.png"},"[枪]":{file:"emoji_93.png"},"[刀]":{file:"emoji_94.png"},"[药]":{file:"emoji_95.png"},"[打针]":{file:"emoji_96.png"},"[钱袋]":{file:"emoji_97.png"},"[钞票]":{file:"emoji_98.png"},"[银行卡]":{file:"emoji_99.png"},"[手柄]":{file:"emoji_100.png"},"[麻将]":{file:"emoji_101.png"},"[调色板]":{file:"emoji_102.png"},"[电影]":{file:"emoji_103.png"},"[麦克风]":{file:"emoji_104.png"},"[耳机]":{file:"emoji_105.png"},"[音乐]":{file:"emoji_106.png"},"[吉他]":{file:"emoji_107.png"},"[火箭]":{file:"emoji_108.png"},"[飞机]":{file:"emoji_109.png"},"[火车]":{file:"emoji_110.png"},"[公交]":{file:"emoji_111.png"},"[轿车]":{file:"emoji_112.png"},"[出租车]":{file:"emoji_113.png"},"[警车]":{file:"emoji_114.png"},"[自行车]":{file:"emoji_115.png"}}

      }
    },
    created(){
      this.get_shop_list()
    },

    methods: {
      filterEmoji(text){
        var re = /\[([^\]\[]*)\]/g;
        var matches = text.match(re) || [];
        for (var j = 0, len = matches.length; j < len; ++j) {
          if(this.emoji[matches[j]]){
            text = text.replace(matches[j], '<img class="emoji" src="https://www.paipaiyin.cn/webdemo/im/images/emoji/' + this.emoji[matches[j]].file + '" />');
          }
        }
        return text;

      },
      async get_im_list(){
        let begintime='';
        let endtime='';
        if(this.searchForm.operator_time){
          begintime =this.searchForm.operator_time[0];
          endtime =this.searchForm.operator_time[1];
        }
        if(begintime==endtime){
          SendMessage({
            message:'请勿选择相同的开始时间与结束时间',
            type:'error'
          });
          return false;
        }

        let result = await this.$request.request(
          this.$API.common_api,
          {
            to:this.searchForm.shop_id,
            fromx:this.searchForm.user_id,
            begintime:begintime,
            endtime:endtime,
          },
          'main',
          'post',
          {
            router_path: 'im/list',
            request_host: 'CUSTOMER_SERVER_HOST',
          });
        if(result.msgs!=''){
          this.tableData = result.msgs
        }else{
          this.tableData=[];
          SendMessage({
            message:'没有查到聊天记录',
            type:'error'
          });
        }

      },

      async get_shop_list(){
        let res = await this.$request.get(this.$API.common_api, '', 'main',
          {
            router_path: 'shop/get_shop_name_list',
            request_host: 'APP_SELLER_SERVER_HOST',
            handel_class: ''
          });
        this.shop_list=res.data;
      },

      async memberList (queryString) {
        this.loading = true;
        let param = {};
        param['accounts'] = queryString;
        let {data} = await this.$request.request(this.$API.common_api,param, 'main', 'GET', {
          router_path: 'mid/user/information',
          request_host:'MEMBER_USER_HOST',
        });
        let arr =[];
        if(data.mobile!=''){
          this.show_key=data.mobile;
        }
        arr['mobile']=data.mobile;
        arr['email']=data.email;
        arr['user_id']=data.user_id;
        let arr1=[];
        arr1[0]=arr;
        this.restaurants=arr1;
        return arr1

      },

      async querySearchAsync(queryString, cb) {
        console.log(queryString);
        if(queryString!='' && queryString!=null){
          let  result = await this.memberList(queryString);
          this.user_name=queryString;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(result);
          }, 1000 * Math.random());
        }
      },
      handleSelect(item) {
        console.log(item);
        this.userInfo=item;
        this.searchForm.user_id=item.user_id;
      },
      changeSelect(val){
        let obj = {};
        obj = this.shop_list.find((item)=>{
          return item.shop_id === val;
        });
        this.shop_name=obj.shop_name;
      },
      show_goods_info(goods_id,shop_id){
        window.open(this.ppy_host+'/customer/shop/'+shop_id+'/goods/'+goods_id,'_blank');
      },

      resetForm(formName) {

        this.$refs[formName].resetFields();
        this.state='';
      },

      search(){
        if(this.searchForm.shop_id==''){
          SendMessage({
            message:'请选择店铺',
            type:'error'
          });
          return false
        }
        if(this.searchForm.user_id==''){
          SendMessage({
            message:'请选择用户',
            type:'error'
          });
          return false
        }
        this.get_im_list();
      },

    },
    components: {
      tagList,  PreviewImage
    },
    filters:{
      formatDate(time) {
        time=time.toString();
        time =  time.substring(0,time.length-3);
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

  }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";
  p{
    margin: 0;padding: 0;
  }
  .clearfix{
    *zoom: 1;
  }
  .msg-order{
    font-size: 12px;
    span{
      color: #666;
      display: inline-block;
      width: 60px;
    }
  }
  .msg-time{
    font-size: 12px;
    color: #999;
    margin-bottom: 20px;
  }
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
  .content {
    width: 100%;
    background: #f5f5f5;
    border-bottom: 1px #eeeeee solid;
    border-radius: 5px;

    .table-content {
      margin: 15px;
      height: auto;
      box-shadow:none;

    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .msg-content{

      width: 900px;
      max-height: 600px;
      overflow: auto;
      border: 1px solid #eee;
    }
    .msg-list-left {
      position: relative;
      padding-left: 30px;
      text-align: left;
      margin-top: 10px;
      .msg-box{
        background: #ddd;
      }
    }
    .msg-list{
      position: relative;
      text-align: right;
      padding-right: 30px;
      margin-top: 10px;
      .msg-box{
        background: #409EFF;
        color: #fff;
      }

    }
    .msg-box{

      max-width: 50%;
      display: inline-block;
      padding:  10px;
      border-radius: 5px;
      text-align: left;
      img{
        max-width: 300px;
      }
    }
  }
</style>
