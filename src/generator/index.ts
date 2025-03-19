import { GetRandom } from './firmRu/random'
import { NoteRu } from './firmRu/type'

export const generator = {
	firmRu: {
		GetRandom: GetRandom,
		Note: NoteRu,
	},
}

export { TFirmRu } from './firmRu/type'
