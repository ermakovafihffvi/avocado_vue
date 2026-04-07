export default function validationRules () {

    const requiredTest = (val) => !!val;
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

    const passwordTest = (val) => /^[A-Za-z0-9!@#$%^&*()_+\-=\\|<>\/?~]{4,}$/.test(val);

    return {
        stringTest,
        capitalLetterTest,
        numberTest,
        anyStringTest,
        codeAnyCaseTest,
        positiveNumberTest,
        passwordTest,
        requiredTest
    };
};
