
const ROCKET_VELOCITY = 50; 
const OBSTACLES_VELOCITY = 2;
const NUM_OBSTACLES = 10;

let rocket;
let obstacles = [];
let dir = null;
let loop;
let score;


function checkCollision(){
    for(ob of obstacles){
        if( (ob.x<=rocket.x+rocket.width-5)&&(ob.x+ob.width>rocket.x-5) &&
            !((rocket.y+rocket.height<ob.y) || (ob.y+ob.height<rocket.y))    
        ){
            ob.collided=true;
            rocket.collided=true;
            return true;
        }
    }
    
    return false;
}

//rocket movement
function move(){

    if(dir!=null&&Math.abs(dir)>1){
        dir=(Math.abs(dir)-7)*((Math.abs(dir)/dir)); //smoothing the movement...
        rocket.y+=dir;
    }
}

function render(){

    element = document.getElementById(rocket.id)
    element.style.position="absolute";
    element.style.top = rocket.y+"px";
    element.style.left = rocket.x+"px";
    element.style.width = rocket.width+"px";
    element.style.height = rocket.height+"px";
    if(rocket.collided)
        element.src="res/rocket_collided.png";

    for(obstacle of obstacles){
        element = document.getElementById(obstacle.id)
        element.style.position="absolute"
        element.style.top = obstacle.y+"px"
        element.style.left = obstacle.x+"px"
        element.style.width = obstacle.width+"px"
        element.style.height = obstacle.height+"px"
        if(obstacle.collided)
            element.src="res/ob1_collided.png";
    }

    document.getElementById("score").innerText=" "+score;
}

function moveObstacle(){
    for(obstacle of obstacles)
        if(obstacle.x+obstacle.width<0){
            obstacle.x = window.innerWidth;
            obstacle.y = 2*(Math.floor(Math.random() * (window.innerHeight/2)));
            obstacle.collided = false;
            if(obstacle.id=="0")
                score++;
        }else
            obstacle.x-=OBSTACLES_VELOCITY;
}

//MAIN LOOP
function mainLoop(){
    let end = checkCollision();
    move()
    moveObstacle()
    render()

    if(end){
        clearInterval(loop);
        document.getElementById("start").style.display="inline";
    }
}


//all initializations goes here
window.onload=function(){

    //key listeners
    document.body.onkeydown = function(handler){
        switch(handler.key){
            case "ArrowUp":
                if(rocket.y>20)
                    dir = -ROCKET_VELOCITY;
                break;
            case "ArrowDown":
                if(rocket.y<window.innerHeight-120)
                    dir = +ROCKET_VELOCITY;
                break;
        }
        x=1
    }

    //start button
    let start = document.getElementById("start");
    start.onclick = ()=>{
        
        score = 0;

        //removing old images
        while(document.getElementsByTagName("img").length>0)
            document.body.removeChild(document.getElementsByTagName("img")[0])

        //init rocket
        rocket = {
                id: "rocket",
                x:window.innerWidth/8,
                y:window.innerHeight/2,
                width:window.innerWidth/8,
                height:(window.innerWidth/30),
                collided: false
        }
        image=document.createElement("img");
        image.id=rocket.id;
        image.src="res/rocket.gif";
        document.body.appendChild(image);


        //init obstacles
        obstacles = []
        for(let i=0; i<NUM_OBSTACLES; i++){

            let size = Math.floor(Math.random() * 100)+70;
            obstacles.push({
                id:i,
                x:(Math.floor(Math.random() * window.innerWidth))+window.innerWidth,
                y:(Math.floor(Math.random() * (window.innerHeight))),
                width:size,
                height:size,
                collided:false
            })
            image = document.createElement("img");
            image.src="res/obstacle1.png";
            image.id=i;
            document.body.appendChild(image);
        }


        //starting the loop
        loop = setInterval(mainLoop, 3);

        //disabling start button
        start.style.display="none";
    }
}