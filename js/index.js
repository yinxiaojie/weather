let citys;
$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/city/",
    type:"get",
    dataType:"jsonp",
    success:function (e) {
        citys=e.data;
        let str="";
        for(item in citys){
            str+=`<h2>${item}<h2>`;
            str+=`<div class="con">`;
            for(item1 in citys[item]){
                str+=`<div class="city">${item1}</div>`;
            }
            str+=`</div>`;
        }
        $(str).appendTo($(".cityBox"));

    }
});

$(function () {
    //语音播放
    $(".audioBtn").click(function (event) {
        event.stopPropagation();
        let speech=window.speechSynthesis;
        let speechset=new SpeechSynthesisUtterance();
        let text=$(".header span").text()+"当前温度"+$("#current_temperature").text()+"摄氏度"+$("#day_condition").text()+$("#weather_wind_direction").text();
        speechset.text=text;
        speech.speak(speechset);
    });


    $(".header").click(function () {
        $(".cityBox").slideDown();
    });
    $(".search button").click(function () {
        $(".cityBox").slideUp();
    });
    $(".cityBox").on("touchstart",function (event) {
        if(event.target.className=="city"){
            let city=event.target.innerText;
            $.ajax({
                url:"https://www.toutiao.com/stream/widget/local_weather/data/",
                data:{'city':city},
                type:"get",
                dataType:"jsonp",
                success:function (e) {
                    updata(e.data);
                }

            });
            $(".cityBox").slideUp();
        }
    });

    //传入数据
    function updata(data) {
        console.log(data);
        $(".header span").text(data.city);
        $("#aqi-val").text(data.weather.aqi);
        $("#tomorrow_quality_level").text(data.weather.quality_level);
        $("#current_temperature").text(data.weather.current_temperature);
        $("#day_condition").text(data.dat_condition);
        $("#weather_wind_direction").text(data.weather.wind_direction+""+data.weather.weather_icon_id+"级");

        $("#weather_high_temperature").text(data.weather.high_temperature+"/"+data.weather.low_temperature);
        $("#tomorrow_weather_high_temperature").text(data.weather.tomorrow_high_temperature+"/"+data.weather.tomorrow_low_temperature);
        $("#dat_condition").text(data.weather.dat_condition);
        $("#tomorrow_condition").text(data.weather.tomorrow_condition);
        $("#weather_icon_id").attr("src",`img/${data.weather_icon_id}.png`);
        $("#tomorrow_weather_icon_id").attr("src",`img/${data.weather.tomorrow_weather_icon_id}.png`);

        let str="";
        for(obj of data.weather.hourly_forecast){
            str+=
                `
               <div class="box">
                <div>${obj.hour}:00</div>
                <img src="img/${obj.weather_icon_id}.png" alt="">
                <div><span>${obj.temperature}</span>°</div>
            </div>   
                `
        }
        $(".hours .con").html(str);

        //一周天气
        let weeknum=["日","一","二","三","四","五","六"];
        let str1="";
        let high=[];
        let low=[];
        let x=[];
        for(obj of data.weather.forecast_list){
            let date =new Date(obj.date);
            let day=date.getDay();
            x.push(obj.date);
            high.push(obj.high_temperature);
            low.push(obj.low_temperature);
            str1+=`<div class="everyday">
                <div>星期${weeknum[day]}</div>
                <div>${obj.date}</div>
                <div>${obj.condition}</div>
                <div><img src="img/${obj.weather_icon_id}.png" alt=""></div>
                <div class="sure"></div>
                <div><img src="img/${obj.weather_icon_id}.png" alt=""></div>
                <div>${obj.condition}</div>
                <div>${obj.wind_direction}</div>
                <div>${obj.wind_level}级</div>
                </div>
            `
        }
        $(".week .weekday").html(str1);

        //折线图
        var myChart = echarts.init($(".empty")[0]);
        let option = {
            xAxis: {
                data:x,
                show:false,
            },
            yAxis: {
                show:false,
            },
            series: [{
                type: 'line',
                data: high,
                color:'blue',
            },{
                name: '销量',
                type: 'line',
                data: low,
                color:'yellow',
            }],
            grid:{
                left:0,
                right:0,
                top:'30%',
                bottom:'10%',
            }
        };
        myChart.setOption(option);
    }
});