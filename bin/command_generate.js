var fs = require('fs-extra');
var colors = require('colors');
var glob = require("glob");
var markdown = require( "markdown" ).markdown;
var util = require("./util");

module.exports = {
    run : function (){
      var self = this;
      console.log("Generating...".green);
      //markdown.toHTML();
      var path = ".";
      var dest = "./showdoc";
      if(commands._[1] && commands._[1] != "."){
        path = commands._[1];
      }
      if(commands._[2] && commands._[2] != "."){
        dest = commands._[2];
      }

      glob(path + "/**/*.md", {}, function (er, files) {
        if(er){
          console.log("Sorry! Unable to generate the documentation, check the error below:".red);
          console.log("");
          console.log(er);
        } else {
          util.createIfNotExistDirectory(dest);
          var docHtml = []
          for(i in files){
            var contents = fs.readFileSync(files[i]).toString();
            var index = self.getIndex(contents);
            if(index >= 0){
                var idDoc = self.getId(contents);
                var title = self.getTitle(contents);
                var group = self.getGroup(contents);
                docHtml[index] = {
                  id: idDoc,
                  title: title,
                  content: markdown.toHTML(contents),
                  group: group
                }
            }
          }
          fs.copySync(__dirname+"/layout", __dirname+"/layout_bind");
          var layout = fs.readFileSync(__dirname+"/layout_bind/index.html").toString();
          layout = self.createMenuTop(docHtml, layout);
          layout = self.createMenuLeft(docHtml, layout);
          layout = self.createContent(docHtml, layout);

          layout = self.parseCodeToComponent(layout);

          fs.writeFileSync(__dirname+"/layout_bind/index.html", layout);
          var msgCool = "See your docs in "+dest;
          console.log("Success!".green);
          console.log(msgCool.yellow);
        }
      })

    },
    getIndex: function(contents){
      var i = contents.split("[showdoc_index]:").length > 1 && Number(contents.split("[showdoc_index]:")[1].split("\n")[0]) >= 0 ? Number(contents.split("[showdoc_index]:")[1].split("\n")[0]) : false;
      if(i && i >= 0){
        return i;
      } else {
        return -1;
      }
    },
    getId: function(contents){
      var id = contents.split("[showdoc_id]:").length > 1 && contents.split("[showdoc_id]:")[1].split("\n")[0] ? contents.split("[showdoc_id]:")[1].split("\n")[0] : this.getTitle(contents).replace(/[^A-Z0-9]/ig, "");
      if(id && id != ""){
        return id.replace(/(?:\r\n|\r|\n)/g, '').trim();
      } else {
        return new Date().getTime();
      }
    },
    getTitle: function(contents){
      var title = contents.split("# ").length > 1 ? contents.split("# ")[1].split("\n")[0] : false;
      if(!title){
        title = contents.split("## ").length > 1 ? contents.split("## ")[1].split("\n")[0] : "NO_TITLE_DEFINED";
      }
      return title.replace(/[\n|\n\r]/, "").trim();
    },
    getGroup: function(contents){
      var g = contents.split("[showdoc_group]:").length > 1 && contents.split("[showdoc_group]:")[1].split("\n")[0] ? contents.split("[showdoc_group]:")[1].split("\n")[0] : false;
      if(g && g != ""){
        return g.trim().replace(/(?:\r\n|\r|\n)/g, '');
      } else {
        return false;
      }
    },
    createMenuTop: function(docHtml, layout){
      var template = layout.split("<!--SHOWDOC:init-top-->")[1].split("<!--SHOWDOC:end-top-->")[0];
      var bind = "";
      for(i in docHtml){
        if(!docHtml[i].group && !docHtml[i].bindMenuTop){
          var newT = template.replace(/SHOWDOC_GROUP_ID/gi, docHtml[i].id);
          newT = newT.replace(/SHOWDOC_GROUP_TITLE/gi, docHtml[i].title.trim());
          bind += newT + "\n";
          docHtml[i].bindMenuTop=true;
        }
      }
      return layout.replace(template, bind);
    },
    createMenuLeft: function(docHtml, layout){
      var template = layout.split("<!--SHOWDOC:init-group-menu-->")[1].split("<!--SHOWDOC:end-group-menu-->")[0];
      var bind = "";
      for(i in docHtml){
        if(!docHtml[i].group && !docHtml[i].bindMenuLeft){
          var newT = template.replace(/SHOWDOC_GROUP_ID/gi, docHtml[i].id);
          newT = newT.replace(/SHOWDOC_GROUP_TITLE/gi, docHtml[i].title.trim());
          var templateItem = template.split("<!--SHOWDOC:init-group-menu-item-->")[1].split("<!--SHOWDOC:end-group-menu-item-->")[0];
          var bindItem = "";
          for(x in docHtml){
            if(!docHtml[x].bindItem && docHtml[x].group && docHtml[x].group === docHtml[i].id){
              var newTI = templateItem.replace(/SHOWDOC_ITEM_TITLE/gi, docHtml[x].title);
              newTI = newTI.replace(/SHOWDOC_GROUP_ITEM_ID/gi, (docHtml[i].id+"|"+docHtml[x].id) );
              bindItem += newTI + "\n";
              docHtml[x].bindItem=true;
            }
          }
          newT = newT.replace(templateItem, bindItem);
          bind += newT + "\n";
          docHtml[i].bindMenuLeft=true;
        }
      }

      return layout.replace(template, bind);
    },
    createContent: function(docHtml, layout){
      var template = layout.split("<!--SHOWDOC:init-group-content-->")[1].split("<!--SHOWDOC:end-group-content-->")[0];
      var bind = "";
      for(i in docHtml){
        if(!docHtml[i].bindContent){
          var newT = template.replace(/SHOWDOC_GROUP_ID/gi, docHtml[i].group);
          newT = newT.replace(/SHOWDOC_ITEM_TITLE/gi, docHtml[i].title.trim());
          newT = newT.replace(/SHOWDOC_GROUP_ITEM_ID/gi, docHtml[i].group ? docHtml[i].group + "|" + docHtml[i].id : docHtml[i].id);
          newT = newT.replace("SHOWDOC_ITEM_CONTENT", docHtml[i].content);
          bind += newT + "\n";
          docHtml[i].bindContent=true;
        }
      }
      return layout.replace(template, bind);
    },
    parseCodeToComponent: function(layout){
      layout = layout.replace(/<code> html/gi, '<div class="box-code"><h2>HTML</h2><textarea class="code-bind">');
      layout = layout.replace(/<code> javascript/gi, '<div class="box-code"><h2>JavaScript</h2><textarea class="code-bind">');
      layout = layout.replace(/<code> css/gi, '<div class="box-code"><h2>CSS</h2><textarea class="code-bind">');
      layout = layout.replace(/<code>/gi, '<div class="box-code"><h2>Terminal</h2><textarea class="code-bind">');
      layout = layout.replace(new RegExp("</code>", 'g'), "</textarea></div>");
      layout = layout.replace(new RegExp("\n</textarea></div>", 'g'), "</textarea></div>");
      return layout;
    }
}
