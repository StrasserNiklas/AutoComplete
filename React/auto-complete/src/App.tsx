import './App.css';
import './web-component/auto-complete-web-component.ts'
import * as React from 'react'
import { AutoCompleteElement } from './web-component/auto-complete-web-component';
import names from './assets/names';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'AutoCompleteReact': {},
      'wc-auto-complete': { };
    }
  }
}

function App() {

  return (
    <div>
      <AutoCompleteReact></AutoCompleteReact>
    </div>
  );
}

export default App;

class AutoCompleteReact extends React.Component {
  componentDidMount() { 

    var component = document.querySelector<AutoCompleteElement>('wc-auto-complete');
    component.autoCompleteDataInput = names;
  }

  render() {
    return <div>
    <h1>React App</h1>
    <wc-auto-complete></wc-auto-complete>
  </div>
  }
}