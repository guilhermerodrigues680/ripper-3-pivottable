(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["BIRemoto"],{"51b2":function(a,t,e){"use strict";e.r(t);var o=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("v-container",{attrs:{fluid:""}},[e("v-row",[e("v-col",{attrs:{cols:"12"}},[e("span",{staticClass:"text-h5 font-weight-medium"},[a._v("Informações")])]),e("v-col",{staticClass:"py-0 font-weight-light",attrs:{cols:"12"}},[e("span",[a._v(" BRT: "),e("span",{staticClass:"font-weight-regular"},[a._v(a._s(this.$route.params.idBRT))]),a._v(", data do processamento do ripper: "),e("span",{staticClass:"font-weight-regular"},[a._v(a._s(this.$route.params.dataProcessamento))]),a._v(" data de referência processada: "),e("span",{staticClass:"font-weight-regular"},[a._v(a._s(this.$route.params.dataReferencia))]),a._v(", ")])]),e("v-col",{staticClass:"py-0 font-weight-light",attrs:{cols:"12"}},[e("span",[a._v("Linhas CSV carregadas: "+a._s(a.pivottableData.length))])]),e("v-col",{attrs:{cols:"4"}},[e("v-btn",{staticClass:"white--text",attrs:{block:"",elevation:"0",color:"blue"},on:{click:a.openCsvViewer}},[a._v(a._s(a.showCsvViewer?"Esconder CSV":"Mostrar CSV"))])],1)],1),e("v-row",{directives:[{name:"show",rawName:"v-show",value:a.showCsvViewer,expression:"showCsvViewer"}]},[e("v-col",{attrs:{cols:"12"}},[e("CsvViewer",{ref:"csvVieweComponent"})],1)],1),e("v-row",{directives:[{name:"show",rawName:"v-show",value:!a.showCsvViewer,expression:"!showCsvViewer"}]},[e("v-col",{attrs:{cols:"12"}},[e("BIProcessamento",{attrs:{pivottableData:a.pivottableData}})],1)],1)],1)},s=[],r=e("2909"),i=(e("99af"),e("a434"),e("369b")),n=e.n(i),c=e("facb"),l=e("4ba7"),v=e("dbf3"),w={name:"BIRemoto",title:"BI Remoto",components:{BIProcessamento:l["a"],CsvViewer:v["a"]},data:function(){return{pivottableData:[],showCsvViewer:!1}},watch:{$route:function(){this.showCsvViewer=!1,this.loadPivottableData()}},mounted:function(){this.loadPivottableData()},methods:{loadPivottableData:function(){var a=this;this.showToastLock("AGUARDE...","Carregando o dia ".concat(this.$route.params.dataReferencia," do BRT ").concat(this.$route.params.idBRT," processado pelo ripper no dia ").concat(this.$route.params.dataProcessamento));var t="./demodata/".concat(this.$route.params.idBRT,"/").concat(this.$route.params.dataProcessamento,"/").concat(this.$route.params.dataReferencia,".csv");n.a.parse(t,{download:!0,skipEmptyLines:!0,error:function(a){alert(a)},complete:function(t,e){var o;console.log("results",t,e,a.pivottableData);var s=c["a"].convertCSVRipperToNumber(t.data);a.pivottableData.splice(0,a.pivottableData.length),(o=a.pivottableData).push.apply(o,Object(r["a"])(s)),a.$swal.close()}})},openCsvViewer:function(){var a=this;this.showCsvViewer=!this.showCsvViewer,this.showCsvViewer?(this.showToastLock("Carregando CSV...","Atenção: Para grande quantidade de dados, o navegador pode ficar lento durante o carregamento. Apenas aguarde."),setTimeout((function(){a.$refs.csvVieweComponent.loadData(a.pivottableData),a.$swal.close()}),500)):this.$refs.csvVieweComponent.loadData(null)},showToastLock:function(a,t){var e=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];this.$swal({showConfirmButton:!e,allowEscapeKey:!e,allowEnterKey:!e,allowOutsideClick:!e,title:a,text:t,icon:"info"})}}},p=w,d=e("2877"),h=e("6544"),u=e.n(h),m=e("8336"),f=e("62ad"),C=e("a523"),V=e("0fd9"),b=Object(d["a"])(p,o,s,!1,null,null,null);t["default"]=b.exports;u()(b,{VBtn:m["a"],VCol:f["a"],VContainer:C["a"],VRow:V["a"]})}}]);
//# sourceMappingURL=BIRemoto.d80c7a5e.js.map