define(['./env'], function (env) {
    return function (context) {
        var element = context.canvas,
            dpr = env.devicePixelRatio;
        
        if (dpr != 1) {
            var width = element.width,
                height = element.height;

            element.style.width = width + "px";
            element.style.height = height + "px";
            element.height = height * dpr;
            element.width = width * dpr;
            context.scale(dpr, dpr);
        }
    }
});