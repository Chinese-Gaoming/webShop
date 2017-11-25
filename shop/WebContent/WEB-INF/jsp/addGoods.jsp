<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="dist/css/bootstrap.min.css">
<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet" href="dist/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="dist/css/bootstrapValidator.min.css">
<link rel="stylesheet" href="dist/css/bootstrap-datetimepicker.min.css">
<link rel="stylesheet" href="dist/css/fileinput.min.css">
<title>Insert title here</title>
<style type="text/css">
.nessary {
	color: #ff0000;
}
</style>
<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="dist/js/jquery-3.1.1.min.js"></script>
<script src="dist/js/j1.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="dist/js/bootstrap.min.js"></script>
<script src="dist/js/bootstrapValidator.min.js"></script>
<script src="dist/js/bootstrap-datetimepicker.min.js"></script>
<script src="dist/js/fileinput.min.js"></script>
<script src="dist/js/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="dist/js/zh_CN.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	$(function () {
	    $('#modalFormId').bootstrapValidator({
	    	message: 'This value is not valid',
	    	feedbackIcons: {
	    		valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
	        fields: {
	        	GoodsName: {
	                message: '用户名验证失败',
	                validators: {
	                    notEmpty: {
	                        message: '用户名不能为空'
	                    },
	                    stringLength: {
	                        min: 1,
	                        max: 18,
	                        message: '用户名长度必须在1到18位之间'
	                    },
	                }
	            },
	            SalePrice: {
	                validators: {
	                    notEmpty: {
	                        message: '密码不能为空'
	                    }
	                }
	            }
	        }
	    });
	   
	})
	});


function importGoodsFile() {
    var form = $("#uploadedfileForm");
    if ($("#GoodsImageId").val() == "") {
        alert("请添加文件再点击解析");
        return;
    } else {
        var options = {
            url: 'http://localhost:8080/shop/upload',
            type: 'get',
            error: function () {
                alert("请重新选择文件");
            },
            success: function (msg) {
                console.log(msg.data.image)
            }
        };
        form.ajaxSubmit(options);
    }
}


function init() {
	
	$.ajax({
		url : "getGoodsType",
		type : "get",
		dataType : "json",
		success : function(data) {//回调函数
			//srchGH();
		
			var data = eval(data);//解析jsonString成object
			console.log(data);
			var result = data;
			zzzz=data;
			var favourEle = $("#TypeId");
			favourEle.empty();
			favourEle.append("<option>请选择</option>");
			for (var i = 0; i < result.length; i++) {
				favourEle.append("<option value='"+result[i].typeId+"'>"
						+ result[i].type + "</option>");
			}

		
		}
	});
	initFileInput();
}

function Save() {
	//开启验证
	/* $('#modalFormId').data('bootstrapValidator').validate();
	if (!$('#modalFormId').data('bootstrapValidator').isValid()) {
		return;
	}
	*/
	
	$form = $('#modalFormId'); 
	// Use Ajax to submit form data 提交至form标签中的action，result自定义
	$.post($form.attr('action'), $form.serialize(), function(data) {
		alert("已成功提交")
		//do something...
		//var data = eval(data);//解析jsonString成object
		//console.log(data);
		//var result = data;
		window.location.href="goodsManagerPage";
		
		$('#modalFormId')[0].reset()

	});

}

//初始化fileinput控件（第一次初始化）
function initFileInput() {    
    var control = $("#GoodsImageId"); 
	
    control.fileinput({
        language: 'zh', //设置语言
        uploadUrl: "dist/imagePath", //上传的地址
        allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
        showUpload: false, //是否显示上传按钮
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式             
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
    });
}
</script>
</head>
<body onload="init()">
	<div class="container-fluid jumbotron ">
		<div class="row col-md-11">
			<form action="InsertGoods" enctype="multipart/form-data"
				method="post" id="modalFormId">
				<div class="row">
					<div class="row col-md-4 col-md-offset-4">
						<p>
							<font size=7>添加商品界面</font>
						</p>
					</div>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-10 col-md-offset-1">
							<div class="col-md-6 " style="margin-top: 60px">
								<div class="form-group">
									<label for="cardId2" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>商品名称</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="GoodsName"
											id="GoodsNameId">
									</div>
								</div>

								<div class="form-group">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>包装样式</label>
									<div class="col-md-8">
										<select class="form-control " name="Package" id="PackageId">
											<option>请选择</option>
											<option>罐装</option>
											<option>袋装</option>
											<option>桶装</option>
											<option>瓶装</option>
											<option>盒装</option>

										</select>
									</div>
								</div>
								<div class="form-group">
									<label for="xmId2" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>商品图片</label>
									<div class="col-md-8">

										<input type="file" class="file" name="pictureFile" />
										<p class="help-block">支持jpg、jpeg、png、gif格式，大小不超过2.0M</p>
										<!-- <input type="submit" value="sdfhsd"> -->

									</div>
								</div>
							</div>

							<div class="col-md-5" style="margin-top: 60px">

								<div class="form-group">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>商品类型</label>
									<div class="col-md-8">
										<select class="form-control " name="TypeId" id="TypeId">

										</select>
									</div>
								</div>
								<div class="form-group">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>产地</label>
									<div class="col-md-8">
										<select class="form-control " name="Producter"
											id="ProducterId">
											<option>请选择</option>
											<option>北京</option>
											<option>上海</option>
											<option>深圳</option>
											<option>辽宁</option>
											<option>黑龙江</option>
											<option>江苏</option>
											<option>浙江</option>
											<option>福建</option>
											<option>湖南</option>
											<option>湖北</option>

										</select>
									</div>
								</div>
								<div class="form-group">
									<label for="nameId" class="col-md-4 control-label">商品价格</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="SalePrice"
											id="SalePriceId">
									</div>
								</div>


							</div>

						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button id="www" type="reset" class="btn btn-default">重置</button>
					<button id="saveBtn" type="submit" class="btn btn-primary"
						onclick="Save()">保存</button>
				</div>
			</form>
		</div>
	</div>
</body>
</html>