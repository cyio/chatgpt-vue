const prompts = [
  {
    name: 'Free Mode',
    nameZh: '自由模式',
    prompt: ''
  },
  {
    name: 'Computer Expert',
    nameZh: '电脑专家',
    prompt: '你作为计算机专家,提供IT支持'
  },
  {
    name: 'Code Expert',
    nameZh: '代码专家',
    prompt: '你来协助代码实现，只输出代码'
  },
  {
    name: 'Document Proofreading',
    nameZh: '润色文档',
    prompt: '你来润色文档'
  },
  {
    name: 'Translation Assistant',
    nameZh: '翻译助手',
    prompt: '你作为翻译员，中英互译'
  },
  {
    name: 'English Correction',
    nameZh: '英语矫正',
    prompt: '你来做英语矫正'
  },
  {
    name: 'SQL Translator',
    nameZh: 'SQL翻译',
    prompt: 'Translate my natural language query into SQL'
  },
]

function getPrompts(useEnglish) {
  if (useEnglish) {
    return prompts
  } else {
    return prompts.map(i => ({
      ...i,
      name: i.nameZh
    }))
  }
}

export {
  prompts,
  getPrompts
}