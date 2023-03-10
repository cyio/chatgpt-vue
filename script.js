import {
  mockMsgList,
  isDev,
  initMarkdown,
  initClipboard,
} from './utils.js'
import { prompts } from './data.js'

let threadContainer = null
let md

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
      prompts
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
        const messages = [...this.messageList]
        if (this.systemRolePrompt) {
          messages.unshift({
            role: 'system',
            content: this.systemRolePrompt
          })
        }
        const response = await fetch(this.api, {
          method: 'POST',
          body: JSON.stringify({
            messages,
          }),
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
      return md.render(content);
    },
    toggleColor() {
      this.useLight = !this.useLight
    },
    onInput() {
      const {inputRef} = this.$refs
      inputRef.style.height = 'auto'; // ?????????????????????scrollHeight ??????
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
      const shouldExclude = event.target.parentElement.classList.contains('mobile-menu')
      if (!shouldExclude) {
        this.sideOpened = false
      }
    },
    setApi(value) {
      this.api = value
      localStorage.setItem('api', this.api)
    },
    inputApi() {
      const append = this.api ? `\n\n?????? api: ${this.api}` : ''
      const input = prompt('????????? api????????????https://chatgpt.oaker.bid/?api=YOUR_API_DOMAIN/api/generate' + append)
      if (input) {
        this.setApi(input)
      }
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
    if (isDev) {
      this.api = 'http://localhost:3000/api/generate'
      this.messageList = mockMsgList
    } else {
      const params = new URLSearchParams(location.search)
      const apiParam = params.get('api')
      if (apiParam) {
        this.setApi(apiParam)
      } else {
        const apiCache = localStorage.getItem('api');
        if (apiCache) {
          this.api = apiCache
        } else {
        }
      }
    }
    md = initMarkdown()
    initClipboard('.copy-btn')
    threadContainer = document.querySelector('.thread-container')
  }
})
app.mount('#app')
