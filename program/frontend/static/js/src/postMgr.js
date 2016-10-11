var postMgr=(function(config){

    /**
     * 创建datatable
     * @returns {*|jQuery}
     */
    function createTable(){

        var ownTable=$("#myTable").dataTable({
            "bServerSide": true,
            "sAjaxSource": config.ajaxUrls.getAllPosts,
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
                { "mDataProp":"theme_tag",
                    "fnRender":function(oObj){
                        return oObj["aData"]["theme_tag"].join(",");
                    }},
                { "mDataProp":"material_tag",
                    "fnRender":function(oObj){
                        return oObj["aData"]["material_tag"].join(",");
                    }},
                { "mDataProp":"keyword_tag",
                    "fnRender":function(oObj){
                        return oObj["aData"]["keyword_tag"].join(",");
                    }},
                { "mDataProp": "author_txt"},
                { "mDataProp":"opt",
                    "fnRender":function(oObj) {
                        var string="<a href='artifacts/"+oObj.aData.id+"/detail' target='_blank'>查看</a>&nbsp;"+
                            "<a href='artifacts/"+oObj.aData.id+"/update'>修改</a>&nbsp;"+
                            "<a href='"+oObj.aData.id+"' class='remove'>删除</a>&nbsp;";

                        return  string;
                    }
                }
            ] ,
            "fnServerParams": function ( aoData ) {
                aoData.push({
                    "name": "name",
                    "value":  $("#name").val()
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
        remove:function(id){
            Functions.showLoading();
            var me=this;
            $.ajax({
                url:config.ajaxUrls.deletePost.replace(":postId",id),
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

    postMgr.createTable();

    $("#searchBtn").click(function(e){
        postMgr.tableRedraw();
    });
    $("#myTable").on("click","a.remove",function(){
        if(confirm("确定删除吗？")){
            postMgr.remove($(this).attr("href"));
        }

        return false;
    });
});
