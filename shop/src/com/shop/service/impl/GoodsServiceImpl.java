package com.shop.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;

import com.shop.dao.GoodsDao;
import com.shop.model.Basket;
import com.shop.model.Goods;
import com.shop.model.GoodsOrder;
import com.shop.model.GoodsType;
import com.shop.service.GoodsService;
@Component
public class GoodsServiceImpl implements GoodsService {
@Resource
private GoodsDao goodsDao;
	@Override
	public List<GoodsType> getGoodsType() {
		// TODO Auto-generated method stub
		return goodsDao.getGoodsType();
	}

	@Override
	public int insertGoodsType(GoodsType goodstype) {
		// TODO Auto-generated method stub
		return goodsDao.insertGoodsType(goodstype);
	}

	@Override
	public int deleteGoodsType(String type) {
		// TODO Auto-generated method stub
		return goodsDao.deleteGoodsType(type);
	}

	@Override
	public List<Goods> getGoods() {
		// TODO Auto-generated method stub
		return goodsDao.getGoods();
	}

	@Override
	public int deleteGoods(String goodNumber) {
		// TODO Auto-generated method stub
		return goodsDao.deleteGoods(goodNumber);
	}

	@Override
	public int insertGoods(Goods goods) {
		// TODO Auto-generated method stub
		return goodsDao.insertGoods(goods);
	}

	@Override
	public List<Goods> getLikeGoods(String GoodsName) {
		// TODO Auto-generated method stub
		return goodsDao.getLikeGoods(GoodsName);
	}

	@Override
	public List<GoodsOrder> getGoodsOrder() {
		// TODO Auto-generated method stub
		return goodsDao.getGoodsOrder();
	}

	@Override
	public List<GoodsOrder> getGoodsOrder2() {
		// TODO Auto-generated method stub
		return goodsDao.getGoodsOrder2();
	}

	@Override
	public int deleteGoodsOrder(String DDH) {
		// TODO Auto-generated method stub
		return goodsDao.deleteGoodsOrder(DDH);
	}

	@Override
	public int updateGoodsOrder(String DDH) {
		// TODO Auto-generated method stub
		return goodsDao.updateGoodsOrder(DDH);
	}

	@Override
	public List<GoodsOrder> getNoMoneyGoodsOrder(String userss) {
		// TODO Auto-generated method stub
		return goodsDao.getNoMoneyGoodsOrder(userss);
	}
	@Override
	public List<GoodsOrder> getYesMoneyGoodsOrder(String userss) {
		// TODO Auto-generated method stub
		return goodsDao.getYesMoneyGoodsOrder(userss);
	}

	@Override
	public int giveMoney(String DDH) {
		// TODO Auto-generated method stub
		return goodsDao.giveMoney(DDH);
	}

	@Override
	public List<Basket> getBasket(String users) {
		// TODO Auto-generated method stub
		return goodsDao.getBasket(users);
	}

	@Override
	public int deleteBasket(Basket basket) {
		// TODO Auto-generated method stub
		return goodsDao.deleteBasket(basket);
	}

	@Override
	public int InsertGoodsOrder(GoodsOrder goodsOrder) {
		// TODO Auto-generated method stub
		return goodsDao.InsertGoodsOrder(goodsOrder);
	}

	@Override
	public List<Goods> getDetailGoods(String goodsName) {
		// TODO Auto-generated method stub
		return goodsDao.getDetailGoods(goodsName);
	}

	@Override
	public int insertBasket(Basket basket) {
		// TODO Auto-generated method stub
		return goodsDao.insertBasket(basket);
	}

	@Override
	public List<Goods> getGoods(String TypeId) {
		// TODO Auto-generated method stub
		return goodsDao.getGoods(TypeId);
	}

}
