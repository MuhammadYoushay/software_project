var express = require("express");
var router = express.Router();

router.get("/",function(req,res){
	res.render("cart/checkout",{user: req.user});
});


module.exports = router;