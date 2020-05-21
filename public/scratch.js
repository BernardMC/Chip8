console.log("Hello from scratch 3")

const DoIt = () => {
    var img1 = document.getElementById('myImg1');
      var img2 = document.getElementById('myImg2');
      var myCanvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");

      // width and height
      var w = img1.width;
      var h = img1.height;

      myCanvas.width = w;
      myCanvas.height = h;

      var pixels = 4 * w * h;
      ctx.drawImage(myImg1, 0, 0, w, h, 0, 0, 900, 900);

      var image1 = ctx.getImageData(0, 0, w, h);
      var imageData1 = image1.data;
      ctx.drawImage(myImg2, 0, 0)
      var image2 = ctx.getImageData(0, 0, w, h);
      var imageData2 = image2.data
      while (pixels--) {
         imageData1[pixels] = imageData1[pixels] * 0.5 + imageData2[pixels] * 0.5;
      }
      image1.data = imageData1;
      ctx.putImageData(image1, 0, 0);
}