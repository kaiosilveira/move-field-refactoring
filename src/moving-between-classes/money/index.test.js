import { Money } from '.';

describe('Money', () => {
  const twoMonetaryUnits = new Money(2);
  const oneMonetaryUnit = new Money(1);

  describe('add', () => {
    it('should sum two amounts', () => {
      const sum = twoMonetaryUnits.add(oneMonetaryUnit);
      expect(sum).toEqual(new Money(3));
    });
  });

  describe('subtract', () => {
    const sum = twoMonetaryUnits.subtract(oneMonetaryUnit);
    expect(sum).toEqual(new Money(1));
  });

  describe('multiply', () => {
    it('should multiply a monetary unit by a scalar', () => {
      expect(oneMonetaryUnit.multiply(2)).toEqual(new Money(2));
    });
  });
});
