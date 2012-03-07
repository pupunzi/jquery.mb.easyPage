/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2011. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * Name:jquery.mb.easyPage
 * Version: 0.1
 */


(function($){

  $.mbEasyPages={
    name:"mb.easyPage",
    author:"Matteo Bicocchi",
    version:"0.1",
    defaults:{
      references:"a[rel='easyPage']", //or "a" for all links -- links must be samedomain
      baseURL:"",
      pages:[],
      mainContext:"body",
      targetContext:".wrapper",
      effect:"Hscroll", //or Vscroll, fade, slide
      showHistoryControls:false,
      historyControls:[$("<div/>").addClass("mbNext").html("NEXT") , $("<div/>").addClass("mbPrev").html("PREV")]
    },
    defaultEffects:[
      {name:"Hscroll", behavior:function(op,np){
        op.addClass("moving").animate({left:windowDim().w, opacity:0},3000,"easeOutExpo",function(){});
        np.css({left:-windowDim().w,opacity:0}).animate({left:0, opacity:1},1000,"easeOutExpo",function(){});
      }},
      {name:"Vscroll", behavior:function(op,np){
        op.addClass("moving").animate({top:windowDim().h, opacity:0},3000,"easeOutExpo",function(){});
        np.css({top:-windowDim().h,opacity:0}).animate({top:0, opacity:1},1000,"easeOutExpo",function(){});
      }},
      {name:"zigZag", behavior:function(op,np){
        op.addClass("moving").animate({left:windowDim().w, opacity:0},3000,"easeOutExpo",function(){});
        np.css({top:-windowDim().h,opacity:0}).animate({top:0, opacity:1},1000,"easeOutExpo",function(){});
      }},
      {name:"fade", behavior:function(op,np){
        op.addClass("moving").animate({left:0, opacity:0},1000,"easeOutExpo",function(){});
        np.css({opacity:0}).animate({top:0, opacity:1},1000,"easeOutExpo",function(){});
      }}
    ],
    domain: window.location.protocol+"//"+document.domain,
    history:[],

    init:function(options){
      $.extend($.mbEasyPages.defaults, options);
      var opt=$.mbEasyPages.defaults;
      $.mbEasyPages.historyCounter=0;
      var globalWrapper=$("<div/>").attr("id","globalWrapper").css({position:"absolute", top:0, left:0, overflow:"hidden", width:"100%", height:"100%"});
      var wrapper= $("<div/>").addClass("mbPagesWrapper").css({position:"absolute", width:"100%", height:"100%", overflow:"auto"});
      globalWrapper.append(wrapper);
      $(opt.mainContext).wrapInner(globalWrapper);
      if(opt.showHistoryControls){
        $(opt.mainContext).append(opt.historyControls[0]).append(opt.historyControls[1]);
        opt.historyControls[0].bind("click",function(){$.mbEasyPages.nextPage()});
        opt.historyControls[1].bind("click",function(){$.mbEasyPages.prevPage()});
      }
      $(opt.mainContext).initLinks();
      var baseURL=$("<base>").attr({href:opt.baseURL, id:"mbBaseURL"});
      $("head").append(baseURL);

      $.mbEasyPages.manageHistoryBtns($.mbEasyPages.historyCounter);
      $.history.init(pageLoad);
    },
    addEffect:function(eff){
      $.mbEasyPages.defaultEffects.push(eff);
    },
    nextPage:function(){
      $.mbEasyPages.historyCounter++;
      var c=$.mbEasyPages.historyCounter;
      if($.mbEasyPages.history[c]){
        $.history.load($.mbEasyPages.history[c]);
      }
    },
    prevPage:function(){
      $.mbEasyPages.historyCounter--;
      var c=$.mbEasyPages.historyCounter;
      if($.mbEasyPages.history[c]){
        $.history.load($.mbEasyPages.history[c]);
      }
    },
    initLinks:function(opt){
      var pageLinks= $(this).find($.mbEasyPages.defaults.references);
      pageLinks.each(function(){
        var pageURL = $(this).attr("href");
        if (!pageURL.beginsWith("http") || pageURL.beginsWith($.mbEasyPages.domain)){
          $(this).bind("click",function(){
            pageURL = pageURL.replace(/^.*#/, '');
            $.mbEasyPages.history.push(pageURL);
            $.mbEasyPages.historyCounter= $.mbEasyPages.history.length-1;
            $.history.load(pageURL);
            return false;
          });
        }
      })
    },    
    manageHistoryBtns:function(c){
      $.mbEasyPages.defaults.historyControls[0].show();
      $.mbEasyPages.defaults.historyControls[1].show();

      if(!$.mbEasyPages.history[c+1])
        $.mbEasyPages.defaults.historyControls[0].hide();

      if(!$.mbEasyPages.history[c-1])
        $.mbEasyPages.defaults.historyControls[1].hide();
    },
    loadPage:function(url){
      if($.mbEasyPages.defaults.showHistoryControls) $.mbEasyPages.manageHistoryBtns($.mbEasyPages.historyCounter);
      var op=$(".mbPagesWrapper").eq(1);
      op.remove();
      var wrapper= $("<div/>").addClass("mbPagesWrapper").css({position:"absolute", width:"100%", height:"100%", overflow:"auto"});
      $("#globalWrapper").prepend(wrapper);
      var u= url + ($.mbEasyPages.defaults.targetContext? " "+$.mbEasyPages.defaults.targetContext:"");
      wrapper.load(u,function(){
        wrapper.initLinks();
        var newPage=$(".mbPagesWrapper").eq(0);
        var oldPage=$(".mbPagesWrapper").eq(1);
        $.mbEasyPages.makeTransition(oldPage,newPage);
      });
    },
    makeTransition:function(op,np){
      var name= $.mbEasyPages.defaults.effect;
      $.each($.mbEasyPages.defaultEffects,function(){
        if(this.name == name)
          this.behavior(op,np);
      });
    }
  };

  $.fn.initLinks=$.mbEasyPages.initLinks;

})(jQuery);

function pageLoad(hash) {
  if(hash) {
    $.mbEasyPages.loadPage(hash,true)
  }else{
    self.location.href= self.location.href.split("#")[0];
  }
}

function windowDim() {
  var context=$.mbEasyPages.defaults.mainContext;
  if($.mbEasyPages.defaults.mainContext=="body") context=window;
  var ww= $(context).width();
  var wh= $(context).height();
  var dim={};
  dim.w = ww;
  dim.h = wh;
  return dim;
}

// string tools

String.prototype.beginsWith = function(t, i) {
  if (!i) {
    return (t == this.substring(0, t.length));
  } else {
    return (t.toLowerCase() == this.substring(0, t.length).toLowerCase());
  }
};

String.prototype.endsWith = function(t, i) {
  if (!i) {
    return (t == this.substring(this.length - t.length));
  } else {
    return (t.toLowerCase() == this.substring(this.length - t.length).toLowerCase()); }
};

String.prototype.asId = function () {
  return this.replace(/[^a-zA-Z0-9_]+/g, '');
};