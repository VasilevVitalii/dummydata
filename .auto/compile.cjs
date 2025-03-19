//@ts-check
const fs = require("fs-extra")
const path = require("path")
const s = require('./compile.shared.cjs')
const { execSync } = require("child_process")
const vv = require('vv-common')

//build backend
fs.emptyDirSync(s.dirDist())
execSync(`npm rebuild`, {cwd: s.dirRoot() })
execSync(`tsc`, {cwd: s.dirRoot() })
fs.copyFileSync(path.join(s.dirRoot(), 'package.json'), path.join(s.dirDist(), 'package.json'))

//compile
fs.emptyDirSync(s.dirCompile())
execSync(`pkg . --out-path compile --compress GZip --debug`, {cwd: s.dirRoot() })

console.log('DONE!')