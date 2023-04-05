import {
  mockMsgList,
  isDev,
  initMarkdown,
  initClipboard,
  getPayload,
} from './utils.js'
import { getPrompts, version } from './data.js'
import { lang, useEnglish } from './lang.js'

let threadContainer = null
let md
const prompts = getPrompts(useEnglish)

const app = Vue.createApp({
  data() {
    return {
      message: "",
      currentAssistantMessage: '',
      messageList: [],
      role: '',
      loading: false,
      controller: null,
      useLight: true,
      sideOpened: false,
      activePromptName: prompts[0].name,
      systemRolePrompt: '',
      search: '',
      api: null,
      apiType: 'default', // default or single
      prompts,
      useEnglish,
      lang,
      mdReady: false,
      version,
    }
  },
  methods: {
    resetThread() {
      this.messageList = []
    },
    handleKeydown(e) {
      if (e.isComposing || e.shiftKey) {
        return
      }
      if (e.key === 'Enter') {
        this.onSend()
      }
    },
    onSend() {
      if (!this.api) {
        this.inputApi()
        return
      }
      if (this.loading) return
      this.scrollEnd()
      this.messageList.push({
        role: 'user',
        content: this.message,
      })
      this.messageList.push({
        role: 'assistant',
        content: '',
      })
      this.requestWithLatestMessage()
    },
    async requestWithLatestMessage() {
      this.loading = true
      this.message = ''
      this.currentAssistantMessage = ''
      try {
        const controller = new AbortController()
        this.controller = controller
        const messages = [...this.messageList].filter(i => i.content !== '')
        if (this.systemRolePrompt) {
          messages.unshift({
            role: 'system',
            content: this.systemRolePrompt
          })
        }
        const response = await fetch(this.api, {
          method: 'POST',
          body: JSON.stringify(getPayload(messages, this.apiType)),
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        const data = response.body
        if (!data) {
          throw new Error('No data')
        }
        const reader = data.getReader()
        const decoder = new TextDecoder('utf-8')
        let done = false

        while (!done) {
          const { value, done: readerDone } = await reader.read()
          isDev && console.log('debug', +new Date(), value, readerDone)
          if (value) {
            let char = decoder.decode(value)
            if (char === '\n' && this.currentAssistantMessage.endsWith('\n')) {
              continue
            }
            if (char) {
              this.currentAssistantMessage += char
            }
          }
          done = readerDone
        }
      } catch (e) {
        console.error(e)
        this.loading = false
        this.controller = null
        return
      }
      this.resEnd()
    },
    archiveCurrentMessage() {
      if (this.currentAssistantMessage) {
        console.log('archiveCurrentMessage')
        this.setLastMsgContent()
        this.currentAssistantMessage = ''
        this.loading = false
        this.controller = null
      } else {
        this.currentAssistantMessage = '...'
      }
    },
    stopStreamFetch() {
      if (this.controller) {
        this.controller.abort()
        this.archiveCurrentMessage()
      }
    },
    setLastMsgContent() {
      const lastMsg = this.messageList[this.messageList.length - 1]
      if (lastMsg.role === 'assistant') {
        lastMsg.content = this.currentAssistantMessage
      }
    },
    resEnd() {
      if (this.currentAssistantMessage) {
        this.currentAssistantMessage = ''
        this.loading = false
        this.controller = null
      }
    },
    scrollEnd() {
      setTimeout(() => {
        threadContainer && threadContainer.scrollTo({top: threadContainer.scrollHeight, behavior: 'smooth'})
      }, 100)
    },
    renderMD(content) {
      return this.mdReady ? md.render(content) : content;
    },
    toggleColor() {
      this.useLight = !this.useLight
    },
    onInput() {
      const {inputRef} = this.$refs
      inputRef.style.height = 'auto'; // 当删减输入时，scrollHeight 重置
      inputRef.style.height = inputRef.scrollHeight + 'px';
    },
    setPromot({prompt, name}) {
      this.activePromptName = name
      this.systemRolePrompt = prompt
      console.info('activePromptName', name)
      this.sideOpened = false
      this.messageList = []
    },
    onSearchEnter() {
      const cur = this.filteredItems[0]
      this.search = ''
      if (cur) {
        this.setPromot(cur)
        this.$refs.inputRef.focus();
      }
    },
    handleOutsideClick(event) {
      const shouldExclude = ['mobile-menu', 'mobile-menu-icon'].some(key => event.target.parentElement.classList.contains(key))
      if (!shouldExclude && this.sideOpened) {
        this.sideOpened = false
      }
    },
    setApi(value, value1) {
      if (value) {
        this.api = value
        localStorage.setItem('api', this.api)
      }
      if (value1) {
        this.apiType = value1
        localStorage.setItem('api-type', this.apiType)
      }
    },
    inputApi() {
      const append = this.api ? `\n\n当前 api: ${this.api}` : ''
      const input = prompt('请指定 api，形如：https://your.com/api/generate' + append)
      if (input) {
        this.setApi(input)
      }
    },
    handleMarkdown() {
      setTimeout(() => {
        md = initMarkdown()
        initClipboard('.copy-btn-trigger')
        this.mdReady = true
      }, 400)
    }
  },
  computed: {
    colorScheme() {
      return this.useLight ? 'light' : 'dark'
    },
    filteredItems() {
      return this.prompts.filter(
          i => i.name.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  watch: {
    'currentAssistantMessage': function (val, oldVal) {
      if (val) {
        if (!oldVal) {
          this.setLastMsgContent()
        } else {
          this.messageList[this.messageList.length - 1].content = val
          this.scrollEnd()
        }
      }
    }
  },
  directives: {
    'outside-click': {
      mounted(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  },
  mounted() {
    const params = new URLSearchParams(location.search)
    let apiParam = params.get('api') || localStorage.getItem('api')
    isDev && (apiParam = 'http://localhost:3000/api/generate')
    isDev && (this.messageList = mockMsgList)
    const apiTypeParam = params.get('api-type') || localStorage.getItem('api-type')
    this.setApi(apiParam, apiTypeParam)
    this.handleMarkdown()
    threadContainer = document.querySelector('.thread-container')
  }
})
app.mount('#app')
