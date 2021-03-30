
//setData([]);

function setData(value){
    chrome.storage.local.set({bmrk: value}, function() {
        console.log('Value is set to ' + value);
    });
}

function getData(callback){
    chrome.storage.local.get(['bmrk'], function(result) {
        callback(JSON.stringify(result))
  });
}
 