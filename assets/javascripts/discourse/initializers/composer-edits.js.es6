import Composer from 'discourse/models/composer';
import ComposerController from 'discourse/controllers/composer';
import DEditor from 'discourse/components/d-editor';
import { default as computed, observes } from 'ember-addons/ember-computed-decorators';
import { getOwner } from 'discourse-common/lib/get-owner';

export default {
  name: 'composer-edits',
  initialize(){
    Composer.serializeOnCreate('topic_type', 'currentType')
    Composer.serializeOnCreate('make_wiki', 'makeWiki')
    Composer.reopen({
      showCategoryChooser: false,
      similarTitleTopics: Ember.A(),
      makeWiki: false,
      currentType: 'general',

      @computed('currentType')
      showWikiControls(type) {
        return type === 'general';
      },

      @computed('currentType')
      typePlaceholder(type) {
        return `topic.type.${type}.placeholder`;
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

    DEditor.reopen({
      init() {
        this._super(...arguments);
        const controller = getOwner(this).lookup('controller:composer');
        if (controller) {
          this.set('typePlaceholder', controller.get('model.typePlaceholder'));
          controller.addObserver('model.currentType', this, function(controller, prop) {
            if (this._state === 'destroying') { return }

            this.set('typePlaceholder', controller.get('model.typePlaceholder'));
          })
        }
      },

      @computed('placeholder', 'typePlaceholder')
      placeholderTranslated(placeholder, typePlaceholder) {
        if (typePlaceholder) return I18n.t(typePlaceholder);
        if (placeholder) return I18n.t(placeholder);
        return null;
      }
    })
  }
};
