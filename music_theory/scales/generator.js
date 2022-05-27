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

        this.LabelFont = "bold 14px arial";
        this.LabelColor = "#00ba6c"; //"#66AAEE";
        this.InitElements();

        this.Instrument = undefined;
        this.InstrumentElements = [];
        this.InstrumentSettings = [];
        this.InstrumentContainers = [];
        this.SelectedRow = 0;
        this.InstrumentRows = -1;

        this.NoteLabels = [ ["C", "B#"], ["C#", "D♭"], ["D"], ["D#", "E♭"], ["E", "F♭"], ["F", "E#"], ["F#", "G♭"], ["G"], ["G#", "A♭"], ["A"], ["A#", "B♭"], ["B", "C♭"] ];

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
                let doc = document.getElementById(this.InstrumentElements.pop())
                if (doc != null)
                {
                    doc.remove();
                }
            }
            while (this.InstrumentSettings.length > 0)
            {
                let doc = document.getElementById(this.InstrumentSettings.pop())
                if (doc != null)
                {
                    doc.remove();
                }
            }
            while (this.InstrumentContainers.length > 0)
            {
                let doc = document.getElementById(this.InstrumentContainers.pop())
                if (doc != null)
                {
                    doc.remove();
                }
            }
            this.InstrumentRows = 0;
        }
        switch(instrument)
        {
            case "piano":
                this.Instrument = new Keyboard();
                break;
            case "guitar":
                this.Instrument = new Guitar();
                break;
        }
        this.Instrument.Initialize(this.ScalePattern, this.ScaleRoot);
        this.Instrument.Resize();
        this.Instrument.Draw();
    }

    GetNoteID(note)
    {
        for (let i = 0; i < this.NoteLabels.length; i++)
        {
            if (this.NoteLabels[i].includes(note))
            {
                return i;
            }
        }
        return -1;
    }

    GetNoteLabel(id)
    {
        return this.NoteLabels[id % 12][0];
    }

    GetScaleKeys()
    {
        let ScaleKeys = [ScaleRoot];
        for (let i = 1; i < 7; i++)
        {
            ScaleKeys.push((ScaleKeys[i - 1] + parseInt(this.ScalePattern[(i - 1) % 7])) % 12)
        }
        return ScaleKeys;
    }

    GetScaleLabels(ScaleKeys)
    {
        let ScaleLabels = [this.NoteLabels[ScaleKeys[0]][0]];
        for (let i = 1; i < 7; i++)
        {
            let label = this.NoteLabels[ScaleKeys[i] % 12][0];
            if (this.NoteLabels[ScaleKeys[i] % 12].length > 1)
            {
                // If next label letter equals current label letter
                if (this.NoteLabels[(ScaleKeys[(i + 1) % 7]) % 12][0][0] == label[0])
                {
                    // If previous label letter does NOT equal current label letter, rename it
                    if (this.NoteLabels[(ScaleKeys[i - 1]) % 12][0][0] != label[0])
                    {
                        label = this.NoteLabels[ScaleKeys[i] % 12][1];
                    }
                }
                else // If next label label letter does NOT equal current label letter
                {
                    // If previous label letter equals current label letter, rename it
                    if (this.NoteLabels[(ScaleKeys[i - 1]) % 12][0][0] == label[0])
                    {
                        label = this.NoteLabels[ScaleKeys[i] % 12][1];
                    }
                }
            }
            
            ScaleLabels.push(label);
        }
        return ScaleLabels;
    }

    DrawLabel(ctx, label, x, y)
    {
        ctx.font = Manager.LabelFont;
        ctx.fillStyle = Manager.LabelColor;
        ctx.textAlign = "center";
        ctx.fillText(label, x, y)
    }

    CreateCanvas(id, heading = undefined)
    {
        if (this.InstrumentElements.includes(id + "_canvas"))
        {
            return document.getElementById(id + "_canvas");
        }
        let name = "";
        let html = "";
        if (heading != undefined)
        {
            name = id + "_heading";
            html += `<h3 id="` + name + `">` + heading + `</h3>\n`;
            this.InstrumentElements.push(name);
        }
        name = id + "_container";
        html += `<div id="` + name + `" class="` + name + `">\n`;
        this.InstrumentContainers.push(name);

        name = id + "_canvas";
        html += `  <canvas id="` + name + `">Your browser does not support the canvas element.</canvas>\n</div>`;
        this.InstrumentElements.push(name);
        this.GeneratorContainer.insertAdjacentHTML('beforeend', html);
        return document.getElementById(name);
    }

    // Settings

    SelectRow(row = this.InstrumentRows)
    {
        this.SelectedRow = row;
    }

    CreateRow(heading = undefined)
    {
        this.InstrumentRows++;
        this.SelectedRow = this.InstrumentRows;
        let name = "row_" + this.InstrumentRows + "_container_parent";
        this.InstrumentContainers.push(name);
        let html = `<div id="` + name + "" + `" class="` + name + `">\n`;
        if (heading != undefined)
        {
            name = "row_" + this.InstrumentRows + "_heading";
            html += `  <p id="` + name + `" style="display: flex; align-items: center; justify-content: center;">` + heading + `</p>\n`;
            this.InstrumentSettings.push(name);
        }
        name = "row_" + this.InstrumentRows + "_container";
        html += `  <div id="` + name + "" + `" class="` + name + `">\n`;
        this.InstrumentContainers.push(name);

        html += `  </div>\n</div>`;
        this.SettingsContainer.insertAdjacentHTML('beforeend', html);

        let row = document.getElementById(name);
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.justifyContent = "center";
        row.style.position = "relative";
    }

    DeleteRow(row)
    {
        if (row < 0 || row > this.InstrumentRows)
        {
            return;
        }
        let name = "row_" + row + "_container_parent";
        document.getElementById(name).remove()
        this.InstrumentContainers.pop(this.InstrumentContainers.indexOf(name));
    }

    CreateSlider(id, min, max, value, step = 1, heading = undefined)
    {
        if (document.getElementById("setting_" + id + "_slider_container") != null)
        {
            return document.getElementById("setting_" + id + "_slider");
        }
        let name = "setting_" + id + "_slider_container";
        this.InstrumentContainers.push(name);
        let html = `<div id="` + name + "" + `" class="` + name + `">\n`;
        if (heading != undefined)
        {
            name = "setting_" + id + "_heading";
            html += `  <p id="` + name + `">` + heading + `</p>\n`;
            this.InstrumentSettings.push(name);
        }
        name = "setting_" + id + "_slider";
        html += `  <input id="` + name + `" type="range" class="slider" min="` + min + `" max="` + max + `" value="` + value +`" step="` + step +`"></input>`;
        this.InstrumentSettings.push(name);

        document.getElementById("row_" + this.SelectedRow + "_container").insertAdjacentHTML('beforeend', html)
        return document.getElementById(name);
    }

    DeleteSlider(id)
    {
        let name = "setting_" + id + "_slider_container";
        if (!this.InstrumentContainers.includes(name))
        {
            return;
        }
        document.getElementById(name).remove()
        this.InstrumentContainers.pop(this.InstrumentContainers.indexOf(name));
    }

    CreateCombo(id, options, selected = 0, heading = undefined)
    {
        if (document.getElementById("setting_" + id + "_combo_container") != null)
        {
            return document.getElementById("setting_" + id + "_combo");
        }
        let name = "setting_" + id + "_combo_container";
        this.InstrumentContainers.push(name);
        let html = `<div id="` + name + "" + `" class="` + name + `">\n`;
        if (heading != undefined)
        {
            name = "setting_" + id + "_heading";
            html += `  <p id="` + name + `">` + heading + `</p>\n`
            this.InstrumentSettings.push(name);
        }
        name = "setting_" + id + "_combo";
        html += `  <select id="` + name + `" class="combo">\n`
        for (let i = 0; i < options.length; i++)
        {
            name = "option_" + i + "_" + id
            if (selected == i)
            {
                html += `    <option id="` + name + `" value="` + options[i][0] + `" selected>` + options[i][1] + `</option>\n`;
            }
            else
            {
                html += `    <option id="` + name +`" value="` + options[i][0] + `">` + options[i][1] + `</option>\n`;
            }
            
        }
        html += `  </select>\n</div>`;
        this.InstrumentSettings.push("setting_" + id + "_combo");
        document.getElementById("row_" + this.SelectedRow + "_container").insertAdjacentHTML('beforeend', html);
        return document.getElementById("setting_" + id + "_combo");
    }

    DeleteCombo(id)
    {
        let name = "setting_" + id + "_combo_container";
        if (!this.InstrumentContainers.includes(name))
        {
            return;
        }
        document.getElementById(name).remove()
        this.InstrumentContainers.pop(this.InstrumentContainers.indexOf(name));
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
        this.HeaderContainter.style.display = "flex";
        this.HeaderContainter.style.alignItems = "center";
        this.HeaderContainter.style.justifyContent = "center";
        this.HeaderContainter.style.position = "relative";
        this.HeaderContainter.insertAdjacentHTML('beforeend', `
<div class="select_container" style="display: flex; align-items: center;">
  <h3 id="select_heading">Instrument:</h3>
  <select id="select_instrument" class="combo">
    <option value="piano" selected>Piano</option>
    <option value="guitar">Guitar</option>
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
        this.ScaleKeys = Manager.GetScaleKeys();

        // --- Scale Labels --- //
        this.ScaleLabels = Manager.GetScaleLabels(this.ScaleKeys);

        this.ScaleColors = "";
        for (let i = 0; i < 7; i++)
        {
            this.ScaleColors += this.KeyColors[this.ScaleKeys[i] % 12];
        }

        this.CountKeys();

        Manager.CreateRow("Keyboard size: ");

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
        this.DrawKeyboard(ctx);

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
                    Manager.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyPos[i] + (this.KeyWidthWhite/2), this.KeyboardHeight - 5)
                }
                else
                {
                    Manager.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyPos[i] + (this.KeyWidthBlack/2), this.KeyHeightBlack - 5)
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
            Manager.DrawLabel(ctx, (i + 1).toString(), this.KeyWidthWhite/2, height + (this.KeyHeightWhite/2))
            
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
                            Manager.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyWidthWhite + this.KeyPos[i] + (this.KeyWidthWhite/2), (this.KeyboardHeight - 5) + (this.KeyboardHeight * index))
                        }
                        else
                        {
                            Manager.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyWidthWhite + this.KeyPos[i] + (this.KeyWidthBlack/2), (this.KeyHeightBlack - 5) + (this.KeyboardHeight * index))
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

    Settings()
    {

    }
}

class Guitar
{
    Initialize(ScalePattern, ScaleRoot)
    {
        // --- Defines --- //
        this.FingerboardColor = "#41260A";
        this.FretColor = "#C0C0C0";
        this.NutColor = "#AA0000";
        this.StringColor = "#DDDDDD";
        this.PositionMarkerColor = "#777777";

        this.NutWidth = 20;
        this.NeckHeight = 130;
        this.NeckWidth = 450 + this.NutWidth;
        this.FretCount = 24;

        this.StringCount = 6;
        this.TuningLabels = ["E", "A", "D", "G", "B", "E"];
        this.StringSize = 1;
        this.StringIncrement = .25;

        // --- Scale Keys --- //
        this.ScaleKeys = Manager.GetScaleKeys();

        // --- Scale Labels --- //
        this.ScaleLabels = Manager.GetScaleLabels(this.ScaleKeys);

        this.ReTune();
        this.Settings();
    }

    Settings()
    {
        Manager.CreateRow()

        Manager.CreateCombo("string_count", [[4,4], [5,5], [6,6], [7,7], [8,8], [9,9], [10,10], [11,11], [12,12]], this.StringCount - 4, "Strings").oninput = function()
        {
            Manager.SelectRow(1)
            Manager.Instrument.StringCount = parseInt(this.value, 10);
            while (Manager.Instrument.StringCount > Manager.Instrument.TuningLabels.length)
            {
                
                Manager.Instrument.TuningLabels.push("E")
                Manager.Instrument.AddTuningCombo(Manager.Instrument.TuningLabels.length - 1)
            }
            while (Manager.Instrument.StringCount < Manager.Instrument.TuningLabels.length)
            {
                Manager.Instrument.TuningLabels.pop();
                Manager.DeleteCombo("tuning_" + Manager.Instrument.TuningLabels.length)
            }
            Manager.SelectRow();
            Manager.Instrument.ReTune();
            Manager.Instrument.Resize();
            Manager.Instrument.Draw();
        }
        for (let string = 0; string < this.StringCount; string++)
        {
            this.AddTuningCombo(string);
        }

        Manager.CreateRow();

        Manager.CreateSlider("width", 400, 1000, this.NeckWidth, 1, "Width").oninput = function()
        {
            Manager.Instrument.NeckWidth = parseInt(this.value, 10);
            Manager.Instrument.Resize();
            Manager.Instrument.Draw();
        }
        Manager.CreateSlider("height", 100, 300, this.NeckHeight, 1, "Height").oninput = function()
        {
            Manager.Instrument.NeckHeight = parseInt(this.value, 10);
            Manager.Instrument.Resize();
            Manager.Instrument.Draw();
        }
    }

    AddTuningCombo(string)
    {
        let selected = 4;
        if (this.Tuning.length - 1 > string)
        {
            selected = this.Tuning[string];
        }
        var combo = Manager.CreateCombo("tuning_" + string, [["C", "C"], ["C#", "C#"], ["D", "D"], ["D#", "D#"], ["E", "E"], ["F", "F"], ["F#", "F#"], ["G", "G"], ["G#", "G#"], ["A", "A"], ["A#", "A#"], ["B", "B"]], selected);
        combo.oninput = function()
        {
            Manager.Instrument.TuningLabels[string] = this.value;
            Manager.Instrument.ReTune();
            Manager.Instrument.Draw();
        }
    }

    SetStringTune(string, note)
    {
        this.Tuning[string] = Manager.GetNoteID(note);
    }

    SetStringKeys(string)
    {
        this.StringKeys[string] = []
        for (let i = 0; i < this.FretCount + 1; i++)
        {
            this.StringKeys[string].push((i + this.Tuning[string] % 12))
        }
    }

    ReTune()
    {
        this.Tuning = []
        this.StringKeys = [];
        for (let string = 0; string < this.TuningLabels.length; string++)
        {
            this.StringKeys.push([])
            this.Tuning.push(0)

            this.SetStringTune(string, this.TuningLabels[string]);
            this.SetStringKeys(string);
        }
    }

    Resize()
    {
        this.FingerboardWidth = (this.NeckWidth - this.NutWidth) / this.FretCount;
        this.FingerboardHeight = this.NeckHeight;
        this.StringHeight = this.NeckHeight/this.StringCount;
        this.FretWidth = 2;

        this.FretPos = [];
        for (let i = 0; i < this.FretCount; i++)
        {
            this.FretPos.push(this.FingerboardWidth * i + this.NutWidth)
        }
        this.StringPos = [];
        for (let i = 0; i < this.StringCount; i++)
        {
            this.StringPos.push((this.StringHeight * i) + this.StringHeight/2)
        }
    }

    Draw()
    {
        var canvas = undefined;
        var ctx = undefined;
        // Scale
        canvas = Manager.CreateCanvas("scale", "Scale");
        Manager.InitializeCanvas(canvas, this.NeckWidth, this.NeckHeight);
        ctx = canvas.getContext("2d");
        this.DrawGuitar(ctx);
    }

    DrawGuitar(ctx)
    {
        // Fingerboard
        ctx.fillStyle = this.FingerboardColor;
        ctx.fillRect(0, 0, this.NeckWidth, this.NeckHeight);

        // Fret
        ctx.fillStyle = this.FretColor;
        for (let i = 0; i < this.FretCount; i++)
        {
            ctx.fillRect(this.FretPos[i] - 1, 0, this.FretWidth, this.NeckHeight);
            if ([2,4,6,8,11,14,16,18,20,23].includes(i))
            {
                ctx.fillStyle = this.PositionMarkerColor;
                ctx.fillRect((this.FretPos[i] - 3) + (this.FingerboardWidth/2), this.StringHeight, 8, 8);
                if ([11,23].includes(i))
                {
                    ctx.fillRect((this.FretPos[i] - 3) + (this.FingerboardWidth/2), this.StringHeight*2, 8, 8);
                }
                ctx.fillStyle = this.FretColor;
            }
        }

        // Nut
        ctx.fillStyle = this.NutColor;
        ctx.fillRect(this.NutWidth - 2, 0, 4, this.NeckHeight);

        // Strings
        for (let i = 0; i < this.StringCount; i++)
        {
            ctx.fillStyle = this.StringColor;
            let thickness = (this.StringCount - i) * this.StringIncrement;
            ctx.fillRect(0, this.StringPos[i], this.NeckWidth, this.StringSize + thickness)
            // String tuning
            Manager.DrawLabel(ctx, Manager.NoteLabels[this.Tuning[i]][0], this.NutWidth/2, this.StringPos[i] + 6)
        }

        // String labels
        for (let string = 0; string < this.StringCount; string++)
        {
            for (let i = 1; i < this.FretCount + 1; i++)
            {
                if (this.ScaleKeys.includes(this.StringKeys[string][i] % 12))
                {
                    let key = this.StringKeys[string][i];
                    let label = Manager.GetNoteLabel(this.StringKeys[string][i] % 12)
                    Manager.DrawLabel(ctx, label, this.FretPos[i] - (this.FingerboardWidth/2), this.StringPos[string] + 6)
                }
            }
        }


        /*
        // Labels
        let counter = 0; // Counts how many time scale keys have been passed through
        for (let i = 0; i < this.KeyCount; i++)
        {
            if (this.ScaleKeys[counter % 7] == i % 12)
            {
                if (this.ScaleColors[counter % 7] == "w")
                {
                    Manager.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyPos[i] + (this.KeyWidthWhite/2), this.KeyboardHeight - 5)
                }
                else
                {
                    Manager.DrawLabel(ctx, this.ScaleLabels[counter % 7], this.KeyPos[i] + (this.KeyWidthBlack/2), this.KeyHeightBlack - 5)
                }
                counter++;
            }
        }
        */
    }
}