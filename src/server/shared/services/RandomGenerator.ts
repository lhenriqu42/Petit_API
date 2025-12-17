export const randString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};

export const randNumber = (length: number): number => {
    let result = '';
    const numbers = '1234567890';
    const numbersLength = numbers.length;
    let counter = 0;
    while (counter < length) {
        result += numbers.charAt(Math.floor(Math.random() * numbersLength));
        counter += 1;
    }
    return Number(result);
};

export const randNumberRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};