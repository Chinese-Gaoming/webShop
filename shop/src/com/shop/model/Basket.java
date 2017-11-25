package com.shop.model;

public class Basket {
	private String GoodsId;
	private String GoodsName;
	private String SalePrice;
	private String Number;
	private String subtotal;//Ð¡¼Æ
	private String UserId;
	private String DDH;
	public String getGoodsId() {
		return GoodsId;
	}
	public void setGoodsId(String goodsId) {
		GoodsId = goodsId;
	}
	public String getGoodsName() {
		return GoodsName;
	}
	public void setGoodsName(String goodsName) {
		GoodsName = goodsName;
	}
	public String getSalePrice() {
		return SalePrice;
	}
	public void setSalePrice(String salePrice) {
		SalePrice = salePrice;
	}
	public String getNumber() {
		return Number;
	}
	public void setNumber(String number) {
		Number = number;
	}
	public String getSubtotal() {
		return subtotal;
	}
	public void setSubtotal(String subtotal) {
		this.subtotal = subtotal;
	}
	public String getUserId() {
		return UserId;
	}
	public void setUserId(String userId) {
		UserId = userId;
	}
	public String getDDH() {
		return DDH;
	}
	public void setDDH(String dDH) {
		DDH = dDH;
	}

}
