var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cats');

var catSchema = new mongoose.Schema({
	name : String,
	age : Number, 
});

var Cat = mongoose.model("Cat", catSchema);

var george = new Cat({
	name : 'George',
	age : 5,
});

george.save(function(err, cat){
	if (err){
		console.log('Something went wrong!!!!')
		console.log(err)
	}
	else{
		console.log('Cat Saved')
		console.log(cat)
	}
});
