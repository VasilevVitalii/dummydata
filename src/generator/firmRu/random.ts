import { GetRandomArray, GetRandomDigit, GetRandomItem, GetRandomNumber } from '../../util/random'
import { TransliterateRu } from '../../util/transliterateRu'
import { Bank, Capital, City, Legal, Mail, NameBody, NameHead, NameTail, Okved, PersonFirstName, PersonLastName, PersonMiddleName, Street } from './chunk'
import { TFirmRu } from './type'
import * as vvc from 'vv-common'

export function GetRandom(): TFirmRu {
	const firmName = GetName()
	const legal = GetLegal()
	const innKpp = GetInnKpp()
	const city = GetRandomItem(City)
	const registration_date = GetRegistrationDate()
	const legal_address = GetAddress(city.title)
	const bank = GetRandomItem(Bank)

	return {
		id: 0,
		full_name: `${legal.title} "${firmName}"`,
		short_name: `${legal.legal} "${firmName}"`,
		legal_form: legal.legal,
		inn: innKpp.inn,
		kpp: innKpp.kpp,
		ogrn: GetOgrn(legal.legal === 'ИП' ? true : false, registration_date, city.region_code),
		legal_address: legal_address,
		actual_address: GetRandomNumber(3) === 3 ? GetAddress(city.title) : legal_address,
		phone: `+7 (${city.phone_code}) ${GetRandomArray(3).join('')}-${GetRandomArray(2).join('')}-${GetRandomArray(2).join('')}`,
		email: GetMail(firmName, city.title),
		bank_account: bank.bank_account,
		bank_bik: bank.bank_bik,
		bank_name: bank.bank_name,
		correspondent_account: GetCorrespondentAccount(bank.bank_bik),
		okpo: GetOKPO(legal.legal === 'ИП' ? true : false),
		okved: GetRandomNumber(4) === 4 ? '' : GetRandomItem(Okved).code,
		oktmo: GetRandomNumber(4) === 4 ? GetRandomItem(city.oktmo) : '',
		okfs:
			GetRandomNumber(4) === 4 ? (legal.legal === 'ГУП' ? '13' : legal.legal === 'ИП' || legal.legal === 'АО' || legal.legal === 'ПАО' ? '16' : '') : '',
		okopf: GetRandomNumber(4) === 4 ? GetRandomItem(legal.okopf) : '',
		registration_date: vvc.dateFormat(registration_date,'yyyy-mm-dd'),
		ceo_name: GetPerson(),
		capital: GetRandomNumber(4) === 4 ? GetRandomItem(Capital) : undefined,
	}
}

function GetName(): string {
	const name = [] as string[]
	if (GetRandomNumber(3) === 3) {
		name.push(GetRandomItem(NameHead))
	}
	for (let i = 0; i < GetRandomNumber(3); i++) {
		let body = GetRandomItem(NameBody)
		while (name.includes(body)) {
			body = GetRandomItem(NameBody)
		}
		name.push(body)
	}
	if (GetRandomNumber(20) === 20) {
		name.push(GetRandomItem(NameTail))
	}
	return name.join('')
}

function GetLegal(): { legal: string; title: string; okopf: string[] } {
	const i = GetRandomNumber(Legal.length)
	return GetRandomItem(Legal.slice(0, i))
}

function GetInnKpp(): { inn: string; kpp: string } {
	const taxOfficeCode = GetRandomArray(4)
	const innBody = GetRandomArray(5)
	const calculateControlDigit = (weights: number[], digits: number[]) => {
		const sum = digits.reduce((acc, digit, index) => acc + digit * weights[index], 0)
		return (sum % 11) % 10
	}
	const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8]
	const innDigits = [...taxOfficeCode, ...innBody]
	const controlDigit = calculateControlDigit(weights, innDigits)
	const inn = [...innDigits, controlDigit].join('')
	const fixedPart = '01'
	const kppRandomPart = GetRandomArray(3).join('')
	const kpp = `${taxOfficeCode.join('')}${fixedPart}${kppRandomPart}`
	return { inn, kpp }
}

function GetRegistrationDate(): Date {
	const startTime = new Date('2001-01-01').getTime()
	const endTime = new Date('2024-12-31').getTime()
	const randomTime = Math.random() * (endTime - startTime) + startTime
	return new Date(randomTime)
}

function GetOgrn(is_person: boolean, registration_date: Date, region_code: string): string {
	const type = is_person ? 2 : 1
	const year = registration_date.getFullYear() % 100
	const uniqueNumber = GetRandomArray(8).join('')
	const first12Digits = `${type}${year}${region_code}${uniqueNumber}`
	const controlDigit = ogrnCalculateControlNumber(first12Digits)
	return `${first12Digits}${controlDigit}`
}

function GetAddress(cityTitle: string): string {
	let address = `г. ${cityTitle}, ул.${GetRandomItem(Street)}, д.${GetRandomNumber(100)}`
	if (GetRandomNumber(10) === 10) {
		address = `${address}, оф.${GetRandomNumber(100)}`
	}
	return address
}

function GetMail(firmName: string, cityName: string): string {
	const rnd = GetRandomNumber(4)
	if (rnd === 1) {
		return `info@${TransliterateRu(firmName.replace('-', ''))}${TransliterateRu(cityName.replace('-', '').replace(' ', ''))}.ru`
	} else if (rnd === 2) {
		return `info@${TransliterateRu(firmName).replace('-', '')}.ru`
	} else if (rnd === 3) {
		return `${TransliterateRu(firmName).replace('-', '')}@${GetRandomItem(Mail)}`
	} else {
		return ''
	}
}

export function GetCorrespondentAccount(bik: string): string {
	if (bik.length !== 9) {
		throw new Error('БИК должен содержать ровно 9 цифр')
	}
	const prefix = '301'
	const randomPart = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('')
	const account = `${prefix}${randomPart}`
	return account
}

function GetOKPO(is_person: boolean): string {
	const length = is_person ? 10 : 8
	const base = Array.from({ length: length - 1 }, () => Math.floor(Math.random() * 10)).join('')
	const controlDigit = okpoCalculateControlNumber(base)
	return `${base}${controlDigit}`
}

function GetPerson(): string {
    const isW = GetRandomNumber(3) === 3
    const isShort = GetRandomNumber(3) === 3
    const lastNameObj = GetRandomItem(PersonLastName)
    const middleNameObj = GetRandomItem(PersonMiddleName)
    const firstNameObj = GetRandomItem(PersonFirstName)
    const lastNameGender = isW ? lastNameObj.w : lastNameObj.m
    const middleNameGender = isW ? middleNameObj.w : middleNameObj.m
    const firstNameGender = isW ? firstNameObj.w : firstNameObj.m
    const middleName = isShort ? `${middleNameGender[0]}.` : middleNameGender
    const firstName = isShort ? `${firstNameGender[0]}.` : firstNameGender
    return `${lastNameGender} ${firstName} ${middleName}`
}

function okpoCalculateControlNumber(base: string): number {
	const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	let sum = 0
	for (let i = 0; i < base.length; i++) {
		sum += parseInt(base[i], 10) * weights[i]
	}
	let checksum = sum % 11
	if (checksum === 10) {
		checksum = 0
	}
	return checksum
}

function ogrnCalculateControlNumber(first12Digits: string): number {
	const divisor = 11
	let remainder = 0
	for (let i = 0; i < first12Digits.length; i++) {
		remainder = (remainder * 10 + parseInt(first12Digits[i], 10)) % divisor
	}
	return remainder
}
