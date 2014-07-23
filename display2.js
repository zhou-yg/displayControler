( function(_global) {
		//model collection object
		var ulContainer;
	
		var backbone = function() {
			
			var SingleItem = Backbone.Model.extend({

				initialize : function(id) {
					
					this.bind("change:visibility",function(_o,_prop){
						if(_prop){
							this.get("o").style.visibility = "visible";
							this.set({opacity:0});
						}else{
							this.get("o").style.visibility = "hidden";
							this.set({opacity:1});
						}
					});
					this.on("change:top",function(_o,_prop){

						if(typeof _prop == "number"){
							_prop = _prop + "px";
						}
						
						this.get("o").style.top = _prop;
					});
					this.on("change:left",function(_o,_prop){
						
						if(typeof _prop == "number"){
							_prop = _prop + "px";
						}
						
						this.get("o").style.left = _prop;
					});
					this.on("change:opacity",function(_o,_prop){
						
						this.get("o").style.opacity = _prop;
					});
				},
				defaults : {
					o:"",
					blili:"li",
					bliStyle:"",
					bChildren:[],
					bChildrenStyles:[],
					bData:[],
					top:0,
					DEFAULT_TOP:25,
					left:0,
					DEFAULT_LEFT:25,
					opacity:1,
					visibility:true
				},
				move:function(_left){
					if(!_left){
						_left = this.get("DEFAULT_LEFT");
					}

					var obj = this;
					var t = new Tweenable();

					obj.set({visibility:true});
	
					t.tween({
						
						from:{left:0},
						to:{left:_left},
						duration:350,
						
						step:function(state){
							obj.set({left:state.left});
						}
					});
				},
				down:function(_top){
					if(!_top){
						_top = this.get("DEFAULT_TOP");
					}
					var obj = this;
					var t = new Tweenable();

					obj.set({visibility:true});
	
					t.tween({
						
						from:{top:0},
						to:{top:_top},
						duration:350,
						
						step:function(state){
							obj.set({top:state.top});
						}
					});
				},
				display:function(){
	
					var obj = this;
					var t = new Tweenable();

					obj.set({visibility:true});
	
					t.tween({
						from:{opacity:0},
						to:{opacity:1},
						duration:1000,
						step:function(state){
							obj.set({opacity:state.opacity});
						}
					});
				},
				create : function(){
					
					var bli = document.createElement(this.get("blili"));
					
					bli.className = this.get("bliStyle");
					
					for (var i=0; i < this.get("bData").length; i++) {

						var ci = i%this.get("bChildren").length;
						var csi = i%this.get("bChildrenStyles").length;
						
						var box = document.createElement(this.get("bChildren")[ci]);

						box.className = this.get("bChildrenStyles")[csi];
						box.innerText = this.get("bData")[i];

						bli.appendChild(box);
					};
					
					this.set({o:bli});
				}
			});

			var Items = Backbone.Collection.extend({
				
				model : "SingleItem",
			});
			
			return {
				"SingleItem":SingleItem,
				"Items":Items
			};
		}();

		function toArray(_arg,_len,_prop){

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
		var parseArg = function(_arg){

			_arg = toArray(_arg,2);
			//横向样式表
			//arr1 每个li的css类名，循环补不足
			//arr2 li内部的html布局标签，循环补不足
			//arr3 li内部的html布局标签的样式类名，循环补不足
			//arr4  横向的条目数，横向的条目数，每条横向有数列，填充于arr2的标签中，循环补不足
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
			
			var r = arr1.every(function(el){
				return typeof el == "string"; 
			});
			if(!r){
				throw new Error("arr1 not all elements are string");
			}
			r = arr2.every(function(el){
				return typeof el == "string"; 
			});
			if(!r){
				throw new Error("arr2 not all elements are string");
			}
			r = arr3.every(function(el){
				return typeof el == "string"; 
			});
			if(!r){
				throw new Error("arr3 not all elements are string");
			}
		    r = arr4.every(function(el){
				return el.length==l;
			});
			if(!r){
				throw new Error("some array's length in data is illegal");
			}

			_arg = [arr1,arr2,arr3,arr4];
			
			console.log(arr1);
			console.log(arr2);
			console.log(arr3);
			console.log(arr4);
			
			return _arg;
		};
		function show(_arg){
			
			var i = 0;
			
			var task = function(){
				if(i==10){
					return;
				}
				ulContainer.at(i).display();
				ulContainer.at(i).move(25);
				i++;
				setTimeout(task,250);
			};
			task();
		}
		//根据解析后的参数，利用backbone
		function load(_arg){
			
			var dataArr = parseArg(_arg);
			
			if(dataArr){
				
				var liStyles      = dataArr[0];
				var liChildren    = dataArr[1];
				var lichildStyles = dataArr[2];
				var liData        = dataArr[3];
				
				ulContainer = new backbone.Items();
				//讲backbone的model 装载进 backbone的model collection中
				for (var i=0; i < liData.length; i++) {
					
					var liOne = new backbone.SingleItem();
					
					liOne.set( {bliStyle:liStyles[i%liStyles.length] });
					
					liOne.set({ bChildren:liChildren });
					liOne.set({ bChildrenStyles:lichildStyles});
					liOne.set({ bData:liData[i] });
					
					liOne.create();
					
					liOne.set({visibility:false});
					
					ulContainer.add(liOne);
				};
			}
			var ulId = document.getElementById("ul_id");
			ulContainer.forEach(function(el){
				ulId.appendChild(el.get("o"));
			});
			show();
		}
		
		function init(_t,_arg){
			
			var fn = {"load":load,"show":show};
			if(typeof _t == "string"){
				return fn[_t]?fn[_t](_arg):fn[0](_arg);
			}else{
				throw new Error("invalid type of arguments in function named init");
			}
		}
		_global.init = init;
	}(window)); 