var flickr_api_key ='d9b14a1c3a5a2394cb3f013be35f2c8e';
var index=0;
var photos=[];
var imgComponent=document.getElementsByClassName('lightbox-img')[0];
var tagsComponent=document.getElementById('tags');
var captionComponent=document.getElementById('caption');
var titleComponent=document.getElementById('title');
var tag='car';

function getImages(tag) {
    imgComponent.src='images/loading.gif';
    var url='https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+flickr_api_key+'&tags='+tag+'&format=json&nojsoncallback=1';
    imageService(url,function (data) {
        photos = data.photos.photo;
        if(photos.length > 0){
            loadImage(photos[0]);
        }else {
            imgComponent.style.visibility='hidden';
            tagsComponent.style.visibility='hidden';
            captionComponent.style.visibility='hidden';
            titleComponent.innerHTML="Couldn't find any photos."
        }

    })
}

getImages(tag);

function loadImage(photo){

    imgComponent.src='images/loading.gif';
    imgComponent.onload = function() {
    };
    getPhotoInfo(photo);
    var src = 'https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg';
    titleComponent.innerHTML=photo.title + '<a href="'+src+'">'+src+'</a>';
    imgComponent.src=src;
}

function getPhotoInfo(photo){

    var url ='https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key='+flickr_api_key+'&photo_id='+photo.id+'&format=json&nojsoncallback=1';
    imageService(url,function (data) {
        if(data.photo){
            loadMetaData(data.photo);
        }
    });
}

function loadMetaData(data) {
    captionComponent.innerHTML = data.description._content || ' Description ';
    tagsComponent.innerHTML='';
    var tags = data.tags.tag;
    tags.forEach(function (tag) {
        var node = document.createElement("li");
        node.innerHTML=    tag._content || ' ';
        node.className='tag';
        tagsComponent.appendChild(node);
    })

}

function previous() {
    index--;
    if(index<0){
        index = photos.length-1
    }
    loadImage(photos[index]);
}

function next() {
    index++;
    if(index == photos.length){
        index = 0;
    }
    loadImage(photos[index]);
}

function imageService(url,callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(res) {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(xhttp.response);
            callback(data);
        }
    };
    xhttp.open(
        "GET",
        url, true);

    xhttp.send();
}

function getTagImages(event) {
    if(event.target && event.target.tagName =='LI'){
        getImages(event.target.innerText);
    }

}

document.onkeydown = function(e) {
    e = e || window.event;

    switch(e.which || e.keyCode) {
        case 37:
            e.preventDefault();
            next();                    // left
            break;
        case 39:
            e.preventDefault();
            previous();                // right
            break;
        default: return;               // exit this handler for other keys
    }

}