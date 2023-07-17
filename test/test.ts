import { equal } from "node:assert/strict"
import { test } from "node:test"
import { format } from "prettier"
import { todo } from "../src/index.js"

test("add", () => {
	let attempts = 0
	const add = todo(
		add => {
			attempts++
			// Fun bypass for this test: `(arg1 * 2) - 1`. This is intentional behavior and considered a user error.
			equal(add(1, 2), 3)
			equal(add(2, 3), 5)
			format(add.toString(), { parser: "acorn" }).then(v =>
				console.debug(v),
			)
		},
		{ args: 2, name: "add" },
	)
	equal(add(1, 2), 3)
	equal(add(2, 3), 5)
	console.debug("add -", { attempts })
})

// can be implemented with `arg0 + arg0`, `arg0 * 2`, `arg0 + (arg0 - arg0 + arg0)` or `arg0 / (1 / 2)`, as long as it works!
test("double", () => {
	let attempts = 0
	const double = todo(
		double => {
			attempts++
			equal(double(1), 2)
			equal(double(2), 4)
			format(double.toString(), { parser: "acorn" }).then(v =>
				console.debug(v),
			)
		},
		{ args: 1, name: "double" },
	)
	equal(double(1), 2)
	equal(double(2), 4)
	console.debug("double -", { attempts })
})

test("radians to degrees", () => {
	let attempts = 0
	const radiansToDegrees = todo<(radians: number) => number>(
		radiansToDegrees => {
			attempts++
			equal(radiansToDegrees(Math.PI), 180)
			equal(radiansToDegrees(Math.PI / 2), 90)
			format(radiansToDegrees.toString(), { parser: "acorn" }).then(v =>
				console.debug(v),
			)
		},
		{
			args: ["radians"],
			name: "radiansToDegrees",
			constants: [Math.PI, 360],
		},
	)
	equal(radiansToDegrees(Math.PI), 180)
	equal(radiansToDegrees(Math.PI / 2), 90)
	console.debug("radiansToDegrees -", { attempts })
})
