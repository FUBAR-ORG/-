interface Benefit{
  getVipBenefit(member: VipMember): void;
  getGoldBenefit(member: GoldMember): void;
}

class DiscountBenefit implements Benefit{
  getVipBenefit(member: VipMember): void {
    console.log(`Vip ${member.name} get vip discount`);
  }

  getGoldBenefit(member: GoldMember): void{
    console.log(`Gold ${member.name} get gold discount`);
  }
}


class PointerBenefit implements Benefit{
  getVipBenefit(member: VipMember): void {
    console.log(`Vip ${member.name} get vip pointer`);
  }

  getGoldBenefit(member: GoldMember): void{

    console.log(`Vip ${member.name} get vip pointer`);
  }
}

interface Member{
  getBenefit(benefit: Benefit): void;
}

class VipMember implements Member{

  constructor(private readonly _name: string) {}

  get name(){
    return this._name;
  }

  getBenefit(benefit: Benefit): void {
    benefit.getVipBenefit(this)
  }
}

class GoldMember implements Member{

  constructor(private readonly _name: string) {}

  get name(){
    return this._name;
  }

  getBenefit(benefit: Benefit): void {
    benefit.getGoldBenefit(this)
  }
}


const goldMember = new GoldMember('gold user');
const vipMember = new VipMember('vip user');
const pointBenefit = new PointerBenefit();
const discountBenefit = new DiscountBenefit();

goldMember.getBenefit(pointBenefit);
vipMember.getBenefit(pointBenefit);
goldMember.getBenefit(discountBenefit);
vipMember.getBenefit(discountBenefit);
