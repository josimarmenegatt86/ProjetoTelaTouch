const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let lastX = null
let lastY = null

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

 canvas.width = video.videoWidth
 canvas.height = video.videoHeight

 ctx.drawImage(results.image,0,0,canvas.width,canvas.height)

 if(results.multiHandLandmarks){

 const landmarks = results.multiHandLandmarks[0]

 const indexFinger = landmarks[8]

 const x = indexFinger.x * canvas.width
 const y = indexFinger.y * canvas.height

 if(lastX && lastY){

 ctx.beginPath()
 ctx.moveTo(lastX,lastY)
 ctx.lineTo(x,y)
 ctx.strokeStyle="cyan"
 ctx.lineWidth=5
 ctx.stroke()

 }

 lastX = x
 lastY = y

 }else{

 lastX=null
 lastY=null

 }

})

const camera = new Camera(video,{
 onFrame: async ()=>{
 await hands.send({image:video})
 },
 width:640,
 height:480
})

camera.start()
