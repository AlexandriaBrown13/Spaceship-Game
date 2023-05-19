//////////////////////////////////////////////
/////    CONSTANTS  //////////////////////////
//////////////////////////////////////////////
const MOVE_LENGTH = 25;
const up = "ArrowUp";
const down = "ArrowDown";
const left = "ArrowLeft";
const right = "ArrowRight";
let previousKey;





//////////////////////////////////////////////
/////    PAGE LOAD  //////////////////////////
//////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', 
() => {
    

    console.log("Starting Game");


    // setInterval accepts a function as the first parameter and 
    // a time in milliseconds as the second parameter. It will continuously 
    // run the function over and over staggered by the time indicated in the 
    // second parameter. I am using it to alternate between two images of the 
    // ufo so that it looks like the lights are flashing
        setInterval( () => {
        const img = document.querySelector("#player img");
        if (img) {
        if(img.src.endsWith("ufo-transparent1.png")) {
            img.src = img.src.replace("ufo-transparent1.png","ufo-transparent2.png");
            console.log(img.src);
        } else {
            img.src = img.src.replace("ufo-transparent2.png","ufo-transparent1.png");
            console.log(img.src);
        }
    }
    }, 1000);

        setInterval( () => {
            const player = document.getElementById("player");
            checkForAsteroid(player);

        }, 250);


    
    //Default to the top left corner of the screen
    player.style.top="0px";
    player.style.left="0px";

    //Grab the entire body of the screen and tell it to listen for 
    // the key up event, then move the player according to what 
    // arrow was pressed
    const body = document.querySelector("body");
    body.addEventListener("keydown", (event) => {

        const player = document.getElementById("player");
        move(event.key, player);
        
        if(checkOverlaps(player)) {
            console.log("overlap!");
        }

    })

    body.addEventListener("keyup", (event) => {
        const player = document.getElementById("player");
        if (player) {
        shoot(event.key, player);
        }
        if (event.key == "x") {
            location.reload();
        }
    })
});

function shoot(key, player) {
    if (key == " "){
        const img = document.createElement("img");
        img.src = "img/laserbeam.gif";
        const rect = player.getBoundingClientRect();
        let currentTop = rect.top;
        let currentLeft = rect.left;
        img.style.position = "absolute";
        img.style.top = currentTop + "px";
        img.style.left = currentLeft + "px";
        const body = document.querySelector("body");
        if (previousKey == up) {
           img.classList.add("laserUp");
           currentLeft -= 225;
           currentTop -= 200;
           img.style.top = currentTop + "px";
           img.style.left = currentLeft + "px";
        } 
        if (previousKey == down) {
           img.classList.add("laserDown");
           currentTop += 200;
           currentLeft -= 225;
           img.style.top = currentTop + "px";
           img.style.left = currentLeft + "px";
       }
       if (previousKey == left) {
           img.classList.add("laserLeft")
           currentLeft -= 450;
           currentTop -= 50;
           img.style.top = currentTop + "px";
           img.style.left = currentLeft + "px";
       }
       if (previousKey == right) {
           currentTop -= 50;
            img.style.top = currentTop + "px";
            img.style.left = currentLeft + "px";
       }
       const planet1 = document.querySelector("#planet1");
       const planet2= document.querySelector("#planet2");
       const planet3 = document.querySelector("#planet3");
       const planet4 = document.querySelector("#planet4");
       body.appendChild(img);
       let mySound = new Audio("sound/laserrocket2-6284.mp3");
       mySound.volume = 0.2;
       mySound.play();

       setTimeout(()=>{
        checkForExplosion(img);
            img.remove();
       }, 1000)
    }
}

//////////////////////////////////////////////
/////    MOVE PLAYER  //////////////////////////
//////////////////////////////////////////////
function move(key, player) {

    if(key === "ArrowUp" || key === "w") {
        moveUp(player);
        previousKey = up;
    }

    if(key === "ArrowDown" || key === "s") {
        moveDown(player); 
        previousKey = down;           
    }

    if(key === "ArrowLeft" || key === "a") {
        moveLeft(player);
        previousKey = left;
    }

    if(key === "ArrowRight" || key === "d") {
        moveRight(player);
        previousKey = right;
    }
}

function moveUp(player) {
    const rect = player.getBoundingClientRect();
    const newTop = rect.top-MOVE_LENGTH;
    player.style.top = newTop + "px";
}

function moveDown(player) {
    const rect = player.getBoundingClientRect();
    console.log(rect);
    let newTop = rect.top+MOVE_LENGTH;
    player.style.top = newTop + "px";
}

function moveRight(player) {
    const rect = player.getBoundingClientRect();
    const newLeft = rect.left + MOVE_LENGTH;
    player.style.left = newLeft + "px";    
}

