import { Identifier, Literal } from "estree"
import { weightedRandom } from "../utils.js"
import { GenerationContext } from "./types.js"

export interface LiteralBooleanOptions {
	/** The chance of generating `true` (0 to 1) @default 0.5 */
	true?: number
}

export interface LiteralNumberOptions {
	/** Minimum value (inclusive) @default 0 */
	min?: number
	/** Maximum value (exclusive) @default 5 */
	max?: number
	/** Whether the number should be floored @default true */
	integer?: boolean
}

export interface LiteralStringOptions {
	/** Possible strings to generate */
	options: string[]
}

export interface LiteralOptions {
	/** @default undefined */
	boolean?: LiteralBooleanOptions | false
	/** @default { min: 0, max: 5 } */
	number?: LiteralNumberOptions | false
	/** @default undefined */
	string?: LiteralStringOptions | false
}

export function number(context: GenerationContext): Literal {
	const {
		min = 0,
		max = 5,
		integer = true,
	} = context.options.literal.number || {}
	let value = Math.random() * (max - min) + min
	if (integer) value = Math.floor(value)
	return { type: "Literal", value }
}

export function string(context: GenerationContext): Literal {
	const { options } = context.options.literal?.string || { options: [] }
	return {
		type: "Literal",
		value: options[Math.floor(Math.random() * options.length)],
	}
}

export function boolean(context: GenerationContext): Literal {
	const { true: trueChance = 0.5 } = context.options.literal?.boolean || {}
	return { type: "Literal", value: Math.random() < trueChance }
}

export function literal(context: GenerationContext): Literal {
	const generate = weightedRandom([
		[number, Number(Boolean(context.options.literal?.number ?? true))],
		[string, Number(Boolean(context.options.literal?.string ?? false))],
		[boolean, Number(Boolean(context.options.literal?.boolean ?? false))],
	])
	return generate(context)
}

export function variable(context: GenerationContext): Identifier {
	return {
		type: "Identifier",
		name: context.variables[
			Math.floor(Math.random() * context.variables.length)
		],
	}
}
