// ==UserScript==
// @name checkcode
// @author gb_2312
// @match http://jxgl.hdu.edu.cn/*
// ==/UserScript==





    var sample = [];
    sample[0] = "0000000000000000000000000000000000000111000111110110011111000111100011110001111000111100011110001111000110111110001110000000000000000000000000000000000000";
    sample[1] = "00000000001111111111111111111111110000000000";
    sample[2] = "0000000000000000000000000000000000000111100111111110001111000110000011000011100011100011100001100001100001111111111111100000000000000000000000000000000000";
    sample[3] = "0000000000000000000000000000000000001111001111110110011100001100001110000111000001110000011110001111000111111110001110000000000000000000000000000000000000";
    sample[4] = "000000000000000000000000000000000011000011000111001111001111011011110011110011111111111111000011000011000000000000000000000000000000";
    sample[5] = "0000000000000000000000000000000000001111110111111011000001100001111110011111111000110000011110001111100110111111001110000000000000000000000000000000000000";
    sample[6] = "0000000000000000000000000000000000000111100111110110011111000001111100111111011001111100011110001111001110111110001111000000000000000000000000000000000000";
    sample[7] = "000000000000000000000000000000111111111111000111000110001100001100011000011000011000110000110000110000000000000000000000000000000000";
    sample[8] = "0000000000000000000000000000000000001111100111110110001111000111100111011111001111101100011110001111000111111111001111000000000000000000000000000000000000";

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var input = document.getElementById('txtYz');
    canvas.id = "canvas";
    var guessCode = '';
    var imgWidth, imgHeight;
    var timer = function(){
        var img = document.querySelector('.footbutton img') || document.images[0];
        setTimeout(function(){
            if (!img) {
                timer();
                return;
            } else {
                img.height = 22;
                guessCode = '';
                canvas.width = imgWidth = img.width;
                canvas.height = imgHeight = img.height;
                ctx.drawImage(img, 0, 0,imgWidth,imgHeight);
                //document.body.appendChild(canvas);
                clearNoise();
                numSlice();
            }
        }, 1000);            
    };




    var clearNoise = function(){
        var blankImageData = ctx.createImageData(1,1);// 白色对比像素点
            blankImageData.data[0]=blankImageData.data[1]=blankImageData.data[2]=255;

        for (var y=0, h=imgHeight; y<h; y+=1){                
            for (var x=0, w=imgWidth; x<w; x+=1){

                var imageData = ctx.getImageData(x,y,1,1);

                if ( chromatic(imageData.data, blankImageData.data) < 180 ){
                    // 验证码较简单，直接二值设置阀值过滤
                    imageData.data[0]=imageData.data[1]=imageData.data[2]=255;
                    ctx.putImageData(imageData, x, y);                                
                }

            }
        }
    }

    var chromatic = function(data1, data2){
        // 色差对比
        var offR = data1[0] - data2[0]
            offG = data1[1] - data2[1],
            offB = data1[2] - data2[2];
            // console.log(offR,offG,offB)
        return Math.sqrt(offR*offR+offG*offG+offB*offB);
    }

    var numSlice = function(){
        // 取验证码坐标
        var codePos = [];
        for (var x=0, w=imgWidth; x<w; x++){
            var count = 0;
            var checkImageData = ctx.getImageData(x, 0, 1, imgHeight);
            for (var i=0, l=checkImageData.data.length; i<l; i+=4){
                // 得到的为存在验证码的坐标
                if ( checkImageData.data[i] < 255 || checkImageData.data[i+1] < 255 || checkImageData.data[i+2] < 255 ){
                    count++;
                }
                if ( count >= 4 ){
                    codePos.push(x);
                    break;
                }
            }
        }

        // 切分验证码坐标
        var slicePos = [];
        for (var i=1, l=codePos.length-1; i<l; i++){
            // 处理出边界的坐标
            if ( codePos[i+1] - codePos[i] > 1 ){
                slicePos.push(codePos[i], codePos[i+1]);
            }
        }
        slicePos.unshift(codePos[0]);
        slicePos.push(codePos[codePos.length-1]);

        // 通过坐标切割出单个验证码图片
        var sliceImageData = [];
        for (var i=0, l=slicePos.length; i<l ;i+=2){
            var tempImageData = ctx.getImageData(slicePos[i], 0, slicePos[i+1]-slicePos[i]+1, imgHeight);

            var temp = '';
            for (var j=0; j<tempImageData.data.length; j+=4){
                if ( tempImageData.data[j] < 255 || tempImageData.data[j+1] < 255 || tempImageData.data[j+2] < 255 ){
                    temp += '1';
                } else {
                    temp += '0';
                }
            }
            LDS(temp);
        }
        input.value = guessCode;
    }

    var LDS = function(str){
        var temp=[];
        var index, LDP=0;
        for (var i=0;i<9;i++){
            temp.push(LD(sample[i], str));
        }
        for (var i=0;i<9;i++){
            if (temp[i]>LDP){
                LDP = temp[i];
                index = i;
            }
        }
        guessCode += index;
        //console.log(guessCode);
    }
    var LD = function(str1, str2){
        //编辑距离
        var s = [];
        str1 = ' '+str1;
        str2 = ' '+str2;
        var l1=str1.length, l2=str2.length;
        for (var i=0,l=str1.length;i<l;i++){
            s[i] = [];
            s[i][0] = i;
        }
        for (var i=0,l=str2.length;i<l;i++){
            s[0][i] = i;
        }

        for (var i=1;i<l1;i++){
            for (var j=1;j<l2;j++){
                var tij = s[i-1][j-1];
                if ( str1[i] !== str2[j] ){
                    tij += 1;
                }

                var min;
                if ( s[i-1][j]+1 <= s[i][j-1]+1 ){
                    min = s[i-1][j]+1;
                } else {
                    min = s[i][j-1]+1;
                }
                if ( tij <= min){
                    min = tij;
                }

                s[i][j]=min;
            }
        }
        if (l1>l2){
            return 1-s[l1-1][l2-1]/l1;
        } else {
            return 1-s[l1-1][l2-1]/l2;
        }        
    }
        console.log('running');timer();