function moveLeft(player) {
    const rect = player.getBoundingClientRect();
    const newLeft = rect.left - MOVE_LENGTH;
    player.style.left = newLeft + "px";   
}


//////////////////////////////////////////////
/////    OVERLAPS   //////////////////////////
//////////////////////////////////////////////

// create variables that keep track of if player is in planet
let numPlanetsVisited = 0;
let numPlanetsDestroyed = 0;
let isInPlanet1 = false;
let isInPlanet2 = false;
let isInPlanet3 = false;
let isInPlanet4 = false;
let isInPlanet5 = false;
let isPlanet1There = true;
let isPlanet2There = true;
let isPlanet3There = true;
let isPlanet5There = true;


function checkOverlaps(player) {
    //check if player is in planet 1
    checkInPlanet1(player);
    checkInPlanet2(player);
    checkInPlanet3(player);
    checkInPlanet5(player);
    check4SAT(player);
    checkForAsteroid(player);
    checkInEARTH(player);
}

function checkInPlanet1(player) {
    const planet = document.getElementById("planet1");
    if(checkOverlap(planet, player)) {

        //if they were just outside the planet, 
        //indicate they are entering
        if(!isInPlanet1){
            updatePlanetCount();
            printMessage("Entering Planet 1");
        }

        isInPlanet1 = true;
    } else {

        //if they were just in the Planet, 
        //indicate they are leaving
        if(isInPlanet1) {
            printMessage("Leaving Planet 1");
        }

        isInPlanet1 = false;
    }

}
function checkInPlanet2(player) {
    const planet = document.getElementById("planet2");
    if(checkOverlap(planet, player)) {

        //if they were just outside the planet, 
        //indicate they are entering
        if(!isInPlanet2){
            updatePlanetCount();
            printMessage("Entering Planet 2");
        }

        isInPlanet2 = true;
    } else {

        //if they were just in the Planet, 
        //indicate they are leaving
        if(isInPlanet2) {
            printMessage("Leaving Planet 2");
        }

        isInPlanet2 = false;
    }
}

