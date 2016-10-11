var tagsMgr=(function(config){

    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#myTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.getAllTags,
            "bInfo":true,
            "bLengthChange": false,
            "bFilter": false,
            "bSort":false,
            "bAutoWidth": false,
            "iDisplayLength":config.perLoadCount.table,
            "sPaginationType":"full_numbers",
            "oLanguage": {
                "sUrl":"static/js/de_DE.txt"
            },
            "aoColumns": [
                { "mDataProp": "name"},
                { "mDataProp": "category"},
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {
                        var string="<a href='"+oObj.aData.id+"' class='remove'>删除</a>";

                        return  string;
                    }
                }
            ] ,
            "fnServerParams": function ( aoData ) {
                aoData.push({
                    "name": "name",
                    "value":  $("#searchName").val()
                },{
                    "name": "category",
                    "value":  $("#searchCategory").val()
                });
            },
            "fnServerData": function(sSource, aoData, fnCallback) {

                //回调函数
                $.ajax({
                    "dataType":'json',
                    "type":"get",
                    "url":sSource,
                    "data":aoData,
                    "success": function (response) {
                        if(response.success===false){
                            Functions.ajaxReturnErrorHandler(response.error_code);
                        }else{
                            var json = {
                                "sEcho" : response.sEcho
                            };
                            for (var i = 0, iLen = response.aaData.length; i < iLen; i++) {
                                response.aaData[i].opt="opt";
                                response.aaData[i].oldCategory=response.aaData[i]["category"];
                                response.aaData[i]["category"]=config.type[response.aaData[i]["category"]];
                            }

                            json.aaData=response.aaData;
                            json.iTotalRecords = response.iTotalRecords;
                            json.iTotalDisplayRecords = response.iTotalDisplayRecords;
                            fnCallback(json);
                        }

                    }
                });
            },
            "fnFormatNumber":function(iIn){
                return iIn;
            }
        });

        return ownTable;
    }

    return {
        ownTable:null,
        createTable:function(){
            this.ownTable=createTable();
        },
        tableRedraw:function(){
            this.ownTable.fnSettings()._iDisplayStart=0;
            this.ownTable.fnDraw();
        },
        formSubmit:function(form){
            Functions.showLoading();
            var me=this;
            $(form).ajaxSubmit({
                dataType:"json",
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                success:function(response){
                    if(response.success){
                        Functions.hideLoading();
                        $().toastmessage("showSuccessToast",config.message.optSuccess);
                        me.ownTable.fnDraw();
                    }else{
                        Functions.ajaxReturnErrorHandler(response.error_code);
                    }
                },
                error:function(){
                    Functions.ajaxErrorHandler();
                }
            });
        },
        remove:function(id){
            Functions.showLoading();
            var me=this;
            $.ajax({
                url:config.ajaxUrls.deleteTag.replace(":id",id),
                type:"post",
                dataType:"json",
                success:function(response){
                    if(response.success){
                        Functions.hideLoading();
                        $().toastmessage("showSuccessToast",config.message.optSuccess);
                        me.ownTable.fnDraw();
                    }else{
                        Functions.ajaxReturnErrorHandler(response.error_code);
                    }

                },
                error:function(){
                    Functions.ajaxErrorHandler();
                }
            });
        }
    }
})(config);

$(document).ready(function(){

    tagsMgr.createTable();

    $("#myTable").on("click","a.remove",function(){
        if(confirm(config.message.confirmDelete)){
            tagsMgr.remove($(this).attr("href"));
        }
        return false;
    });

    $("#searchBtn").click(function(){
        tagsMgr.tableRedraw();
        return false;
    });

    $("#addForm").validate({
        rules:{
            name:{
                required:true,
                maxlength:32
            },
            description:{
                required:true,
                maxlength:256
            }
        },
        messages:{
            name:{
                required:config.validError.required,
                maxlength:config.validError.maxLength.replace("${max}",32)
            },
            description:{
                required:config.validError.required,
                maxlength:config.validError.maxLength.replace("${max}",256)
            }
        },
        submitHandler:function(form) {
            tagsMgr.formSubmit(form);
        }
    });
});
