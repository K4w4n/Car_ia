const carCanvas = document.querySelector("#car-canvas");
carCanvas.width = 200;

const networkCanvas = document.querySelector("#network-canvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 500;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

const trafic = generateTrafic(100);

function generateTrafic(ranksNumber) {
    const trafic = [];
    for (let i = 0; i < ranksNumber; i++) {
        const numberOfCars = Math.round(Math.random() * 2);
        for (let j = 0; j < numberOfCars; j++) {
            const line = Math.round(Math.random() * 2);
            trafic.push(
                new Car(road.getLaneCenter(line), -100 * i * 2, 30, 50, "DUMMY", 2.5)
            );
        }
    }
    return trafic;
}

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
function discard() {
    localStorage.removeItem("bestBrain");
}
function generateCars(n) {
    const cars = [];
    for (let i = 0; i < n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}
function animate(time) {

    bestCar = cars.sort((a, b) => a.y - b.y)[0];

    trafic.forEach(car => {
        car.update(road.borders, []);
    });

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, trafic);
    }

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();

    carCtx.translate(0, -bestCar.y + bestCar.height + carCanvas.height * 0.7)
    road.draw(carCtx);

    carCtx.globalAlpha = 0.5;

    trafic.forEach(car => {
        car.draw(carCtx, "red");
    });

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue", cars[i] == bestCar);
    }


    carCtx.restore();

    networkCtx.lineDashOffset = time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}