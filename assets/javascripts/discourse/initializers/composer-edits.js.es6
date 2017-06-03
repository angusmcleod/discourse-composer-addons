import Composer from 'discourse/models/composer';
import ComposerController from 'discourse/controllers/composer';
import ComposerEditor from 'discourse/components/composer-editor';
import { default as computed } from 'ember-addons/ember-computed-decorators';

export default {
  name: 'composer-edits',
  initialize(){
    Composer.serializeOnCreate('topic_type', 'currentType')
    Composer.serializeOnCreate('make_wiki', 'makeWiki')
    Composer.reopen({
      showCategoryChooser: false,
      similarTitleTopics: Ember.A(),
      makeWiki: false,

      @computed('currentType')
      showWikiControls(type) {
        return type === 'general';
      }
    })

    ComposerController.reopen({
      _setModel(composerModel, opts) {
        this._super(composerModel, opts);
        const addProps = opts.addProperties;
        if (addProps) {
          Object.keys(addProps).forEach((k) => {
            this.set(`model.${k}`, addProps[k])
          })
        }
      }
    })

    ComposerEditor.reopen({
      @computed('composer.currentType')
      placeholder(type) {
        if (type) return `topic.type.${type}.body`;
        return "composer.reply_placeholder"
      }
    })

  }
};
