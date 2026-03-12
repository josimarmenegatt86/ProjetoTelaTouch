const video = document.getElementById("video")

// THREE JS
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

// Globo 3D
const geometry = new THREE.SphereGeometry(1,32,32)

const material = new THREE.MeshStandardMaterial({
color:0x00ffff
})

const sphere = new THREE.Mesh(geometry,material)

scene.add(sphere)

// luz
const light = new THREE.PointLight(0xffffff,1)
light.position.set(10,10,10)
scene.add(light)

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

const finger = results.multiHandLandmarks[0][8]

// posição do dedo
const x = (finger.x - 0.5) * 10
const y = -(finger.y - 0.5) * 6

sphere.position.x = x
sphere.position.y = y

}

})

// iniciar webcam
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
