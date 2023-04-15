//TODO:
//remove checkboxes when pressing alt+z

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext('2d');

let backgroundColor = document.getElementById("backgroundColor");
let lineColor = document.getElementById("lineColor");
let lineWidth = document.getElementById("lineWidth");
let centerRotations = document.getElementById("centerRotations");
let centerSelection = document.getElementById("centerSelection");
let settings = document.getElementById("settings");
let checkboxes = document.getElementsByClassName("checkbox");
let instructions = document.getElementById("instructions");

let lines = [];
let centers = [];
let activeCenters = [];

let latestLine = createGenericLine();

let S = false;

function createGenericLine() {
    let l = new Line();
    l.centers = [...activeCenters];
    l.color = "yellow";
    l.width = 1;

    return l;
}

canvas.addEventListener('mousemove', (e) => {
    if (e.which == 0) {
        if (e.clientX >= window.innerWidth - 2) {
            settings.style.left = "calc(100vw - 130px)";
            console.log("SSSSSS")
        } else {
            settings.style.left = "100vw";
        }
    }
    if (e.which == 1) {
        latestLine.centers = [...activeCenters];
        latestLine.x.push(e.clientX);
        latestLine.y.push(e.clientY);
    }
});

canvas.addEventListener('mouseup', (e) => {
    const line = new Line([...latestLine.x], [...latestLine.y], [...activeCenters], lineColor.value, lineWidth.value);

    lines.push(line);

    let removeIndexes = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].x.length == 0) {
            removeIndexes.push(i);
        }
    }
    for (let i = removeIndexes.length - 1; i >= 0; i--) {
        lines.splice(removeIndexes[i], 1);
    }

    latestLine = createGenericLine();
});

canvas.addEventListener('mousedown', (e) => {
    if (e.which == 3) {

        for (let i = 0; i < centers.length; i++) {
            centers[i].settings.active = false;
        }

        centers.push(new Center(`center${centers.length + 1}`, e.clientX, e.clientY, { active: true, rotations: centerRotations.value }));

        activeCenters = [];
        activeCenters.push(clone(centers[centers.length - 1]));

        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].firstChild.checked = false;
        }

        let checkbox = document.createElement('input');
        checkbox.style = "padding:0;margin:0;width:10px"
        checkbox.type = 'checkbox';
        checkbox.name = `center${centers.length}`;
        checkbox.id = `center${centers.length}`;
        checkbox.value = `center${centers.length}`;
        checkbox.checked = true;

        let label = document.createElement('label');
        label.style = "padding:5px;margin:0;"
        label.setAttribute('for', `center${centers.length}`);
        label.innerText = `Center ${centers.length}`;

        let el = document.createElement('div');
        el.className = "checkbox";
        el.style = "display:flex;flex-direction:row;";
        el.appendChild(checkbox);
        el.appendChild(label);

        centerSelection.appendChild(el);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key == ' ') {
        lines = [];
        centers = [];
        activeCenters = [];
        latestLine = createGenericLine();
        centerSelection.innerHTML = '';
    }
    if (e.key == 'z' && e.ctrlKey) {
        lines.splice(lines.length - 1, 1);
    }
    if (e.key == 'z' && e.altKey) {
        centers.splice(centers.length - 1, 1);
        activeCenters = [...centers.filter(c => c.settings.active == true)];
        centerSelection.removeChild(centerSelection.lastChild);
    }
    if (e.key == 's' && e.ctrlKey) {
        e.preventDefault();
        S = true;

    }
    if (e.key == 'i') {
        if (instructions.style.top == "") {
            instructions.style.top = "-100vh";
        } else {
            instructions.style.top = "";
        }
    }
});

centerSelection.addEventListener("click", () => {
    activeCenters = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].firstChild.checked) {
            centers[i].settings.active = true;
            activeCenters.push(clone(centers[i]));

        } else {
            centers[i].settings.active = false;
        }
    }
});

centerRotations.addEventListener('change', (e) => {
    activeCenters = [];
    for (let i = 0; i < centers.length; i++) {
        if (centers[i].settings.active) {
            centers[i].settings.rotations = centerRotations.value;
            activeCenters.push(clone(centers[i]));
        }
    }
});

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = backgroundColor.value;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < lines.length; i++) {
        lines[i].draw(ctx);
    }
    if (!S) {
        for (let i = 0; i < centers.length; i++) {
            centers[i].draw(ctx);
        }
    }
    latestLine.draw(ctx);


    if (S) {
        let canvasUrl = canvas.toDataURL();
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
        createEl.download = "art";
        createEl.click();
        createEl.remove();
        S = false;
    }

    window.requestAnimationFrame(draw);
}

function clone(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

draw();