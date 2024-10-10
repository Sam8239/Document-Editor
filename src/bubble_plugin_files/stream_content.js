function stream_content(instance, properties, context) {
    const { url } = properties;
    instance.data.streamContent(url);
}
