function replace_text(instance, properties, context) {
  const { new_text } = properties;
  instance.data.replaceHighlightedText(new_text);
}
