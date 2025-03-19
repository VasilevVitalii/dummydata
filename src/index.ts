import minimist from 'minimist'
import { PrettyArgs } from './args'
import { generator } from './generator'
import * as fs from 'fs'
import * as path from 'path'
import { AppDir } from './util/location'
import { Writer } from './util/wtiter'

export enum EAppParamKind {
	firmRu = 'firm-ru',
}

export type TAppParam = {
	kind?: EAppParamKind
	count?: number
}

export const env = {
	args: undefined as TAppParam | undefined,
}

setTimeout(async () => {
	if (env.args) return

	const prettyArgs = PrettyArgs(minimist(process.argv.slice(2)))
	if (prettyArgs.error) {
		console.log(prettyArgs.error)
	} else if (prettyArgs.result) {
		env.args = prettyArgs.result
		Go()
	}
}, 2000)

export function Go() {
	try {
		if (!env.args) return
		if (env.args.kind === 'firm-ru') {
			if (!env.args.count) {
				console.log(generator.firmRu.Note())
			} else {
				;(async () => {
					const writer = new Writer({kind: 'json', fullFileName: path.join(AppDir(), 'firm-ru.json')})
					const len = env?.args?.count || 0
					if (!(await writer.Write(`[\n`))) return
					for (let i = 0; i < len; i++) {
						const data = generator.firmRu.GetRandom()
						data.id = i
						const text = JSON.stringify(data, null, '').replace(/\n/g, '')
						if (!(await writer.Write(`${text}${i + 1 === len ? '\n' : ',\n'}`))) return
					}
					if (!(await writer.Write(`]`))) return
					writer.Close()
				})()
			}
		}
	} catch (err) {
		console.error(`${(err as Error).message}`)
	}
}
