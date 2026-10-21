const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

export function numberToWords(n: number): string {
    if (n === 0) return 'zero'
    if (n === 1000) return 'one thousand'

    let words = ''
    if (n >= 100) {
        words += ONES[Math.floor(n / 100)] + ' hundred'
        n %= 100
        if (n > 0) words += ' and '
    }

    if (n > 0) {
        if (n < 20) {
            words += ONES[n]
        } else {
            words += TENS[Math.floor(n / 10)]
            if (n % 10 > 0) {
                words += '-' + ONES[n % 10]
            }
        }
    }

    return words
}