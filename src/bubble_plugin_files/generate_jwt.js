function run_server(properties, context) {
    const jsonwebtoken = require("jsonwebtoken");
    const { inspect } = require("node:util");

    const { document_id, user_id } = properties;

    const allowedDocumentNames = [document_id];
    const payload = { allowedDocumentNames, userId: user_id };
    const secret = context.keys["Tiptap Cloud App Secret"];

    try {
        const jwt = jsonwebtoken.sign(payload, secret);

        return {
            token: jwt,
            returned_an_error: false,
            error_message: "",
        };
    } catch (error) {
        return {
            token: "",
            returned_an_error: true,
            error_message: inspect(error),
        };
    }
}
