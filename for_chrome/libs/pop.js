

function contextFunction(event){
   // event.preventDefault();
   // var ctxMenu = document.getElementById("context-menu");
   // ctxMenu.style.position = "fixed";
   // ctxMenu.style.display = "block";
   // ctxMenu.style.left = (event.pageX )+"px";
   // ctxMenu.style.top = (event.pageY )+"px";
}


//
//document.addEventListener("click",function(event){
//    var ctxMenu = document.getElementById("context-menu");
//    ctxMenu.style.display = "";
//    ctxMenu.style.left = "";
//    ctxMenu.style.top = "";
//},false);
//







function addBookMark(title ,description ,img, url,tags,catagory){
    var link = document.createElement("a");
    link.className= "navigator";
    link.href = url;


    var bookmark_container = document.createElement("div"); 
    bookmark_container.className="bookmark-item";
    bookmark_container.setAttribute("tags",tags.join(", "));
    bookmark_container.setAttribute("catagory",catagory);

 
    var attributes_container = document.createElement("div"); 
    attributes_container.className = "attributes-div";

    var catagory_tag= document.createElement("span");
    catagory_tag.className = "badge badge-dark catagory";
    catagory_tag.innerHTML = catagory;


    var tags_container = document.createElement("div");
    tags_container.className = "tags-div";

    tags.forEach((tag_text)=>{
        var tag_obbject = document.createElement("span");
        tag_obbject.className = "badge badge-light tag";
        tag_obbject.innerHTML = tag_text;
        tags_container.appendChild(tag_obbject);
    });

    attributes_container.appendChild(catagory_tag);
    attributes_container.appendChild(tags_container);

    var bookmark_icon = document.createElement("img"); 
    bookmark_icon.className = "bookmark-icon";
    bookmark_icon.src = img;
   

    var bookmark_content = document.createElement("div"); 
    bookmark_content.className = "bookmark-content";

    var bookmark_title = document.createElement("h5"); 
    bookmark_title.className = "bookmark-title";
    bookmark_title.innerHTML = title;

    var bookmark_description = document.createElement("h5"); 
    bookmark_description.className = "bookmark-description";
    bookmark_description.innerHTML = description;

   
    bookmark_content.appendChild(bookmark_title);
    bookmark_content.appendChild(bookmark_description);
    bookmark_container.appendChild(bookmark_icon);
    bookmark_container.appendChild(bookmark_content);
    bookmark_container.appendChild(attributes_container);


    link.appendChild(bookmark_container);

    link.addEventListener("click", function(){
            var newURL = url;
            chrome.tabs.create({ url: newURL });
    });
    link.addEventListener("contextmenu",contextFunction,false);

    var list_container = document.getElementById("bookmark-list");
    list_container.appendChild(link);
}


function loadBookmarks(){
    var list_container = document.getElementById("bookmark-list");
    try{
            //Clears Bookmark-Items
        while (list_container.firstChild) {
            list_container.removeChild(list_container.firstChild);
        }
    }catch{}
    
    //Reads saved bookmarks
    
    getData((data)=>{
        var json = JSON.parse(data);
        //Loads Bookmarks as list
        json.bmrk.forEach((mark)=>{
            addBookMark(mark.title,mark.description,mark.img,mark.url,mark.tags,mark.catagory);
        });
    });
    
    
   
        
        
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

document.addEventListener("DOMContentLoaded", function(event){
    var searchBox = document.getElementById("search-input");
    searchBox.addEventListener("input",function(e){
        var search_term = e.target.value;

        loadBookmarks();
        if(search_term == ""){
            return
        }
        var x = document.getElementsByClassName('navigator');
        wait(50).then(()=>{
            Array.prototype.forEach.call(x,(link)=>{

                var bookmark_item = link.firstChild;

                var contents = bookmark_item.getElementsByTagName("h5");
                var str_cont = "";
                Array.prototype.forEach.call(contents,(content)=>{
                    str_cont+=", "+content.innerHTML;
                });
               
                var catagory = bookmark_item.getAttribute("catagory");
                var joined_tags = bookmark_item.getAttribute("tags");
                var all_attributes = joined_tags + ", "+catagory+str_cont;

                if(!all_attributes.toLowerCase().includes(search_term.toLowerCase())){
                    link.remove();
                }

            });
        });
        
      


    });
});






function setData(value){
    chrome.storage.local.set({bmrk: value}, function() {
        console.log('Value is set to ' + value);
    });
}

function getData(callback){
    chrome.storage.local.get(['bmrk'], function(result) {
        if(JSON.stringify(result) === "{}"){
            setData([]);
        }
        callback(JSON.stringify(result))
  });
}
 

loadBookmarks();