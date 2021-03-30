document.addEventListener("DOMContentLoaded", function(event) {
    populate_lists();
   //is-invalid

    const Input_URL = document.getElementById("url-input");
    const Input_Title = document.getElementById("title-input");
    const Icon_Frame = document.getElementById("fav-frame");
    const Input_Catagory = document.getElementById("catagory-input");
    const Input_Description = document.getElementById("description-input");
    const Input_Tags = document.getElementById("tags-input");
    const Button_New = document.getElementById("btn-addBookmark");
    const InvalidMessage = document.getElementById("invalid-label");

   

    browser.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let tab = tabs[0];
        Input_URL.value = tab.url;
        Input_Title.value = tab.title;
        var favIconUrl = tab.favIconUrl;

        if(favIconUrl === undefined){
            favIconUrl = "undefined-fav.png";
        }else{
            toDataUrl(favIconUrl, function(base64){
                favIconUrl = base64;
            });
        }
        Icon_Frame.setAttribute("src",favIconUrl);
       
    

        Button_New.addEventListener("click",function(){
            if(Input_Title.value === "" || Input_Title.value === undefined){
                InvalidMessage.innerHTML="Please enter a valid title";
                InvalidMessage.style.color="darkred";
                InvalidMessage.style.display="block";
                Input_Title.classList.add("is-invalid");
                return;
            }
            if(Input_Catagory.value === "" || Input_Catagory.value === undefined){
                Input_Catagory.classList.add("is-invalid");
                InvalidMessage.innerHTML="Please enter a valid catagory";
                InvalidMessage.style.color="darkred";
                InvalidMessage.style.display="block";
                return;
            }

            var tag_arr = Input_Tags.value.replace(", ", ",").split(",");

            var newBookMark={
                "title":Input_Title.value,
                "tags":tag_arr,
                "description":Input_Description.value,
                "img":favIconUrl,
                "catagory":Input_Catagory.value,
                "url":Input_URL.value
            }

            Input_Catagory.classList.remove("is-invalid");
            Input_Title.classList.remove("is-invalid");




           var isEx = isExists(newBookMark, function(isEx){
            if(isEx){
                InvalidMessage.innerHTML="Title use already in use.";
                InvalidMessage.style.color="orange";
                InvalidMessage.style.display="block";
            }else{
                addThat(newBookMark);
            }
            });
            
            
        });
    });
});

function addThat(that){
    const InvalidMessage = document.getElementById("invalid-label");
    getData((data)=>{
        var json = JSON.parse(data);
        console.log(json.bmrk);
        json.bmrk.push(that);
        setData(json.bmrk); 
    });
    InvalidMessage.innerHTML="Bookmark added.";
    InvalidMessage.style.color="green";
    InvalidMessage.style.display="block";
    wait(50).then(()=>{
        populate_lists();
    })
    
}


function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

function isExists(testObject,callback){
    try{
        getData((data)=>{
            var json = JSON.parse(data);
            if(json.bmrk.some(mark => mark.title.toLowerCase() == testObject.title.toLowerCase())){
                callback(true);
                }else{
                    callback(false);
                }
        });
    }catch{
        
        callback(false);
        
    }
}

function populate_lists(){

    
   
 getData((data)=>{

    var json = JSON.parse(data);
    var mark_list = document.getElementById("mark-list");
    //Clears Current
    mark_list.innerHTML = "";
    //Loads Bookmarks as list
    json.bmrk.forEach((mark)=>{
        
        var new_mark = document.createElement("div");
        new_mark.className = "alert alert-warning alert-item";
        new_mark.setAttribute("role","alert");
        new_mark.innerHTML = mark.title;


        var mark_delete = document.createElement("button");
        mark_delete.type = "button";
        mark_delete.className = "btn btn-outline-danger remove";
        mark_delete.setAttribute("delete", mark.title)
        mark_delete.addEventListener("click", removeMark);

        new_mark.appendChild(mark_delete);
        mark_list.appendChild(new_mark);

       //<div id="mark-list" class="border">

       //<!--Mark Template-->
       //div class="alert alert-warning" role="alert">
       // Google
       // <button type="button" class="btn btn-outline-danger remove"></button>
       ///div>
       //
    });
});
}

function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}


function removeMark(event){
    getData((data)=>{
        var removeTitle = event.target.getAttribute("delete");
        json = JSON.parse(data)
        var objArr = [];

        json.bmrk.forEach((item)=>{
            if(item.title !== removeTitle){
                objArr.push(item);
            }
        })

        setData(objArr);
        populate_lists();
    });
}



function setData(value){

    browser.storage.local.set({bmrk: value}, function() {
        console.log('Value is set to ' + value);
    });
}

function getData(callback){
    browser.storage.local.get(['bmrk'], function(result) {
        callback(JSON.stringify(result))
    });
}