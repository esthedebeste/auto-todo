import type {
	BinaryExpression,
	BinaryOperator,
	Expression,
	UnaryExpression,
	UnaryOperator,
} from "estree"
import { literal, variable } from "./literal.js"
import { GenerationContext } from "./types.js"

const BINARY_OPERATORS: BinaryOperator[] = ["+", "-", "*", "/"] // todo: add more
function binary(context: GenerationContext): BinaryExpression {
	return {
		type: "BinaryExpression",
		operator:
			BINARY_OPERATORS[Math.floor(Math.random() * BINARY_OPERATORS.length)],
		left: expression(context),
		right: expression(context),
	}
}

const UNARY_OPERATORS: UnaryOperator[] = ["-"] // todo: add more
function unary(context: GenerationContext): UnaryExpression {
	return {
		type: "UnaryExpression",
		operator:
			UNARY_OPERATORS[Math.floor(Math.random() * UNARY_OPERATORS.length)],
		argument: expression(context),
		prefix: true,
	}
}

export function expression(context: GenerationContext): Expression {
	const random = Math.random()
	if (random < 0.6) return variable(context)
	else if (random < 0.85) return binary(context)
	else if (random < 0.9) return unary(context)
	else return literal(context)
}
