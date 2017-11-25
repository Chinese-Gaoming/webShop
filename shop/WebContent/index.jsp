<%@page import="com.shop.model.Users"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta charset="UTF-8">
	<meta name="Generator" content="EditPlus®">
	<meta name="Author" content="">
	<meta name="Keywords" content="">
	<meta name="Description" content="">
	<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
	<meta name="renderer" content="webkit">
	<title>明购物商城-换一种方式购物</title>
	<link rel="shortcut icon" type="image/x-icon" href="dist/img/icon/favicon.ico">
	<link rel="stylesheet" type="text/css" href="dist/css/base.css">
	<link rel="stylesheet" type="text/css" href="dist/css/home.css">
	<!-- 新 Bootstrap 核心 CSS 文件 -->
	<link rel="stylesheet" href="dist/css/bootstrap.min.css">
	<!-- 可选的Bootstrap主题文件（一般不用引入） -->
	<link rel="stylesheet" href="dist/css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="dist/css/bootstrapValidator.min.css">
	<link rel="stylesheet" href="dist/css/bootstrap-datetimepicker.min.css">
	<style type="text/css">
	.nessary {
		color: #ff0000;
	}
</style>
	<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
	<script src="dist/js/jquery-3.1.1.min.js"></script>
	<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
	<script src="dist/js/bootstrap.min.js"></script>
	<script src="dist/js/bootstrapValidator.min.js"></script>
	<script src="dist/js/bootstrap-datetimepicker.min.js"></script>
	<script src="dist/js/bootstrap-datetimepicker.zh-CN.js"></script>
	<script src="dist/js/zh_CN.js"></script>
	<script type="text/javascript" src="dist/js/index.js"></script>
	<script type="text/javascript">

        var intDiff = parseInt(90000);//倒计时总秒数量

        function timer(intDiff){
            window.setInterval(function(){
                var day=0,
                    hour=0,
                    minute=0,
                    second=0;//时间默认值
                if(intDiff > 0){
                    day = Math.floor(intDiff / (60 * 60 * 24));
                    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                }
                if (minute <= 9) minute = '0' + minute;
                if (second <= 9) second = '0' + second;
                $('#day_show').html(day+"天");
                $('#hour_show').html('<s id="h"></s>'+hour+'时');
                $('#minute_show').html('<s></s>'+minute+'分');
                $('#second_show').html('<s></s>'+second+'秒');
                intDiff--;
            }, 1000);
        }

        $(function(){
            timer(intDiff);
        });//倒计时结束

        $(function(){
	        /*======右按钮======*/
            $(".you").click(function(){
                nextscroll();
            });
            function nextscroll(){
                var vcon = $(".v_cont");
                var offset = ($(".v_cont li").width())*-1;
                vcon.stop().animate({marginLeft:offset},"slow",function(){
                    var firstItem = $(".v_cont ul li").first();
                    vcon.find(".flder").append(firstItem);
                    $(this).css("margin-left","0px");
                });
            };
	        /*========左按钮=========*/
            $(".zuo").click(function(){
                var vcon = $(".v_cont");
                var offset = ($(".v_cont li").width()*-1);
                var lastItem = $(".v_cont ul li").last();
                vcon.find(".flder").prepend(lastItem);
                vcon.css("margin-left",offset);
                vcon.animate({marginLeft:"0px"},"slow")
            });
        });
        
        function RegisterModalShow() {
        	$('#myModal').modal('show')
        	
		}
        function loginModalShow() {
        	$('#myModal3').modal('show')
        	
		}
        function BasketModalShow(bb) {
        	if(bb==0){
        		alert("没登录，请登录！")
        	}else{
        		
        	$('#myModal2').modal('show')
        	}
        	
		}
        function myGoodsOrder(aa) {
        	if(aa==1){
        		window.location.href="myGoodsOrderPage";
        	}else{
        		alert("没登录，请登录！")
        	}
        	
        	
		}
        function myYesMoneyGoodsOrder(aa) {
        	if(aa==1){
        		window.location.href="myYesMoneyGoodsOrderPage";
        	}else{
        		alert("没登录，请登录！")
        	}
        	
        	
		}
        function changePassword(aa) {
        	if(aa==1){
        		//window.location.href="myYesMoneyGoodsOrderPage";
        		window.open(encodeURI("http://localhost:8080/shop/changeUserPassword.jsp"));
        	}else{
        		alert("没登录，请登录！")
        	}
        	
        	
		}
        function loginExit() {
        	
        	$.ajax({
        		type:"get",
        		url:"loginExit",
        		dataType: "json",
        		success: function (data) {
                   window.location.reload()
                   alert("退出成功")
                }
        	})
        	
        	
        
        	
		}
        $(function() {
    		$('.form_datetime').datetimepicker({
    			language : 'zh-CN',
    			weekStart : 1,
    			todayBtn : 1,
    			autoclose : 1,
    			todayHighlight : 1,
    			startView : 2,
    			minView : 2,
    			forceParse : 0,
    			format : "yyyy-mm-dd"
    		})
    	}).on(
    			'hide',
    			function(e) {
    				$('#modalFormId').data('bootstrapValidator').updateStatus(
    						'CSRQ', 'NOT_VALIDATED', null).validateField('CSRQ');
    			});
        function registerModalSave() {
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
    			var data = eval(data);//解析jsonString成object
    			console.log(data);
    			var result = data;
    			/* $("#xmId").val(result.xm);
    			$("#dhhmId1").val(result.dhhm);
    			$("#jtzzId").val(result.jtzz);
    			$("#xbId").val(result.xb);
    			var nl = new Date(result.csrq);
    			var datetime = new Date();
    			var nl = datetime.getFullYear() - nl.getFullYear() + 1;
    			$("#nlId").val(nl);
    			$("#klxId2").val(result.klx); */
    			$('#myModal').modal('hide');//手动关闭弹出框 */ */

    		});

    	}
        function loginModalSave() {
    		//开启验证
    		/* $('#modalFormId').data('bootstrapValidator').validate();
    		if (!$('#modalFormId').data('bootstrapValidator').isValid()) {
    			return;
    		}
    		*/
    		$form = $('#loginModalFormId'); 
    		// Use Ajax to submit form data 提交至form标签中的action，result自定义
    		$.post($form.attr('action'), $form.serialize(), function(data) {
    			//do something...
    			
    			var data = eval(data);//解析jsonString成object
    			console.log(data);
    			if(data.userId==null){
    				alert("用户名密码错误登录失败")
    				
    				document.getElementById("loginModalFormId").reset();
    				
    				
    			}else{
    				window.location.reload()
    				alert("登陆成功")
    				//$('#myModal3').modal('hide');
    				//好像要刷新一下页面
    				
    			}
    			

    		});

    	}
        
		
        
         $(function() {
    		$("#myModal2").on(
    				'show.bs.modal',
    				function() {
    					$.ajax({
    						url : "getBasket",
    						type : "get",
    						dataType : "json",
    						success : function(data) {//回调函数
    							console.log(data);
    							var result = data;
    							var favourEle = $("#tableId");
    							var favourEle2 = $("#basketNumber");
    							favourEle.empty();
    							favourEle2.empty();
    							var number=0;
    							 var length1=result.length;
    							for (var i = 0; i < result.length; i++) {
    							   
    								number++;
    								var xiaoji=result[i].salePrice*result[i].number;
    								favourEle.append("<tr><td style='width:300px'>" + number
    										+ "</td><td   style='width:300px'><input id='goodsId"+i+"' name='GoodsId' readonly='readonly' style='width:70px' /></td><td style='width:300px'><input id='goodsNameId"+i+"' readonly='readonly' name='GoodsName' style='width:70px' /></td><td style='width:200px' id='salePriceId"+i+"'>"+result[i].salePrice+"</td><td style='width:200px'><input id='numberId"+i+ "' onkeyup='smallMoney("+ i+ ",this.value,"+length1+")' onchange='smallMoney("+i+",this.value,"+length1+")'name='number'  type='number' min='0' max='100' /></td><td style='width:200px'  ><input id='xiaojiId"+i+ "' readonly='readonly' style='width:70px'/></td><td style='width:200px'><a onclick='deleteBasket("+i
    										+")'>删除<a></td></tr>");
    								 $("#numberId"+i).val(result[i].number)
     							   	$("#goodsId"+i).val(result[i].goodsId)
     							   	$("#goodsNameId"+i).val(result[i].goodsName)
    								 $("#salePriceId"+i).val(result[i].salePrice)
     							    $("#xiaojiId"+i).val(xiaoji)
    							}
    							favourEle2.append(result.length)
    							
    	

    						}
    					})
    					

    				})
    		
    	});
        
        function smallMoney(i, number,length1) {

    		var money = $("#salePriceId" + i).val() * number;
    		$("#xiaojiId" + i).val(money);
    		AllMoney(length1);
    	}
    	function AllMoney(length1) {
    		var m=0;
    		for(var i=0;i<length1;i++){
    			
    			if($("#xiaojiId" +i).val()!=null)
    			m=(m*1)+($("#xiaojiId" +i).val()*1)
    		}
    		$("#hjId").val(m);
    	}
    	function deleteBasket(i) {
    		var a=$("#goodsId"+i).val()
    		//alert(a);
    		$.ajax({
    			url : "deleteBasket?GoodsId="+a+"",
    			type : "get",
    			dataType : "json",
    			success : function(data) {//回调函数
    				alert("删除成功");
    			//$('#myModal2').modal('hide');
    			$('#myModal2').modal('show');

    			
    			}
    		});
		}
    	
    	
    	function basketSave() {
    		
    			$form = $('#modalFormId2');//购物车表单
    			$.post($form.attr('action'), $form.serialize(), function(data) {
    				alert("购物车已成功提交")
    				//do something...
    				var data = eval(data);//解析jsonString成object
    				//console.log(data);
    				var result = data;
    				window.location.href="myGoodsOrderPage";
    			});
    		}
    	
    	
    	function init() {
    		
    		$.ajax({
    			url : "getGoods",
    			type : "get",
    			dataType : "json",
    			success : function(data) {//回调函数
    			console.log(data);
    			var result =data;
    			var favourEle = $("#goodsListId");
				favourEle.empty();
				
				var num=0;
				for(var i=0;i<result.length;i++){
					num++;
					var aa="dist/imagePath/"+result[i].goodsImage;
					console.log(aa);
					favourEle.append("<div class='xsq_deal_wrapper'><a class='saleDeal' onclick='detail("+num+")' target='_blank'><div class='dealCon'><img  class='dealImg' src='"+aa
							+ "' ></div><div class='title_new'><p class='word' id='shangpinId"+num+"'><span class='baoyouText'>[包邮]</span>"+result[i].goodsName
							+"</p></div><div class='dealInfo'><span class='price'>"+result[i].salePrice
							+"</span></div></a></div>");
				}
    			}
    		});
    		goodsType()
		}
    	function detail(mm){
    		var goodsName=$("#shangpinId"+mm).text();
    		var bb=goodsName.substring(4,goodsName.length)
    		window.open(encodeURI("http://localhost:8080/shop/goodsDetail.jsp?goodsName="+bb+""));
			
		}
    	function goodsType() {
    		$.ajax({
    			url : "getGoodsType",
    			type : "get",
    			dataType : "json",
    			success : function(data) {//回调函数
    			console.log(data);
    			var result =data;
    			var favourEle = $("#goodsTypeId");
				favourEle.empty();
				
				var num=0;
				for(var i=0;i<result.length;i++){
					num++;
					
					
					favourEle.append("<li ><a  id='typeId"+num+"' onclick='getSomeGoods("+num+","+result[i].typeId+")'>"+result[i].type+"</a></li>");
				}
    			}
    		});
			
		}
    	function getSomeGoods(aa,bb) {
    		//var type=$("#typeId"+aa).text()
    		alert(bb)
    		$.ajax({
    			url : "getSomeGoods?TypeId="+bb+"",
    			type : "get",
    			dataType : "json",
    			success : function(data) {//回调函数
    			console.log(data);
    			var result =data;
    			var favourEle = $("#goodsListId");
				favourEle.empty();
				
				var num=0;
				for(var i=0;i<result.length;i++){
					num++;
					var aa="dist/imagePath/"+result[i].goodsImage;
					console.log(aa);
					favourEle.append("<div class='xsq_deal_wrapper'><a class='saleDeal' onclick='detail("+num+")' target='_blank'><div class='dealCon'><img  class='dealImg' src='"+aa
							+ "' ></div><div class='title_new'><p class='word' id='shangpinId"+num+"'><span class='baoyouText'>[包邮]</span>"+result[i].goodsName
							+"</p></div><div class='dealInfo'><span class='price'>"+result[i].salePrice
							+"</span></div></a></div>");
				}
    			}
    		});
    		
			
		}
    	function srch() {
    		var zzz=$("#srchId").val()
    		var zz=encodeURI(encodeURI(zzz))
    		$.ajax({
    			url : "getsrchGoods?GoodsName="+zz+"",
    			type : "get",
    			dataType : "json",
    			success : function(data) {//回调函数
    			console.log(data);
    			var result =data;
    			var favourEle = $("#goodsListId");
				favourEle.empty();
				
				var num=0;
				for(var i=0;i<result.length;i++){
					num++;
					var aa="dist/imagePath/"+result[i].goodsImage;
					console.log(aa);
					favourEle.append("<div class='xsq_deal_wrapper'><a class='saleDeal' onclick='detail("+num+")' target='_blank'><div class='dealCon'><img  class='dealImg' src='"+aa
							+ "' ></div><div class='title_new'><p class='word' id='shangpinId"+num+"'><span class='baoyouText'>[包邮]</span>"+result[i].goodsName
							+"</p></div><div class='dealInfo'><span class='price'>"+result[i].salePrice
							+"</span></div></a></div>");
				}
    			}
    		});
		}
    	

	</script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Insert title here</title>
