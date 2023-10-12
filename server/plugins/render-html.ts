export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.bodyAttrs.push('class="bg-gray-100"');
  });
})