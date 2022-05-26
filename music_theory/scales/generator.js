function Initialize()
{
    // First, check if the ScalePattern and ScaleRoot are correct
    if (typeof ScalePattern == 'undefined')
    {
        alert("Required variables are not defined!\nPlease define them and try again.");
        return;
    }
    else if (ScalePattern.length != 7)
    {
        alert("Scale pattern must be 7 characters.\nPlease correct this and try again.");
        return;
    }
    else if (ScaleRoot < 0 || ScaleRoot > 11)
    {
        alert("The root key must be between 0 and 11.\nPlease correct this and try again.");
        return;
    }
    else
    {
        let total = 0
        for (let value of ScalePattern)
        {
            total += parseInt(value, 10);
        }
        if (total != 12)
        {
            alert("Invalid ScalePattern, total must be 12.\nPlease correct this and try again.");
            return;
        }
    }

    Manager.Initialize(ScalePattern, ScaleRoot);
}

class _Manager
{
    Initialize(ScalePattern, ScaleRoot)
    {
        this.ScalePattern = ScalePattern;
        this.ScaleRoot = ScaleRoot;

        this.LabelFont = "bold 16px arial";
        this.LabelColor = "#66AAEE";
        this.InitElements();

        this.Instrument = undefined;
        this.InstrumentElements = [];
        this.InstrumentSettings = [];

        let instrument_selector = document.getElementById("select_instrument");

        instrument_selector.oninput = function()
        {
            Manager.Render(this.value);
        }
        Manager.Render(instrument_selector.value);
    }

    Render(instrument)
    {
        if (this.Instrument != undefined)
        {
            while (this.InstrumentElements.length > 0)
            {
                let rem = document.getElementById(this.InstrumentElements.pop());
                rem.remove();
            }
        }
        switch(instrument)
        {
            case "piano":
                this.Instrument = new Keyboard();
                break;
            case "guitar":
                //inst = new Guitar(ScalePattern, ScaleRoot);
                break;
        }
        this.Instrument.Initialize(this.ScalePattern, this.ScaleRoot);
        this.Instrument.Resize();
        this.Instrument.Draw();
    }

    CreateCanvas(id, heading = undefined)
    {
        if (this.InstrumentElements.includes(id))
        {
            return document.getElementById(id);
        }
        let html = "";
        if (heading != undefined)
        {
            html += `<h3 id="` + id + `_heading">` + heading + `</h3>\n`
            this.InstrumentElements.push(id + "_heading");
        }
        html += `<div class="` + id + "_container" + `">\n`
        this.InstrumentElements.push(id + "_container")

        html += `  <canvas id="` + id + `">Your browser does not support the canvas element.</canvas>\n</div>`;
        this.InstrumentElements.push(id)
        this.GeneratorContainer.insertAdjacentHTML('beforeend', html);
        return document.getElementById(id);
    }

    CreateSlider(id, min, max, value, step = 1, heading = undefined)
    {
        if (this.InstrumentSettings.includes("setting_" + id + "_slider"))
        {
            return document.getElementById(id);
        }
        let html = "";
        if (heading != undefined)
        {
            html += `<p id="setting_` + id + `_heading">` + heading + `</p>\n`
            this.InstrumentSettings.push("setting_" + id + "_heading")
        }
        html += `<input id="setting_` + id + `_slider" type="range" class="slider" min="` + min + `" max="` + max + `" value="` + value +`" step="` + step +`"></input>`
        this.InstrumentSettings.push("setting_" + id + "_slider")
        this.SettingsContainer.insertAdjacentHTML('beforeend', html)
        return document.getElementById("setting_" + id + "_slider")
    }

    InitializeCanvas(canvas, width, height, style = "border:1px solid #c3c3c3;")
    {
        let parent = canvas.parentElement;
        parent.style.display = "flex";
        parent.style.alignItems = "center";
        parent.style.justifyContent = "center";
        parent.style.position = "relative";

        canvas.setAttribute("width", width.toString());
        canvas.setAttribute("height", height.toString());
        canvas.setAttribute("style", style);
    }

    InitElements()
    {
        // Defines HTML elements
        this.HeaderContainter = document.getElementById('header_container');
        this.HeaderContainter.insertAdjacentHTML('beforeend', `
<div class="select_container">
  <h2 id="select_heading">Instrument</h2>
  <select id="select_instrument" class="combo">
    <option value="piano" selected>Piano</option>
  </select>
  <button onclick="Manager.ToggleSettings();">Settings</button>
</div>`
        );
        this.SettingsContainer = document.getElementById('settings_container');
        this.SettingsContainer.style.display = "none";
        this.SettingsContainer.style.alignItems = "center";
        this.SettingsContainer.style.justifyContent = "center";

        this.GeneratorContainer = document.getElementById('generator_container');
        this.StyleContainer = document.getElementById('style');
    }

