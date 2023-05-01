const mockMsgList = [{"role":"user","content":"hi"},{"role":"assistant","content":"Hello! I am an AI language model. How can I assist you today?"},{"role":"user","content":"js 代码实现二分查找"},{"role":"assistant","content":"下面是用JavaScript实现二分查找的示例代码：\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n\n  return -1;\n}\n\nconst arr = [1, 3, 5, 7, 9];\nconst target = 5;\nconst result = binarySearch(arr, target);\n\nconsole.log(result); // 2\n```\n\n这个函数接受两个参数：一个已排序的数组和要查找的目标值。它使用while循环来迭代左右指针，直到找到目标值或者左指针超过了右指针。在每次循环中，它计算中间索引，然后比较中间值和目标值的大小。如果中间值等于目标值，函数返回中间索引；如果中间值小于目标值，左指针移动到中间索引的右侧；如果中间值大于目标值，右指针移动到中间索引的左侧。如果没有找到目标值，函数返回-1。\n\n在上面的例子中，我们使用了一个已排序的数组[1, 3, 5, 7, 9]和要查找的目标值5。函数返回2，因为5在数组中的索引是2。"},{"role":"user","content":"分条描述如何实现财富自由"},{"role":"assistant","content":"实现财富自由是一个长期的过程，需要有计划地进行，以下是一些步骤：\n\n1. 制定财务计划：了解自己的资产和负债，制定一个详细的财务计划，包括设定目标、预算、储蓄计划和投资计划。\n\n2. 节约开支：查看自己的开支，找到可以减少的地方，例如减少娱乐开支、购物开支等。将节约下来的资金用于储蓄和投资。\n\n3. 储蓄：建立一个储蓄计划，每月将一定比例的收入储蓄起来，可以选择高利率的储蓄账户或定期存款，用于紧急情况和长期储备。\n\n4. 投资：将一部分资金投资于股票、基金、房地产等领域，以获得更高的收益。在投资前，需要了解投资风险和投资目标，并选择适合自己的投资方式。\n\n5. 建立被动收入来源：除了工资以外，建立被动收入来源可以帮助实现财务自由。可以选择投资于房地产出租、股息、版权收益等领域，以获得稳定的被动收入。\n\n6. 持续学习：了解财务知识、投资知识、理财知识等，可以帮助更好地管理自己的财务，提高投资的成功率。\n\n以上是一些实现财富自由的步骤，需要长期坚持和不断努力。"},{"role":"user","content":"以下 json，增加 ja 字段表示日文，只输出代码\n\nconst _lang = {\n  curSet: {\n    en: 'Current setting',\n    zh: '当前设定'\n  },\n  roleKeywords: {\n    en: 'role keywords',\n    zh: '角色关键字'\n  }\n}"},{"role":"assistant","content":"const _lang = {\n  curSet: {\n    en: 'Current setting',\n    zh: '当前设定',\n    ja: '現在の設定'\n  },\n  roleKeywords: {\n    en: 'role keywords',\n    zh: '角色关键字',\n    ja: '役割のキーワード'\n  }\n};"}]
const isDev = location.port !== ''

function initMarkdown() {
  if (!window.hljs || !window.markdownit) return
  hljs.highlightAll();
  const md = window.markdownit({
    linkify: true,
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><button class="copy-btn copy-btn-trigger not-prose"><img class="clippy" width="13" src="https://clipboardjs.com/assets/images/clippy.svg" alt="Copy to clipboard"></button><code>` +
                hljs.highlight(str, { language: lang, ignoreIllegals: true}).value +
                '</code></pre>';
        } catch (__) {}
      }

      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  });
  return md
}

function initClipboard(target) {
  const clipboard = new ClipboardJS(target, {
    text: function(trigger) {
      const contentEl = trigger.nextElementSibling;
      return contentEl.getAttribute('data-raw') || contentEl.innerText;
    }
  });

  clipboard.on('success', function(e) {
      e.trigger.classList.add('copied')
      e.clearSelection()
  });

  return clipboard
}

// 适配不同 api 入参
function getPayload(messages, apiType = 'default') {
  if (apiType === 'default') {
    return { messages }
  } else {
    const userMessages = messages.filter(i => i.role === 'user')
    const prompt = userMessages[userMessages.length - 1]?.content
    return { prompt }
  }
}

function scrollHelper(dom) {
  let userScrollFlag = false

  function onScroll() {
    console.log('onScroll')
    if (!userScrollFlag) {
      console.log('onScroll 2')
      userScrollFlag = true
      dom.removeEventListener('scroll', onScroll)
    }
  }

  function registerScroll() {
    userScrollFlag = false
    dom.addEventListener('scroll', onScroll);
  }

  function getUserScrollFlag() {
    return userScrollFlag
  }

  return {
    getUserScrollFlag,
    onScroll,
    registerScroll
  }
}

const fetchConfig = async (key) => {
  let url = `https://api.oaker.bid/api/data?key=${key}`
  let res = await fetch(url)
  let json = await res.json()
  return json
}

export {
  mockMsgList,
  initMarkdown,
  initClipboard,
  getPayload,
  scrollHelper,
  fetchConfig,
  isDev
}