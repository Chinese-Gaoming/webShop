<%@page import="com.shop.model.Admin"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link rel="stylesheet" type="text/css" href="dist/css/bootstrap.min.css">
<script  type="text/javascript" src="dist/js/jquery-3.1.1.min.js"></script>
<script  type="text/javascript" src="dist/js/bootstrap.min.js"></script>
<!-- Custom styles for this template -->
<link href="dist/css/dashboard.css" rel="stylesheet">
<link href="dist/css/menu.css">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Insert title here</title>
<style type="text/css">
.nav-bgcolr {
	background-color: #3A8FBA;
}
</style>
<script type="text/javascript">
</script>
<script type="text/javascript">
	function adminManager() {
	document.getElementById("iframe").src="adminManager"; 
	}
	function changeAdminPassword() {
	document.getElementById("iframe").src="changeAdminPassword"; 
	}
	function goodsTypePage() {
	document.getElementById("iframe").src="goodsTypePage"; 
	}
	function goodsManagerPage() {
	document.getElementById("iframe").src="goodsManagerPage"; 
	}
	function addGoodsPage() {
	document.getElementById("iframe").src="addGoodsPage"; 
	}
	function goodsOrderManagerPage() {
	document.getElementById("iframe").src="goodsOrderManagerPage"; 
	}
	function goodsOrderManagerPage2() {
	document.getElementById("iframe").src="goodsOrderManagerPage2"; 
	}
	function userManager() {
	document.getElementById("iframe").src="userManagerPage"; 
	}
</script>
</head>
<body>
	<nav class="navbar navbar-fixed-top nav-bgcolr" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
        <%
			Admin admins = (Admin) session.getAttribute("admin");
		%>
          <font class="navbar-brand" style="color:white">欢迎您：<%=admins.getAdminId()%></font>
        </div> 
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="adminLogin.jsp">退出</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
        	<ul id="main-nav" class="nav nav-tabs nav-stacked" >
					<li class="active"><a href="#"> 
						<i class="glyphicon glyphicon-th-large"></i>菜单列表
					</a></li>
							<li>
						<a href="#XiTongGuanLi" class="nav-header collapsed" data-toggle="collapse"> 
							<i class="glyphicon glyphicon-credit-card"></i> 系统管理<span class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
						<ul id="XiTongGuanLi" class="nav nav-list collapse secondmenu"
							style="height: 0px;">
							<li><a onclick="adminManager()"><i class="glyphicon glyphicon-user"></i>管理员用户</a></li>
							<li><a onclick="changeAdminPassword()"><i class="glyphicon glyphicon-user"></i>修改登录密码</a></li>
						</ul>
					</li>
					<!-- <li>
						<a href="#GunDongGongGaoGuanli" class="nav-header collapsed"
							data-toggle="collapse"> <i class="glyphicon glyphicon-cog"></i>
								滚动公告管理 <span class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
						<ul id="GunDongGongGaoGuanli" class="nav nav-list collapse secondmenu"
							style="height: 0px;">
							<li><a onclick="changeSource('patientlist')"><i class="glyphicon glyphicon-user"></i>滚动公告管理</a></li>
							<li><a onclick="changeSource('patientlist')"><i class="glyphicon glyphicon-user"></i>发布滚动公告</a></li>
						</ul>
					</li> -->
					<!-- <li>
						<a href="#GouWuZiXunGuanLi" class="nav-header collapsed"
							data-toggle="collapse"> 
							<i class="glyphicon glyphicon-credit-card"></i> 购物咨询管理<span class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
						<ul id="GouWuZiXunGuanLi" class="nav nav-list collapse secondmenu"
							style="height: 0px;">
							<li><a onclick="changeSource('charge')"><i class="glyphicon glyphicon-user"></i>购物咨询管理</a></li>
							<li><a onclick="changeSource('charge')"><i class="glyphicon glyphicon-user"></i>发布购物咨询</a></li>
						</ul>
					</li> -->
					<li>
						<a href="#ShangPinLeiBieGuanLi" class="nav-header collapsed"
							data-toggle="collapse"> 
							<i class="glyphicon glyphicon-credit-card"></i> 商品类别管理<span class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
						<ul id="ShangPinLeiBieGuanLi" class="nav nav-list collapse secondmenu"
							style="height: 0px;">
							<li><a onclick="goodsTypePage()"><i class="glyphicon glyphicon-user"></i>商品类别管理</a></li>
						</ul>
					</li>
					<li>
						<a href="#ShangPinXinXIGuanLi" class="nav-header collapsed"
							data-toggle="collapse"> 
							<i class="glyphicon glyphicon-credit-card"></i> 商品信息管理<span class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
						<ul id="ShangPinXinXIGuanLi" class="nav nav-list collapse secondmenu"
							style="height: 0px;">
							<li><a onclick="goodsManagerPage()"><i class="glyphicon glyphicon-user"></i>商品信息管理</a></li>
							<li><a onclick="addGoodsPage()"><i class="glyphicon glyphicon-user"></i>发布商品信息</a></li>
						</ul>
					</li>
					<li>
						<a href="#ZhuCeYongHuGuanLi" class="nav-header collapsed"
							data-toggle="collapse"> 
							<i class="glyphicon glyphicon-credit-card"></i> 注册用户管理<span class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
						<ul id="ZhuCeYongHuGuanLi" class="nav nav-list collapse secondmenu"
							style="height: 0px;">
							<li><a onclick="userManager()"><i class="glyphicon glyphicon-user"></i>注册用户管理</a></li>
						</ul>
					</li>
					<li>
						<a href="#GouMaiDingDanGuanLi" class="nav-header collapsed"
							data-toggle="collapse"> 
							<i class="glyphicon glyphicon-credit-card"></i> 购买订单管理<span class="pull-right glyphicon glyphicon-chevron-down"></span>
						</a>
						<ul id="GouMaiDingDanGuanLi" class="nav nav-list collapse secondmenu"
							style="height: 0px;">
							<li><a onclick="goodsOrderManagerPage()"><i class="glyphicon glyphicon-user"></i>已发货订单信息</a></li>
							<li><a onclick="goodsOrderManagerPage2()"><i class="glyphicon glyphicon-user"></i>未发货订单信息</a></li>
						</ul>
					</li>
				</ul>
        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" style="padding-left:3px;padding-right:3px;padding-top:1px">
          <iframe id="iframe" src="test" width="100%" height="900px"  scrolling="no" frameborder="0">
          </iframe>
      	</div>
    </div>
    </div>
</body>
</html>