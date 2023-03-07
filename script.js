const isDev = location.port !== ''
let api
let threadContainer = null
hljs.initHighlightingOnLoad();
let md = window.markdownit({
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const app = Vue.createApp({
  data() {
    return {
      message: "",
      currentAssistantMessage: '',
      messageList: [],
      role: '',
      loading: false,
      controller: null,
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
      if (this.loading) return
      this.scrollEnd()
      this.messageList.push({
        role: 'user',
        content: this.message,
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
        const response = await fetch(api, {
          method: 'POST',
          body: JSON.stringify({
            messages: this.messageList,
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
        this.messageList.push({
          role: 'assistant',
          content: this.currentAssistantMessage,
        })
        this.currentAssistantMessage = ''
        this.loading = false
        this.controller = false
      }
    },
    resEnd() {
      if (this.currentAssistantMessage) {
        this.currentAssistantMessage = ''
        this.loading = false
        this.controller = false
      }
    },
    scrollEnd() {
      setTimeout(() => {
        threadContainer && threadContainer.scrollTo({top: threadContainer.scrollHeight, behavior: 'smooth'})
      }, 100)
    },
    renderMD(content) {
      return md.render(content);
    }
  },
  watch: {
    'currentAssistantMessage': function (val, oldVal) {
      if (val) {
        if (!oldVal) {
          this.messageList.push({
            role: 'assistant',
            content: this.currentAssistantMessage,
          })
        } else {
          this.messageList[this.messageList.length - 1].content = val
          this.scrollEnd()
        }
      }
    }
  },
  mounted() {
    if (isDev) {
      api = 'http://localhost:3000/api/generate'
      this.messageList = [{ "role": "user", "content": "hi" }, { "role": "assistant", "content": "\n\nHello! I am an AI language model. How can I assist you today?" }, { "role": "user", "content": "js 代码实现二分查找" }, { "role": "assistant", "content": "下面是用JavaScript实现二分查找的示例代码：\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n\n  return -1;\n}\n\nconst arr = [1, 3, 5, 7, 9];\nconst target = 5;\nconst result = binarySearch(arr, target);\n\nconsole.log(result); // 2\n```\n\n这个函数接受两个参数：一个已排序的数组和要查找的目标值。它使用while循环来迭代左右指针，直到找到目标值或者左指针超过了右指针。在每次循环中，它计算中间索引，然后比较中间值和目标值的大小。如果中间值等于目标值，函数返回中间索引；如果中间值小于目标值，左指针移动到中间索引的右侧；如果中间值大于目标值，右指针移动到中间索引的左侧。如果没有找到目标值，函数返回-1。\n\n在上面的例子中，我们使用了一个已排序的数组[1, 3, 5, 7, 9]和要查找的目标值5。函数返回2，因为5在数组中的索引是2。" }]
    } else {
      const params = new URLSearchParams(location.search)
      const apiParam = params.get('api')
      if (apiParam) {
        api = apiParam
        localStorage.setItem('api', apiParam)
        alert('设置 api 成功')
      } else {
        const apiCache = localStorage.getItem('api');
        if (apiCache) {
          api = apiCache
        } else {
          alert('请指定 api，形如：https://chatgpt.oaker.bid/?api=YOUR_SERVICE_DOMAIN/api/generate')
        }
      }
    }
    threadContainer = document.querySelector('.thread-container')
  }
})
app.mount('#app')
