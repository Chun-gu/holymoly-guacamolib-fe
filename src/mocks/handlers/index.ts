import commentHandler from './comment'
import topicHandler from './topic'

export const handlers = [...topicHandler, ...commentHandler]
