function init() {
  initialized=true;
  ss=SpreadsheetApp.getActive();
  var sheets=ss.getSheets();
  sheets.forEach(s=>data[s.getName()]=s.getDataRange().getValues());
  data["roster"].shift();
  data["roster"].forEach(r=>roster[r[0]]={name: r[0], email:r[1], id: null});
}


const scriptRunPromise = ()=>
{
  const gs = {};
  
  // google.script.run contains doSomething() methods at runtime.
  // Object.keys(goog.sscript.run) returns array of method names.
  const keys = Object.keys(google.script.run);
  
  // for each key, i.e. method name...
  for (let i=0; i < keys.length; i++) {
    // assign the function to gs.doSomething() which returns...
    gs[keys[i]] = (function(key) {
      // a function which accepts arbitrary args and returns...
      return function(...args) {
        // a promise that executes ...
        return new Promise(function(resolve, reject) {
          google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)[key]
            .apply(google.script.run, args);
        });
      };
    })(keys[i]);
  }
  return gs;
  // gs.doSomething() returns a promise that will execulte 
  // google.script.run.withSuccessHandler(...).withFailureHandler(...).doSomething()
}
funcs.push(scriptRunPromise);
