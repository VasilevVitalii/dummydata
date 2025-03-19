import * as fs from 'fs'

export type TWriterParam =
    {kind: 'json', fullFileName: string}

export class Writer {
    private _param = undefined as TWriterParam | undefined
    private _fileStream = undefined as fs.WriteStream | undefined

    private _close(): Error | undefined {
        try {
            console.log('write done')
            if (this._fileStream) this._fileStream.end()
            return undefined
        } catch (err) {
            return err as Error
        }
    }

    constructor(param: TWriterParam) {
        this._param = param
    }

    async Write(data: string): Promise<boolean> {
        try {
            if (!this._fileStream) {
                console.log(`write data in file "${this._param!.fullFileName}" ...`)
                this._fileStream = fs.createWriteStream(this._param!.fullFileName, { encoding: 'utf-8' })
            }
            if (!this._fileStream.write(data)) {
                await new Promise<void>(resolve => this._fileStream!.once('drain', () => resolve()))
            }
            return true
        } catch(err) {
            this._close()
            console.error(`error write in file: "${err}"`)
            return false
        }
    }

    Close() {
        const err = this._close()
        if (err) {
            console.error(`error close file`)
        }
    }
}