</head>
<body onload="init()">
<header id="pc-header">
	<div class="pc-header-nav">
		<div class="pc-header-con">
		 <%
			Users users = (Users) session.getAttribute("users");
		 	if(users!=null){
		 		
		 		String userId=users.getUserId();
		 		
		 	}
		%>
			<div class="fl pc-header-link" >
			<%if(users==null){%>
			<a href='javascript:loginModalShow();' >请登录</a>
			<a href='javascript:RegisterModalShow();'> 免费注册</a>
			<%}else{%>
			欢迎您:<%=users.getUserName()%>
			<a href='javascript:loginExit();'> 退出</a>
			<%}%>
			</div>
			
			<div class="fr pc-header-list top-nav">
				<ul>
					<li>
						<!-- <a href="myGoodsOrderPage">我的订单</a> -->
						<%if(users==null){%>
						<div class="nav"><i class="pc-top-icon"></i><a onclick="myGoodsOrder(0)">我的订单</a></div>
						<%}else{%>
						<div class="nav"><i class="pc-top-icon"></i><a onclick="myGoodsOrder(1)">我的订单</a></div>
						<%}%>
						
						<%if(users==null){%>
						<div class="con">
							<dl>
								<dt><a onclick="myYesMoneyGoodsOrder(0)">已买货品</a></dt>
							</dl>
						</div>
						<%}else{%>
						<div class="con">
							<dl>
								<dt><a onclick="myYesMoneyGoodsOrder(1)">已买货品</a></dt>
							</dl>
						</div>
						<%}%>
						
						
					</li>
					<li>
						<div class="nav"><i class="pc-top-icon"></i><a>客户服务</a></div>
						<%if(users==null){%>
						<div class="con">
							<dl>
								<dt><a onclick='changePassword(0)'>修改密码</a></dt>
							</dl>
						</div>
						<%}else{%>
						<div class="con">
							<dl>
								<dt><a onclick='changePassword(1)'>修改密码</a></dt>
							</dl>
						</div>
						<%}%>
					</li>
					
					<li><a href="adminLogin.jsp">管理员登录</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="pc-header-logo clearfix">
		<div class="pc-fl-logo fl" style="width: 200px;height: 90px">
			<h1>
				<!-- <a href="index.html"></a> -->
			</h1>
		</div>
		<div class="head-form fl">
			<form class="clearfix">
				<input class="search-text" accesskey="" id="srchId" autocomplete="off" placeholder="洗衣机" type="text">
				<button class="button" onclick="srch();return false;">搜索</button>
			</form>
			<div class="words-text clearfix">
				<a href="#" class="red">1元秒爆</a>
				<a href="#">低至五折</a>
				<a href="#">农用物资</a>
				<a href="#">佳能相机</a>
				<a href="#">服装城</a>
				<a href="#">买4免1</a>
				<a href="#">家电秒杀</a>
				<a href="#">农耕机械</a>
				<a href="#">手机新品季</a>
			</div>
		</div>
		<div class="fr pc-head-car">
			<i class="icon-car"></i>
			
			<!-- <a onclick="BasketModalShow()">我的购物车</a> -->
			<%if(users==null){%>
			<a onclick="BasketModalShow(0)">我的购物车</a>
			<%}else{%>
			<a onclick="BasketModalShow(1)">我的购物车</a>
			<%}%>
			
			<em id="basketNumber"></em>
			
			
		</div>
	</div>
	<!--  顶部    start-->
	<div class="yHeader">
		<!-- 导航   start  -->
		<div class="yNavIndex">
			<div class="pullDown">
				<h2 class="pullDownTitle"><i class="icon-class"></i>所有商品分类</h2>
				<ul class="pullDownList" id="goodsTypeId">
					

				</ul>
	

			</div>
			<ul class="yMenuIndex">
				<!-- <li><a href="" target="_blank">首页</a></li>
				<li><a href="" target="_blank">云购物 </a></li>
				<li><a href="" target="_blank">购物资讯</a></li>
				<li><a href="" target="_blank">电器城</a></li>
				<li><a href="" target="_blank">家具城</a></li>
				<li><a href="" target="_blank">母婴专场</a></li>
				<li><a href="" target="_blank">数码专场</a></li> -->
			</ul>
		</div>
		<!-- 导航   end  -->
	</div>
	<!--  顶部    end-->

	<!-- banner  -->
	<div class="yBanner">
		<div class="yBannerList">
			<div class="yBannerListIn">
				<a href=""><img class="ymainBanner" src="dist/images/banner1.jpg"  width="100%"></a>
				<div class="yBannerListInRight">
					<a href=""><img src="dist/images/BR2.png" width="100%"/></a>
					<a href=""><img src="dist/images/BR3.png" width="100%" /></a>
				</div>
			</div>
		</div>

		<div class="yBannerList ybannerHide">
			<div class="yBannerListIn">
				<a href=""><img class="ymainBanner" src="dist/images/banner1.jpg" width="100%"></a>
				<div class="yBannerListInRight">
					<a href=""><img src="dist/images/BR6.png" width="100%"/></a>
					<a href=""><img src="dist/images/BR4.png" width="100%" /></a>
				</div>
			</div>
		</div>

		<div class="yBannerList ybannerHide">
			<div class="yBannerListIn">
				<a href=""><img class="ymainBanner" src="dist/images/banner1.jpg" width="100%"></a>
				<div class="yBannerListInRight">
					<a href=""><img src="dist/images/BR7.png" width="100%"/></a>
					<a href=""><img src="dist/images/BR5.png" width="100%" /></a>
				</div>
			</div>
		</div>
	</div>
	<!-- banner end -->
