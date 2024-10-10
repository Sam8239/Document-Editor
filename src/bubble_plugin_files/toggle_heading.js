function toggle_heading(instance, properties, context) {
  const { level } = properties;
  instance.data.toggleHeading(level);
}
