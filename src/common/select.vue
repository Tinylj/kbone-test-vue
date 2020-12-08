<template>
	<span class="lh-select lh-down-component" v-bind:class="size + (styleType==='second'?' lh-select-second ':'')" ref="lhSelect" v-bind:style="{width: inputWidth}">
		<span class="lh-select-text" v-bind:class="status + (disabled?' disabled ':' ')" @click="selectClick('all')">
			<div class="lh-select-placeholder" v-show="showList.length===0">{{placeholder}}</div>
			<template v-if="selectType == '2'">
				<span class="lh-select-node text-overflow pull-left" v-if="index===0" v-for="(item,index) in showList">
                    <span :title="item.name" v-html="item.name"></span><i class="el-icon-error" @click.stop="delTopItem(item)"></i>
                </span>
				<span class="lh-select-more pull-left" v-if="showList.length>1">
					+{{showList.length-1}}
				</span>
			</template>
			<template v-if="selectType == '1'">
				<div class="lh-select-single text-overflow" v-for="item in showList" v-html="item.name"></div>
			</template>
			<template v-if="styleType==='normal'">
				<i class="dropdown-icon lh-ui-font icon_drop_down"/>
			</template>
            <i class="dropdown-icon-caret-bottom" v-if="styleType==='second'"></i>
		</span>
		<span class="triangle_border_up" v-if="!disabled"></span>
		<div class="lh-select-ul" v-bind:style="{width: ulWidth}">
			<div class="lh-select-search" v-if="filterShow">
				<input placeholder="输入关键词检索" v-model="filterText" />
			</div>
			<ul class="lh-scroll-common" v-if="!disabled" v-bind:style="{maxHeight:(maxHeight + 'px')}">
				<li v-show="filterTextIn(item.name)" v-for="item in myoptionList" @click="itemClick(item.value)" v-bind:class="selectType=='1'?'':(item.active?'active':'')">
					<span :title="isTitle?item.name:''" v-html="item.name"></span>
				</li>
				<div class="nullMsg" v-if="myoptionList.length === 0">-&nbsp;{{nullMsg}}&nbsp;-</div>
			</ul>
		</div>
	</span>
</template>

