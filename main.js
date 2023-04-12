//TODO:
//remove checkboxes when pressing alt+z

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext('2d');

let lineColor = document.getElementById("lineColor");
let lineWidth = document.getElementById("lineWidth");
let centerRotations = document.getElementById("centerRotations");
let centerSelection = document.getElementById("centerSelection");
let settings = document.getElementById("settings");
let checkboxes = document.getElementsByClassName("checkbox");

let lines = [];
let centers = [];
let activeCenters = [];

let latestLine = createGenericLine();

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
            settings.style.marginLeft = "calc(100vw - 130px)";
        } else {
            settings.style.marginLeft = "100vw";
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
        label.style = "padding:0;margin:0;"
        label.setAttribute('for', `center${centers.length}`);
        label.innerText = `center${centers.length}`;

        let el = document.createElement('div');
        el.className = "checkbox";
        el.style = "font-size:0.7rem;display:flex;flex-direction:row;";
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
        let canvasUrl = canvas.toDataURL();
        const createEl = document.createElement('a');
        createEl.href = canvasUrl;
        createEl.download = "art";
        createEl.click();
        createEl.remove();
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

    for (let i = 0; i < lines.length; i++) {
        lines[i].draw(ctx);
    }
    for (let i = 0; i < centers.length; i++) {
        centers[i].draw(ctx);
    }
    latestLine.draw(ctx);


    window.requestAnimationFrame(draw);
}

function clone(obj) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

draw();