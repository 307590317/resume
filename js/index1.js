let loadRender=(function(){
    let $loadingBox=$('.loadingBox');
    let $progress=$('.progress'),
        $run=$progress.find('.run');
    //获取所有图片
    let ary=["img/icon.png","img/zf_concatAddress.png","img/zf_concatInfo.png","img/zf_concatPhone.png","img/zf_course.png","img/zf_course1.png","img/zf_course2.png","img/zf_course3.png","img/zf_course4.png","img/zf_course5.png","img/zf_course6.png","img/zf_cube1.png","img/zf_cube2.png","img/zf_cube3.png","img/zf_cube4.png","img/zf_cube5.png","img/zf_cube6.png","img/zf_cubeBg.jpg","img/zf_cubeTip.png","img/zf_emploment.png","img/zf_messageArrow1.png","img/zf_messageArrow2.png","img/zf_messageChat.png","img/zf_messageKeyboard.png","img/zf_messageLogo.png","img/zf_messageStudent.png","img/zf_outline.png","img/zf_phoneBg.jpg","img/zf_phoneDetail.png","img/zf_phoneListen.png","img/zf_phoneLogo.png","img/zf_return.png","img/zf_style1.jpg","img/zf_style2.jpg","img/zf_style3.jpg","img/zf_styleTip1.png","img/zf_styleTip2.png","img/zf_teacher1.png","img/zf_teacher2.png","img/zf_teacher3.jpg","img/zf_teacher4.png","img/zf_teacher5.png","img/zf_teacher6.png","img/zf_teacherTip.png"];
    //加载资源
    let total=ary.length,
        cur=0;
    let computed=function () {
        ary.forEach(function (item) {
            let temp=new Image;
            temp.src=item;
            temp.onload=function () {
                cur++;
                run();
                temp=null;
            }
        })
    };
    //让滚动条跟着动
    let run=function () {
        $run.css('width',cur/total*100+'%');
        //当资源都加载完成之后，清除本区域额内容，开始下一个区域的内容
        if(cur===total){
            //清除本页内容，进入下个区域的内容：添加一个动画效果
            let timer=setTimeout(()=>{
                $loadingBox.remove();
                phoneBox.init();
                clearTimeout(timer);
            },1000);
        }
    };
    return {
        init:function(){
            $loadingBox.css('display','block');
            computed();
        }
    }
})();
let phoneBox=(function($){
    let $phoneBox=$('.phoneBox'),
        $time=$phoneBox.find('.time'),
        $listen=$('.listen'),
        $listenTouch=$listen.find('.touch'),
        $detail=$('.detail'),
        $detailTouch=$detail.find('.touch'),
        bell=$('#bell')[0],
        say=$('#say')[0];
    let sayTimer=null;
    let $plan=$.Callbacks();
    //控制铃声页面隐藏，自我介绍界面显示
    $plan.add(()=>{
        //让自我介绍播放，铃声停止
        bell.pause();
        //铃声停止的时候说明已经点击了按钮，需要让$detail替换掉$listen
        $listen.remove();
        $detail.css('transform','translateY(0)');
        say.play();
    });
    //自我介绍播放的时候让页面中的time跟着变化
    $plan.add(()=>{
        //time一开始是不显示的，先让time显示
        $time.css('display','block');
        let time=0;
        sayTimer=setInterval(()=>{
            time++;
            //获取音频的总时间
            let zTime=say.duration;
            //设置time中的时间
            let minute=Math.floor(time/60);
            let second=Math.ceil(time-minute*60);
            //判断前面是否需要补0
            minute=minute<10?'0'+minute:minute;
            second=second<10?'0'+second:second;
            //设置给$time
            $time.html(`${minute}:${second}`);
            //当time>=zTime时跳转到下一个页面
            if(time>=zTime){
                //执行跳转到下一个页面的函数
                toNext();
            }
        },1000);
        $detailTouch.tap(toNext);
    });
    //从自我介绍跳转到下一个页面方法
    let toNext=function () {
        //先清除定时器
        clearInterval(sayTimer);
        //让say停止播放
        say.pause();
        //移除当前页面
        $phoneBox.remove();
        //执行下一个方法init
        messageRender.init();
    };

    return {
        init:function(){
            $phoneBox.css('display','block');
            //让铃声在这里播放，点击的时候让自我介绍播放
            bell.play();
            $listenTouch.tap($plan.fire);
        }
    }
})(Zepto);
let messageRender=(function($){
    let $messageBox=$('.messageBox'),
        $talkBox=$messageBox.find('.talkBox'),
        $lis=$talkBox.find('li'),
        $keyBord=$('.keyBord'),
        $span=$keyBord.find('span'),
        $submit=$keyBord.find('.submit'),
        music=$('#music')[0];
    let $plan=$.Callbacks();
    let step=-1,
        autoTimer=null,
        offset=0;
    $plan.add(()=>{
        autoTimer=setInterval(()=>{
            step++;
            let $cur=$lis.eq(step);
            //让step对应的li透明度为1，并且回到原来的位置；
            $cur.css({
                opacity:1,
                transform:'translateY(0)'
            });
            //显示到第三个li的时候，停止定时器，并让键盘上来，出现打字效果。等待点击
            if(step===2){
                $cur.one('transitionend',()=>{
                    $keyBord.css('transform','translateY(0)').one('transitionend',textPlay);
                });
                clearInterval(autoTimer);
                return;
            }
            //如果显示到第五条了，让ul跟着往上面动
            if(step>=4){
                offset+=$cur[0].offsetHeight;
                $talkBox.css(`transform`,`translateY(${-offset}px)`);
            }
            //如果显示到最后一条了，清除本页面，切换到下一个页面；
            if(step>=$lis.length-1){
                clearInterval(autoTimer);
                let delayTimer=setTimeout(()=>{
                    //音乐停止
                    music.pause();
                    $messageBox.remove();
                    cubeRender.init();
                    clearTimeout(delayTimer);
                },1500);
            }
        },1000);
    });
    //让文字出现打字机效果；
    let textPlay=function () {
        //获取所有文本内容
        let text=$span.html(),
            n=-1;
        //将文本内容置为空
        $span.html('');
        //然后让span显示
        $span.css('display','block');
        let timer=setInterval(()=>{
            n++;
            if(n>=text.length){
                clearTimeout(timer);
                //让发送按钮显示
                $submit.css('display','block');
                //给发送按钮绑定点击时事件
                $submit.tap(()=>{
                    //让span消失
                    $span.css('display','none');
                    //让键盘回归到下面
                    $keyBord.css('transform','translateY(3.7rem)');
                    $plan.fire();
                });
                return;
            }
            //把文字一个个的添加到span中
            $span[0].innerHTML+=text.charAt(n);
        },300);
    };
    return {
        init:function(){
            $messageBox.css('display','block');
            music.play();
            $plan.fire();
        }
    }
})(Zepto);
//只要在移动端浏览器实现滑动操作，都需要把浏览器默认的滑动行为（如页卡切换）禁止掉；
$(document).on('touchstart touchmove touchend',function (e) {
    e.preventDefault();
});
let cubeRender=(function(){
    let $cubeBox=$('.cubeBox'),
        $box=$cubeBox.find('.box');
    let touchstart=function (e) {
        let point=e.changedTouches[0];
        //记录起始的鼠标位置
        $(this).attr({
            isMove:false,
            strX:point.clientX,
            strY:point.clientY,
            changeX:0,
            changeY:0
        })
    };
    let touching=function (e) {
        let point=e.changedTouches[0];
        let $this=$(this);
        //用attr获取的值为字符串要转换成数值
        let strX=parseFloat($this.attr('strX')),
            strY=parseFloat($this.attr('strY'));
        //计算改变的值;
        let changeX=point.clientX-strX,
            changeY=point.clientY-strY;
        //判断是否发生移动,发生移动就把移动的值记录到操作的当前盒子上
        if(Math.abs(changeX)>10||Math.abs(changeY)>10){
            $this.attr({
                isMove:true,
                changeX:changeX,
                changeY:changeY,
            })
        }
    };
    let touchend=function (e) {
        let point=e.changedTouches[0];
        let $this=$(this);
        if($this.attr('isMove')==='true'){
            let changeX=parseFloat($this.attr('changeX')),
                changeY=parseFloat($this.attr('changeY'));
            //计算改变后的旋转角度,changeY是按X轴旋转,changeX是按Y轴旋转
            let rotateX=parseFloat($this.attr('rotateX'))-changeY/3,
                rotateY=parseFloat($this.attr('rotateY'))+changeX/3;
            //把改变的值设置给盒子的css样式让盒子动起来；
            $this.css(`transform`,`scale(.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
                .attr({
                    //把盒子当先的旋转角度作为下次旋转角度的初始角度
                rotateX:rotateX,
                rotateY:rotateY
            })
        }
    };
    return {
        init:function(){
            $cubeBox.css('display','block');
            //记录起始旋转角度，并给盒子绑定触摸事件
            $box.attr({
                rotateX:-30,
                rotateY:-45
            }).on({
                touchstart:touchstart,
                touchmove:touching,
                touchend:touchend
            });
            $box.find('li').tap(function () {
                let index=$(this).index();
                $cubeBox.css('display','none');
                detailRender.init(index);
            })
        }
    }
})();
let detailRender=(function(){
    let $detailBox=$('.detailBox'),
        $cubeBox=$('.cubeBox'),
        $return=$detailBox.find('.return'),
        $makisuBox=$('#makisuBox'),
        swiper=null;
    let change=function (swiper) {
        //当前活动块的索引
        /*swiper.activeIndex*/
        //slides获取了所有的活动块（是一个数组）
        /*swiper.slides*/
        //获取当前的活动块
        /*swiper.slides[swiper.activeIndex]*/
        let {slides,activeIndex}=swiper;
        //处理第一页,是第一页就让它展开，不是就收起
        if(activeIndex===0){
            $makisuBox.makisu({
                selector:'dd',
                overlap:0.2,
                speed:0.5
            });
            $makisuBox.makisu('open');
        }else{
            $makisuBox.makisu({
                selector:'dd',
                overlap:0,
                speed:0
            });
            $makisuBox.makisu('close');
        }
        //给当前活动块增加ID，其他活动块移除ID
        [].forEach.call(slides,function (item,index) {
            if(index===activeIndex){
                item.id='page'+(activeIndex+1);
                return;
            }
            item.id=null;
        })
    };
    return {
        init:function(index=0){
            $detailBox.css('display','block');
            /*初始化 swiper swiper不存在的时候才需要初始化*/
            if(!swiper){
                /*给return按钮添加返回上一个界面的功能*/
                $return.tap(()=>{
                    $detailBox.css('display','none');
                    $cubeBox.css('display','block');
                });
                swiper=new Swiper('.swiper-container',{
                    effect:'coverflow',
                    /*初始化时候执行*/
                    onInit:change,
                    /*切换到某一张的动画结束的时候执行*/
                    onTransitionEnd:change
                });
                index=index>5?5:index;
                //运动到指定索引的slide位置
                swiper.slideTo(index,0);
            }
        }
    }
})();
loadRender.init();
/*
* 滑到某一个页面的时候，给当前这个页面设置一个ID，例如：滑动到第二个页面。我们给其设置id=page2
* 滑出这个页面的时候，我们把之前设置的ID移除掉
* 我们把当前页面中元素需要的动画效果全部写在指定的ID下
*细节处理
* 1、我们是基于animate.css帧动画库来完成的动画
* 2、我们让需要运动的元素初始样式opacity为0
* 3、当设置ID让其运动的时候，我们自己在动画完成的的时候让其透明度为1
*
* */