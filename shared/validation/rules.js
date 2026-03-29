export default function validationRules () {

    const stringTest = (val) => {
        return /^[a-zA-Z0-9\u0020]+$/gm.test(val); // +space
    };
    const capitalLetterTest = (val) => /^[A-Z]+$/.test(val);
    const numberTest = (val) => /^(?:\d+|\d*\.\d+)$/.test(val);
    const positiveNumberTest = (val) => /^[1-9]{1,}\d{0,}$/gm.test(val);
    const anyStringTest = (val) => {
        return /^[\p{L}\p{N}\p{P}\p{Zs}]+$/u.test(val);
    };
    const codeAnyCaseTest = (val) => /^[a-zA-Z_]+$/gm.test(val);

    return {
        stringTest,
        capitalLetterTest,
        numberTest,
        anyStringTest,
        codeAnyCaseTest,
        positiveNumberTest
    };
};