function checkInPlanet3(player) {
    const planet = document.getElementById("planet3");
    if(checkOverlap(planet, player)) {

        //if they were just outside the planet, 
        //indicate they are entering
        if(!isInPlanet3){
            updatePlanetCount();
            printMessage("Entering Planet 3");
        }

        isInPlanet3 = true;
    } else {

        //if they were just in the Planet, 
        //indicate they are leaving
        if(isInPlanet3) {
            printMessage("Leaving Planet 3");
        }

        isInPlanet3 = false;
    }
}

    function checkInPlanet5(player) {
        const planet = document.getElementById("planet5");
        if(checkOverlap(planet, player)) {
    
            //if they were just outside the planet, 
            //indicate they are entering
            if(!isInPlanet5){
                updatePlanetCount();
                printMessage("Entering Planet 5");
            }
    
            isInPlanet5 = true;
        } else {
    
            //if they were just in the Planet, 
            //indicate they are leaving
            if(isInPlanet5) {
                printMessage("Leaving Planet 5");
            }
    
            isInPlanet5 = false;
        }
    }

    function checkInEARTH(player) {
        const planet = document.getElementById("planet4");
        if(checkOverlap(planet, player)) {
            if (document.getElementById("SAT")) {
                shipExplodes(player);
            } else {         
                const element = document.querySelector("#win");
                element.style.visibility = "visible"
            }
        }
    }

    function shipExplodes(player) {
        const img = document.querySelector("#player img");
        let sound = new Audio("sound/myexplosion1-87923.mp3");
        sound.volume = .2;
        sound.play();
        if(img.src.endsWith("ufo-transparent1.png")) {
            img.src = img.src.replace("ufo-transparent1.png","explosion.gif");
                setTimeout( () => {
                    img.remove();
                    player.remove();
                }, 1000);

        } else {
            img.src = img.src.replace("ufo-transparent2.png","explosion.gif");
            setTimeout( () => {
                img.remove();
                player.remove();
            }, 1000);
        }
        const element = document.querySelector("#lose");
        element.style.visibility = "visible"

    }

    function check4SAT(player) {
        const planet = document.getElementById("SAT");
        if(checkOverlap(planet, player)) {
            shipExplodes(player);
        }
}

    function checkForAsteroid(player){
        const asteriod = document.getElementById("ELE");
        const asteriod2 = document.getElementById("ELE2");
       if (checkOverlap(asteriod, player) || checkOverlap(asteriod2, player)) {
        shipExplodes(player);
       }
    }

    function checkForExplosion(laser) {
        const planet1 = document.querySelector("#planet1");
        const planet2= document.querySelector("#planet2");
        const planet3 = document.querySelector("#planet3");
        const planet4 = document.querySelector("#planet4");
        const planet5 = document.querySelector("#planet5");
        const sat = document.querySelector("#SAT");
        const asteriod = document.getElementById("ELE");
        const asteriod2 = document.getElementById("ELE2");

        if (checkOverlap(planet1, laser)){
            const planet = document.querySelector("#planet1 img");
            planet.src = planet.src.replace("img/Saturn_planet.gif", "img/explosion.gif");
            let sound = new Audio("sound/a-bomb-139689.mp3");
            updatePlanetDestroyed();
            printMessage("Planet 1 Destroyed!");
            sound.volume = .5;
            sound.play();
                        setTimeout(() =>{
                planet1.remove();

        }, 1000)
        }
        if (checkOverlap(planet2, laser)){
            const planet = document.querySelector("#planet2 img");
            planet.src = planet.src.replace("img/planet_bounce.gif", "img/explosion.gif");
            let sound = new Audio("sound/a-bomb-139689.mp3");
            sound.volume = .2;
            sound.play();
            updatePlanetDestroyed();
            printMessage("Planet 2 Destroyed!");
            setTimeout(() =>{
                planet2.remove();

        }, 1000)
        }
        if (checkOverlap(planet3, laser)){
            const planet = document.querySelector("#planet3 img");
            planet.src = planet.src.replace("img/neptune_planet.gif", "img/explosion.gif");
            let sound = new Audio("sound/a-bomb-139689.mp3");
            sound.volume = .2;
            sound.play();
            setTimeout(() =>{
                planet3.remove();
                updatePlanetDestroyed();
                printMessage("Planet 3 Destroyed!");
        }, 1000)
        }
        if (checkOverlap(planet5, laser)){
            const planet = document.querySelector("#planet5 img");
            planet.src = planet.src.replace("img/DGPlanet.PNG", "img/explosion.gif");
            let sound = new Audio("sound/a-bomb-139689.mp3");
            sound.volume = .2;
            sound.play();
            setTimeout(() =>{
                planet5.remove();
                updatePlanetDestroyed();
                printMessage("Planet 5 Destroyed!");
        }, 1000)
        }
        if (checkOverlap(sat, laser)){
            const satellite = document.querySelector("#SAT img");
            satellite.src = satellite.src.replace("img/satellite.gif", "img/explosion.gif");
            let sound = new Audio("sound/a-bomb-139689.mp3");
            sound.volume = .2;
            sound.play();
            setTimeout(() =>{
                sat.remove();
                printMessage("Satellite Destroyed!");
        }, 1000)
        }
        if (checkOverlap(asteriod, laser)) {
            const img = document.querySelector("#ELE img");
            img.src = img.src.replace("img/asteroid.gif", "img/explosion.gif");
            let sound = new Audio("sound/a-bomb-139689.mp3");
            sound.volume = .2;
            sound.play();
            setTimeout(() =>{
                asteriod.remove();
                printMessage("Asteroid Destroyed!");
        }, 1000)
        }
        if (checkOverlap(asteriod2, laser)) {
            const img = document.querySelector("#ELE2 img");
            img.src = img.src.replace("img/asteroid.gif", "img/explosion.gif");
            let sound = new Audio("sound/a-bomb-139689.mp3");
            sound.volume = .2;
            sound.play();
            printMessage("Asteroid Destroyed!");
            setTimeout(() =>{
                asteriod2.remove();

        }, 1000)
        }
    }


function checkOverlap(elem1, elem2) {
    if (elem1 && elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    const overlap = !(rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom);

    return overlap;
    }
}


//////////////////////////////////////////////
/////    UTIL       //////////////////////////
//////////////////////////////////////////////
function updatePlanetCount() {
    
    numPlanetsVisited++;

    const planetCounter = document.getElementById("planetCount");
    const winPlanetCounter = document.querySelector("#win #planetCount");
    winPlanetCounter.innerText = numPlanetsVisited;
    planetCounter.innerText = numPlanetsVisited;
}

function updatePlanetDestroyed() {
    
    numPlanetsDestroyed++;

    const planetCounter = document.getElementById("planetDestroyed");
    const winPlanetCounter = document.querySelector("#win #planetDestroyed");
    winPlanetCounter.innerText = numPlanetsDestroyed;
    planetCounter.innerText = numPlanetsDestroyed;
}

function printMessage(message) {
    const p = document.getElementById("messages");
    p.innerText = message;
}


function GameOver(didWin) {
   if(didWin) {
       const element = document.querySelector("#win");
       element.style.visibility("visable")
   }
    
}
