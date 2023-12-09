[![Continuous Integration](https://github.com/kaiosilveira/move-field-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/move-field-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Move field

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
class Customer {
  get plan() {
    return this._plan;
  }

  get discountRate() {
    return this._discountRate;
  }
}
```

</td>

<td>

```javascript
class Customer {
  get plan() {
    return this._plan;
  }

  get discountRate() {
    return this.plan._discountRate;
  }
}
```

</td>
</tr>
</tbody>
</table>

Fields are the most granular representation of data in an object-oriented world. Nevertheless, defining which classes should contain which fields is often a hard task, even for experienced domain-driven architects. Hopefully, definitions aren't written in stone and, with enough codebase hygiene, moving a field from one class to another is straightforward. This refactoring brings a set of steps and considerations to help with these cases.

## Working examples

Two working examples were provided for this refactoring. The first one touches on a scenario of moving a field from one class to another, while the second one describes how to move behavior to a shared object.

### Moving between classes

In this example, we have a `Customer` class with a `discountRate` field. We decided, though, that the best place to keep the `discountRate` field is in the `CustomerContract` class.

#### Test suite

A straightforward test suite was put in place to support our refactoring moves. It covers the behavior of `becomePreferred` and `applyDiscount`. The test code is shown below:

```javascript
describe('Customer', () => {
  describe('becomePreferred', () => {
    it('should add 0.03 to the initial discount rate', () => {
      const customer = new Customer('John', 0.97);
      customer.becomePreferred();
      expect(customer.discountRate).toEqual(1);
    });
  });

  describe('applyDiscount', () => {
    it('should apply the discount rate to a given amount', () => {
      const customer = new Customer('John', 0.1);
      const amount = new Money(100);
      const discountedAmount = customer.applyDiscount(amount);
      expect(discountedAmount).toEqual(new Money(90));
    });
  });
});
```

With that in place, we're good to go.

#### Steps

Our first step is to introduce a private setter to `discountRate`. This move is important so we're sure that the field is not being modified from any other source. The method is marked as "private" (underscore convention in JS, since it has no access protection) because we don't want to allow for external modifications of the field.

```diff
diff --git a/src/moving-between-classes/customer/index.js b/src/moving-between-classes/customer/index.js
@@ -5,7 +5,7 @@
const dateToday = () => new Date();
 export class Customer {
   constructor(name, discountRate) {
     this._name = name;
-    this._discountRate = discountRate;
+    this._setDiscountRate(discountRate);
     this._contract = new CustomerContract(dateToday());
   }

@@ -13,13 +13,17 @@ export class Customer {
     return this._discountRate;
   }

+  _setDiscountRate(aNumber) {
+    this._discountRate = aNumber;
+  }
+
   becomePreferred() {
-    this._discountRate += 0.03;
+    this._setDiscountRate(this.discountRate + 0.03);
     // other nice things
   }

   applyDiscount(amount) {
-    const discountValue = amount.multiply(this._discountRate);
+    const discountValue = amount.multiply(this.discountRate);
     return amount.subtract(discountValue);
   }
 }
```

Next, we can add an accessor to `discountRate` at `CustomerContract` and update the tests:

```diff
diff --git a/src/moving-between-classes/customer-contract/index.js b/src/moving-between-classes/customer-contract/index.js
@@ -1,5 +1,14 @@
 export class CustomerContract {
-  constructor(startDate) {
+  constructor(startDate, discountRate) {
     this._startDate = startDate;
+    this._discountRate = discountRate;
+  }
+
+  get discountRate() {
+    return this._discountRate;
+  }
+
+  set discountRate(arg) {
+    this._discountRate = arg;
   }
 }

diff --git a/src/moving-between-classes/customer-contract/index.test.js b/src/moving-between-classes/customer-contract/index.test.js
new file mode 100644
@@ -0,0 +1,8 @@
+import { CustomerContract } from '.';
+
+describe('CustomerContract', () => {
+  it('should have a discount rate', () => {
+    const contract = new CustomerContract(new Date(), 0.1);
+    expect(contract.discountRate).toEqual(0.1);
+  });
+});
```

Finally, we can update the `Customer` class to use the `discountRate` field from `CustomerContract`, and that's when our test says "not yet":

```zsh
 FAIL  src/moving-between-classes/customer/index.test.js
  ● Customer › becomePreferred › should add 0.03 to the initial discount rate

    TypeError: Cannot set properties of undefined (setting '_discountRate')

      15 |
      16 |   _setDiscountRate(aNumber) {
    > 17 |     this._contract._discountRate = aNumber;
         |                                 ^
      18 |   }
      19 |
      20 |   becomePreferred() {
```

The error happened because we were calling `_setDiscountRate` before initializing the contract. After sliding the statements and putting back the delegation at `discountRate`, we finally have:

```diff
diff --git a/src/moving-between-classes/customer/index.js b/src/moving-between-classes/customer/index.js
@@ -5,16 +5,16 @@
const dateToday = () => new Date();
 export class Customer {
   constructor(name, discountRate) {
     this._name = name;
+    this._contract = new CustomerContract(dateToday(), discountRate);
     this._setDiscountRate(discountRate);
-    this._contract = new CustomerContract(dateToday());
   }

   get discountRate() {
-    return this._discountRate;
+    return this._contract._discountRate;
   }

   _setDiscountRate(aNumber) {
-    this._discountRate = aNumber;
+    this._contract._discountRate = aNumber;
   }

   becomePreferred() {
```

And that's it! The field is now moved to `CustomerContract`, with the `Customer` simply forwarding calls to it.

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                        | Message                                                         |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [746a191](https://github.com/kaiosilveira/move-field-refactoring/commit/746a1910bcad7597015a83ed707e884f7d55dc22) | introduce private setter to `discountRate`                      |
| [a620e69](https://github.com/kaiosilveira/move-field-refactoring/commit/a620e690ef7c5becaf8a5add855df8a0f97205f0) | add acessor for `discountRate` at `CustomerContract`            |
| [cb6b42e](https://github.com/kaiosilveira/move-field-refactoring/commit/cb6b42edce25418ac0d8a364aab880e34fef351a) | update `Customer` to use `discountRate` from `CustomerContract` |

For the full commit history for this example, check the [Commit History tab](https://github.com/kaiosilveira/move-field-refactoring/commits/main) for commits with the `moving-between-classes` prefix.

### Moving to a shared object

In this example, we have an `Account` object, that contains an `AccountType`. Due to new requirements related to different interest rates for different account types, our idea was to move the `interestRate` field to the `AccountType` class. This field is currently on the `Account`.

#### Test suite

A simple test suite was put in place to cover existing behavior:

```javascript
describe('Account', () => {
  it('should have an interest rate', () => {
    const normalAccount = new AccountType('normal');
    const account = new Account('1234', normalAccount, 0.03);
    expect(account.interestRate).toEqual(0.03);
  });
});

describe('AccountType', () => {
  it('should have a name', () => {
    const type = new AccountType('normal');
    expect(type.name).toEqual('normal');
  });
});
```

With that in place, we're ready to start.

#### Steps

Our first step is to add an `interestRate` field to to `AccountType`, updating the existing tests and adding a new one:

```diff
diff --git a/src/moving-to-a-shared-object/account-type/index.js b/src/moving-to-a-shared-object/account-type/index.js
@@ -1,9 +1,14 @@
 export class AccountType {
-  constructor(nameString) {
+  constructor(nameString, interestRate) {
     this._name = nameString;
+    this._interestRate = interestRate;
   }

   get name() {
     return this._name;
   }
+
+  get interestRate() {
+    return this._interestRate;
+  }
 }

diff --git a/src/moving-to-a-shared-object/account-type/index.test.js b/src/moving-to-a-shared-object/account-type/index.test.js
@@ -2,7 +2,12 @@
import { AccountType } from '.';

 describe('AccountType', () => {
   it('should have a name', () => {
-    const type = new AccountType('normal');
+    const type = new AccountType('normal', 0.1);
     expect(type.name).toEqual('normal');
   });
+
+  it('should have an interestRate', () => {
+    const type = new AccountType('normal', 0.1);
+    expect(type.interestRate).toEqual(0.1);
+  });
 });
```

Next, we stop to introduce an assertion to make sure all interest rates currently in the accounts match the new `interestRate` value registered on the `AccountType`. For that, we resort to NodeJS' `assert` library:

```diff
diff --git a/src/moving-to-a-shared-object/account/index.js b/src/moving-to-a-shared-object/account/index.js
@@ -1,7 +1,10 @@
+import assert from 'assert';
+
 export class Account {
   constructor(number, type, interestRate) {
     this._number = number;
     this._type = type;
+    assert(interestRate === this._type.interestRate);
     this._interestRate = interestRate;
   }

diff --git a/src/moving-to-a-shared-object/account/index.test.js b/src/moving-to-a-shared-object/account/index.test.js
@@ -3,7 +3,7 @@
import { AccountType } from '../account-type';

 describe('Account', () => {
   it('should have an interest rate', () => {
-    const normalAccount = new AccountType('normal');
+    const normalAccount = new AccountType('normal', 0.03);
     const account = new Account('1234', normalAccount, 0.03);
     expect(account.interestRate).toEqual(0.03);
   });
```

With this protection in place, we're safe to update the `Account` class to read the `interestRate` field from `AccountType`:

```diff
diff --git a/src/moving-to-a-shared-object/account/index.js b/src/moving-to-a-shared-object/account/index.js
@@ -9,6 +9,6 @@
export class Account {
   }

   get interestRate() {
-    return this._interestRate;
+    return this._type._interestRate;
   }
 }
```

And that's it!

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                        | Message                                                    |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [b250ac6](https://github.com/kaiosilveira/move-field-refactoring/commit/b250ac6d131265fb6e93b973db1d6cea2efd84df) | add `interestRate` to `AccountType`                        |
| [d32e9b4](https://github.com/kaiosilveira/move-field-refactoring/commit/d32e9b42d672b991d7a6a3ddafb363f26611e4ae) | introduce assertion to make sure interest rates match      |
| [e984bf1](https://github.com/kaiosilveira/move-field-refactoring/commit/e984bf1c016bf9bc536a88b9884c9db18cd01c63) | update `Account` to read `interestRate` from `AccountType` |

For the full commit history for this example, check the [Commit History tab](https://github.com/kaiosilveira/move-field-refactoring/commits/main) for commits with the `moving-to-shared-object` prefix.
