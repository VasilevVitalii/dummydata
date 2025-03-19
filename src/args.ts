import { prop, toString, toBool, toIntPositive, toInt } from 'vv-common'
import { EAppParamKind, TAppParam } from '.'
import { BorderRemove } from './util/border'

export function PrettyArgs(args: any): { error?: string; result?: TAppParam } {
	const errors = [] as string[]
	const kind = getKind(args, 'kind')
	const count = getCount(args, 'count')
	if (!kind.raw) {
		errors.push('not found arg "--kind"')
	} else if (!kind.result) {
		errors.push('bad arg "--kind"')
	}
	if (count.raw && !count.result) {
		errors.push('bad arg "--count"')
	}
	if (errors.length > 0) {
		return { error: `${errors.join('\n')}\n\nHELP:\n\n${HelpArgs()}` }
	} else {
		return { result: { kind: kind.result, count: count.result } }
	}
}

function getKind(args: any, param: string): { raw: string | undefined; result: EAppParamKind | undefined } {
	const raw = toString(prop(args, param))
	const result = Object.values(EAppParamKind).includes(raw as EAppParamKind) ? (raw as EAppParamKind) : undefined
	return { raw, result }
}

function getCount(args: any, param: string): { raw: string | undefined; result: number | undefined } {
	const raw = toString(prop(args, param))
	const result = raw ? toInt(BorderRemove(BorderRemove(raw, `"`, `"`), `'`, `'`)) : undefined
	return {
		raw,
		result: result === undefined || result <= 0 ? undefined : result,
	}
}

export function HelpArgs(): string {
	return [
		`agrs:`,
		`    --kind          REQUIRED     kind of generated data ("firm-ru")`,
		`    --count         OPTIONAL     count of generated items (if empty, show help about kind)`,
		`example:`,
		`    --kind='firm-ru' --count=1000`,
	].join('\n')
}
