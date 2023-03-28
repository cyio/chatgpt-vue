function isChineseLang() {
  const lang = navigator.language || navigator.userLanguage;
  return lang.indexOf('zh') !== -1
}

const useEnglish = !isChineseLang()

const _lang = {
  curSet: {
    en: 'Current setting',
    zh: '当前设定'
  },
  roleKeywords: {
    en: 'role keywords',
    zh: '角色关键字'
  },
  resetThread: {
    en: 'Reset Thread',
    zh: '重置会话'
  },
  mode: {
    en: 'Mode',
    zh: '模式'
  },
  light: {
    en: 'Light',
    zh: '浅色'
  },
  dark: {
    en: 'Dark',
    zh: '深色'
  },
  setAPI: {
    en: 'Set API',
    zh: '设置 API'
  },
  version: {
    en: 'version',
    zh: '版本号'
  }
}

const lang = new Proxy(_lang, {
  get: function(target, prop) {
    if (target[prop]) {
      return useEnglish ? target[prop].en : target[prop].zh;
    }
  }
});

export {
  lang,
  useEnglish
}