import {html, css, LitElement} from 'lit';
// console.log('import: ', LitElement)
import {styles} from './styles.js';

export default class VersionNum extends LitElement {
  static get styles() {
    return styles;
  }

  static get properties() { // fixed by 尝试将 class fields 改写为传统的类属性定义方式
    return {
      label: { type: String },
      num: { type: String },
    };
  }

  constructor() {
    super();
    this.label = 'version';
    this.num = '1.0.0';
  }

  render() {
    return html`
      <p>${this.label}: ${this.num}</p>`
  }
}
