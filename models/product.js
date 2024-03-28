var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
	name: String,
	image: String,
	mrp: Number,
	price: Number,
	category: String,
	disc_perc: Number,
	discount: Number,
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	],
	description: String,
	new: Boolean,
	trending: Boolean,
});

module.exports = mongoose.model('Product',productSchema);