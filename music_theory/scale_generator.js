let KeyCountWhite = 22;
let KeyCountBlack = 15;
let KeyCount = 37;

let CanvasHeight = 150;
let CanvasWidth = 660;

let KeyWidthWhite = CanvasWidth / KeyCountWhite;
let KeyHeightWhite = CanvasHeight;
let KeyWidthBlack = KeyWidthWhite * .5;
let KeyHeightBlack = CanvasHeight * (.66);

let KeyLabels = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let LabelStandard = ["C", "D", "E", "F", "G", "A", "B"]
let LabelSharp = ["B#", "C#", "D#", "E#", "F#", "G#", "A#"]
let LabelFlat = ["D♭", "E♭", "F♭", "G♭", "A♭", "B♭", "C♭"]

let KeyColors = "wbwbwwbwbwbw"
let KeyWhite = []
let KeyBlack = []
let KeyPos = [];
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

let ScaleKeys = [ScaleKey];
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


function Draw()
{
    if (typeof ScalePattern == 'undefined')
    {
        alert("Required variables are not defined!\nPlease define them and try again.");
        return;
    }
    // Scale
    var ctx = document.getElementById("scale").getContext("2d");
    DrawKeyboard.call(this, ctx);
    DrawScaleLabels.call(this, ctx)
    // Chord 1
    var ctx = document.getElementById("chord1").getContext("2d");
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [1,3,5,7])
    // Chord 2
    var ctx = document.getElementById("chord2").getContext("2d");
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [2,4,6,8])
    // Chord 3
    var ctx = document.getElementById("chord3").getContext("2d");
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [3,5,7,9])
    // Chord 4
    var ctx = document.getElementById("chord4").getContext("2d");
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [4,6,8,10])
    // Chord 5
    var ctx = document.getElementById("chord5").getContext("2d");
    DrawKeyboard.call(this, ctx);
    DrawChordLabels.call(this, ctx, [5,7,9,11])
    // Chord 6
    var ctx = document.getElementById("chord6").getContext("2d");
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
    ctx.fillStyle = "#888888";
    for (let index of ScaleKeys)
    {
        if (KeyColors[index % 12] == "w")  // Drawing white label
        {
        ctx.font = "20px serif";
        ctx.fillText(KeyLabels[index % 12], KeyPos[index] + (KeyWidthWhite/4), CanvasHeight - 10);
        }
        else
        {
        ctx.font = "16px serif";
        ctx.fillText(KeyLabels[index % 12], KeyPos[index] - 2, KeyHeightBlack - 10);
        }
    }
}

function DrawChordLabels(ctx, keyIndexes)
{
    ctx.fillStyle = "#888888";
    for (let index of keyIndexes)
    {
        if (KeyColors[ScaleKeys[index] % 12] == "w")
        {
        ctx.font = "20px serif";
        ctx.fillText(KeyLabels[ScaleKeys[index] % 12], KeyPos[ScaleKeys[index]] + (KeyWidthWhite/4), CanvasHeight - 10)
        }
        else
        {
        ctx.font = "16px serif";
        ctx.fillText(KeyLabels[ScaleKeys[index] % 12], KeyPos[ScaleKeys[index]] - 2, KeyHeightBlack - 10)
        }
    }
}