var oBox = document.getElementById("box");
		
		init();
		
		function init(){
			var oH = document.createElement("h1");
			oH.innerHTML = "飞机大战";
			var oUl = document.createElement("ul");
			oUl.className = "diff";
			var arr = ["简单难度","中等难度","困难难度","老师附体"];
			for(var i =0; i < 4; i++){
				var oLi = document.createElement("li");
				oLi.innerHTML = arr[i];
				if(i == 3){
					oLi.className = "last";
				}
				(function(i){
					oLi.onclick = function(e){
						e = e || window.event;
						var goudan = {
							x : e.clientX,
							y : e.clientY
						}
						gamestart(i,goudan);
					}
				})(i)
				oUl.appendChild(oLi);
			}
			oBox.appendChild(oH);
			oBox.appendChild(oUl);
			oBox.score = 0;
		}
		
		function gamestart(index,offset){
			oBox.innerHTML = "";
			var oS = document.createElement("span");
			oS.innerHTML = oBox.score;
			oS.className = "score";
			oBox.appendChild(oS);
			var oPlane = plane(index,offset);
			enemy(index,oPlane,oS);
		}
		
		function plane(index,offset){
			var x_ = oBox.offsetLeft + 10 + 30;
			var y_ = oBox.offsetTop + 10 + 15;
			var oPlane = new Image();
			oPlane.src = "img/plane.png";
			oPlane.width = 60;
			oPlane.height = 36;
			oPlane.style.left = offset.x - x_ + "px";
			oPlane.style.top = offset.y - y_ + "px";
			oPlane.className = "plane";
			oBox.appendChild(oPlane);
			
			
			var topMin = 0;
			var topMax = oBox.clientHeight - oPlane.clientHeight;
			var leftMin = -oPlane.clientWidth/2 + 11.5;
			var leftMax = oBox.clientWidth - oPlane.clientWidth/2 - 11.5;
			document.onmousemove = function(e) {
				e = e || window.event;
				var left = e.clientX - x_;
				var top = e.clientY - y_;
				
				left = Math.max(leftMin,left);
				left = Math.min(left,leftMax);
				top = Math.max(topMin,top);
				top = Math.min(top,topMax);
				oPlane.style.left = left + "px";
				oPlane.style.top = top + "px";
			}
			
			var speed = 300;
			switch(index){
				case 0:{speed = 200;break;}
				case 1:{speed = 250;break;}
				case 2:{speed = 300;break;}
				case 3:{speed = 350;break;}
			}
			
			oPlane.timer = setInterval(function() {
				var oBiu = new Image();
				oBiu.src = "img/bullet.png";
				oBiu.width = 6;
				oBiu.height = 22;
				oBiu.className = "biu";
				oBiu.style.left = oPlane.offsetLeft + oPlane.width/2 - oBiu.width/2 + "px";
				oBiu.style.top = oPlane.offsetTop - oBiu.height + "px";
				oBox.appendChild(oBiu);
			},speed);
			
			oPlane.BiuTimer = setInterval(function() {
				var aBiu = document.getElementsByClassName("biu");
				for(var i = aBiu.length - 1; i >= 0; i--) {
					 aBiu[i].style.top = aBiu[i].offsetTop - 2 +"px";
					if(aBiu[i].offsetTop <= -11){
						oBox.removeChild(aBiu[i]);
					}
				}
			},20);
			
			return oPlane;
		}
		
		function enemy(index,oplane,Os){
			var spd = 1000;
			switch(index){
				case 0:{spd = 1000;break;}
				case 1:{spd = 400;break;}
				case 2:{spd = 300;break;}
				case 3:{spd = 200;break;}
			}
			
			var timer = setInterval(function() {
				var oEnemy = new Image();
				oEnemy.src = "img/enemy.png";
				oEnemy.width = 23;
				oEnemy.height = 30;
				oEnemy.speed = Math.random()*2 + 1;
				oEnemy.className = "enemy";
				oEnemy.style.top = -oEnemy.height + "px";
				oEnemy.style.left = Math.random() * (oBox.clientWidth - oEnemy.width) + "px";
				oBox.appendChild(oEnemy);
			},spd);
			
			var Timer = setInterval(function(){
				var aEnemy = document.getElementsByClassName("enemy");
				var aBiu = document.getElementsByClassName("biu");
				for(var i = aEnemy.length-1; i >= 0 ; i--){
					aEnemy[i].style.top = aEnemy[i].offsetTop + aEnemy[i].speed +"px";
					for(var j = aBiu.length-1; j >= 0; j--){
						if(pz(aEnemy[i],aBiu[j])){
							boom(aEnemy[i],true);
							oBox.score += 10;
							Os.innerHTML = oBox.score;
							oBox.removeChild(aEnemy[i]);
							oBox.removeChild(aBiu[j]);
						}
						
						if(pz(oplane,aEnemy[i])){
							boom(oplane,false);
							oBox.removeChild(aEnemy[i]);
							oBox.removeChild(oplane);
							clearInterval(timer);
							clearInterval(oplane.timer);
							
							setTimeout(function() {
								gameover(oplane,Timer);
							},100);
						}
						
					}
					if(aEnemy[i].offsetTop >= oBox.clientHeight) {
						oBox.removeChild(aEnemy[i]);
					}
				};
			},10);
		}
		
		function gameover(obj,timer){
			clearInterval(obj.BiuTimer);
			clearInterval(timer);
			oBox.innerHTML = "";
			var oDiv = document.createElement("div");
			var oH2 = document.createElement("h2");
			var oP = document.createElement("p");
			var oBt = document.createElement("div");
			oDiv.className = "gameover";
			oBt.className = "btn";
			oH2.innerHTML = "Game Over";
			oP.innerHTML = "您的得分为：" + oBox.score;
			oBt.innerHTML = "重新开始";
			oDiv.appendChild(oH2);
			oDiv.appendChild(oP);
			oDiv.appendChild(oBt);
			oBox.appendChild(oDiv);
			oBt.onclick = function() {
				oBox.innerHTML = "";
				init();
			}
		}
		
		function boom(obj,bool){
			var oBoom = new Image();
			oBoom.src = bool ? "img/boom.png" : "img/boom2.png";
			oBoom.width = bool ? 23 : 60;
			oBoom.height = bool ? 30 : 36;
			oBoom.className = "boom";
			oBoom.style.left = obj.offsetLeft + "px";
			oBoom.style.top = obj.offsetTop + "px";
			oBox.appendChild(oBoom);
			
			var ttt = setTimeout(function(){
				oBox.removeChild(oBoom);
				clearInterval(ttt);
			},160);
		}
		
		function pz(objA,objB) {
			var tA = objA.offsetTop;
			var bA = objA.clientHeight + tA;
			var lA = objA.offsetLeft;
			var rA = lA + objA.clientWidth;
			
			var tB = objB.offsetTop;
			var bB = objB.clientHeight + tB;
			var lB = objB.offsetLeft;
			var rB = objB.clientWidth + lB;
			
			if(rB < lA || tA > bB || rA < lB || bA < tB){
				return false;
			} else {
				return true;
			}
		}