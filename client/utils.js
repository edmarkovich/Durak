export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}

export function animate_transform(element, transform,speed) {
    let anim = element.animate([ { transform: transform}], {
        duration: speed,
        iterations: 1,
        fill: "forwards",
    })  
    return anim;
}

