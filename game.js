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
  kitchen:{x:0,y:0,w:4,h:4},
  ballroom:{x:6,y:0,w:6,h:5},
  conservatory:{x:13,y:0,w:5,h:4},
  library:{x:0,y:11,w:4,h:5},
  study:{x:13,y:11,w:5,h:5}
}

document.getElementById("rolldice").onclick=()=>{
  const d1=Math.floor(Math.random()*6)+1
  const d2=Math.floor(Math.random()*6)+1
  stepsLeft=d1+d2
  document.getElementById("stepsleft").textContent=stepsLeft
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
  gameArea.style.position="relative"

  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const cell=document.createElement("div")
      cell.className="cell"
      if(player.x===x&&player.y===y){
        cell.classList.add("player")
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

