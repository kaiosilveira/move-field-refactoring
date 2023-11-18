import { AccountType } from '.';

describe('AccountType', () => {
  it('should have a name', () => {
    const type = new AccountType('normal', 0.1);
    expect(type.name).toEqual('normal');
  });

  it('should have an interestRate', () => {
    const type = new AccountType('normal', 0.1);
    expect(type.interestRate).toEqual(0.1);
  });
});
