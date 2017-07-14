import { topicIconClass } from '../../lib/composer-utilities';

export default {
  setupComponent(args, component) {
    if (args.model)
      component.set('topicIcon', topicIconClass(args.model.get('subtype')));
  }
}
