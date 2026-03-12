const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let trail=[]

const hands = new Hands({
locateFile: file =>
`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
})

hands.setOptions({
maxNumHands:1,
minDetectionConfidence:0.7,
minTrackingConfidence:0.7
})

hands.onResults(results=>{

canvas.width = results.image.width
canvas.height = results.image.height

ctx.drawImage(results.image,0,0)

if(results.multiHandLandmarks){

const finger = results.multiHandLandmarks[0][8]

const x = finger.x * canvas.width
const y = finger.y * canvas.height

trail.push({x,y})

if(trail.length>30){
trail.shift()
}

ctx.lineJoin="round"
ctx.lineCap="round"

for(let i=1;i<trail.length;i++){

ctx.beginPath()

ctx.moveTo(trail[i-1].x,trail[i-1].y)
ctx.lineTo(trail[i].x,trail[i].y)

ctx.strokeStyle="cyan"
ctx.lineWidth=8

ctx.shadowBlur=20
ctx.shadowColor="cyan"

ctx.stroke()

}

}

})

navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{

video.srcObject=stream

const camera=new Camera(video,{
onFrame: async ()=>{
await hands.send({image:video})
},
width:640,
height:480
})

camera.start()

})