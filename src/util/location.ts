import { sep, join } from 'path'
import { existsSync } from 'fs'

export function AppInPkg(): boolean {
	const result = __dirname
	if (result) {
		const parts = result.split(sep)
		if (parts.length > 1 && parts[1].toUpperCase() === 'SNAPSHOT') {
			return true
		}
	}
	return false
}

export function AppDir(): string {
	if (AppInPkg()) {
		return process.cwd()
	}

	const result = __dirname
	if (result) {
		const parts = result.split(sep)
		let isFindPackageJson = existsSync(pp(parts, true))
		while (!isFindPackageJson) {
			parts.pop()
			isFindPackageJson = existsSync(pp(parts, true))
		}
		return pp(parts, false)
	}
	return __dirname
}

function pp(parts: string[], allowPackageJson: boolean): string {
	let res = ''
	if (parts.length > 0 && parts[0] === '') {
		res = `${sep}${join(...parts)}`
	} else {
		res = join(...parts)
	}
	if (allowPackageJson) {
		return join(res, 'package.json')
	}
	return res
}
