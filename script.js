const video = document.getElementById("video")

const drawCanvas = document.getElementById("drawCanvas")
const drawCtx = drawCanvas.getContext("2d")

drawCanvas.width = window.innerWidth
drawCanvas.height = window.innerHeight

// THREE
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

const renderer = new THREE.WebGLRenderer({
canvas:document.getElementById("threeCanvas"),
alpha:true
})

renderer.setSize(window.innerWidth,window.innerHeight)

camera.position.z=5

const geometry = new THREE.SphereGeometry(1,32,32)

const material = new THREE.MeshStandardMaterial({
color:0x00ffff
})

const sphere = new THREE.Mesh(geometry,material)

scene.add(sphere)

const light = new THREE.PointLight(0xffffff,1)
light.position.set(10,10,10)
scene.add(light)

// desenho
let lastX=null
let lastY=null

// mediapipe
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

if(results.multiHandLandmarks){

const lm = results.multiHandLandmarks[0]

const finger = lm[8]

const x = finger.x * window.innerWidth
const y = finger.y * window.innerHeight

// mover globo
sphere.position.x = (finger.x - 0.5) * 10
sphere.position.y = -(finger.y - 0.5) * 6

// desenhar
if(lastX && lastY){

drawCtx.beginPath()
drawCtx.moveTo(lastX,lastY)
drawCtx.lineTo(x,y)

drawCtx.strokeStyle="cyan"
drawCtx.lineWidth=5
drawCtx.shadowBlur=20
drawCtx.shadowColor="cyan"

drawCtx.stroke()

}

lastX = x
lastY = y

}else{

lastX=null
lastY=null

}

})

// webcam
navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{

video.srcObject=stream

const cam = new Camera(video,{
onFrame: async ()=>{
await hands.send({image:video})
},
width:640,
height:480
})

cam.start()

})

// animação
function animate(){

requestAnimationFrame(animate)

sphere.rotation.y += 0.01

renderer.render(scene,camera)

}

animate()
