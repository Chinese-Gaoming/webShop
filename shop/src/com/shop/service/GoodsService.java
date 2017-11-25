package com.shop.service;

import java.util.List;

import com.shop.model.Basket;
import com.shop.model.Goods;
import com.shop.model.GoodsOrder;
import com.shop.model.GoodsType;

public interface GoodsService {
	public List<GoodsType> getGoodsType();
	public List<Goods> getGoods();
	public List<Goods> getGoods(String TypeId);
	public List<Goods> getDetailGoods(String goodsName);
	public List<GoodsOrder> getGoodsOrder();
	public List<GoodsOrder> getGoodsOrder2();
	public List<GoodsOrder> getNoMoneyGoodsOrder(String userss);//获取未付款的订单
	public List<GoodsOrder> getYesMoneyGoodsOrder(String userss);//获取yi付款的订单
	
	public List<Goods> getLikeGoods(String GoodsName);
	public int insertGoodsType(GoodsType goodstype);
	public int insertGoods(Goods goods);
	public int insertBasket(Basket basket);
	public int InsertGoodsOrder(GoodsOrder goodsOrder);
	public int deleteGoodsType(String type);
	public int deleteGoods(String goodNumber);
	public int deleteBasket(Basket basket);
	
	public int deleteGoodsOrder(String DDH);
	public int updateGoodsOrder(String DDH);
	public int giveMoney(String DDH);
	public List<Basket> getBasket(String users);
}
