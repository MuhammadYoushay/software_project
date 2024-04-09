var express = require("express");
var router = express.Router();
var Product = require("../models/product");

router.get("/", function(req, res) {
	Product.find({}, function(err, products) {
	  if (err) {
		req.flash("error", "Something went wrong!!");
		res.redirect("/products");
	  }
	else {
		let categories = products.map(product => product.category);
		categories = [...new Set(categories)];		
		Product.find({ new: true }, function(err, newProducts) {
		  if (err) {
			req.flash("error", "Something went wrong!!");
			res.redirect("/products");
		  } else {
			Product.find({ trending: true }, function(err, trendingProducts) {
			  if (err) {
				req.flash("error", "Something went wrong!!");
				res.redirect("/products");
			  } else {
				res.render("products/index", { categories, newProducts, trendingProducts });
			  }
			});
		  }
		});
	  }
	});
  });

module.exports = router;