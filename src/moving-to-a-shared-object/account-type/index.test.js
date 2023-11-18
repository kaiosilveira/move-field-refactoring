import { AccountType } from '.';

describe('AccountType', () => {
  it('should have a name', () => {
    const type = new AccountType('normal');
    expect(type.name).toEqual('normal');
  });
});
