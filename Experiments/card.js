function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function move(element, targetX, targetY, speed) {

    animation = element.animate([
        { transform: 'translate3d('+targetX+','+targetY+',0px)'},   
    ], {
        duration: speed,
        iterations: 1,
        fill: "forwards",
    })
}