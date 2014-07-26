var Display = function(_global) {
		
		//model collection object
		var domContainer;
		var ulContainer;
		var startTime;
		var DISPLAY_INTERVAL    = 250;
		var TRANS_DURATION      = 350;
		var APPEARANCE_DURATION = 1000;
		var childLength = 0;
		
		var elQueue;
		
		var Queue = function(_arr){
			
			var index = 0;
			var arr;
			
			var isinit = false;
			
			if(_.isArray(_arr) && _arr){
				arr = _arr;
				isinit = true;
			}else{
				arr = new Array();
			}
			this.getInit = function(){
				return isinit;
			}
			this.setInit = function(){
				isinit = false;
			}
			this.queue = function(){
				
				return arr[index];
			}
			this.dequeue = function(){
				
				index = index<=0?index:--index;
				
				return arr.shift();
			};
			
			this.push = function(_el){
				if( _el || _el==0 ){
					arr.push(_el);
					isinit = true;
				}
			}
		};
		
		var backbone = function() {
			
			var SingleItem = Backbone.Model.extend({

				defaults : {
					
					o:"",
					
					tagName:"",
					tagStyle:"",
					childTags:[],
					childStyles:[],
					
					data:[],
					
					top:0,
					DEFAULT_TOP:25,
					left:0,
					DEFAULT_LEFT:25,
					opacity:1,
					visibility:true
				
				},
				initialize : function(id) {
					
					this.on("change:o",function(_o){

						_o.set({visibility:false});	
					});
					this.bind("change:visibility",function(_o,_prop){

						if(_prop){
							_o.get("o").style.display = "block";
							_o.set({opacity:0});
						}else{
							_o.get("o").style.display = "none";
							_o.set({opacity:1});
						}
					});
					this.on("change:top",function(_o,_prop){

						if(_.isNumber(_prop)){
							_prop = _prop + "px";
						}
						_o.get("o").style.top = _prop;
					});
					this.on("change:left",function(_o,_prop){
						
						if(_.isNumber(_prop)){
							_prop = _prop + "px";
						}
						_o.get("o").style.left = _prop;
					});
					this.on("change:opacity",function(_o,_prop){
						
						_o.get("o").style.opacity = _prop;
					});
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
						duration:TRANS_DURATION,
						
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
						duration:TRANS_DURATION,
						
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
						duration:APPEARANCE_DURATION,
						
						step:function(state){
							obj.set({opacity:state.opacity});
						}
					});
				},
				setProp : function(_t,_ts,_c,_cs,_d){
					
					this.set({tagName:_t,tagStyle:_ts,childTags:_c,childStyles:_cs,data:_d});
					this.create();
				},
				create : function(){
					
					var tag         = document.createElement(this.get("tagName"));
					tag.className   = this.get("tagStyle");

					var childTags   = this.get("childTags");
					var childStyles = this.get("childStyles");
					var data        = this.get("data");
					
					for (var i=0; i < data.length; i++) {

						var cti = i%childTags.length;
						var csi = i%childStyles.length;
						
						var box       = document.createElement(childTags[cti]);
						box.className = childStyles[csi];
						box.innerText = data[i];

						tag.appendChild(box);
					};
					
					this.set({o:tag});
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
		function parseObject(_arg,_isKey){

			var kArr = new Array();
			var vArr = new Array();
			
			for(var k in _arg){
				
				kArr.push(k);
				
				if(_arg[k].constructor == Object){
					_arg[k] = parseObject(_arg[k],false);
				}
				if(_.isArray(_arg[k])){
					_arg[k].forEach(function(el){
						vArr.push(el);
					});
				}else{
					vArr.push(_arg[k]);
				}
			}
			return _isKey?[kArr,vArr]:vArr;
		};
		function parseArray(_arg,_generation,_onlyV){

			if(_generation>=2){
				return _arg;
			}
			_generation++;
			
			if(_arg.constructor == Object){
				
				_arg = parseObject(_arg,_onlyV);
			}
			if(_.isArray(_arg)){
				
				_arg = _arg.map(function(el){
					return parseArray(el,_generation,_onlyV);
				});
			}
			return _arg;		
		};
		var parseArg = function(_arg){

			//最新版本的参数 ,适用于2层结构
			//arr1   = [{li:{a:"l",b:"l2"}},{div:"c",span:"d"}];
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
			if(_arg.constructor != Array || _arg.length != 2){
				throw new Error("argument has illegal length or it isn't Array");
				return;
			}

			var arr1 = parseArray(_arg[0],0,true);
			var arr2 = arr1[0][1];
			var arr3 = arr1[1][0];
			var arr4 = arr1[1][1];
			arr1 = arr1[0][0];

			var arr5 = parseArray(_arg[1],0,false);
			
			return [arr1,arr2,arr3,arr4,arr5];
		};
		function displayTask(){
			
		};
		function animateShow(){
			
			var i = elQueue.dequeue();
			
			console.log("isinit",elQueue.getInit(),'i:',i);
			
			if(elQueue.getInit() && (!i && i!=0)){
				elQueue.setInit();
				return;
			}
			
		    var el = ulContainer.at(i);
		    if(el){
		    	domContainer.appendChild(el.get('o'));
		    	el.display();
		    }
			
			setTimeout(animateShow,DISPLAY_INTERVAL);
		}
		function loadShow(_i){

			_i = _i?_i:0;
			
			startTime = startTime?startTime:(+new Date());
			
			var nowTime = +new Date(); 
			
			if(nowTime - startTime > DISPLAY_INTERVAL * _i){
				displayTask(_i);
			}else{
				setTimeout(displayTask,DISPLAY_INTERVAL * _i - (nowTime - startTime),_i);
			}
		}
		function animate(_arg){
			
			domContainer = _.isElement(_arg)?_arg:(_.isString(_arg)?document.getElementById(_arg):undefined);
			
			if(container){
				
				var tags = container.children;
				_.each(tags,function(_el,_i){
					
					var tag = new backbone.SingleItem();
					tag.set({o:_el});
					ulContainer.add(tag);
				});

				childLength = tags.length;
				
				animateShow();
				
				if(container.style.display == "none" || container.style.display == ""){
					container.style.display = "block";
				}
			}else{
				throw new Error("can't get dom");
			}
		}
		//根据解析后的参数，利用backbone
		function load(_arg){
			
			var dataArr = parseArg(_arg);
			
			if(!!dataArr){

				var tagNames       = dataArr[0];
				var tagStyles      = dataArr[1];
				var tagChildren    = dataArr[2];
				var tagchildStyles = dataArr[3];
				var data           = dataArr[4];
				
				//backbone的model 装载进 backbone的model collection中
				for (; childLength < data.length; childLength++) {
					
					var tag = new backbone.SingleItem();
					var t      = tagNames[childLength%tagNames.length];
					var ts     = tagStyles[childLength%tagStyles.length];
					var d      = data[childLength];
					
					tag.setProp(t,ts,tagChildren,tagchildStyles,d);
					ulContainer.add(tag);
					
					elQueue.push(childLength);
				};
			}
		}
		
		function init(_t,_arg,_containerId){
			
			var fn = {"load":load,"animate":animate};

			if(!_arg){
				throw new Error("there is no argument in Function init");
				return;
			}
			if(_.isString(_t)){
				
				elQueue = new Queue();
				
				domContainer = document.getElementById(_containerId);
				if(!domContainer){
					throw new Error('container is not existed.Maybe the id is wrong');
					return;
				}
				ulContainer = new backbone.Items();

				animateShow();
				
				return fn[_t]?fn[_t](_arg):fn[0](_arg);
			}else{
				throw new Error("invalid type of arguments in function named init");
			}
		}
		this.init = init;
};