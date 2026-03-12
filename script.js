
const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  }
})

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
})

hands.onResults(results => {

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  ctx.save()
  ctx.clearRect(0,0,canvas.width,canvas.height)

  ctx.drawImage(results.image,0,0,canvas.width,canvas.height)

  if(results.multiHandLandmarks){

    for(const landmarks of results.multiHandLandmarks){

      drawConnectors(ctx, landmarks, HAND_CONNECTIONS,
        {color:"#00FFFF", lineWidth:4})

      drawLandmarks(ctx, landmarks,
        {color:"#FF0000", lineWidth:2})

    }

  }

  ctx.restore()

})

const camera = new Camera(video,{
  onFrame: async () => {
    await hands.send({image: video})
  },
  width:640,
  height:480
})

camera.start()
