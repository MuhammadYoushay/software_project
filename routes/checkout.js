var express = require("express");
var router = express.Router();
router.get("/",isLoggedIn,function(req,res){
	res.render("cart/checkout",{user: req.user});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Login to continue!!");
	res.redirect("/login");
}

module.exports = router;