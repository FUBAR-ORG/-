interface IBicycle{
    ride(): void;
    brake(): void;
}

interface ICar{
    ride(): void;
    brake(): void;
    fly(): void;
}

interface ITrip{
    prepareTravel(): void;
}

interface IMechanic<T>{
    prepareTrip(): T[]
    prepareBicycle(bicycle: T[]): void;
}

class Bicycle implements IBicycle{
    constructor(private size: number){}
    ride(): void {
        console.log('ride');
    }
    brake(): void {
        console.log('brake');
    }
}

class Car implements ICar{
    constructor(private size: number){}
    ride(): void {
        console.log('ride');
    }
    brake(): void {
        console.log('brake');
    }
    fly(): void {
        console.log('fly');
    }
}

class Car2 implements ICar{
    constructor(private size: number){}
    ride(): void {
        console.log('ride booster');
    }
    brake(): void {
        console.log('brake booster');
    }
    fly(): void {
        console.log('fly');
    }
}

class Mechanic<T> implements IMechanic<T>{

    constructor(private rider: T[]){}

    private cleanBicycle(bicycle: T): void{
        console.log(bicycle, 'cleanBicycle');
    }
    private pumpTires(bicycle: T): void {
        console.log(bicycle, 'pumpTires');
    }
    private lubeChain(bicycle: T): void {
        console.log(bicycle, 'lubeChain');
    }
    private checkBrakes(bicycle: T): void {
        console.log(bicycle, 'checkBrakes');
    }
    private something(bicycle: T): void {
        console.log(bicycle, 'something');
    }
    prepareTrip(): T[] {
        return this.rider
    }
    prepareBicycle(bicycles: T[]): void{
        bicycles.forEach(bicycle => {
            this.cleanBicycle(bicycle);
            this.pumpTires(bicycle);
            this.lubeChain(bicycle);
            this.checkBrakes(bicycle);
            this.something(bicycle);
        });
    }
}

class Mechanic2<T> implements IMechanic<T>{

    constructor(private rider: T[]){}

    private cleanBicycle(bicycle: T): void{
        console.log(bicycle, 'cleanBicycle');
    }
    prepareTrip(): T[] {
        return this.rider
    }
    prepareBicycle(bicycles: T[]): void{
        bicycles.forEach(bicycle => {
            this.cleanBicycle(bicycle);
        });
    }
}


class Trip<T> implements ITrip{
    constructor(private mechanic: IMechanic<T>){}
    prepareTravel(): void {
        const bicycles = this.mechanic.prepareTrip();
        this.mechanic.prepareBicycle(bicycles);
    }
}

const cars = [new Car(10), new Car2(10)];
const tripWithCar = new Trip(new Mechanic(cars));
tripWithCar.prepareTravel();

const bicycles = [new Bicycle(10), new Bicycle(10)];
const bicycleWithCar = new Trip(new Mechanic(bicycles));
bicycleWithCar.prepareTravel();

const bicycles2 = [new Bicycle(10), new Bicycle(10)];
const bicycleWithCar2 = new Trip(new Mechanic2(bicycles));
bicycleWithCar2.prepareTravel();