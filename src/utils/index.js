export const uniqueString = () => {
    const rand = Math.floor(Math.random() * 90000000) + 10000000;
    const timestamp = Date.now().toString(36);
    return timestamp + rand.toString(32);
};

export const generateRandomId = (length) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
};

export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

export const debounce = (func, delay = 300) => {
    let timeoutId;

    return function (...args) {
        const context = this;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

export const validateHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.documentElement.nodeName !== "parsererror";
};

export const validateJSON = (jsonString) => {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
};

export const getRandomElement = (list) => {
    return list[Math.floor(Math.random() * list.length)];
};

export const typewriterEffect = (editor, paragraph, speed = 100, callback) => {
    let index = 0;

    function typeNextCharacter() {
        if (index < paragraph.length) {
            // Insert character by character into the editor
            editor.chain().focus().insertContent(paragraph[index]).run();
            index++;

            // Set typing speed delay
            setTimeout(typeNextCharacter, speed);
        } else if (callback) {
            callback();
        }
    }

    // Start typing the paragraph
    typeNextCharacter();
};
