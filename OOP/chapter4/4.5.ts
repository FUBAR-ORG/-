// interface IBicycle{
//     ride(): void;
//     brake(): void;
// }

// interface ITrip{
//     prepareTravel(): void;
// }

// interface IMechanic{
//     cleanBicycle(bicycle: IBicycle): void;
//     pumpTires(bicycle: IBicycle): void;
//     lubeChain(bicycle: IBicycle): void;
//     checkBrakes(bicycle: IBicycle): void;
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
//     cleanBicycle(bicycle: IBicycle): void{
//         console.log(bicycle, 'cleanBicycle');
//     }
//     pumpTires(bicycle: IBicycle): void {
//         console.log(bicycle, 'pumpTires');
//     }
//     lubeChain(bicycle: IBicycle): void {
//         console.log(bicycle, 'lubeChain');
//     }
//     checkBrakes(bicycle: IBicycle): void {
//         console.log(bicycle, 'checkBrakes');
//     }
//     // add prepare procedure
//     something(bicycle: IBicycle): void {
//         console.log(bicycle, 'something');
//     }
// }

// class Trip implements ITrip{
//     constructor(private bicycles: IBicycle[], private mechanic: IMechanic){}
//     prepareTravel(): void {
//         this.bicycles.forEach(bicycle => {
//             this.mechanic.cleanBicycle(bicycle);
//             this.mechanic.pumpTires(bicycle);
//             this.mechanic.lubeChain(bicycle);
//             this.mechanic.checkBrakes(bicycle);
//         })
//     }
// }


// const bicycles = [new Bicycle(10), new Bicycle2(10)];
// const mechanic = new Mechanic();
// const trip = new Trip(bicycles, mechanic);

// trip.prepareTravel();
