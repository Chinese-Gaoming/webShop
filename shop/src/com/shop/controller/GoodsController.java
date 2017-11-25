package com.shop.controller;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.shop.model.Basket;
import com.shop.model.Goods;
import com.shop.model.GoodsOrder;
import com.shop.model.GoodsType;
import com.shop.model.Users;
import com.shop.service.GoodsService;

@Controller
public class GoodsController {
@Resource
private GoodsService goodsService;

@RequestMapping("goodsTypePage")
public String goodsTypePage(){
	return "goodsType";
	
}
@RequestMapping("goodsManagerPage")
public String goodsPage(){
	return "goodsManager";
	
}
@RequestMapping("addGoodsPage")
public String addgoodsPage(){
	return "addGoods";
	
}
@RequestMapping("goodsOrderManagerPage")
public String goodsOrderPage(){
	return "goodsOrderManager";
	
}
@RequestMapping("goodsOrderManagerPage2")
public String goodsOrderManagerPage2(){
	return "goodsOrderManagerPage2";
	
}
@RequestMapping("userManagerPage")
public String userManagerPage(){
	return "userManagerPage";
	
}
@RequestMapping("myGoodsOrderPage")
public String myGoodsOrderPage(){
	return "myGoodsOrder";
	
}
@RequestMapping("myYesMoneyGoodsOrderPage")
public String myYesMoneyGoodsOrder(){
	return "myYesMoneyGoodsOrder";
	
}


@RequestMapping("getGoodsType")
@ResponseBody
public List<GoodsType> getGoodsType(){
	List<GoodsType> list=goodsService.getGoodsType();
	return list;
	
}
@RequestMapping("InsertGoodsType")
@ResponseBody
public int insertGoodsType(GoodsType goodstype){
	int result=goodsService.insertGoodsType(goodstype);
	return result;
	
}
@RequestMapping("deleteGoodsType")
@ResponseBody
public int deleteGoodsType(String Type,HttpServletResponse response){
	try {
		Type = URLDecoder.decode(Type, "UTF-8");//解码
	} catch (UnsupportedEncodingException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	response.setCharacterEncoding("UTF-8"); 
	response.setContentType("text/xml;charset=utf-8");
	System.out.println(Type);
	int result=goodsService.deleteGoodsType(Type);
	return result;
	
}

@RequestMapping("getGoods")
@ResponseBody
public List<Goods> getGoods(){
	List<Goods> list=goodsService.getGoods();
	return list;
	
}
@RequestMapping("getSomeGoods")
@ResponseBody
public List<Goods> getGoods(String TypeId){
	List<Goods> list=goodsService.getGoods(TypeId);
	return list;
	
}
@RequestMapping("getsrchGoods")
@ResponseBody
public List<Goods> getGoods22(String GoodsName,HttpServletRequest request,HttpServletResponse response){
	try {
		GoodsName = URLDecoder.decode(GoodsName, "UTF-8");//解码
	} catch (UnsupportedEncodingException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	response.setCharacterEncoding("UTF-8"); 
	response.setContentType("text/xml;charset=utf-8");
	System.out.println(GoodsName);
	List<Goods> list=goodsService.getLikeGoods(GoodsName);
	return list;
	
}
@RequestMapping("getGoodsOrder")
@ResponseBody
public List<GoodsOrder> getGoodsOrder(){
	List<GoodsOrder> list=goodsService.getGoodsOrder();
	return list;
	
}
@RequestMapping("getGoodsOrder2")
@ResponseBody
public List<GoodsOrder> getGoodsOrder2(){
	List<GoodsOrder> list=goodsService.getGoodsOrder2();
	return list;
	
}
@RequestMapping("getNoMoneyGoodsOrder")
@ResponseBody
public List<GoodsOrder> getNoMoneyGoodsOrder(HttpServletRequest request){
	Users users =(Users) request.getSession().getAttribute("users");
	String userss=users.getUserId();
	List<GoodsOrder> list=goodsService.getNoMoneyGoodsOrder(userss);
	return list;
	
}
@RequestMapping("getYesMoneyGoodsOrder")
@ResponseBody
public List<GoodsOrder> getYesMoneyGoodsOrder(HttpServletRequest request){
	Users users =(Users) request.getSession().getAttribute("users");
	String userss=users.getUserId();
	List<GoodsOrder> list=goodsService.getYesMoneyGoodsOrder(userss);
	return list;
	
}

@RequestMapping("deleteGoods")
@ResponseBody
public int deleteGoods(String goodNumber){
	int list=goodsService.deleteGoods(goodNumber);
	return list;
	
}
@RequestMapping("deleteGoodsOrder")
@ResponseBody
public int deleteGoodsOrder(String DDH){
	int list=goodsService.deleteGoodsOrder(DDH);
	return list;
	
}
@RequestMapping("updateGoodsOrder")
@ResponseBody
public int updateGoodsOrder(String DDH){
	int list=goodsService.updateGoodsOrder(DDH);
	return list;
	
}
@RequestMapping("giveMoney")
@ResponseBody
public int giveMoney(String DDH){
	int list=goodsService.giveMoney(DDH);
	return list;
	
}
@RequestMapping("InsertGoods")//添加商品信息
@ResponseBody
public int InsertGoods(Goods goods,MultipartFile pictureFile) throws Exception, Exception{
	UUID uuid = UUID.randomUUID();
	String m=uuid.toString();
	String filepath="E:\\workspaces\\shop\\WebContent\\dist\\imagePath\\";
	String originalFilename=pictureFile.getOriginalFilename();
	String nameFileName=UUID.randomUUID()+originalFilename;
	pictureFile.transferTo(new File(filepath+nameFileName));
	goods.setGoodsImage(nameFileName);
	goods.setGoodsNumber(m);
	int list=goodsService.insertGoods(goods);
	return list;
	
}
@RequestMapping("InsertBasket")//添加购物车信息
@ResponseBody
public int InsertBasket(Basket baskets,HttpServletRequest request) {
	System.out.println(baskets.getGoodsName());
	Users users =(Users) request.getSession().getAttribute("users");
	if(users!=null){
		System.out.println();
		String userss=users.getUserId();
		baskets.setUserId(userss);
		int list=goodsService.insertBasket(baskets);
		return list;
	}else{
		System.out.println("添加购物车失败");
		return 0;
	}
	
}


@RequestMapping("getLikeGoods")//查询商品信息
@ResponseBody
public List<Goods> getGoods(String GoodsName,HttpServletResponse response){
	try {
		GoodsName = URLDecoder.decode(GoodsName, "UTF-8");//解码
	} catch (UnsupportedEncodingException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	response.setCharacterEncoding("UTF-8"); 
	response.setContentType("text/xml;charset=utf-8");
	System.out.println(GoodsName);
	List<Goods> list=goodsService.getLikeGoods(GoodsName);
	return list;
	
}
@RequestMapping("getBasket")//查询购物车商品信息
@ResponseBody
public List<Basket> getBasket(HttpServletRequest request){
	
	Users users =(Users) request.getSession().getAttribute("users");
	String userss=users.getUserId();
	List<Basket> list=goodsService.getBasket(userss);
	
	return list;
	
}
@RequestMapping("getdetailGoods")
@ResponseBody
public List<Goods> getGoodsDetail(String goodsName,HttpServletRequest request,HttpServletResponse response){
	
	System.out.println(111111);
	try {
		goodsName = URLDecoder.decode(goodsName, "UTF-8");//解码
	} catch (UnsupportedEncodingException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	response.setCharacterEncoding("UTF-8"); 
	response.setContentType("text/xml;charset=utf-8");
	System.out.println(goodsName);
	
	List<Goods> list=goodsService.getDetailGoods(goodsName);
	
	return list;
	
}
@RequestMapping("deleteBasket")//删除购物车商品信息
@ResponseBody
public int deleteBasket(String GoodsId,Basket basket,HttpServletRequest request){
	Users users =(Users) request.getSession().getAttribute("users");
	if(users!=null){
		String userss=users.getUserId();
		basket.setUserId(userss);
		basket.setGoodsId(GoodsId);
		
		int list=goodsService.deleteBasket(basket);
		
		return list;
	}else{
		System.out.println("删除购物车失败");
		return 0;
	}
	
	
}
@RequestMapping("InsertGoodsOrder")//添加订单信息
@ResponseBody
public int InsertGoodsOrder(HttpServletRequest request,GoodsOrder goodsOrder){
	Users users =(Users) request.getSession().getAttribute("users");
	if(users!=null){
		String userss=users.getUserId();
		goodsOrder.setLXR(userss);
		String[] zz=request.getParameterValues("GoodsId");
		String[] dd=request.getParameterValues("GoodsName");
		String aa=Arrays.toString(zz);
		String bb=Arrays.toString(dd);
		goodsOrder.setGoodsId(aa);
		goodsOrder.setGoodsName(bb);
		int a=goodsService.InsertGoodsOrder(goodsOrder);
		return a;
	}else{
		System.out.println("添加订单信息失败");
		return 0;
	}
	
}

}
