package com.shop.dao.impl;

import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Component;

import com.shop.dao.GoodsDao;
import com.shop.model.Basket;
import com.shop.model.Goods;
import com.shop.model.GoodsOrder;
import com.shop.model.GoodsType;
import com.shop.model.Users;
@Component
public class GoodsDaoImpl extends SqlSessionDaoSupport implements GoodsDao {
	@Resource
	@Override
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		// TODO Auto-generated method stub
		super.setSqlSessionFactory(sqlSessionFactory);
	}

	@Override
	public List<GoodsType> getGoodsType() {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getGoodsType";
		List<GoodsType> type=session.selectList(statement);
		
		return type;
	}

	@Override
	public int insertGoodsType(GoodsType goodstype) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.insertGoodsType";
		int result=session.insert(statement,goodstype);
		return result;
	}

	@Override
	public int deleteGoodsType(String type) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.deleteGoodsType";
		int result=session.delete(statement,type);
		return result;
	}

	@Override
	public List<Goods> getGoods() {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getGoods";
		List<Goods> goods=session.selectList(statement);
		
		return goods;
	}

	@Override
	public int deleteGoods(String goodNumber) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.deleteGoods";
		int result=session.delete(statement,goodNumber);
		return result;
	}

	@Override
	public int insertGoods(Goods goods) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.insertGoods";
		int result=session.insert(statement,goods);
		return result;
	}

	@Override
	public List<Goods> getLikeGoods(String GoodsName) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getLikeGoods";
		List<Goods> result=session.selectList(statement,GoodsName);
		return result;
	}

	@Override
	public List<GoodsOrder> getGoodsOrder() {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getGoodsOrder";
		List<GoodsOrder> goods=session.selectList(statement);
		
		return goods;
	}

	@Override
	public List<GoodsOrder> getGoodsOrder2() {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getGoodsOrder2";
		List<GoodsOrder> goods=session.selectList(statement);
		
		return goods;
	}
	@Override
	public List<GoodsOrder> getNoMoneyGoodsOrder(String userss) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getNoMoneyGoodsOrder";
		List<GoodsOrder> goods=session.selectList(statement,userss);
		
		return goods;
	}
	@Override
	public List<GoodsOrder> getYesMoneyGoodsOrder(String userss) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getYesMoneyGoodsOrder";
		List<GoodsOrder> goods=session.selectList(statement,userss);
		
		return goods;
	}

	@Override
	public int deleteGoodsOrder(String DDH) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.deleteGoodsOrder";
		int result=session.delete(statement,DDH);
		return result;
	}

	@Override
	public int updateGoodsOrder(String DDH) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.updateGoodsOrder";
		int result=session.update(statement,DDH);
		return result;
	}


	@Override
	public int giveMoney(String DDH) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.giveMoney";
		int result=session.update(statement,DDH);
		return result;
	}

	@Override
	public List<Basket> getBasket(String users) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getBasket";
		List<Basket> basket=session.selectList(statement,users);
		return basket;
	}

	@Override
	public int deleteBasket(Basket basket) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.deleteBasket";
		int result=session.delete(statement,basket);
		return result;
	}

	@Override
	public int InsertGoodsOrder(GoodsOrder goodsOrder) {
		SqlSession session=getSqlSession();
		String UserId=goodsOrder.getLXR();
		String statement="com.shop.mapper.loginMapper.userMyManagerInfo";
		String statement2="com.shop.mapper.goodsMapper.insertGoodsOrder";
		List<Users> list=session.selectList(statement, UserId);
		
		goodsOrder.setADDRESS(list.get(0).getAddress());
		goodsOrder.setLXFS(list.get(0).getTelephone());
		UUID uuid=UUID.randomUUID();
		String m=uuid.toString();
		goodsOrder.setDDH(m);
		
		int result=session.insert(statement2,goodsOrder);
		return result;
	}

	@Override
	public List<Goods> getDetailGoods(String goodsName) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getDetailGoods";
		List<Goods> result=session.selectList(statement,goodsName);
		return result;
	}

	@Override
	public int insertBasket(Basket basket) {
		System.out.println("111111111111111");
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.insertBasket";
		int result=session.insert(statement,basket);
		return result;
	}

	@Override
	public List<Goods> getGoods(String TypeId) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.goodsMapper.getSomeGoods";
		List<Goods> goods=session.selectList(statement,TypeId);
		
		return goods;
	}
	
	
	




}
