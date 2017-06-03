var topicIconClass = function(topicType) {
  switch(topicType){
    case 'default':
      return 'comments-o';
    case 'question':
      return 'question-circle';
    case 'rating':
      return 'star';
    case 'event':
      return 'calendar';
  }
}

export { topicIconClass }