    ToggleSettings()
    {
        if (this.SettingsContainer.style.display === "none")
        {
            this.SettingsContainer.style.display = "block";
        }
        else
        {
            this.SettingsContainer.style.display = "none";
        }
    }
}
const Manager = new _Manager();
//////////////////////////////////////////////////
//             Instruments                      //
//////////////////////////////////////////////////
// ------ Keyboard ------- //
class Keyboard
{
    Initialize(ScalePattern, ScaleRoot)
    {
        // --- Defines --- //
        this.KeyColors = "wbwbwwbwbwbw" // Starting at C
        this.ScaleStart = 0;
        this.KeyWhiteColor = "#FFFFFF";
        this.KeyBlackColor = "#222222";
        this.KeySeparatorColor = "#000000";

        this.KeyboardHeight = 100;
        this.KeyboardWidth = 440;

        // --- Scale Keys --- //
        this.ScaleKeys = [ScaleRoot];
        for (let i = 1; i < 7; i++)
        {
            this.ScaleKeys.push((this.ScaleKeys[i - 1] + parseInt(ScalePattern[(i - 1) % 7])) % 12)
        }
        console.log(this.ScaleKeys);

        // --- Scale Labels --- //
        let KeyLabels = [ ["C", "B#"], ["C#", "D♭"], ["D"], ["D#", "E♭"], ["E", "F♭"], ["F", "E#"], ["F#", "G♭"], ["G"], ["G#", "A♭"], ["A"], ["A#", "B♭"], ["B", "C♭"] ]
        this.ScaleLabels = [KeyLabels[this.ScaleKeys[0]][0]];
        for (let i = 1; i < 7; i++)
        {
            let label = KeyLabels[this.ScaleKeys[i] % 12][0];
            if (KeyLabels[this.ScaleKeys[i] % 12].length > 1)
            {
                // If next label letter equals current label letter
                if (KeyLabels[(this.ScaleKeys[(i + 1) % 7]) % 12][0][0] == label[0])
                {
                    // If previous label letter does NOT equal current label letter, rename it
                    if (KeyLabels[(this.ScaleKeys[i - 1]) % 12][0][0] != label[0])
                    {
                        label = KeyLabels[this.ScaleKeys[i] % 12][1];
                    }
                }
                else // If next label label letter does NOT equal current label letter
                {
                    // If previous label letter equals current label letter, rename it
                    if (KeyLabels[(this.ScaleKeys[i - 1]) % 12][0][0] == label[0])
                    {
                        label = KeyLabels[this.ScaleKeys[i] % 12][1];
                    }
                }
            }
            
            this.ScaleLabels.push(label);
        }
        console.log(this.ScaleLabels);

        this.ScaleColors = "";
        for (let i = 0; i < 7; i++)
        {
            this.ScaleColors += this.KeyColors[this.ScaleKeys[i] % 12];
        }
        console.log(this.ScaleColors);

        this.CountKeys();

        // Sliders
        Manager.CreateSlider("width", 400, 1000, this.KeyboardWidth, 1, "Width").oninput = function()
        {
            Manager.Instrument.KeyboardWidth = parseInt(this.value, 10);
            Manager.Instrument.Resize();
            Manager.Instrument.Draw();
        }
        Manager.CreateSlider("height", 70, 200, this.KeyboardHeight, 1, "Height").oninput = function()
        {
            Manager.Instrument.KeyboardHeight = parseInt(this.value, 10);
            Manager.Instrument.Resize();
            Manager.Instrument.Draw();
        }
    }

    CountKeys()
    {
        this.Octaves = 3;
        this.KeyCountWhite = (7 * this.Octaves) + 1;
        this.KeyCountBlack = 5 * this.Octaves;
        this.KeyCount = (this.Octaves * 12) + 1;
    }

    Resize()
    {
        this.KeyWidthWhite = this.KeyboardWidth / this.KeyCountWhite;
        this.KeyHeightWhite = this.KeyboardHeight;
        this.KeyWidthBlack = this.KeyWidthWhite * .5;
        this.KeyHeightBlack = this.KeyboardHeight * (.66);

        this.KeyWhite = []
        this.KeyBlack = []
        this.KeyPos = [];
        for (let i = 0; i < this.KeyCount; i++)
        {
            if (this.KeyColors[i % 12] == "w") // White key
            {
                this.KeyPos.push(this.KeyWidthWhite * this.KeyWhite.length)
                this.KeyWhite.push(i)
            }
            else
            {
                this.KeyPos.push(this.KeyPos[i - 1] + (this.KeyWidthWhite - this.KeyWidthBlack/2))
                this.KeyBlack.push(i)
            }
        }
    }

