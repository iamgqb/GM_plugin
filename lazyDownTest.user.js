// ==UserScript==
// @name   Lazy download Test
// @include  http://douban.fm/*
// ==/UserScript==

    var doc = document;
    if (window.location.href=='http://douban.fm/'){
        var downButton = doc.createElement('li');
        downButton.innerHTML = '<a href="javascript:;" id="baidu_search">搜索百度</a>';
        
        var xiamiButton = doc.createElement('li');
        xiamiButton.innerHTML = '<a href="javascript:;" id="xiami_search">搜索虾米</a>';       
        
        doc.getElementById('user_play_record').appendChild(downButton);
        doc.getElementById('user_play_record').appendChild(xiamiButton); 
        
        doc.getElementById('baidu_search').addEventListener('click', function(){            
            var url = 'http://music.baidu.com/search?key=' + getSongName();
            window.open(url);
        }, false);
        
        doc.getElementById('xiami_search').addEventListener('click', function(){
            var url = 'http://www.xiami.com/search?key=' + getSongName();
            window.open(url);
        }, false);
        
    }
    
    var getSongName = function(){
        return encodeURIComponent(doc.title.slice(0, -14));
    }
    console.log('Lazy download loaded');


    
