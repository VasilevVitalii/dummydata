export function GetRandomItem<T>(array: T[]): T {
	const randomIndex = Math.floor(Math.random() * array.length)
	return array[randomIndex]
}

export function GetRandomNumber(n: number): number {
	if (n <= 0) {
		throw new Error('The input number must be greater than 0')
	}
	return Math.floor(Math.random() * n) + 1
}

export function GetRandomBoolean(): boolean {
	return Math.random() < 0.5
}

export function GetRandomDigit(): number {
	return Math.floor(Math.random() * 10)
}

export function GetRandomArray(len: number): number[] {
	if (len <= 0) {
		throw new Error('The len must be greater than 0')
	}
	return Array.from({ length: len }, GetRandomDigit)
}