    Draw()
    {
        var canvas = undefined;
        var ctx = undefined;
        // Scale
        canvas = Manager.CreateCanvas("scale", "Scale");
        Manager.InitializeCanvas(canvas, this.KeyboardWidth, this.KeyboardHeight);
        ctx = canvas.getContext("2d");
        this.DrawKeyboard(ctx, 1);

        // Triads
        canvas = Manager.CreateCanvas("triads", "Triads");
        Manager.InitializeCanvas(canvas, this.KeyboardWidth + this.KeyWidthWhite, this.KeyboardHeight * 7);
        ctx = canvas.getContext("2d");
        this.DrawChords(ctx, 7);
        this.DrawChordLabels(ctx, [[0,2,4,6], [1,3,5,7], [2,4,6,8], [3,5,7,9], [4,6,8,10], [5,7,9,11], [6,8,10,12]])

        // Chords
        canvas = Manager.CreateCanvas("chords", "Chords");
        Manager.InitializeCanvas(canvas, this.KeyboardWidth + this.KeyWidthWhite, this.KeyboardHeight * 7);
        ctx = canvas.getContext("2d");
        this.DrawChords(ctx, 7);
        this.DrawChordLabels(ctx, [[0,3,6,9], [1,4,7,10], [2,5,8,11], [3,6,9,12], [4,7,10,13], [5,8,11,14], [6,9,12,15]])
    }

    DrawKeyboard(ctx)
    {
        // White keys
        ctx.fillStyle = this.KeyWhiteColor;
        for (let index of this.KeyWhite)
        {
            ctx.fillRect(this.KeyPos[index], 0, this.KeyWidthWhite, this.KeyHeightWhite);
        }

        // Key separator
        ctx.fillStyle = this.KeySeparatorColor;
        for (let index of this.KeyWhite)
        {
            ctx.fillRect(this.KeyPos[index] - 1, 0, 2, this.KeyboardHeight);
        }

        // Black keys
        ctx.fillStyle = this.KeyBlackColor;
        for (let index of this.KeyBlack)
        {
            ctx.fillRect(this.KeyPos[index], 0, this.KeyWidthBlack, this.KeyHeightBlack);
        }

        // Labels
        let counter = 0; // Counts how many time scale keys have been passed through
        for (let i = 0; i < this.KeyCount; i++)
        {
            if (this.ScaleKeys[counter % 7] == i % 12)
            {
                if (this.ScaleColors[counter % 7] == "w")
                {
                    this.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyPos[i] + (this.KeyWidthWhite/2), this.KeyboardHeight - 5)
                }
                else
                {
                    this.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyPos[i] + (this.KeyWidthBlack/2), this.KeyHeightBlack - 5)
                }
                counter++;
            }
        }
    }

    DrawChords(ctx, count)
    {
        ctx.font = Manager.LabelFont;
        ctx.textAlign = "center";
        let height = 0;

        for (let i = 0; i < count; i++)
        {
            for (let index of this.KeyWhite)
            {   // White keys
                ctx.fillStyle = this.KeyWhiteColor;
                ctx.fillRect(this.KeyPos[index] + this.KeyWidthWhite, height, this.KeyWidthWhite, this.KeyHeightWhite);
                // Key separator
                ctx.fillStyle = this.KeySeparatorColor;
                ctx.fillRect((this.KeyPos[index] - 1) + this.KeyWidthWhite, height, 2, this.KeyHeightWhite);
            }

            // Black keys
            ctx.fillStyle = this.KeyBlackColor;
            for (let index of this.KeyBlack)
            {
                ctx.fillRect(this.KeyPos[index] + this.KeyWidthWhite, height, this.KeyWidthBlack, this.KeyHeightBlack);
            }

            // Horizontal separator
            ctx.fillStyle = this.KeySeparatorColor;
            ctx.fillRect(0 + this.KeyWidthWhite, height - 2, this.KeyboardWidth, 4);
            // Bar on left for label
            ctx.fillRect(0, height, this.KeyWidthWhite, this.KeyHeightWhite);

            
            // Chord number label
            this.DrawLabel(ctx, (i + 1).toString(), this.KeyWidthWhite/2, height + (this.KeyHeightWhite/2))
            
            height += this.KeyboardHeight;
        }
    }

    DrawChordLabels(ctx, scaleIndexes)
    {
        for (let index = 0; index < scaleIndexes.length; index++)
        {
            let counter = 0; // Counts how many time scale keys have been passed through
            for (let i = 0; i < this.KeyCount; i++)
            {
                
                if (this.ScaleKeys[counter % 7] == i % 12)
                {
                    if (scaleIndexes[index].includes(counter))
                    {
                        if (this.ScaleColors[counter % 7] == "w")
                        {
                            this.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyWidthWhite + this.KeyPos[i] + (this.KeyWidthWhite/2), (this.KeyboardHeight - 5) + (this.KeyboardHeight * index))
                        }
                        else
                        {
                            this.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyWidthWhite + this.KeyPos[i] + (this.KeyWidthBlack/2), (this.KeyHeightBlack - 5) + (this.KeyboardHeight * index))
                        }
                    }
                    counter++;
                    if (counter > Math.max(scaleIndexes[index]))
                    {
                        break;
                    }
                }
            }
        }
    }

    DrawLabel(ctx, label, x, y)
    {
        ctx.font = Manager.LabelFont;
        ctx.fillStyle = Manager.LabelColor;
        ctx.textAlign = "center";
        ctx.fillText(label, x, y)
    }

    Settings()
    {

    }
}