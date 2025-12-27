const suspects=["Janitor","Aunt","Chef","James","Butler","Grandfather"]
const weapons=["knife","candlestick","revolver","wrench","rope"]
const rooms=["kitchen","ballroom","conservatory","library","study"]
//random pick function
function randomFrom(arr){
  return arr[Math.floor(Math.random()*arr.length)]
}

const answer={
  suspect: randomFrom(suspects),
  weapons: randomFrom(weapons),
  room: randomFrom(rooms)
}

const rows=18
const cols=18
const gameArea=document.getElementById("game")
//walls

const board=[]
for(let y=0;y<rows;y++){
  board[y]=[]
  for(let x=0;x<cols;x++){
    board[y][x]=1
  }
}
//put guy in yhr middle
const player={x:9,y:9}
let stepsleft=0
//detect by position for this cause only 300 squares tbf
//complete rwork for spots array to each room and then give it an x and y
const roomTiles = {
  kitchen: { 
    x: 0, y: 0, w: 4, h: 4, type: "kitchen", doors: [{x:3, y:4}],
    spots: [{x:1, y:1, name:"bin"}, {x:2, y:3, name:"rug"}, {x:0, y:2, name:"drawer"}] 
  },
  ballroom: { 
    x: 6, y: 0, w: 6, h: 5, type: "room", doors: [{x:6, y:5}, {x:11, y:5}],
    spots: [{x:7, y:1, name:"bin"}, {x:10, y:3, name:"rug"}, {x:8, y:0, name:"drawer"}]
  },
  conservatory: { 
    x: 13, y: 0, w: 5, h: 4, type: "study", doors: [{x:13, y:4}],
    spots: [{x:14, y:1, name:"bin"}, {x:17, y:1, name:"rug"}, {x:15, y:3, name:"drawer"}]
  },
  library: { 
    x: 0, y: 11, w: 4, h: 5, type: "library", doors: [{x:3, y:11}],
    spots: [{x:1, y:12, name:"bin"}, {x:2, y:14, name:"rug"}, {x:1, y:15, name:"drawer"}]
  },
  study: { 
    x: 13, y: 11, w: 5, h: 5, type: "study", doors: [{x:13, y:11}],
    spots: [{x:14, y:12, name:"bin"}, {x:17, y:12, name:"rug"}, {x:15, y:15, name:"drawer"}]
  }
};
// This then picks which of the 3 items has the clue
const winningSpots = {};
for (let room in roomTiles) {
  let s = roomTiles[room].spots;
  winningSpots[room] = s[Math.floor(Math.random() * s.length)].name;
}
document.getElementById("rolldice").onclick=()=>{
  const d1=Math.floor(Math.random()*6)+1
  const d2=Math.floor(Math.random()*6)+1
  stepsleft=d1+d2
  document.getElementById("stepsleft").textContent=stepsleft  
}
 
//simeple function to find room by player position
function RoomAt(x, y) {
  for (let key in roomTiles) {
    let r = roomTiles[key];
    if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) {
      return r;
    }
  }

  return null;
}

document.addEventListener("keydown",e=>{
  if(stepsleft<=0)return

  let dx=0,dy=0
  if(e.key==="ArrowUp")dy=-1
  if(e.key==="ArrowDown")dy=1
  if(e.key==="ArrowLeft")dx=-1
  if(e.key==="ArrowRight")dx=1

  if(dx === 0 && dy === 0) return;

  let nx=player.x+dx
  let ny=player.y+dy

  if(caniwalk(nx,ny)){
    let wasInRoom = RoomAt(player.x, player.y);
    player.x=nx
    player.y=ny
    stepsleft--
    document.getElementById("stepsleft").textContent=stepsleft

    let nowInRoom = RoomAt(nx, ny);
    render()
    
    if(nowInRoom && !wasInRoom){
        console.log("Entered a room"); 
        stepsleft = 0; 
        document.getElementById("stepsleft").textContent = stepsleft;
        // Small delay to ensure render completes before alert
        //beause i thnk it was causing to freeze
        setTimeout(() => {
          alert("You entered the " + nowInRoom.type + ". Search the Room for clues.");
        }, 100);
    }
  }
})

function checkRoom(){
  for(const r in roomTiles){
    const t=roomTiles[r]
    if(//detect the bigger room update
      player.x>=t.x &&
      player.x<t.x+t.w &&
      player.y>=t.y &&
      player.y<t.y+t.h
    ){
      console.log("in room:",r)
      return
    }
  }
}

function render(){
  gameArea.innerHTML=""

  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      let cell=document.createElement("div")
      cell.className = "cell";

      let room=RoomAt(x,y)
      if(room){
        cell.classList.add("room")
        cell.classList.add(room.type)
        
        room.spots.forEach(spot => {
          if (spot.x === x && spot.y === y) {
            let item = document.createElement("div");
            item.innerHTML = "🔍"; // The clickable icon
            item.style.cursor = "pointer";
            
            item.onclick = function() {
              if (player.x === x && player.y === y) {
                if (winningSpots[room.type] === spot.name) {
                  alert("You found a clue in the " + spot.name + "!");
                } else {
                  alert("Nothing inside the " + spot.name + ".");
                }
              } else {
                alert("Walk over to the " + spot.name + " to search it.");
              }
            };
            cell.appendChild(item);
          }
        });
      }else{
        cell.classList.add("floor")
      }
  
      //player
      if(player.x===x&&player.y===y){
        let token = document.createElement("div");
        token.style.width = "20px";
        token.style.height = "20px";
        token.style.background = "red";
        token.style.borderRadius = "50%";
        token.style.margin = "5px";
        token.style.boxShadow = "0 0 5px #000";
        cell.appendChild(token);
      }
      gameArea.appendChild(cell)
    }
  }
}

//now make it so they can only enter through door
function caniwalk(targetX,targetY){
  if (targetX < 0 || targetX >= cols || targetY < 0 || targetY >= rows) return false;

  //room walls
  let currentRoom = RoomAt(player.x, player.y);
  let targetRoom = RoomAt(targetX, targetY);
  
  if (!currentRoom && targetRoom) {
    // stepping on a door square to enter
    return targetRoom.doors.some(door => door.x === targetX && door.y === targetY);
  }

  if (currentRoom && !targetRoom) {
    return currentRoom.doors.some(door => door.x === player.x && door.y === player.y);
  }

  //both floor or both room
  return true;
}

//final guess on button
document.getElementById("solvebutton").onclick= function() {
    let gSuspect = prompt("Who is the killer?");
    let gWeapon = prompt("What was the weapon?");
    let gRoom = prompt("In which room?");

    if (!gSuspect || !gWeapon || !gRoom) return;

    let isCorrect =
      gSuspect.toLowerCase() === answer.suspect.toLowerCase() &&
      gWeapon.toLowerCase() === answer.weapons.toLowerCase() &&
      gRoom.toLowerCase() === answer.room.toLowerCase();

    if (isCorrect) {
      alert("Congratulations You solved the mystery!");
      location.reload();
    } else {
      alert(`Wrong!! The correct answer was: ${answer.suspect} with the ${answer.weapons} in the ${answer.room}.`
      );
    }
}
render()
