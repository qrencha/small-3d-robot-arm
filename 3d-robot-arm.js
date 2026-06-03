let axes = [];

let baseHeight = 100;
let circleAxle = 80;
let sliders = [];
let checkboxes = [];
let numSliders;     // number of sliders
let img;
let roboColor = 'silver'
let sliderName;
// let url = "https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap";

async function setup() {
    createCanvas(800, 500, WEBGL);

    axes = [
        { rotate: true, angle: 0, speed: 0.010, angleDir: 1, cwLimit: PI, ccwLimit: -PI },
        { rotate: true, angle: 0, speed: 0.012, angleDir: 1, cwLimit: QUARTER_PI, ccwLimit: -QUARTER_PI },
        { rotate: true, angle: 0, speed: 0.014, angleDir: 1, cwLimit: QUARTER_PI, ccwLimit: -QUARTER_PI },
        { rotate: true, angle: 0, speed: 0.016, angleDir: 1, cwLimit: QUARTER_PI, ccwLimit: -HALF_PI },
        { rotate: true, angle: 0, speed: 0.018, angleDir: 1, cwLimit: QUARTER_PI, ccwLimit: -HALF_PI }
    ];

    numSliders = axes.length;
    frameRate(30)
    rectMode(CENTER)

    img = await loadImage('\\shiny-silver.jpg'); // credit: stock adobe


    for (s = 0; s < numSliders; s++) {
        sliders[s] = createSlider(-180, 180, 0, 1).parent('slider-container')
        checkboxes[s] = createCheckbox(' Enable Axel', axes[s].rotate);
        sliders[s].position(90, height+8 + (s * 30));
        checkboxes[s].position(300, height+8 + (s*30))
        sliders[s].size(200)
    }
}

function draw() {

    background(175);

    // orbit control with mouse
    orbitControl();

    pointLight(250, 200, 200, 200, -200, 0); // top light
    pointLight(200, 200, 250, 0, -200, 200);  // front (z-axis) light
    pointLight(200, 200, 250, 0, -200, -200);  // back (z-axis) light
    pointLight(250, 250, 250, -200, -200, 0);  // side (x-axis) light

    sliderIds();

    // start by translating to the bottom of the screen
    translate(0, height / 2 - baseHeight, 0);
    rotateX(HALF_PI);
    noStroke();
    fill(100);
    plane(1000);

    //------------------------------ Robot ---------------------------
    //--------------------------- Robot Base -------------------------
    rotateX(-HALF_PI)
    translate(0, -50, 0)
    noStroke();
    rotateY(axes[0].angle);
    applyTexture(img)
    cylinder(30, baseHeight);
    showAxis(); // show Axis

    //---------------------------- Base Axis --------------------------
    translate(0, -50, 0);
    push()
    rotateX(HALF_PI)
    applyTexture(img)
    cylinder(40, 60);
    pop()


    // Arm
    rotateZ(axes[1].angle);
    translate(0, -120, 0);

    // Need to isolate the two big Axis, so put all within a push() and a pop()
    push()
    rotateX(HALF_PI)
    rotateY(axes[2].angle);
    applyTexture(img)
    cylinder(40, 60);
    push();
    translate(0, 35, 0)
    sphere(10)
    pop();
    showAxis(); // show Axis

    // Mini Arm on top of Arm Axle
    rotateX(-HALF_PI)
    translate(0, -circleAxle * 3 / 4, 0);
    applyTexture(img)
    translate(0, 10, 0)
    cylinder(15, 30);
    translate(0, -10, 0)
    rotateX(-HALF_PI)
    rotateZ(HALF_PI)
    cylinder(20, 80)
    translate(0, 50, 0)
    rotateY(axes[3].angle);
    showAxis(); // show Axis
    applyTexture(img)
    cylinder(15, 20);

    // Axis at one End of Mini Arm
    translate(0, 30, 0);
    rotateZ(-HALF_PI);
    rotateX(-PI);
    applyTexture(img)
    cylinder(25, 25);
    rotateY(axes[4].angle);
    showAxis(); // show Axis
    push()
    rotateX(HALF_PI)
    applyTexture(img)
    translate(-20, 0, -15)
    box(80, 30, 10);
    translate(20, 0, 0)
    sphere(10);
    pop()

    // Tip
    rotate(HALF_PI);
    translate(0, 50, 0)
    applyTexture(img)
    cylinder(18, 35);
    translate(0, 15, 0)
    sphere(10);
    translate(0, 10, 0)
    cylinder(2, 20);
    translate(0, 10)
    sphere(5);
    pop()

    // Render the Arm from the Base over the two big Axles
    translate(0, 120, 25);
    push()
    push();
    translate(0, 0, 10)
    showAxis(); // show Axis
    applyTexture(img)
    sphere(10);
    pop();
    applyTexture(img)
    translate(0, -60, 10)
    box(40, 160, 10);
    pop();

    //-------------------- Turn Axes Rotation ON/OFF -----------------
    axisRotation();
}

function showAxis() {
    strokeWeight(2);
    stroke('red')
    line(50, 0, 0, -50, 0, 0);
    stroke('green')
    line(0, 50, 0, 0, -50, 0);
    stroke('blue')
    line(0, 0, 50, 0, 0, -50);
}

function axisRotation() {
    axes.forEach((axis, i) => {
        if (checkboxes[i].checked()) {
            axis.rotate = true;
        } else {
            axis.rotate = false;
        }

        if (axis.rotate) {
            axis.angle += axis.speed * axis.angleDir;
            sliders[i].value(degrees(axis.angle));
            if ((axis.angle > axis.cwLimit) || (axis.angle < axis.ccwLimit)) axis.angleDir *= -1;
        }
    });
}

function sliderIds() {
    // Show each sliders Identification
    strokeWeight(0)
    fill(175)
    for (s = 0; s < numSliders; s++) {
        textWeight(400)
        fill('black')
        document.getElementById('slider'+ (s+1)+'value').innerHTML = sliders[s].value();
    }
}

function applyTexture(image) {
    noStroke();
    texture(image);
}