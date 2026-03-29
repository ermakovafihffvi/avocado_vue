import { validation } from '@/locales/en/validation.js';
import { headers } from '@/locales/en/headers.js';
import { common } from '@/locales/en/common.js';
import { messages } from '@/locales/en/messages.js';

export default function loadMessages () {
    console.log('load locales');
    return {
        en: {
            validation: validation,
            headers: headers,
            common: common,
            messages: messages,
        } 
    };
};