</header>
<section id="">
	<div class="center pc-ad-img clearfix">
		<!-- <div class="pc-center-img"><img src="dist/img/ad/ad1.jpg"></div>
		<div class="pc-center-img"><img src="dist/img/ad/ad2.jpg"></div>
		<div class="pc-center-img"><img src="dist/img/ad/ad3.jpg"></div>
		<div class="pc-center-img"><img src="dist/img/ad/ad4.jpg"></div>
		<div class="pc-center-img"><img src="dist/img/ad/ad5.jpg"></div> -->
	</div>
</section>
<section id="s">
	<div class="center">
		<div class="pc-center-he">
			<!-- <div class="pc-box-he clearfix">
				<div class="fl"><i class="pc-time-icon"></i></div>
				<div class="time-item fr">
					<span id="day_show">0天</span>
					<strong id="hour_show">0时</strong>
					<strong id="minute_show">00分</strong>
					<strong id="second_show">00秒</strong>
					<em style="color:#fff">后结束抢购</em>
				</div>
			</div> -->
			<div class="pc-list-goods" id="goodsListId" style="height: auto;">
				
				
				<!-- <div class="xsq_deal_wrapper">
						<div class="dealCon">
							<img class="dealImg" src="dist/images/xlqg9.jpg" >
						</div>
						<div class="title_new">
							<p class="word" title="925银流苏珍珠耳坠耳钉"><span class="baoyouText">[包邮]</span>925银流苏珍珠耳坠耳钉</p>
						</div>
						<div class="dealInfo">
							<span class="price">¥<em>2</em></span>
							
						</div>
				</div> -->
			</div>
		</div>
	</div>
	
	
	
	
	<div class="center pc-top-20">
		<div class="pc-center-he">
			<div class="pc-box-he pc-box-ue clearfix">
				<div class="fl"><i class="pc-time-icon"></i></div>
				<div class="fr pc-box-blue-link">
					<a href="#">上衣</a>
					<a href="#">短裙</a>
					<a href="#">牛仔裤</a>
					<a href="#">短袖</a>
					<a href="#">帽子</a>
				</div>
			</div>
			<div class="pc-list-goods" style="height:auto">
				<div class="xsq_deal_wrapper pc-deal-list clearfix">
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg19.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="【京东超市】福临门 葵花籽原香食用调和油5L 中粮出品"><span class="baoyouText">[包邮]</span>【京东超市】福临门 葵花籽原香食用调和油5L 中粮出品</p></div>
						<div class="dealInfo"><span class="price">¥<em>39.9</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg14.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="神火（supfire）C8T6 强光手电筒 远射LED充电式防身灯 配18650电池"><span class="baoyouText">[包邮]</span>神火（supfire）C8T6 强光手电筒 远射LED充电式防身灯 配18650电池</p></div>
						<div class="dealInfo"><span class="price">¥<em>99.0</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg15.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="【京东超市】福临门 葵花籽原香食用调和油5L 中粮出品"><span class="baoyouText">[包邮]</span>【京东超市】福临门 葵花籽原香食用调和油5L 中粮出品</p></div>
						<div class="dealInfo"><span class="price">¥<em>99.9</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg16.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="暖风机家用取暖器婴儿电暖气暖手宝浴室防水N"><span class="baoyouText">[包邮]</span>暖风机家用取暖器婴儿电暖气暖手宝浴室防水N</p></div>
						<div class="dealInfo"><span class="price">¥<em>199.9</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg17.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="CIKOO 洗澡玩具 戏水玩具 水枪玩具 高压水枪玩具"><span class="baoyouText">[包邮]</span>CIKOO 洗澡玩具 戏水玩具 水枪玩具 高压水枪玩具</p></div>
						<div class="dealInfo"><span class="price">¥<em>29.0</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg18.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="联想（ThinkPad）轻薄系列E470c（20H3A004CD）14英寸笔记本电脑（i5-6200U 8G 500G 2G独显 Win10）黑色 "><span class="baoyouText">[包邮]</span>联想（ThinkPad）轻薄系列E470c（20H3A004CD）14英寸笔记本电脑（i5-6200U 8G 500G 2G独显 Win10）黑色 </p></div>
						<div class="dealInfo"><span class="price">¥<em>4499.9</em></span></div>
					</a>
				</div>
				<div class="xsq_deal_wrapper pc-deal-list clearfix" >
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg13.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="【京东超市】福临门 葵花籽原香食用调和油5L 中粮出品"><span class="baoyouText">[包邮]</span>【京东超市】福临门 葵花籽原香食用调和油5L 中粮出品</p></div>
						<div class="dealInfo"><span class="price">¥<em>39.9</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg14.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="神火（supfire）C8T6 强光手电筒 远射LED充电式防身灯 配18650电池"><span class="baoyouText">[包邮]</span>神火（supfire）C8T6 强光手电筒 远射LED充电式防身灯 配18650电池</p></div>
						<div class="dealInfo"><span class="price">¥<em>99.0</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg15.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="【京东超市】福临门 葵花籽原香食用调和油5L 中粮出品"><span class="baoyouText">[包邮]</span>【京东超市】福临门 葵花籽原香食用调和油5L 中粮出品</p></div>
						<div class="dealInfo"><span class="price">¥<em>99.9</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg16.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="暖风机家用取暖器婴儿电暖气暖手宝浴室防水N"><span class="baoyouText">[包邮]</span>暖风机家用取暖器婴儿电暖气暖手宝浴室防水N</p></div>
						<div class="dealInfo"><span class="price">¥<em>199.9</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg17.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="CIKOO 洗澡玩具 戏水玩具 水枪玩具 高压水枪玩具"><span class="baoyouText">[包邮]</span>CIKOO 洗澡玩具 戏水玩具 水枪玩具 高压水枪玩具</p></div>
						<div class="dealInfo"><span class="price">¥<em>29.0</em></span></div>
					</a>
					<a class="saleDeal" href="" target="_blank">
						<div class="dealCon"><img class="dealImg" src="dist/images/xlqg18.jpg" alt=""></div>
						<div class="title_new"><p class="word" title="联想（ThinkPad）轻薄系列E470c（20H3A004CD）14英寸笔记本电脑（i5-6200U 8G 500G 2G独显 Win10）黑色 "><span class="baoyouText">[包邮]</span>联想（ThinkPad）轻薄系列E470c（20H3A004CD）14英寸笔记本电脑（i5-6200U 8G 500G 2G独显 Win10）黑色 </p></div>
						<div class="dealInfo"><span class="price">¥<em>4499.9</em></span></div>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<div style="height:100px"></div>

