/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
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
      references:"a[rel='easyPage']", // or "a" for all links -- links must be samedomain
      effect:"Hscroll", //or Vscroll, fade, slide
      nextBtn:$("<div/>").addClass("mbNext").html("NEXT"),
      prevBtn:$("<div/>").addClass("mbPrev").html("PREV")
    },
    domain: document.domain,
    pages:[],
    history:[],

    init:function(options){
      $.extend($.mbEasyPages.defaults, options);
      var opt=$.mbEasyPages.defaults;
      $.mbEasyPages.historyCounter=0;
      var globalWrapper=$("<div/>").attr("id","globalWrapper").css({position:"absolute", top:0, left:0, overflow:"hidden", width:"100%", height:"100%"});
      var wrapper= $("<div/>").addClass("mbPagesWrapper").css({position:"absolute", top:0, left:0, width:"100%", height:"100%"});
      globalWrapper.append(wrapper);
      $("body").wrapInner(globalWrapper);
      $("body").append(opt.nextBtn).append(opt.prevBtn);
      opt.nextBtn.bind("click",function(){$.mbEasyPages.nextPage()});
      opt.prevBtn.bind("click",function(){$.mbEasyPages.prevPage()});
      $("body").initLinks();
    },

    nextPage:function(){
      $.mbEasyPages.historyCounter++;
      var c=$.mbEasyPages.historyCounter;
      if($.mbEasyPages.history[c]){
        //        $.mbEasyPages.loadPage($.mbEasyPages.history[c], false);
        $.history.load($.mbEasyPages.history[c]);
      }
    },

    prevPage:function(){
      $.mbEasyPages.historyCounter--;
      var c=$.mbEasyPages.historyCounter;
      if($.mbEasyPages.history[c]){
        //        $.mbEasyPages.loadPage($.mbEasyPages.history[c], false);
        $.history.load($.mbEasyPages.history[c]);
      }
    },

    manageHistoryBtns:function(c){
      $.mbEasyPages.defaults.nextBtn.show();
      $.mbEasyPages.defaults.prevBtn.show();

      if(!$.mbEasyPages.history[c+1])
        $.mbEasyPages.defaults.nextBtn.hide();

      if(!$.mbEasyPages.history[c-1])
        $.mbEasyPages.defaults.prevBtn.hide();
    },

    loadPage:function(url,store){
      $.mbEasyPages.manageHistoryBtns($.mbEasyPages.historyCounter);
      var wrapper= $("<div/>").addClass("mbPagesWrapper").css({position:"absolute", top:0, left:0, width:"100%", height:"100%"});
      $("#globalWrapper").prepend(wrapper);
      wrapper.load(url,function(){
        wrapper.initLinks();
        var oldPage=$(".mbPagesWrapper").eq(1);
        oldPage.addClass("moving").animate({left:1400, opacity:0},1000,"easeOutExpo",function(){oldPage.remove();});
      });
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
    }
  };

  $.fn.initLinks=$.mbEasyPages.initLinks;

})(jQuery);

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


function pageLoad(hash) {
  if(hash) {
    $.mbEasyPages.loadPage(hash,true)
  }else{
    self.location.href= self.location.href.split("#")[0];
  }
}

$(function(){
  $.mbEasyPages.init();
  $.history.init(pageLoad);
  $.mbEasyPages.manageHistoryBtns($.mbEasyPages.historyCounter);
});