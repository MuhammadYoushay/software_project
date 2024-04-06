var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var User = require("../models/user");

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
			// Find trending products
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


router.get("/category/:category",function(req,res){
	const categoryName = req.params.category;
	let option = {};
	if(categoryName!=="all") {
		option = {category:categoryName.replaceAll("-"," ")};
	}

	Product.find(option,function(err,products){
		if(err){
			req.flash("error","Something went wrong!!");
			res.redirect("/products");
		} else {
			res.render("products/category",{products, category:req.params.category});
		}
	});
})

router.get("/:id",function(req,res){
	Product.findById(req.params.id).populate("reviews").exec(function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			res.render("products/show",{product: product});
		}
	});
});

router.get("/:id/edit",isAdmin,function(req,res){
	Product.findById(req.params.id,function(err,product){
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			res.render("products/edit",{product: product});
		}
	});
});

router.delete("/:id",isAdmin,function(req,res){
	Product.findById(req.params.id,function(err,product) {
		if(err || !product) {
			req.flash("error","Product not found!!");
			res.redirect("/products");
		} else {
			User.find({},function(err,users) {
				if(err) {
					req.flash("error","Something went wrong!!");
					res.redirect("/products");
				} else {
					users.forEach(function(user) {
						for (var i = user.cart.items.length - 1; i >= 0; i--) {
							if(user.cart.items[i].product._id.equals(req.params.id)) {
								user.cart.cart_total-=(product.mrp*user.cart.items[i].qty);
								user.cart.discount-=(product.discount*user.cart.items[i].qty);
								user.cart.total-=(product.total*user.cart.items[i].qty);
								user.cart.items.splice(i,1);
								break;
							}
						}
						user.save();
					});
				}
			});
		}
	});
	Product.findByIdAndRemove(req.params.id,function(err){
		if(err) {
			req.flash("error","Something went wrong!!");
			res.redirect("/products");
		} else {
			req.flash("success","Product removed!!");
			res.redirect("/products");
		}
	});
});

function isAdmin(req,res,next) {
	if(req.isAuthenticated()) {
		if(req.user.username=='admin') {
			next();
		} else {
			req.flash("error","Permission Denied!!");
			res.redirect("/products");
		}
	} else {
		req.flash("error","Login to continue!!");
		res.redirect("/login");
	}
}

module.exports = router;