<footer>
	<div class="pc-footer-top">
		<div class="center">
			<ul class="clearfix">
				<li>
					<span>关于我们</span>
					<a href="#">关于我们</a>
					<a href="#">诚聘英才</a>
					<a href="#">用户服务协议</a>
					<a href="#">网站服务条款</a>
					<a href="#">联系我们</a>
				</li>
				<li class="lw">
					<span>购物指南</span>
					<a href="#">新手上路</a>
					<a href="#">订单查询</a>
					<a href="#">会员介绍</a>
					<a href="#">网站服务条款</a>
					<a href="#">帮助中心</a>
				</li>
				<li class="lw">
					<span>消费者保障</span>
					<a href="#">人工验货</a>
					<a href="#">退货退款政策</a>
					<a href="#">运费补贴卡</a>
					<a href="#">无忧售后</a>
					<a href="#">先行赔付</a>
				</li>
				<li class="lw">
					<span>商务合作</span>
					<a href="#">人工验货</a>
					<a href="#">退货退款政策</a>
					<a href="#">运费补贴卡</a>
					<a href="#">无忧售后</a>
					<a href="#">先行赔付</a>
				</li>
				<li class="lss">
					<span>下载手机版</span>
					<div class="clearfix lss-pa">
						<div class="fl lss-img"><img src="dist/img/icon/code.png" alt=""></div>
						<div class="fl" style="padding-left:20px">
							<h4>扫描下载云购APP</h4>
							<p>把优惠握在手心</p>
							<P>把潮流带在身边</P>
							<P></P>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="pc-footer-lin">
			<div class="center">
				<p>友情链接：
					卡宝宝信用卡
					梦芭莎网上购物
					手游交易平台
					法律咨询
					深圳地图
					P2P网贷导航
					名鞋库
					万表网
					叮当音乐网
					114票务网
					儿歌视频大全
				</p>
				<p>
					京ICP证1900075号  京ICP备20051110号-5  京公网安备110104734773474323  统一社会信用代码 91113443434371298269B  食品流通许可证SP1101435445645645640352397
				</p>
				<p style="padding-bottom:30px">版物经营许可证 新出发京零字第朝160018号  Copyright©2011-2015 版权所有 ZHE800.COM </p>
			</div>
		</div>
	</div>
