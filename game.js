const suspects=["Janitor","Aunt","Chef","James","Butler","Grandfather"]
const weapons=["knife","candlestick","revolver","wrench","rope"]
const rooms=["kitchen","ballroom","conservatory","library","study"]

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

const board=[]
for(let y=0;y<rows;y++){
  board[y]=[]
  for(let x=0;x<cols;x++){
    board[y][x]=1
  }
}

const player={x:6,y:1}
let stepsLeft=0
//detect by position for this cause only 300 squares tbf
const roomTiles={
  kitchen:      { x: 0,  y: 0,  w: 4, h: 4, type: "kitchen", doors: [{x:3, y:4}] },
  ballroom:     { x: 6,  y: 0,  w: 6, h: 5, type: "room",    doors: [{x:6, y:5}, {x:11, y:5}] },
  conservatory: { x: 13, y: 0,  w: 5, h: 4, type: "study",   doors: [{x:13, y:4}] },
  library:      { x: 0,  y: 11, w: 4, h: 5, type: "library", doors: [{x:3, y:11}] },
  study:        { x: 13, y: 11, w: 5, h: 5, type: "study",   doors: [{x:13, y:11}] }
};

document.getElementById("rolldice").onclick=()=>{
  const d1=Math.floor(Math.random()*6)+1
  const d2=Math.floor(Math.random()*6)+1
  stepsLeft=d1+d2
  document.getElementById("stepsleft").textContent=stepsLeft
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
  if(stepsLeft<=0)return

  let dx=0,dy=0
  if(e.key==="ArrowUp")dy=-1
  if(e.key==="ArrowDown")dy=1
  if(e.key==="ArrowLeft")dx=-1
  if(e.key==="ArrowRight")dx=1

  const nx=player.x+dx
  const ny=player.y+dy

  if(nx>=0&&nx<cols&&ny>=0&&ny<rows&&board[ny][nx]===1){
    player.x=nx
    player.y=ny
    stepsLeft--
    document.getElementById("stepsleft").textContent=stepsLeft
    render()
    checkRoom()
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
      cell.classList.add=("cell")

      let room=RoomAt(x,y)
      if(room){
        cell.classList.add("room")
        cell.classList.add(room.type)
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

  for(const r in roomTiles){
  const t=roomTiles[r]
  for(let y=0;y<t.h;y++){
    for(let x=0;x<t.w;x++){
      const block=document.createElement("div")

      block.className="room"
      block.style.gridColumn=t.x+x+1
      block.style.gridRow=t.y+y+1
      block.style.pointerEvents="none"
      
      gameArea.appendChild(block)
  }}
}}



render()
