import { useEffect, useState } from 'react';

export type CurrencyCode = 'MDL' | 'EUR' | 'USD' | 'RON';

interface CurrencyOption {
    code: CurrencyCode;
    label: string;
    locale: string;
    rateFromRon: number;
}

const CURRENCY_STORAGE_KEY = 'sb_currency';
const CURRENCY_EVENT = 'sb_currency_changed';

export const CURRENCIES: CurrencyOption[] = [
    { code: 'MDL', label: 'MDL', locale: 'ro-MD', rateFromRon: 3.95 },
    { code: 'EUR', label: 'EUR', locale: 'ro-RO', rateFromRon: 0.2 },
    { code: 'USD', label: 'USD', locale: 'en-US', rateFromRon: 0.22 },
    { code: 'RON', label: 'RON', locale: 'ro-RO', rateFromRon: 1 },
];

function isCurrencyCode(value: string | null): value is CurrencyCode {
    return CURRENCIES.some((currency) => currency.code === value);
}

function getCurrencyConfig(currencyCode: CurrencyCode) {
    return CURRENCIES.find((currency) => currency.code === currencyCode) ?? CURRENCIES[0];
}

export function getSelectedCurrency(): CurrencyCode {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return isCurrencyCode(stored) ? stored : 'MDL';
}

export function setSelectedCurrency(currency: CurrencyCode) {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    window.dispatchEvent(new Event(CURRENCY_EVENT));
}

export function convertFromRon(amountRon: number, currency: CurrencyCode) {
    const { rateFromRon } = getCurrencyConfig(currency);
    return amountRon * rateFromRon;
}

export function formatCurrency(amountRon: number, currency: CurrencyCode) {
    const config = getCurrencyConfig(currency);
    const convertedAmount = convertFromRon(amountRon, currency);

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code,
        currencyDisplay: 'symbol',
        maximumFractionDigits: 0,
    }).format(convertedAmount);
}

export function useCurrency() {
    const [currency, setCurrencyState] = useState<CurrencyCode>(() => getSelectedCurrency());

    useEffect(() => {
        const syncCurrency = () => setCurrencyState(getSelectedCurrency());
        window.addEventListener(CURRENCY_EVENT, syncCurrency);
        window.addEventListener('storage', syncCurrency);
        return () => {
            window.removeEventListener(CURRENCY_EVENT, syncCurrency);
            window.removeEventListener('storage', syncCurrency);
        };
    }, []);

    return {
        currency,
        currencies: CURRENCIES,
        setCurrency: setSelectedCurrency,
        formatPrice: (amountRon: number) => formatCurrency(amountRon, currency),
        convertPrice: (amountRon: number) => convertFromRon(amountRon, currency),
    };
}
