import { registerUnbound } from 'discourse-common/lib/helpers';
import { topicIconClass } from '../lib/composer-utilities';

function renderTopicIcon(topic) {
  let iconClass = topicIconClass(topic.get('subtype'));
  if (iconClass) {
    return `<i class="fa fa-${iconClass}"></i>`;
  } else {
    return '';
  }
};

export default registerUnbound('topic-icon', function(topic) {
  return new Handlebars.SafeString(renderTopicIcon(topic));
});
