xs.init = function (module) {
    let startTime = [];
    let allPaths = module.collect("path")
        .run(function init(path) {
            let length = path.length = path.getTotalLength();
            path.style.transition = "";
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = length;
           path.style.strokeOpacity="1";
            path.style.fillOpacity = "0";
           
        });
    let aniPaths = module.collect(".aniLines")
        .run(function collectStartTimes(path) {
            let speed = 50; //per second
            path.time = path.length / speed;
            startTime.push(path.time * 1000);
        });


    aniPaths.runOneByOne(startTime, function beginAnimate(path) {
        path.style.transition = 'stroke-dashoffset ' + path.time + 's ease-in-out ';
        path.style.strokeDashoffset = '0';
    })
    .then(xs.AnimationTask,allPaths,function coloring(path){
        path.style.transition = 'fill-opacity 1.5s ease-in-out ';
        path.style.fillOpacity="1";
        path.style.transition += ',stroke-opacity 1.5s ease-in-out ';
        path.style.strokeOpacity="0";
    });

};