</footer>
<script type="text/javascript">
    //hover 触发两个事件，鼠标移上去和移走
    //mousehover 只触发移上去事件
    $(".top-nav ul li").hover(function(){
        $(this).addClass("hover").siblings().removeClass("hover");
        $(this).find("li .nav a").addClass("hover");
        $(this).find(".con").show();
    },function(){
        //$(this).css("background-color","#f5f5f5");
        $(this).find(".con").hide();
        //$(this).find(".nav a").removeClass("hover");
        $(this).removeClass("hover");
        $(this).find(".nav a").removeClass("hover");
    })
</script>


<!-- Modal -->
	<div class="modal fade" id="myModal">
		<div class="modal-dialog" style="width: 900px">
			<div class="modal-content">
				<fieldset>
					<form id="modalFormId" class="form-horizontal "
						action="InsertUser" method="post">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">
								<span>&times;</span>
							</button>
							<h4 class="modal-title" id="myModalLabel">用户注册</h4>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-md-10 col-md-offset-1">
									<div class="col-md-5 " style="margin-top: 60px">
										<div class="form-group">
											<label for="UserId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>用户名</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="UserId"
													id="UserId">
											</div>
										</div>
										<div class="form-group">
											<label for="PasswordId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>密码</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="Password" id="PasswordId">
											</div>
										</div>
										<div class="form-group">
											<label for="UserNameId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>真实姓名</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="UserName"
													id="UserNameId">
											</div>
										</div>
										<div class="form-group">
											<label for="csrqId2" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>出生日期</label>
											<div class="col-md-8">
												<div class="input-group date form_datetime"
													data-data-format="yyyy-MM-dd">
													<input type="text" class="form-control input-sm"
														id="csrqId2" placeholder="请输入出生日期" name="CSRQ" readonly>
													<span class="input-group-addon"> <span
														class="glyphicon glyphicon-calendar"></span>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label for="AddressId" class="col-md-4 control-label">家庭住址</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="Address"
													id="AddressId">
											</div>
										</div>
									</div>
									<div class="col-md-6 col-md-offset-1" style="margin-top: 60px">
										<div class="form-group">
											<label for="nameId" class="col-md-4 control-label">电话号码</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="Telephone"
													id="TelephoneId">
											</div>
										</div>
										<div class="form-group">
											<label for="nameId" class="col-md-4 control-label">Email</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="Email"
													id="EmailId">
											</div>
										</div>
										<div class="form-group">
											<label for="SexId" class="col-md-4 control-label">Sex</label>
											<div class="col-md-8">
												<input type="radio" class="form-control" name="Sex"
													id="SexId" value="1">男
												<input type="radio" class="form-control" name="Sex"
													id="SexId" value="0">女
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button id="www" type="button" class="btn btn-default"
								data-dismiss="modal">关闭</button>
							<button id="saveBtn" type="button" class="btn btn-primary"
								onclick="registerModalSave()">保存</button>
						</div>
					</form>
				</fieldset>
			</div>
		</div>
	</div>
	<div class="modal fade" id="myModal3">
		<div class="modal-dialog" style="width: 900px">
			<div class="modal-content">
				<fieldset>
					<form id="loginModalFormId" class="form-horizontal "
						action="userLogin" method="post">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">
								<span>&times;</span>
							</button>
							<h4 class="modal-title" id="myModalLabel">用户登录</h4>
						</div>
						<div class="modal-body" style="height: 200px">
							<div class="row">
								<div class="col-md-10 col-md-offset-1">
									<div class="col-md-6 col-md-offset-3 " style="margin-top: 60px">
										<div class="form-group">
											<label for="UserId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>用户名</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="UserId"
													id="UserId">
											</div>
										</div>
										<div class="form-group">
											<label for="PasswordId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>密码</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="Password" id="PasswordId">
											</div>
										</div>
										<!-- <div class="form-group">
										
											<div class="pc-submit-ss col-md-1 ">
												<input type="button" value="登录"   onclick="loginModalSave()">
											</div>
										</div> -->
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<!-- <button id="www" type="button" class="btn btn-default"
								data-dismiss="modal">关闭</button>
							<button id="saveBtn" type="button" class="btn btn-primary"
								onclick="loginModalSave()">登录</button> -->
								<div class="pc-submit-ss " align="center" style="margin-top: 100px">
									<input type="button" value="登录"   onclick="loginModalSave()">
								</div>
						</div>
					</form>
				</fieldset>
			</div>
		</div>
	</div>
