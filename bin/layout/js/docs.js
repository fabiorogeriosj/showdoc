var showItem = function(item){
  clearClassItem();
  var group = item.parentElement.parentElement.querySelectorAll("a")[0];
  group = group.getAttribute("href").replace("#","");
  item = item.innerHTML.replace(/<[^>]*>/g, "")
  var itens = document.querySelectorAll(".options.active .item-menu");
  [].forEach.call(itens, function(el) {
      var attr = el.getAttribute("class");
      usingClass = attr.indexOf("active") >= 0;
      if(el.innerHTML.replace(/<[^>]*>/g, "") == item && !usingClass){
        el.setAttribute("class", attr + " active");
      }
  });
  var content = document.querySelectorAll('.doc-content [option="'+group+'"][item="'+item+'"]');
  if(content){
      contentPosition = content[0].offsetTop;
      window.scrollTo(0,contentPosition - 90);
  }
}

var clearClass = function(){
  var elems = document.querySelectorAll(".options");
  [].forEach.call(elems, function(el) {
      el.className = el.className.replace(/\bactive\b/, "");
  });
}

var clearClassItem = function(){
  var itens = document.querySelectorAll(".options .item-menu");
  [].forEach.call(itens, function(el) {
      el.setAttribute("class", el.getAttribute("class").replace("active",""));
  });
}

var clearClassTop = function(){
  var itens = document.querySelectorAll(".menu-top a");
  [].forEach.call(itens, function(el) {
      if(el.getAttribute("class")){
          el.setAttribute("class", el.getAttribute("class").replace("selected",""));
      }
  });
}

var activeOptions = function(){
  clearClass();
  var hash = location.hash.replace("#","");
  if(hash){
      var hashGroup = hash.split("|")[0];
      var e = document.getElementById("options-"+hashGroup);
      var attr = e.getAttribute("class");
      attr += " active";
      e.setAttribute("class", attr);
      clearClassItem();
      clearClassTop();
      document.querySelector(".menu-top [href='#"+hashGroup+"']").setAttribute("class", "selected");
      var divItem=document.querySelector(".itens a[href='#"+hash+"'] div");
      if(divItem){
          divItem.setAttribute("class", divItem.getAttribute("class") + " active");
      }
  }
}
var basePreview = '<link rel="stylesheet" href="/icons/materialdesign.css"><link rel="stylesheet" href="/lib/mockapp-colors.css"><link rel="stylesheet" href="/lib/mockapp.css">';
var bindPreview = function(){
  var elements = document.querySelectorAll(".preview");
  [].forEach.call(elements, function(el) {
    var code = el.querySelectorAll("textarea");
    var codeHTML = code[0].value;
    var iframePreview = el.querySelectorAll("iframe");
    iframePreview = iframePreview[0];
    iframePreview.contentDocument.body.innerHTML = basePreview + codeHTML;
    el.querySelectorAll("button")[0].addEventListener("click", function(){
      var newCodeHTML = this.parentElement.parentElement.querySelectorAll("textarea")[0].value
      iframePreview.contentDocument.body.innerHTML = basePreview + newCodeHTML;
    }, false);
  });
}

window.onload = function(){
  bindPreview();
  activeOptions();
  if(location.hash === ""){
    location.hash = document.querySelector(".menu-top a").getAttribute("href");
  }

  window.addEventListener("hashchange", activeOptions, false);

  var bindCodes = document.querySelectorAll(".code-bind");
  [].forEach.call(bindCodes, function(el) {
    var mycm = CodeMirror.fromTextArea(el, {
      readOnly: true
    });
    mycm.on('change',function(cMirror){
      el.value = cMirror.getValue();
      var asizeCode = el.parentElement.offsetHeight;
      el.parentElement.parentElement.querySelectorAll(".box-mobile")[0].style.height=asizeCode+"px";
    });
  });

  previewMobile();
}

function previewMobile(){
  var boxs = document.querySelectorAll(".box-code");
  [].forEach.call(boxs, function(el) {
    if(el.querySelector("h2").innerText == "HTML"){
      var elNew = document.createElement('div');
      elNew.setAttribute("class", "box-mobile");
      elNew.innerHTML = '<div class="marvel-device s5 white"><div class="top-bar"></div><div class="sleep"></div><div class="camera"></div><div class="sensor"></div><div class="speaker"></div><div class="screen"><iframe width="100%" height="100%;"></iframe></div><div class="home"></div></div>';
      insertAfter(elNew, el.querySelector("h2"));
      el.setAttribute("class", el.getAttribute("class") + " margin-top-mobile")
    }
  });
}
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}