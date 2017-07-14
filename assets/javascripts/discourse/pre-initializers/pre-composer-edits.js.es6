import KeyboardShortcuts from 'discourse/lib/keyboard-shortcuts';

export default {
  name: "pre-composer-edits",
  initialize(container) {
    KeyboardShortcuts._bindToFunction = function(func, binding) {
      if (Discourse.SiteSettings.composer_override_shortcut && func == 'createTopic') return;
      if (typeof this[func] === 'function') {
        this.keyTrapper.bind(binding, _.bind(this[func], this));
      }
    }
  }
}
