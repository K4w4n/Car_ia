import Car from "./car.js";
import NeuralNetwork from "./network.js";
import Road from "./road.js";
import Visualizer from "./visualizer.js";

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
let rankingCar = cars;
let start = false;

const trafic = /* generateTrafic(10) */[
    new Car(road.getLaneCenter(1), getYTraffic(0), 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), getYTraffic(0), 30, 50, "DUMMY", 2.5),

    new Car(road.getLaneCenter(0), getYTraffic(1), 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), getYTraffic(1), 30, 50, "DUMMY", 2.5),

    new Car(road.getLaneCenter(0), getYTraffic(2), 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), getYTraffic(2), 30, 50, "DUMMY", 2.5),

    new Car(road.getLaneCenter(1), getYTraffic(3), 30, 50, "DUMMY", 2.5),

    new Car(road.getLaneCenter(0), getYTraffic(4), 30, 50, "DUMMY", 2.5),

    new Car(road.getLaneCenter(1), getYTraffic(5), 30, 50, "DUMMY", 2.5),

    new Car(road.getLaneCenter(2), getYTraffic(6), 30, 50, "DUMMY", 2.5),

    new Car(road.getLaneCenter(0), getYTraffic(7), 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), getYTraffic(7), 30, 50, "DUMMY", 2.5),

    new Car(road.getLaneCenter(1), getYTraffic(8), 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), getYTraffic(8), 30, 50, "DUMMY", 2.5),
];

function generateTraffic(ranksNumber) {
    const traffic = [];
    for (let i = 0; i < ranksNumber; i++) {
        const numberOfCars = 1 + (Math.random() > 0.5 ? 1 : 0);
        for (let j = 0; j < numberOfCars; j++) {
            const line = Math.round(Math.random() * 2);
            traffic.push(
                new Car(road.getLaneCenter(line), getYTraffic(i), 30, 50, "DUMMY", 2.5)
            );
        }
    }
    return traffic;
}

animate();

function getYTraffic(i) {
    return -100 * i * 2;
}

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    localStorage.setItem("rankingCar", JSON.stringify(rankingCar.map(car => ({ brain: car.brain, color: car.color }))));
}
function discard() {
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("rankingCar");
}
function generateCars(quantity) {
    const cars = [];
    const carItem = new Car(road.getLaneCenter(2), 100, 30, 50, "AI");
    const myCar = new Car(road.getLaneCenter(2), 100, 30, 50, "KEYS");
    myCar.color = "#2b11dd";
    cars.push(carItem, myCar);

    // 1 = 500
    // 2 = 250
    // 3 = 166
    // 4 = 125
    // 5 = 100
    let rankingCar = JSON.parse(localStorage.getItem('rankingCar'));// TODO: gambiarra para mostrar melhor carro, remover isso
    const [bestBrainItem] = rankingCar;
    carItem.brain = JSON.parse(JSON.stringify(bestBrainItem.brain));
    carItem.color = bestBrainItem.color;
    return cars;

    rankingCar = rankingCar ? JSON.parse(rankingCar) : null;

    if (rankingCar) {

        rankingCar.forEach((bestBrainItem, rankingIndex) => {
            const count = quantity / (rankingIndex + 1);
            for (let i = 0; i < count; i++) {

                const carItem = new Car(road.getLaneCenter(2), 100, 30, 50, "AI");

                carItem.brain = JSON.parse(JSON.stringify(bestBrainItem.brain));
                carItem.color = bestBrainItem.color;

                if (i != 0) {
                    const variation = 0.05;
                    NeuralNetwork.mutate(carItem.brain, variation);
                    carItem.color = varyColorWithPercentage(carItem.color, variation);
                }

                cars.push(carItem);
            }

        });
    } else {

        for (let i = 0; i < quantity; i++) {
            const carItem = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
            carItem.color = varyColorWithPercentage('#000000', 1);
            cars.push(carItem);
        }

    }

    return cars;
}
function animate(time) {

    rankingCar = cars.sort((a, b) => a.y - b.y).slice(0, 10);
    [bestCar] = rankingCar;

    const live = cars.filter(car => !car.damaged).length;

    const bestCarEnded = /* getYTraffic(9) < */ rankingCar.reduce((acc, car) => Math.min(acc, car.y), Infinity);
    if (live === 0 /* || bestCarEnded */) {
        save();
        location.reload();
    }

    trafic.forEach(car => {
        car.update(road.borders, []);
    });

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, trafic.filter(traficCar => Math.abs(traficCar.y - cars[i].y) <= 200), bestCar);
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
        cars[i].draw(carCtx, cars[i].color, cars[i] == bestCar);
    }


    carCtx.restore();

    networkCtx.lineDashOffset = time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    drawNumbers();
    if(start) requestAnimationFrame(animate);
}

function drawNumbers() {

    // Define o estilo de texto
    carCtx.font = "15px Arial";
    carCtx.fillStyle = "black";
    carCtx.textAlign = "center";
    carCtx.textBaseline = "middle";

    // Calcula as coordenadas do centro do canvas
    var centerX = carCanvas.width / 2;
    var centerY = 15;

    const live = cars.filter(car => !car.damaged).length;
    const death = cars.filter(car => car.damaged).length;
    const total = cars.length;
    // Desenha "Hello, World!" no centro do canvas
    carCtx.fillText(`V: ${live} M: ${death} T: ${total} `, centerX, centerY);
}

window.onload = () => {
    document.getElementById("save").addEventListener("click", save)
    document.getElementById("trash").addEventListener("click", discard)
}

function varyColorWithPercentage(hexadecimal, percentage) {
    // Check if the hexadecimal format is valid
    var hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/i;
    if (!hexRegex.test(hexadecimal)) {
        console.error("Invalid hexadecimal format");
        return null;
    }

    // Convert the hexadecimal color to RGB
    var r = parseInt(hexadecimal.slice(1, 3), 16);
    var g = parseInt(hexadecimal.slice(3, 5), 16);
    var b = parseInt(hexadecimal.slice(5, 7), 16);

    // Calculate the maximum variation allowed based on the percentage
    var maxVariation = 255 * percentage;

    // Apply variation to each RGB component with randomness
    r += Math.round((Math.random() * 2 - 1) * maxVariation);
    g += Math.round((Math.random() * 2 - 1) * maxVariation);
    b += Math.round((Math.random() * 2 - 1) * maxVariation);

    // Ensure the values are within the valid range (0-255)
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    // Convert back to hexadecimal format
    var componentR = r.toString(16).padStart(2, '0');
    var componentG = g.toString(16).padStart(2, '0');
    var componentB = b.toString(16).padStart(2, '0');

    // Return the new color in hexadecimal format
    return `#${componentR}${componentG}${componentB}`;
}

window.addEventListener('keydown', () => {
    if (!start) {
        start = true;
        animate();
    }
})
/* setTimeout(() => {
    save();
    location.reload();
}, 1_000 * 95); */