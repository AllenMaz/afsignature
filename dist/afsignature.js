/**
 * Created by Allen on 2017/11/24.
 */
;(function () {
  this.afsignature = function () {
        this.options = {
            renderdom:null,     //渲染节点
            width:'auto',       //画板宽度
            height:'auto',      //画板高度
            color:'#000000',    //画笔颜色：默认黑色
            linewidth:3,         //画笔线条宽度
            bgcolor:'#ffffff',  //画板背景色：默认白色
            alpha:0,              //画板背景透明度 0-1，为0时全部透明
            parampanel:{
                width:100,          //宽度100
                position:'right' //位置靠右:left right up dowm
            },     //参数面板
            saveevent:null       //保存图片事件
        }

        this.setOptions = function (sourceoptions,destoptions) {
            for(var p in sourceoptions){
                for(var dp in destoptions){
                    if(p == dp && sourceoptions[p])
                    {
                        if(typeof(sourceoptions[p]) == "object" && p!="renderdom")
                            this.setOptions(sourceoptions[p],destoptions[dp]);
                        else
                            destoptions[dp] = sourceoptions[p];
                        break;
                    }
                }
            }
        }

      function getTop(e){
          var offset=e.offsetTop;
          if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
          return offset;
      }
      function getLeft(e){
          var offset=e.offsetLeft;
          if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
          return offset;
      }
      this.getXY = function (e)
      {
          return {
              /*x : e.touches[0].clientX - e.target.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft),*/
              x : e.touches[0].clientX - getLeft(e.target),
              y : e.touches[0].clientY - getTop(e.target)
          }
      }
  }

  this.afsignature.prototype.init = function (config) {
      var afsignatureobj = this;
      this.setOptions(config,this.options);
      var renderDom = this.options.renderdom;
      if(renderDom){
          try{
              var renderdomWdith = renderDom.clientWidth;
              var renderdomHeight = renderDom.clientHeight;

              var canvanspanel = document.createElement("div");
              canvanspanel.setAttribute("style","position:relative;width:"+renderdomWdith+";height:"+renderdomHeight+";overflow:hidden")
              //渲染画布
              var canvas = document.createElement("canvas");
              var canvasWidth = this.options.width=='auto'?renderdomWdith:this.options.width;
              var canvasHeight = this.options.height=='auto'?renderdomHeight:this.options.height;
              canvas.setAttribute("width",canvasWidth);
              canvas.setAttribute("height",canvasHeight);

              var ctx = canvas.getContext("2d");
              ctx.fillStyle = this.options.bgcolor;  //画布颜色
              ctx.globalAlpha = this.options.alpha; //画布透明度
              ctx.fillRect(0,0,canvasWidth,canvasHeight); //画出矩形画布

              canvas.addEventListener("touchstart",function (e) {
                  var position = afsignatureobj.getXY(e);
                  ctx.globalAlpha = 1; //画笔颜色透明度
                  ctx.strokeStyle = afsignatureobj.options.color; //画笔颜色
                  ctx.lineWidth = afsignatureobj.options.linewidth;
                  ctx.beginPath();
                  ctx.moveTo(position.x,position.y);
              });
              canvas.addEventListener("touchmove",function (e) {
                  e.preventDefault();
                  var position = afsignatureobj.getXY(e);
                  ctx.lineTo(position.x,position.y);
                  ctx.stroke();
              });
              canvas.addEventListener("touchend",function (e) {
                  ctx.closePath();
              });

              //参数设置面板
              var parampanelWidth = afsignatureobj.options.parampanel.width;
              var parampanelPosition = afsignatureobj.options.parampanel.position;
              var paramdpanel = document.createElement("div");
              var rightstyle = "position:absolute;";
              if(parampanelPosition =="up")
                 rightstyle += "top:0;left:0;width:"+renderdomWdith+"px;height:"+parampanelWidth+"px;";
              else if(parampanelPosition =="down")
                  rightstyle += "bottom:0;left:0;width:"+renderdomWdith+"px;";
              else if(parampanelPosition =="left")
                  rightstyle += "top:0;left:0;width:"+parampanelWidth+"px;height:"+renderdomHeight+"px;";
              else if(parampanelPosition =="right")
                  rightstyle += "top:0;right:0;height:"+renderdomHeight+"px;";
              paramdpanel.setAttribute("style",rightstyle);

              var btnstyle = "float:left;padding:5px 10px;height: 60px;line-height: 60px;color: white;font-size: 30px;text-align: center;background: rgba(0, 0, 0, 0.42);";
              var clearBtn = document.createElement("div");
              clearBtn.setAttribute("style",btnstyle);
              clearBtn.innerHTML="清除";
              clearBtn.addEventListener("click",function () {
                  ctx.clearRect(0,0,canvasWidth,canvasHeight);
                  ctx.fillStyle = afsignatureobj.options.bgcolor;  //画布颜色
                  ctx.globalAlpha = afsignatureobj.options.alpha; //画布透明度
                  ctx.fillRect(0,0,canvasWidth,canvasHeight); //画出矩形画布
              })

              var saveBtn = document.createElement("div");
              saveBtn.setAttribute("style",btnstyle);
              saveBtn.innerHTML="保存";
              saveBtn.addEventListener("click",function () {
                  var dataurl = canvas.toDataURL('image/png');
                  if(afsignatureobj.options.saveevent)
                      afsignatureobj.options.saveevent(dataurl);
              })

              paramdpanel.appendChild(clearBtn);
              paramdpanel.appendChild(saveBtn);

              canvanspanel.appendChild(canvas);
              canvanspanel.appendChild(paramdpanel);
              renderDom.appendChild(canvanspanel);

          }catch(ex){
              alert(ex.message);
          }
      }
  }

}());
