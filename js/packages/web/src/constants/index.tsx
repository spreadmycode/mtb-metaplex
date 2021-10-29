import { WRAPPED_SOL_MINT, Creator } from '@oyster/common';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export * from './labels';
export * from './style';

export const QUOTE_MINT = WRAPPED_SOL_MINT;

export const ROYALTY_LIMIT = LAMPORTS_PER_SOL * 0.05;
export const CONTRACTOR_ADDRESS = '3WTgq7Mzp5tAoe7xYLDJd3mqvnBmpk568QaxePFVpVtS';
export const CONTRACTOR_ACCOUNT = 'GwiD1BABioqAmep3KFpE9decFgAcxsrRiDg7HCe6fEVj';
export const CONTRACTOR_WALLET = '6ky939iyHRRkjjpxVq53jfUh8TTf838Xae6RgPimLqXn';
export const CONTRACTOR_PIVATE = '[204,193,32,174,240,71,109,46,208,151,16,10,196,28,112,255,62,0,158,255,160,179,129,174,56,205,13,158,54,82,56,166,85,141,226,176,129,122,148,4,134,79,191,204,196,180,248,136,92,6,149,116,235,229,243,242,38,199,182,205,234,149,61,17]';

export const OWNERS: Array<Creator> = [
    // System program
    new Creator({
        address: 'HNHW1hTELFegJQG9hxMWm8Uf6LWgeaNZTa5Sdy8g2wce',
        verified: false,
        share: 10
    }),
    // Contractor account
    new Creator({
        address: '6ky939iyHRRkjjpxVq53jfUh8TTf838Xae6RgPimLqXn',
        verified: false,
        share: 40
    }),
    // Branden
    new Creator({
        address: 'BaVEHQFey4VA9mGZrohj7kvds8PHYj5HqoN4Kf1zqKpt',
        verified: false,
        share: 50
    }),
];

export const PRESALERS: Array<string> = [
    'HGo192hk8Bgnqd2PKUi4z1D5zxw3Ut5JotzRru4RYUfM',
    'DsxFKQ6fuzYqN6sahbdHgsJ7RYeUB7Vm18vvveAMCr9X',
    'F2FtU1GpYsRsvDGYmF2wvByZf9HrqUYjyR6shxasdRMV',
    'FxsMNu1KfMrM1YrAnhZTD5d5HKriFHhf8aC54oFQiDpF',
];
