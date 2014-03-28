
//mainlist is a list of objects corresponding to tracks taken from
//soundcloud. Fields for the object: {title, username, id, isqd}, wher
//username refers to the soundcloud user who uploaded the track, id refers
//to the song id used to stream the song from soundcloud, and isqd is 
//a boolean that is true when the object has been added to the queue.
var mainlist;
var queue;
var clientid = '4049f4856a7eee5b403bdbed54734a09';
var isstreaming = false;
var exploreGenre = "Popular Music";
var exploreoffset = 0;
var now_playing_index = 0;

SC.initialize({
  client_id: '4049f4856a7eee5b403bdbed54734a09'
});

//Below is a JSON of all categories used for SoundCloud Explore. Retrieved from:
//https://api.soundcloud.com/explore/v2?limit=10&offset=0&linked_partitioning=1&client_id=4049f4856a7eee5b403bdbed54734a09
//{"categories":{"audio":["Popular+Audio","Audiobooks","Business","Comedy","Entertainment","Learning","News+%26+Politics","Religion+%26+Spirituality","Science","Sports","Storytelling","Technology"],
//               "music":["Popular+Music","Alternative+Rock","Ambient","Blues","Classical","Country","Dance","Deep+House","Disco","Drum+%26+Bass","Dubstep","Electro","Electronic","Folk","Hardcore+Techno","Hip+Hop","House","Indie+Rock","Jazz","Latin","Metal","Minimal+Techno","Mixtape","Piano","Pop","Progressive+House","Punk","R%26B","Rap","Reggae","Rock","Singer-Songwriter","Soul","Tech+House","Techno","Trance","Trap","Trip+Hop","World"]},
//              "tag":"uniform-time-decay-experiment:1:1393436807",
//               "took":"278.206us"}
//This is the query not using my client_id but taking what was used by sc/explore
var explore = {"categories":{"audio":["Popular+Audio","Audiobooks","Business","Comedy","Entertainment","Learning","News+%26+Politics","Religion+%26+Spirituality","Science","Sports","Storytelling","Technology"],
                            "music":["Popular+Music","Alternative+Rock","Ambient","Blues","Classical","Country","Dance","Deep+House","Disco","Drum+%26+Bass","Dubstep","Electro","Electronic","Folk","Hardcore+Techno","Hip+Hop","House","Indie+Rock","Jazz","Latin","Metal","Minimal+Techno","Mixtape","Piano","Pop","Progressive+House","Punk","R%26B","Rap","Reggae","Rock","Singer-Songwriter","Soul","Tech+House","Techno","Trance","Trap","Trip+Hop","World"]},
               "tag":"uniform-time-decay-experiment:6:1393437049",
               "took":"286.701us"};

//Below is an example of an explore retrieval. It gets the first 10 most popular
//Deep House sounds. Below that is a retrieval that gets the next 10.
//https://api-web.soundcloud.com/explore/deep%2Bhouse?tag=uniform-time-decay-experiment%3A6%3A1392943040&limit=10&offset=0&linked_partitioning=1
//https://api-web.soundcloud.com/explore/deep%2Bhouse?offset=10&tag=uniform-time-decay-experiment%3A6%3A1392943040&limit=10
//https://api-web.soundcloud.com/explore/Popular%20Music?tag=uniform-time-decay-experiment%3A6%3A1392943040&limit=10&offset=0&linked_partitioning=1
function gettracks(){

}
function buildlist1(){
    for (var i = exploreoffset; i < mainlist.length; i++) {
        $('#list1').append('<li><p> ' + mainlist[i]['title'] + 
        ' <small>' + mainlist[i]['username'] + '</small></p></li>');
    }

}

function playSound(soundindex){
    console.log(soundindex);
    if (queue[soundindex]['isplaying']===false){
        if(isstreaming == true){
            mySound.pause()
            queue[now_playing_index]['isplaying'] = false;
            isstreaming = false;
            $('#list2 li').eq(now_playing_index).removeClass("playing");
            $('#list2 li').eq(now_playing_index).removeClass("paused");
        }
        mySound = soundManager.createSound({
            id: 'track_' + queue[soundindex]['id'],
            url: queue[soundindex]['url'] + "?consumer_key=" + clientid,
            autoplay: false
        });
        soundManager.play(mySound.id, {
            multiShotEvents: true,
            onfinish: function(){
                queue[soundindex]['isplaying'] = false;
                isstreaming = false;
                $('#list2 li').eq(now_playing_index).removeClass("playing");
                $('#list2 li').eq(now_playing_index).removeClass("paused");
                if(soundindex < queue.length){
                    playSound(soundindex + 1)
                }
            }
        });
        queue[soundindex]['isplaying'] = true;
        isstreaming = true;
        $('#list2 li').eq(soundindex).removeClass("paused").addClass("playing");       
    }
    else if (queue[soundindex]['isplaying']=== true){
        mySound.pause();
        queue[soundindex]['isplaying'] = fal;
        isstreaming = false;
        $('#list2 li').eq(now_playing_index).removeClass("playing").addClass("paused");
    }
    now_playing_index = soundindex;
}

