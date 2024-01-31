const carCanvas = document.getElementById('carCanvas')
carCanvas.width=200;
const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width=400;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);
const N=1;
const cars = generateCars(N);

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-900,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-1100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-1100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-1300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-1300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-1600,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-1700,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-1800,30,50,"DUMMY",2,getRandomColor()),
];


let bestCar = cars[0];
localStorage.setItem('bestBrain',JSON.stringify({"levels":[{"inputs":[0,0,0,0.1076053371543908,0.517039488676676],"outputs":[1,1,0,0,0,0],"biases":[-0.2766127952485631,-0.0931521895549522,0.13313750071749994,0.5135240722664426,0.27498388442318455,-0.00807401731857188],"weights":[[-0.3618039098851407,0.3446186875043845,0.1736962362672301,-0.03523184133538129,-0.5799566466237781,-0.38497500385026523],[-0.21626333746286233,-0.02283070945266738,0.877528995417171,-0.32378904454078306,-0.2672652410651858,-0.552087681326254],[-0.5408086025658091,-0.32008896046890856,-0.5706173310950675,-0.022082405048882307,0.49326184656638994,-0.15926905469280012],[0.7010410366051458,0.44018601668145585,-0.06732245393586495,0.602891090300558,0.41477725792775716,-0.6964360188000197],[0.288045633582942,0.3212520506062096,0.24141457973110708,0.6517712974046777,0.38800807036359053,-0.1733362858302626]]},{"inputs":[1,1,0,0,0,0],"outputs":[1,1,1,0],"biases":[-0.8734791975957121,-0.11626631128307545,0.15406378197707962,0.5187837748093691],"weights":[[-0.5588904112751399,0.7665241836371752,-0.16855308803807093,-0.017529574143106186],[0.006388956997441931,-0.5953137012763012,0.8625740660660599,-0.5107180022767194],[0.4717520457815954,0.052920448863565395,-0.2863978216698248,0.31156617555720223],[-0.03452501956298937,0.31336284426518907,-0.0566193478591388,-0.3405381845659902],[0.05405025552587758,-0.056351320035596,-0.5499664818381328,0.6723992233266597],[0.22827829642681835,-0.4534265044575087,0.10618766604986504,0.4266594478838771]]}]}))
if(localStorage.getItem('bestBrain')){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}


animate();


function save(){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain))
}

function discard(){
    localStorage.removeItem("bestBrain")
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}
