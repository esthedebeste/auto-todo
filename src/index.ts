import * as astring from "astring"
import type { BlockStatement } from "estree"
import { LiteralOptions } from "./generate/literal.js"
import { statement } from "./generate/statement.js"
import { GenerationContext } from "./generate/types.js"
import { deepMerge } from "./utils.js"

// eslint-disable-next-line @typescript-eslint/ban-types -- intentional use of Function
type AnyFunction = Function

export type CheckFunction<T extends AnyFunction> = (
	attempt: T,
) => false | unknown

export type Constants = Partial<
	| Record<string | number, unknown>
	| Record<string, unknown>
	| Record<number, unknown>
>

export interface TodoOptions {
	/**
	 * The number of arguments the function should have, or an array of argument names.
	 * @default 1 // ["arg0"]
	 */
	args?: number | string[]
	/**
	 * The function name.
	 * @default "TODO"
	 */
	name?: string
	literal?: LiteralOptions
	/**
	 * Constants that the function can use. Can be an object or an array.
	 * @default {}
	 */
	constants?: Constants
}

function isValid(
	check: CheckFunction<AnyFunction>,
	attempt: AnyFunction,
): boolean {
	try {
		return check(attempt) !== false
	} catch {
		return false
	}
}

/**
 * Create a function from the given parameters. All parameters are usable from within the function.
 */
function makeFunction(
	// !!! THESE PARAMETER NAMES CAN BE USED IN EVAL !!!
	__CONSTANTS__: unknown[],
	__name__: string,
	__parameters__: string[],
	__body__: string,
) {
	return eval(
		`(function ${__name__}(${__parameters__.join(", ")}) {${__body__}})`,
	) as AnyFunction
}

/**
 * Create a function that satisfies the given check. Currently only capable of inserting numeric literals.
 * @param check Checks if the attempt is correct. Can also throw if the attempt is incorrect. (Little note: throwing is slightly less performant than returning false)
 */
export function todo<T extends AnyFunction>(
	check: CheckFunction<T>,
	options: TodoOptions = {},
): T {
	options = deepMerge(
		{
			args: 1,
			name: "TODO",
			constants: {},
			literal: {
				boolean: false,
				number: {
					min: 0,
					max: 5,
					integer: true,
				},
				string: false,
			},
		},
		options,
	)

	const parameters =
		typeof options.args === "number"
			? new Array(options.args).fill(0).map((_, index) => `arg${index}`)
			: options.args

	const constants = Object.values(options.constants)
	const context: GenerationContext = {
		variables: [
			...parameters,
			...constants.map((value, index) =>
				typeof value === "string" ||
				(typeof value === "number" && value === Math.round(value * 10) / 10) || // Keep integers and numbers with one decimal point
				typeof value === "boolean"
					? JSON.stringify(value)
					: `__CONSTANTS__[${index}]`,
			),
		],
		options,
	}
	for (;;) {
		const body: BlockStatement = {
			type: "BlockStatement",
			body: [
				statement(context), // todo: add more statements
			],
		}
		const attempt = makeFunction(
			constants,
			options.name,
			parameters,
			astring.generate(body),
		)
		if (isValid(check, attempt)) return attempt as T
	}
}