<!-- basketModal -->
	<div class="modal fade" id="myModal2">
		<div class="modal-dialog" style="width: 900px">
			<div class="modal-content"  >
				<fieldset>
					<form id="modalFormId2" class="form-horizontal "
						action="InsertGoodsOrder" method="post">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">
								<span>&times;</span>
							</button>
							<h4 class="modal-title" id="myModalLabel">购物车界面</h4>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-md-12 ">
								<div class="col-md-12">
									
									<div class="col-md-12 " >
									<table class="table table-striped">
										<caption>
											<strong>我的购物车</strong>
											
										</caption>
										<thead style="display: block; height: 30px">
											<tr>
												<td style="width:300px"  class="success">序号</td>
												<td style="width:300px" class="success">商品编号</td>
												<td style="width:300px" class="success">商品名</td>
												<td style="width:200px" class="success">单价</td>
												<td style="width:200px" class="success">数量</td>
												<td style="width:200px" class="success">小计</td>
												<td style="width:200px" class="success">删除操作</td>
											</tr>
										</thead>
				
										<tbody id="tableId"
											style="display: block; max-height: 700px;height: 200px ; overflow-y: scroll">
										</tbody>
										<tfoot>
														
		
										</tfoot>
				
									</table>
									</div>
								</div>

								</div>
							</div>
						</div>
						<div class="modal-footer">
							
							<div>
								<label for="hjId" class="col-md-1 col-md-offset-8 control-label">合计:</label>
											<div class="col-md-3">
												<input type="text" class="form-control" placeholder="合计" name="money"
													id="hjId">
											</div>
							</div>
							<button id="www" type="button" class="btn btn-default"
								data-dismiss="modal">关闭</button>
							<button id="saveBtn" type="button" class="btn btn-primary"
								onclick="basketSave()">提交订单</button>
						</div>
					</form>
				</fieldset>
			</div>
		</div>
	</div>

</body>
</html>