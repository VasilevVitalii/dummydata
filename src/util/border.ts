export function BorderRemove(text: string | undefined, left: string, right: string): string {
	if (!text) return ''
	if (text.startsWith(left) && text.endsWith(right)) return text.slice(left.length, text.length - right.length)
	return text
}

export function BorderAdd(text: string | undefined, left: string, right: string): string {
	if (!text) return ''
	if (text.startsWith(left) || text.endsWith(right)) return text
	return `${left}${text}${right}`
}