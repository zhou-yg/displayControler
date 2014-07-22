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

		function toArray(_arg){

			if(_arg.constructor == Object){
				
			}
			if(_arg.constructor == Array){
				
			}
			return _arg;		
		};
		var parseArg = function(_arg){

			_arg = toArray(_arg,2);
			//最新版本的参数 ,适用于2层结构
			//arr1   = [{li:{a:l,b:l2}},{div:"c",span:"d"}];
			//或 arr1 = [{li:[l,l2],{div:"c",span:"d"}];
			//arr2  = [{v:0,k:"A"},{v:1,k:"B"},{v:2,k:"C"},{v:3,k:"D"},{v:4,k:"e"},{v:5,k:"f"},{v:6,k:"g"},{v:7,k:"h"},{v:8,k:"i"},{v:9,k:"j"}];
			//转化
			//arr1 = ["li"]
			//arr2 = ["l","l2"];
			//arr3 = ["div","span"]
			//arr4 = ["c","d"];
			//arr5 = [[0,A],[1,B],[2,C],[3,D],[4,E],[5,F],[6,G],[7,H],[8,I],[9,J]];
			
			//arr1 容器下的第一层子局部标签,循环补不足
			//arr2 第一层子局部标签的css样式类名，循环补不足
			//arr3 容器下的第二层布局标签，数据的容身之处，循环补不足
			//arr4  第二层布局标签的css类名，循环补不足
			//arr5 数据，二位数组存放
			var arr1 = 1;
			var arr2 = 2;
			var arr3 = 3;
			var arr4 = 4;
			var arr5 = 5;
			
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
			
			if(false){
				
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