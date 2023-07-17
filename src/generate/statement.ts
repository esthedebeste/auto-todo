import type { Statement } from "estree"
import { expression } from "./expression.js"
import type { GenerationContext } from "./types.js"

export function statement(context: GenerationContext): Statement {
	return {
		type: "ReturnStatement", // todo: add more
		argument: expression(context),
	}
}
