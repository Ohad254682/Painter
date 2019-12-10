var gCanvas;
var gCtx;
var gCurrShape = 'rect';
var gCurrColor = 'black';
var gIsPainting = false;
var gPrevX;
var gPrevY;
var gDevelopmentEvent = [];
var gCanDim;

function init() {

    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    gCanvas.width = document.body.clientWidth;
    gCanvas.height = document.body.clientHeight;
    gCanDim = gCanvas.getBoundingClientRect();
    gCanvas.addEventListener("touchstart", onDownPaintingMobile);
    gCanvas.addEventListener("touchmove", handleMove);
    gCanvas.addEventListener("touchend", function(){
        gIsPainting = false;
    });
    window.addEventListener("mouseup", function () {
        gIsPainting = false;
    })
}

function handleMove(ev) {
    ev.preventDefault();
    drawMobile(ev);
}

function onDownPaintingMobile(ev) {
    gIsPainting = true;
    gPrevX = ev.targetTouches[0].clientX - gCanDim.left;
    gPrevY = ev.targetTouches[0].clientY - gCanDim.top;
    drawMobile(ev);
}

function drawMobile(ev) {
    gDevelopmentEvent.push(ev);
    if (gIsPainting) {
        gCtx.save();
        const offsetX = ev.targetTouches[0].clientX - gCanDim.left;
        const offsetY = ev.targetTouches[0].clientY - gCanDim.top;
        switch (gCurrShape) {
            case 'triangle':
                drawTriangle(offsetX, offsetY)
                break;
            case 'rect':
                drawRect(offsetX, offsetY)
                break;
            case 'circle':
                drawCircle(offsetX, offsetY)
                break;

            case 'line':
                drawLine(gPrevX, gPrevY, offsetX, offsetY)
                gPrevX = ev.targetTouches[0].clientX - gCanDim.left;
                gPrevY = ev.targetTouches[0].clientY - gCanDim.top;
                break;
        }
        gCtx.restore();
    }
}

function onDownPainting(ev) {
    gIsPainting = true;
    gPrevX = ev.offsetX;
    gPrevY = ev.offsetY;
    draw(ev);
}



function draw(ev) {
    if (gIsPainting) {
        gCtx.save();
        const offsetX = ev.offsetX
        const offsetY = ev.offsetY
        switch (gCurrShape) {
            case 'triangle':
                drawTriangle(offsetX, offsetY)
                break;
            case 'rect':
                drawRect(offsetX, offsetY)
                break;
            case 'circle':
                drawCircle(offsetX, offsetY)
                break;

            case 'line':
                drawLine(gPrevX, gPrevY, offsetX, offsetY)
                gPrevX = offsetX;
                gPrevY = offsetY;
                break;
        }
        gCtx.restore();
    }
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth - 100
    gCanvas.height = elContainer.offsetHeight - 100
}

function setShape() {
    var shape = document.querySelector('select').value;
    gCurrShape = shape;
}

function setColor() {
    var color = document.querySelector('input[type="color"]').value;
    gCurrColor = color;
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function drawTriangle(x, y) {
    gCtx.beginPath();
    gCtx.moveTo(x, y);
    gCtx.lineTo(x - 50, y - 50);
    gCtx.lineTo(x + 50, y - 50);
    gCtx.closePath();
    gCtx.strokeStyle = gCurrColor;
    gCtx.fillStyle = gCurrColor;
    gCtx.stroke();
    gCtx.fill();
}

function drawCircle(x, y) {
    gCtx.beginPath();
    gCtx.arc(x, y, 10, 0, Math.PI * 2);
    gCtx.strokeStyle = gCurrColor;
    gCtx.fillStyle = gCurrColor;
    gCtx.stroke();
    gCtx.fill();
}

function drawRect(x, y) {
    gCtx.beginPath();
    gCtx.rect(x, y, 50, 50);
    gCtx.strokeStyle = gCurrColor;
    gCtx.fillStyle = gCurrColor;
    gCtx.fillRect(x, y, 50, 50);
    gCtx.stroke();
    gCtx.closePath();
}

function drawLine(startX, startY, endX, endY) {
    gCtx.beginPath();
    gCtx.moveTo(startX, startY);
    gCtx.lineTo(endX, endY);
    gCtx.closePath();
    gCtx.strokeStyle = gCurrColor;
    gCtx.stroke();
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
}


// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}