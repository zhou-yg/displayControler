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
				"Items":itemsObj
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
		var toArray = function(_arg,_len,_prop){

			if(_arg.constructor == Object){
				
				var vArr = new Array();

				if(_prop){

					var kArr = new Array();

					for(k in _arg){
						kArr.push(k);
						vArr.push(_arg[k]);
					}
					_arg = [kArr,vArr];

				}else{
					for(k in _arg){
						vArr.push(_arg[k]);
					}
					_arg = vArr;
				}
			}
			if(_arg.constructor == Array){
				
				if(!_len){
					return _arg;
				}
				if(_arg.length != _len){
					throw new Error("the argument's child elements's num is illegal");
					return;
				}
			}
			return _arg;		
		};
		var parse = function(_arg){
			//_arg[arr1,arr2];
			//arr1 = [{a:"l",b:"l2"},{div:"c",span:"d"}];
			//arr2 = [{v:0},{v:1},{v:2},{v:3},{v:4},{v:5},{v:6},{v:7},{v:8},{v:9}];
			//--> arr1 = [[0],[1],[2],[3],[4],[5],[6],[7],[8],[9]];
			//--> arr2 = ["l","l2"];
			//--> arr3 = ["c","d"];
			//--> arr4 = ["div","span"]
			//_arg[arr1,arr2,arr3,arr4]
			_arg = toArray(_arg,2);
			
			var arr1 = toArray(_arg[0],2);
			var arr2 = arr1[0];
			var arr3 = arr1[1];

			var arr4 = _arg[1];
			  
			arr1 = toArray(arr2);
			
			arr2 = toArray(arr3,0,true)[0];
			arr3 = toArray(arr3,0,true)[1];

			arr4 = arr4.map(function(el){
				return toArray(el);
			});
			var l = arr4[0].length;
			var r = arr4.every(function(el){
				return el.length==l?true:false;
			});
			if(!r){
				throw new Error("some array's length in data is illegal");
			}

			_arg = [arr1,arr2,arr3,arr4];

			return _arg;
		};
		function load(_arg){
			
			var dataArr = parse(_arg);
			
			if(dataArr){
				
				
			}
		}
		function show(_arg){
			
		}
		
		_global.init = init;
	}(window)); 