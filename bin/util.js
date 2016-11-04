var fs = require('fs');
var path = require('path');

module.exports = {

  execCascadeWithCallback : function(functions, callback){
    var result = {isValid:false, msg:""};
    var length = functions.length;
    var index = 0;

    var run = function (){
      functions[index](function (res){
        if(res.isValid){
          index++;
          if(index < length){
            run();
          } else {
            result.isValid=true;
            callback(result);
          }
        } else {
          callback(result);
        }
      });
    }

    if(index < length){
      run();
    }

  },

  createIfNotExistDirectory: function (path) {
    var path;
    if (this.directoryExists(path)) {
      return true;
    }
    fs.mkdirSync(path);
  },

  directoryExists: function (path) {
    try {
      return fs.statSync(path).isDirectory();
    }
    catch (err) {
      return false;
    }
  },

  fileExists: function (path){
    if (fs.existsSync(path)) {
      return true;
    } else {
      return false;
    }
  },

  deleteFiles: function(files, callback){
    var self = this;
    var result = {isValid:false, msg:""};
    var i = files.length;
    var next = function(res){
      i--;
      if(!res.isValid){
        callback(result);
        if(commands.log){
          console.log(res);
        }
      } else if (i <= 0) {
        result.isValid=true;
        callback(result);
      }
    }
    files.forEach(function(filepath){
      if(fs.lstatSync(filepath).isDirectory()){
        self.deleteRecursive(filepath, function(res){
          next(res);
        });
      } else {
        fs.unlink(filepath, function(err) {
          next({isValid:!err});
        });
      }
    });
  },
  deleteRecursive : function (filePath, callback){
    var result = {isValid:false, msg:""};
    try {

      var del = function (f){
        fs.readdirSync(f).forEach(function(file,index){
          var curPath = f + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            del(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(f);
      }
      del(filePath);

      result.isValid=true;
      callback(result);
    } catch (e) {
      callback(result);
      if(commands.log){
        console.log(e);
      }
    } finally {

    }

  },

  getDirectories : function(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }

}
