import {css} from 'lit';

/*
  Soon we can use import attribtues instead of Lit CSS Templates
  for a more vanilla web platform experience!

  ```
  import styles from './shared-styles.css' with {type: 'css'}
  
  class SimpleGreeting extends LitElement {
    static styles = styles;
  }
  ```

  Learn more:

  https://github.com/tc39/proposal-import-attributes/blob/master/README.md
*/
export const styles = css`
  :host {
    display: block;
    border-radius: 24px;
    padding: 24px;
    margin-block: 16px;
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    position: absolute;
    right: 10px;
    top: 0;
    color: blue;
  }
    
  :host > :first-child {
    margin-block-start: 0;  
  }
    
  :host > :last-child {
    margin-block-end: 0;  
  }
    
  a {
    color: inherit;  
  }`;