var express = require("express");
var router = express.Router();
var Product = require("../models/product");

//adding prods to cart
router.get("/new/:id/:return",inCart,function(req,res)
	{
	var cartItem = {
		product: req.params.id,
		qty: 1
	}
	req.user.cart.items.unshift(cartItem);
	Product.findById(req.params.id,function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			req.user.cart.cart_total+=product.mrp;
			req.user.cart.discount+=product.discount;
			req.user.cart.total+=product.price;
			req.user.save();
		}
	});
	req.flash("success","Product added to Cart!!");
	if(req.params.return=="show") {
		res.redirect("/products/" + req.params.id);
	} else {
		res.redirect("/products");
	}
});

module.exports = router;