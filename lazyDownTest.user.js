// ==UserScript==
// @name   Lazy download Test
// @include  http://douban.fm/*
// ==/UserScript==

    var doc = document;
if (window.location.href=='http://douban.fm/'){
    var downButton = doc.createElement('li');
    downButton.innerHTML = '<a href="javascript:;" id="my_lazydown">下载</a>';
    doc.getElementById('user_play_record').appendChild(downButton);

    doc.getElementById('my_lazydown').addEventListener('click', function(){
        var songName = doc.title.slice(0, -7);
        var url = 'http://music.baidu.com/search?key=' + songName;
        window.open(url)
    }, false);
}

if (window.location.href.indexOf('type=liked')){
    var lists = doc.querySelectorAll('.info_wrapper');
    for(var i=0, l=lists.length;i<l;i++){
        var song_title = lists[i].querySelector('.song_title').innerHTML;
        var downButton = doc.createElement('a');
        downButton.href = 'javascript:window.open(\'http://music.baidu.com/search?key='+song_title+'\');'
        downButton.innerHTML = '下载';
        lists[i].appendChild(downButton);
    }
}

