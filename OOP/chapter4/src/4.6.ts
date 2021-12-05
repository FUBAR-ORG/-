// interface IBicycle{
//     ride(): void;
//     brake(): void;
// }

// interface ITrip{
//     prepareTravel(): void;
// }

// interface IMechanic{
//     prepareBicycle(bicycle: IBicycle[]): void;
// }

// class Bicycle implements IBicycle{
//     constructor(private size: number){}
//     ride(): void {
//         console.log('ride');
//     }
//     brake(): void {
//         console.log('brake');
//     }
// }

// class Bicycle2 implements IBicycle{
//     constructor(private size: number){}
//     ride(): void {
//         console.log('ride2');
//     }
//     brake(): void {
//         console.log('brake2');
//     }
// }

// class Mechanic implements IMechanic{
//     private cleanBicycle(bicycle: IBicycle): void{
//         console.log(bicycle, 'cleanBicycle');
//     }
//     private pumpTires(bicycle: IBicycle): void {
//         console.log(bicycle, 'pumpTires');
//     }
//     private lubeChain(bicycle: IBicycle): void {
//         console.log(bicycle, 'lubeChain');
//     }
//     private checkBrakes(bicycle: IBicycle): void {
//         console.log(bicycle, 'checkBrakes');
//     }
//     private something(bicycle: IBicycle): void {
//         console.log(bicycle, 'something');
//     }
//     prepareBicycle(bicycles: IBicycle[]): void{
//         bicycles.forEach(bicycle => {
//             this.cleanBicycle(bicycle);
//             this.pumpTires(bicycle);
//             this.lubeChain(bicycle);
//             this.checkBrakes(bicycle);
//             this.something(bicycle);
//         });
//     }
// }


// class Trip implements ITrip{
//     constructor(private bicycles: IBicycle[], private mechanic: IMechanic){}
//     prepareTravel(): void {
//         this.mechanic.prepareBicycle(this.bicycles);
//     }
// }

// const bicycles = [new Bicycle(10), new Bicycle2(10)];
// const mechanic = new Mechanic();
// const trip = new Trip(bicycles, mechanic);

// trip.prepareTravel();