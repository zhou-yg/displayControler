( function(_global) {
		//model collection object
		var liContainer;
	
		var backbone = function() {
			
			var SingleItem = Backbone.Model.extend({

				url:"#",
				
				initialize : function(id) {
					
					this.bind("invalid",function(model,error){

					});
				},
				validate:function(attr){

				},
				defaults : {
					name:"d"
				}
			});

			var Items = Backbone.Collection.extend({
				model : "SingleItem",
			});
			
			var itemsObj = new Items();

			return {
				"SingleItem":SingleItem,
				"Items":itemObj
			};
		}();

		function init(_t,_arg){
			
			var fn = {"load":load,"show":show};

			if(typeof _t == "string"){
				return fn[_t]?fn[_t](_arg):fn[0](_arg);
			}else{
				throw new Error("invalid type of arguments in function named init");
			}
		}
		var parse = function(_arg){
			// _arg = [ [ [1,2,3],[1,2,3],[1,2,3] ]   , [css1,css2,css3]]
			//3维数组
			if(_arg.constructor == Array){

				if(_arg.length != 2){
					throw new Error("the argument's length is illegal");
					return;
				}
			}else if(_arg.constructor == Object){
				
				if(_arg.data){
					throw new Error("the argument Object have to include data");
					return;
				}
				if(_arg.css){
					throw new Error("the argument Object have to include css");
					return;
				}
				_arg = [_arg.data,_arg.css];
			}
			//第一个数组元素是数据
			if(_arg[0].length && _arg[0][0].length && _arg[1].length){
				return ;
			}
			
			var l = _arg[0][0].length;
			var r = _arg[0].every(function(el){
				return el.length==l?true:false;
			});
			if(!r){
				throw new Error("all the data arrays' lengthes are not equal");
				return;
			}
			
			r = _arg[1].every(function(el){
				return el;
			});
			if(!r){
				throw new Error("all the css arrays' data is illegal");
				return;
			}
			return _arg;
		};
		function load(_arg){
			
			var dataArr = parse(_arg);
		}
		function show(_arg){
			
		}
		
		
		_global.init = init;
	}(window)); 