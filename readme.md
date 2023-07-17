# Auto-Todo

Ever wanna not write code? Auto-Todo is your friend. Instead of writing logic, you get to lay back and write tests!

 - ✅ Test-driven development
 - ✅ 100% test coverage
 - ✅ No-code development

```ts
import * as assert from "assert"
import { todo } from "auto-todo"

const add = todo<(a: number, b: number) => number>(
    add => {
        assert.equal(add(1, 2), 3)
        assert.equal(add(2, 3), 5)
    },
    { args: 2 },
)

add(1, 2) // 3
add(2, 3) // 5
add(5, 8) // 13, hopefully
```

<details>
    <summary>Fun question! Find a bypass, where <code>add(1, 2)</code> is 3, and <code>add(2, 3)</code> is 5, but <code>add(5, 8)</code> is <em>NOT</em> 13</summary>

`(b * 2) - 1`!

 - 2 * 2 - 1 = 3
 - 3 * 2 - 1 = 5
 - 8 * 2 - 1 = 15

In the scope of auto-todo, letting this happen is considered a user error. Write your tests well!

</details>

## Installation

```sh
pnpm install auto-todo
yarn add auto-todo
npm install auto-todo
```

## Notes

 - Uses `eval` to generate code
 - It takes a little time to generate the code! Or a big time!
    - `Math.random()` is used generously
    - The complexity of the requested function plays a role. `a + b` will generate faster than `a * 5 + b * 2 - 4`
