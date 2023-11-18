import { Account } from '.';
import { AccountType } from '../account-type';

describe('Account', () => {
  it('should have an interest rate', () => {
    const normalAccount = new AccountType('normal', 0.03);
    const account = new Account('1234', normalAccount, 0.03);
    expect(account.interestRate).toEqual(0.03);
  });
});