<script>
    export default {
        name: "lhSelect",
        componentName: 'lhSelect',
        model: {
            prop: 'selectValue', //提供给外界的v-model
            event: 'cc'
        },
        props: {
            selectValue: [String, Object, Array, Number],
            optionList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            width: {
                type: [Number, String],
                default: "200"
            },
            selectWidth: {
                // 下拉候选框的宽度。可选。不填时默认为width
                type: [Number, String],
                default: ""
            },
            maxHeight: {
                type: [Number, String],
                default: "200"
            },
            status: {
                type: String,
                default: 'success'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            backType: {
                type: String,
                default: "object" //backType 应该是value 或者 Object
            },
            selectType: {
                type: String,
                default: '1'
            },
            size: {
                type: String,
                default: ''
            },
            defaultSelect: {
                type: Boolean,
                default: false
            },
            nullMsg: {
                type: String,
                default: '暂无可选择的数据'
            },
            isTitle: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: '-请选择-',
            },
            filterShow: {
                type: Boolean,
                default: false,
            },
            styleType: {
                type: String,
                default: 'normal'
            },
        },
        data() {
            return {
                myoptionList: this.optionList || [],
                ulStatus: false,
                showList: [],
                filterText: '',//检索字符串
                inputWidth: '',//input的宽度
                ulWidth: '',//下拉候选的宽度
            };
        },
        watch: {
            optionList: {
                immediate: true,
                handler: function (val) {
                    const data = JSON.parse(JSON.stringify(val)) || [];
                    if (this.defaultSelect) {
                        data.unshift({
                            name: this.placeholder,
                            value: ''
                        });
                    }
                    for (let i = 0; i < data.length; i++) {
                        data[i]["active"] = false;
                    }
                    this.myoptionList = data;
                    //optionList也会触发一次selectValue的反显绑定事件
                    this.selectValueChange(this.selectValue);
                },
                deep: true
            },
            selectValue: {
                immediate: true,
                handler: function (newVal, oldVal) {
                    // let isEqual = true;
                    // if(typeof oldVal =="undefined") {
                    //     isEqual = false;
                    // }
                    // else if(val.length != oldVal.length) {
                    //     isEqual = false;
                    // }
                    // else {
                    //     for(let i=0;i<val.length;i++) {
                    //         if(val[i].value != oldVal[i].value) {
                    //             isEqual = false;
                    //         }
                    //     }
                    // }
                    // if(isEqual) {
                    //     return;
                    // }
                    this.selectValueChange(newVal);
                }
            },
            showList: {
                // immediate: true,
                handler: function (val, oldVal) {
                    //单选时刻
                    if (this.selectType == "1") {
                        if (this.showList.length > 0) {
                            //如果返回值是value
                            if (this.backType == "value") {
                                // this.$emit("cc",val[0].value);
                                this.commitCC(val[0].value);
                            }
                            //如果返回值是Object
                            else {
                                // this.$emit("cc",{name:val[0].name,value:val[0].value});
                                this.commitCC({name: val[0].name, value: val[0].value});
                            }
                        } else {
                            // this.$emit("cc","");
                            this.commitCC("");
                        }
                    }
                    //多选时刻
                    else {
                        if (this.showList.length > 0) {
                            //返回的是value
                            if (this.backType == "value") {
                                let backvalue = this.showList[0].value;
                                for (let i = 1; i < this.showList.length; i++) {
                                    backvalue = backvalue + "," + this.showList[i].value;
                                }
                                // this.$emit("cc",backvalue);
                                this.commitCC(backvalue);
                            }
                            //返回的Object
                            else {
                                const cplist = [];
                                for (let i = 0; i < this.showList.length; i++) {
                                    cplist.push({name: val[i].name, value: val[i].value});
                                }
                                // this.$emit("cc",cplist);
                                this.commitCC(cplist);
                            }
                        } else {
                            // this.$emit("cc","");
                            this.commitCC("");
                        }

                    }
                },
                deep: true
            },
            width: {
                immediate: true,
                handler: function (val) {
                    const inputWidth = this.initWidth(val);
                    this.inputWidth = inputWidth;
                },
            },
            selectWidth: {
                immediate: true,
                handler: function (val) {
                    if(val === '') {
                        val = this.width;
                    }
                    const ulWidth = this.initWidth(val);
                    this.ulWidth = ulWidth;
                },
            },
        },
        methods: {
            //删除最上面的
            delTopItem(item){
                for(let i=0; i<this.showList.length; i++) {
                    if(this.showList[i].value == item.value){
                        this.showList.splice(i, 1);
                        break;
                    }
                }
            },
            //点击li的时候
            itemClick(value) {
                this.changeClick(value);
                this.$emit("itemClick");//给外界一个item 点击时候的callback事件
            },
            //切换选择
            changeClick(value) {
                //如果是单选
                if (this.selectType == 1) {
                    this.showList = [];
                    if (value !== "" && value != null) {
                        for (let j = 0; j < this.myoptionList.length; j++) {
                            const copy_j = this.myoptionList[j];
                            if (copy_j.value === value) {
                                this.showList.push({name: copy_j.name, value: copy_j.value});
                            }
                        }
                    }
                    this.selectClick("up");
                }
                //多选
                else {
                    //点击请选择或者不限的时候用的
                    if (value === "" || value == null) {
                        this.showList = [];
                    } else {
                        for (let i = 0; i < this.myoptionList.length; i++) {
                            const copy_i = this.myoptionList[i];
                            if (copy_i.value === value) {
                                copy_i.active = !copy_i.active;
                                if (copy_i.active) {
                                    this.showList.push({name: copy_i.name, value: copy_i.value});
                                } else {
                                    let romoveIndex = -1;
                                    for (let j = 0; j < this.showList.length; j++) {
                                        if (this.showList[j].value === copy_i.value) {
                                            romoveIndex = j;
                                        }
                                    }
                                    if (romoveIndex !== -1) {
                                        this.showList.splice(romoveIndex, 1);
                                    }
                                }
                                break;
                            }
                        }
                    }


                }
            },
            //点击下拉
            selectClick(param) {
                //判断是不是禁用
                if (this.disabled) {
                    return;
                }
                //判断是不是已经加载完
                const lhSelect = this.$refs.lhSelect;
                if (lhSelect == null) {
                    return;
                }
                if (param == "all") {
                    const thisClassStatus = lhSelect.classList.contains("active");
                    this.clearAllSelects();
                    if (!thisClassStatus) {
                        lhSelect.classList.add("active");
                    }
                } else {
                    this.clearAllSelects();
                    if (param == "down") {
                        lhSelect.classList.add("active");
                    } else if (param == "up") {
                        lhSelect.classList.remove("active");
                    }
                }
                this.$emit("selectClick");//给外界一个点击时候的callback事件
            },
            // 闭合所有下拉选择框
            clearAllSelects() {
                const eles = document.querySelectorAll('.lh-down-component');
                for (let i = 0; i < eles.length; i++) {
                    eles[i].classList.remove("active");
                }
            },
            //commit之前匹配一下看看值是不是相同。可以减少一次watch的情况。
            commitCC(val) {
                const oldVal = this.selectValue;
                let isEqual = true;
                if (typeof oldVal === "undefined") {
                    isEqual = false;
                } else if (val.length != oldVal.length) {
                    isEqual = false;
                } else {
                    //如果是数组进行这种判断
                    if (Array.isArray(val)) {
                        for (let i = 0; i < val.length; i++) {
                            if (val[i].value !== oldVal[i].value) {
                                isEqual = false;
                            }
                        }
                    }
                    //如果是对象
                    else if (typeof val === "object") {
                        if (val.value !== oldVal.value) {
                            isEqual = false;
                        }
                    }
                    //如果是String
                    else {
                        if (val !== oldVal) {
                            isEqual = false;
                        }
                    }
                }
                if (isEqual) {
                    return;
                }
                this.$emit("cc", val);
            },
            //selectValue 导致的数据变化
            selectValueChange(newVal) {
                if (this.optionList.length === 0) {
                    return;
                }
                const val = (newVal == null ? "" : newVal);
                //逻辑闭环没有问题
                this.showList = [];
                for (let i = 0; i < this.myoptionList.length; i++) {
                    this.myoptionList[i]["active"] = false;
                }
                //back-type:"Object" 单选
                if (typeof val == "object" && !Array.isArray(val)) {
                    this.changeClick(val.value);
                }
                //back-type:"Object" 多选
                else if (typeof val == "object" && Array.isArray(val)) {
                    for (let i = 0; i < val.length; i++) {
                        for (let j = 0; j < this.myoptionList.length; j++) {
                            let realVal = null;
                            if(typeof this.myoptionList[j].value === 'number') {
                                realVal = Number(val[i].value);
                            } else {
                                realVal = val[i].value;
                            }
                            if (realVal === this.myoptionList[j].value) {
                                this.myoptionList[j]["active"] = true;
                                this.showList.push({
                                    name: this.myoptionList[j].name,
                                    value: this.myoptionList[j].value
                                });
                                break;
                            }
                        }
                    }
                }
                //back-type:"value"
                else {
                    let plc = "";
                    if (typeof val === "number") {
                        plc = [val];
                    }
                    if (typeof val === "string") {
                        plc = val.split(",");
                    } else if (typeof val === "undefined") {
                        plc = "";
                    } else {
                        //todo
                    }
                    //单选
                    if (plc.length === 1) {
                        this.changeClick(plc[0]);
                    }
                    //多选
                    else {
                        for (let i = 0; i < plc.length; i++) {
                            for (let j = 0; j < this.myoptionList.length; j++) {
                                let realVal = null;
                                if(typeof this.myoptionList[j].value === 'number') {
                                    realVal = Number(plc[i]);
                                } else {
                                    realVal = plc[i];
                                }
                                if (realVal === this.myoptionList[j].value) {
                                    this.myoptionList[j]["active"] = true;
                                    this.showList.push({
                                        name: this.myoptionList[j].name,
                                        value: this.myoptionList[j].value
                                    });
                                    break;
                                }
                            }
                        }
                    }

                }
                this.$emit('change', newVal);
            },
            //筛选text
            filterTextIn(param) {
                if (param.indexOf(this.filterText) != -1) {
                    return true;
                }
            },
            // 格式化宽度数据
            initWidth(val) {
                // 过滤掉错误格式的数据：非数字且非'n%'/'npx'
                let width = '';
                if(val==='' || isNaN(val)) {
                    // 不为数字。props中已经做了初步的判空与格式校验，此处无需做多余的判空以及格式校验。进入此判断逻辑中的必为string
                    const arr = val.split('');
                    let check = true; //是否符合正确格式：'200px'、'100%'
                    if(arr[arr.length-1] === '%') {
                        // 百分数格式
                        arr.splice(arr.length-1, 1);
                    } else if(arr[arr.length-1] === 'x' && arr[arr.length-2] === 'p') {
                        // 带px格式
                        arr.splice(arr.length-1, 1);
                        arr.splice(arr.length-1, 1);
                    } else {
                        check = false;
                    }
                    if(check) {
                        const tempVal = arr.join('');
                        if(tempVal==='' || isNaN(tempVal)) {
                            // 不为数字
                            check = false;
                        }
                    }
                    if(!check) {
                        // 错误格式，赋值默认值
                        width = '200px';
                    } else {
                        width = val;
                    }
                } else {
                    // 为数字，拼px单位
                    width = val + 'px';
                }
                return width;
            }
        },
        computed: {},
        mounted() {
            this.clearAllSelects();
        },

    };
</script>

<style scoped lang="less">
    .el-icon-error {
        color: #b2b2b2;
        width: 12px;
        height: 12px;
        /*background-color: #c0c4cc;*/
        border-radius: 50%;
        display: inline-block;
        float: right;
        cursor: pointer;
        margin-top: 3px;
        margin-left: 4px;
        position: absolute;
        top: -1px;
        right: 6px;

    &:hover {
         color: #f5222d;
     }

    i {
        position: absolute;
        top: 5px;
        left: 1px;
    }
    }
</style>