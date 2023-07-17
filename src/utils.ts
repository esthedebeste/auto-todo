export function weightedRandom<const T>(options: [T, number][]): T {
	const total = options.reduce((total, [, weight]) => total + weight, 0)
	let random = Math.random() * total
	for (const [option, weight] of options) {
		random -= weight
		if (random < 0) return option
	}
	throw new Error("weightedRandom: unreachable")
}

export function deepMerge<T extends object>(to: T, from: T) {
	for (const [key, value] of Object.entries(from)) {
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			if (key in to) deepMerge(to[key], value)
			else to[key] = value
		} else to[key] = value
	}
	return to
}
