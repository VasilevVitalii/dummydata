//@ts-check
const path = require('path')
const fs = require('fs')
const vv = require('vv-common')

/** @returns {string} */
function dirRoot() {
    return path.join(__dirname, "..")
}
exports.dirRoot = dirRoot

/** @returns {string} */
function dirDist() {
    return path.join(__dirname, "..", "dist", "src")
}
exports.dirDist = dirDist

/**
 * @returns {string}
 *  */
function dirCompile() {
    return path.join(__dirname, "..", "compile")
}
exports.dirCompile = dirCompile

/**
 * @returns {string}
 *  */
function version() {
    const t = fs.readFileSync(path.join(dirRoot(), 'package.json'), 'utf8')
    return JSON.parse(t).version
}
exports.version = version

