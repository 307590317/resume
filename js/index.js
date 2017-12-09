let loadingRender=(function(){
    let $loadingBox=$('.loadingBox'),
        $run=$loadingBox.find('.run');
    let ary=["img/icon.png","img/zf_concatAddress.png","img/zf_concatInfo.png","img/zf_concatPhone.png","img/zf_course.png","img/zf_course1.png","img/zf_course2.png","img/zf_course3.png","img/zf_course4.png","img/zf_course5.png","img/zf_course6.png","img/zf_cube1.png","img/zf_cube2.png","img/zf_cube3.png","img/zf_cube4.png","img/zf_cube5.png","img/zf_cube6.png","img/zf_cubeBg.jpg","img/zf_cubeTip.png","img/zf_emploment.png","img/zf_messageArrow1.png","img/zf_messageArrow2.png","img/zf_messageChat.png","img/zf_messageKeyboard.png","img/zf_messageLogo.png","img/zf_messageStudent.png","img/zf_outline.png","img/zf_phoneBg.jpg","img/zf_phoneDetail.png","img/zf_phoneListen.png","img/zf_phoneLogo.png","img/zf_return.png","img/zf_style1.jpg","img/zf_style2.jpg","img/zf_style3.jpg","img/zf_styleTip1.png","img/zf_styleTip2.png","img/zf_teacher1.png","img/zf_teacher2.png","img/zf_teacher3.jpg","img/zf_teacher4.png","img/zf_teacher5.png","img/zf_teacher6.png","img/zf_teacherTip.png"];
    let total=ary.length,
        cur=0;
    /*控制图片加载进度*/
    let computed=function () {
        ary.forEach(function (item) {
            let temp=new Image;
            temp.src=item;
            temp.onload=function () {
                cur++;
                run();
                temp=null;
            };

        })
    };
    /*给run动态设置宽度*/
    let run=function () {
        $run.css('width',cur/total*100+'%');
        if(cur>=total){
            //说明需要延迟加载的图片都已经加载成功了；进入下一个区域
            let timer=setTimeout(function () {//设置一个等待时间，让用户看到加载已经完成进入下一个区域
                $loadingBox.remove();
                phoneRender.init();
                clearInterval(timer);
            },500)
        }
    };
    return {
        init:function(){
            $loadingBox.css('display','block');
            computed();
        }
    }
})();
let phoneRender=(function($){
    let $phoneBox=$('.phoneBox'),
        $time=$phoneBox.find('.time'),
        $listen=$phoneBox.find('.listen'),
        $listenTouch=$listen.find('.touch'),
        $detail=$phoneBox.find('.detail'),
        $detailTouch=$detail.find('.touch');
    let bell=$('#bell')[0],
        say=$('#say')[0];
    let $phonePlan=$.Callbacks();
    let sayTimer=null;
    //控制盒子的显示隐藏
    $phonePlan.add(function(){
        $listen.remove();
        $detail.css('transform','translateY(0)');
    });
    $phonePlan.add(function () {
        bell.pause();
        say.play();
        $time.css('display','block');
        //计算播放时间
        let time=0;
        sayTimer=setInterval(()=>{
            time++;
            let zTime=say.duration;
            let minute=Math.floor(time/60);
            let second=Math.ceil(time-minute*60);
            minute= minute<10?'0'+minute:minute;
            second= second<10?'0'+second:second;
            $time.html(`${minute}:${second}`);
            if(time>=zTime){
                enterNext();
            }
        },1000);
        //点击直接进入下一个界面
        $phonePlan.add(()=>$detailTouch.tap(enterNext));
    });
    let enterNext=function () {
        clearInterval(sayTimer);
        say.pause();
        $phoneBox.remove();
        messageRender.init();
    };
    return {
        init:function(){
            $phoneBox.css('display','block');
            bell.play();
            $listenTouch.tap($phonePlan.fire);
        }
    }
})(Zepto);
let messageRender=(function($){
    let $messageBox=$('.messageBox'),
        $talkBox=$messageBox.find('.talkBox'),
        $talkList=$talkBox.find('li'),
        $keyBord=$messageBox.find('.keyBord'),
        $keyBordText=$keyBord.find('span'),
        $submit=$keyBord.find('.submit'),
        music=$('#music')[0];
    let $plan=$.Callbacks();
    //控制消息列表逐条显示
    let step=-1,
        autoTimer=null,
        offset=0;
    $plan.add(()=>{
        autoTimer=setInterval(()=>{
            step++;
            let $cur=$talkList.eq(step);
            $cur.css({
                opacity:1,
                transform:'translateY(0)'
            });
            //当第三条出来立即调取出键盘(step===2&&当前li显示的动画已经完成)
            if(step===2){
                $cur.one('transitionend',()=>{
                    $keyBord.css('transform','translateY(0)').one('transitionend',textMove);
                });
                clearInterval(autoTimer);
                return;
            }
            //当展示第五条的时候，每当展示一个li，都要ul整体上移
            if(step>=4){
                offset+=-$cur[0].offsetHeight;
                $talkBox.css(`transform`,`translateY(${offset}px)`);
            }
            //已经把所有li都展示完了，进入下一个区域
            if(step>=$talkList.length-1){
                clearInterval(autoTimer);
                let delayTimer=setTimeout(()=>{
                    music.pause();
                    $messageBox.remove();
                    cubeRender.init();
                    clearTimeout(delayTimer);
                },1500);
            }
        },1500);
    });
    let textMove=function () {
        let text=$keyBordText.html();
        $keyBordText.css('display','block').html('');
        let timer=null,
            n=-1;
        timer=setInterval(()=>{
            if(n>=text.length){
                clearInterval(timer);
                $submit.css('display','block').tap(()=>{
                    $keyBordText.css('display','none');
                    $keyBord.css('transform','translateY(3.7rem)');
                    $plan.fire();
                });
                return;
            }
            n++;
            $keyBordText[0].innerText+=text.charAt(n);
        },100)
    };
    return {
        init:function(){
            $messageBox.css('display','block');
            music.play();
            $plan.fire();
        }
    }
})(Zepto);
/*魔方区域*/
//只要在移动端浏览器实现滑动操作，都需要把浏览器默认的滑动行为（如页卡切换）禁止掉；
$(document).on('touchstart touchmove touchend',function (e) {
    e.preventDefault();
});
let cubeRender=(function(){
    let $cubeBox=$('.cubeBox'),
        $box=$cubeBox.find('.box');
    let touchBegin=function (e) {
        //方法中的this是原生的box
        let point=e.changedTouches[0];
        $(this).attr({
            strX:point.clientX,
            strY:point.clientY,
            isMove:false,
            changeX:0,
            changeY:0
        })
    };
    let touching=function (e) {
        let point=e.changedTouches[0],
            $this=$(this);
        let changeX=point.clientX-parseFloat($this.attr('strX')),
            changeY=point.clientY-parseFloat($this.attr('strY'));
        if(Math.abs(changeX)>10||Math.abs(changeY)>10){
            $this.attr({
                isMove:true,
                changeX:changeX,
                changeY:changeY,
            })
        }
    };
    let touchEnd=function (e) {
        let point=e.changedTouches[0],
            $this=$(this);
        let isMove=$this.attr('isMove'),
            changeX=parseFloat($this.attr('changeX')),
            changeY=parseFloat($this.attr('changeY')),
            rotateX=parseFloat($this.attr('rotateX')),
            rotateY=parseFloat($this.attr('rotateY'));
        /*没有发生移动直接返回*/
        if(isMove==='false')return;
        rotateX=rotateX-changeY/3;
        rotateY=rotateY+changeX/3;
        $this.css(`transform`,`scale(.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`).attr({
            rotateX:rotateX,
            rotateY:rotateY
        })
    };
    return {
        init:function(){
            $cubeBox.css('display','block');
            //记录初始旋转角度
            $box.attr({
                rotateX:-30,
                rotateY:-45
            }).on({
                touchstart:touchBegin,
                touchmove:touching,
                touchend:touchEnd
            })

        }
    }
})();
loadingRender.init();