function addgenretags(){
    for (var i = 0; i < explore['categories']['music'].length; i++){
        $('#dropdown ul').append('<li id="genre"><p> ' + 
          decodeURIComponent(explore['categories']['music'][i]).replace("+"," ") 
          + '</p></li>');
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function  gettrendingSCtracks(genre, limit, offset){
    var genretag = encodeURIComponent(genre);
    var phpurl = "getexplore.php/?genre=" + genretag + "&limit=" + limit +
                 "&offset=" + offset;
    $.getJSON(phpurl, function(data){
        dataparsed = JSON.parse(data);
        $(dataparsed["tracks"]).each(function(index, track) {
            console.log(index, track);
            mainlist.push({title: track.title, username: track.user['username'],
                           id: track.id, url: track.stream_url, isqd: false,
                           isplaying: false});
        });
        buildlist1();
        exploreoffset += limit;
        $(window).trigger('resize');
    })
}

function createCORSrequest(method, url){
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);
    } 
    else if (typeof XDomainRequest != "undefined") {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open('GET', url);

    } 
    else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
    }
    xhr.withCredentials = true;
    return xhr;
}

function processdata(data){
    console.log(data);
}

$(document).ready(function() {
    mainlist = new Array();
    queue = new Array();
    gettracks();
 
 /*   SC.get('/tracks', { streamable: true, genres: 'rock' }, function(tracks) {
        $(tracks).each(function(index, track) {
            mainlist.push({title: track.title, username: track.user['username'],
                           id: track.id, url: track.stream_url, isqd: false, isplaying: false});
        });
        buildlist1();
        $(window).trigger('resize');
    });*/
    soundManager.setup({
        url: '/path/to/swf-directory/',
        onready: function() {
          // SM2 has loaded, API ready to use e.g., createSound() etc.
        },
        ontimeout: function() {
          // Uh-oh. No HTML5 support, SWF missing, Flash blocked or other issue
        }
    });
});

$(window).resize(function(){
    var col1 = $('#list1div');
    var col2 = $('#list2div');
    var colsep = $('#colsep');
    if (col1.height() < col2.height()){
        colsep.height(col2.height());
    }
    else {
        colsep.height(col1.height());
    }
    colsep.offset(col2.offset());
}).resize();

//Relies on the order of list 1 corresponding to the order of
//mainlist
$(document).on('click', '#list1 li', function(){
    var list2 = $('#list2');    
    console.log("SEAFASDSA")
    if($(this).attr("title") != "true"){}
        list2.append($(this).clone());
        $(this).attr("title", "true");
        $(window).trigger('resize');
    } 
});

$(document).on('click', '#list2 li', function(){
    targetindex = $(this).index();
    playSound(targetindex);
});

$('#list1').on('scroll', function() {
    if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight){
        console.log('end reached');
        gettrendingSCtracks(exploreGenre, 15, exploreoffset);
    }
})

//click causes playing to skip to prev track
$("#backbutton").on("click", function(){
    targetindex = now_playing_index - 1;
    if (targetindex < 0){targetindex = 0;}
    console.log("backbutton clicked",targetindex, now_playing_index);
    playSound(targetindex);
});


//click causes playing song to be paused
$("#playbutton").on("click", function(){
    console.log("Play clicked");
    $(this).removeAttr("id");
    $(this).attr("id","pausebutton");
    playSound(now_playing_index);
});

//click causes playing song to be paused
$("#pausebutton").on("click", function(){
    console.log("Pause clicked");
    $(this).removeAttr("id");
    $(this).attr("id","playbutton");
    playSound(now_playing_index);
});

$("#fwdbutton").on("click", function(){
    targetindex = now_playing_index + 1;
    console.log("Fwdbutton clicked",targetindex, now_playing_index);
    if (targetindex < queue.length){playSound(targetindex);}
});
