(function(_global){
	
	var SingleItem = Backbone.Model.extend({
		
		initialize:function(){
			
		},
		
		defaults:{
			top:0,
			left:0,
			opacity:1
		}
	});
	
	var Items = Backbone.Collection.extend({
		model:"SingleItem"
	});
	
	var ContainerView = Backbone.View.extend({
		
		el:null,

		initialize:function(context){

		},
		
		events:{
			"click":"toggle"
		},
		
		toggle:function(){

		}
	});
	
	var cv = new ContainerView({el:$("#container")});
	
}(window));