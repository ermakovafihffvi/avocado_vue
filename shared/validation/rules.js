export default function validationRules () {

    const stringTest = (val) => {
        console.log('string validations');
        return /^[a-zA-Z]+$/gm.test(val);
    };
    const capitalLetterTest = (val) => /^[A-Z]+$/.test(val);
    const numberTest = (val) => /^(?:\d+|\d*\.\d+)$/.test(val);

    return {
        stringTest,
        capitalLetterTest,
        numberTest
    };
};
