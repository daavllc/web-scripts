let KeyCountWhite = 22;
let KeyCountBlack = 15;
let KeyCount = 37;

let CanvasHeight = 100;
let CanvasWidth = 500;

let KeyLabels = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let LabelStandard = ["C", "D", "E", "F", "G", "A", "B"]
let LabelSharp = ["B#", "C#", "D#", "E#", "F#", "G#", "A#"]
let LabelFlat = ["D♭", "E♭", "F♭", "G♭", "A♭", "B♭", "C♭"]

let KeyColors = "wbwbwwbwbwbw"

// Sliders
let widthMin = "420";
let widthMax = "1440";
var width_slider = document.getElementById("width_slider");
width_slider.setAttribute("min", widthMin);
width_slider.setAttribute("max", widthMax);
width_slider.setAttribute("value", CanvasWidth.toString());

width_slider.oninput = function()
{
    CanvasWidth = this.value;
    Draw.call(this);
}

let heightMin = "50";
let heightMax = "200";
var height_slider = document.getElementById("height_slider");
height_slider.setAttribute("min", heightMin);
height_slider.setAttribute("max", heightMax);
height_slider.setAttribute("value", CanvasHeight.toString());

height_slider.oninput = function()
{
    CanvasHeight = this.value;
    Draw.call(this);
}

function Initialize()
{
    KeyWidthWhite = CanvasWidth / KeyCountWhite;
    KeyHeightWhite = CanvasHeight;
    KeyWidthBlack = KeyWidthWhite * .5;
    KeyHeightBlack = CanvasHeight * (.66);

    KeyWhite = []
    KeyBlack = []
    KeyPos = [];
    for (let i = 0; i < KeyCount; i++)
    {
        if (KeyColors[i % 12] == "w")
        {
            KeyPos.push(KeyWidthWhite * KeyWhite.length)
            KeyWhite.push(i)
        }
        else
        {
            KeyPos.push(KeyPos[i - 1] + (KeyWidthWhite - KeyWidthBlack/2))
            KeyBlack.push(i)
        }
    }

    ScaleKeys = [ScaleKey];
    for (let i = 1; i < 15; i++)
    {
        if (ScalePattern[(i - 1) % 7] == "f")
        {
            ScaleKeys.push(ScaleKeys[i-1] + 2)
        }
        else
        {
            ScaleKeys.push(ScaleKeys[i-1] + 1)
        }
    }
}

function Draw()
{
    if (typeof ScalePattern == 'undefined')
    {
        alert("Required variables are not defined!\nPlease define them and try again.");
        return;
    }
    Initialize.call(this);
    // Scale
    var canvas = document.getElementById("scale");
    InitializeCanvas.call(this, canvas);
    ctx = canvas.getContext("2d")
    DrawKeyboard.call(this, ctx);
    DrawScaleLabels.call(this, ctx)
    // Chord 1
    var canvas = document.getElementById("chord1");
    InitializeCanvas.call(this, canvas);
    ctx = canvas.getContext("2d")
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [1,3,5,7])
    // Chord 2
    var canvas = document.getElementById("chord2");
    InitializeCanvas.call(this, canvas);
    ctx = canvas.getContext("2d")
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [2,4,6,8])
    // Chord 3
    var canvas = document.getElementById("chord3");
    InitializeCanvas.call(this, canvas);
    ctx = canvas.getContext("2d")
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [3,5,7,9])
    // Chord 4
    var canvas = document.getElementById("chord4");
    InitializeCanvas.call(this, canvas);
    ctx = canvas.getContext("2d")
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [4,6,8,10])
    // Chord 5
    var canvas = document.getElementById("chord5");
    InitializeCanvas.call(this, canvas);
    ctx = canvas.getContext("2d")
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [5,7,9,11])
    // Chord 6
    var canvas = document.getElementById("chord6");
    InitializeCanvas.call(this, canvas);
    ctx = canvas.getContext("2d")
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [6,8,10,12])
}

function DrawKeyboard(ctx)
{
    // White keys
    ctx.fillStyle = "#FFFFFF";
    for (let index of KeyWhite)
    {
        ctx.fillRect(KeyPos[index], 0, KeyWidthWhite, KeyHeightWhite);
    }

    // Key border
    ctx.fillStyle = "#000000"
    for (let index of KeyWhite)
    {
        ctx.fillRect(KeyPos[index] - 1, 0, 2, CanvasHeight);
    }

    // Black keys
    ctx.fillStyle = "#222222";
    for (let index of KeyBlack)
    {
        ctx.fillRect(KeyPos[index], 0, KeyWidthBlack, KeyHeightBlack);
    }
}

function DrawScaleLabels(ctx)
{
    ctx.font = "bold 16px arial";
    ctx.fillStyle = "#66AAEE";
    ctx.textAlign = "center";
    for (let index of ScaleKeys)
    {
        if (KeyColors[index % 12] == "w")  // Drawing white key label
        {
        ctx.fillText(KeyLabels[index % 12], KeyPos[index] + (KeyWidthWhite/2), CanvasHeight - 5);
        }
        else
        {
        ctx.fillText(KeyLabels[index % 12], KeyPos[index] + (KeyWidthBlack/2), KeyHeightBlack - 5);
        }
    }
}

function DrawChordLabels(ctx, keyIndexes)
{
    ctx.font = "bold 16px arial";
    ctx.fillStyle = "#66AAEE";
    ctx.textAlign = "center";
    for (let index of keyIndexes)
    {
        if (KeyColors[ScaleKeys[index] % 12] == "w")
        {
        
        ctx.fillText(KeyLabels[ScaleKeys[index] % 12], KeyPos[ScaleKeys[index]] + (KeyWidthWhite/2), CanvasHeight - 5)
        }
        else
        {
        ctx.fillText(KeyLabels[ScaleKeys[index] % 12], KeyPos[ScaleKeys[index]] + (KeyWidthBlack/2), KeyHeightBlack - 5)
        }
    }
}

function InitializeCanvas(canvas)
{
    canvas.setAttribute("width", CanvasWidth.toString())
    canvas.setAttribute("height", CanvasHeight.toString())
    canvas.setAttribute("style", "border:1px solid #c3c3c3;")
}