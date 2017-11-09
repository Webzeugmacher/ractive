import Ractive from 'ractive'
import $ from 'jquery'
import MyComponent from './path/to/MyComponent.ractive.html'

const message = 'World'

export default Ractive.extend({
  components: { MyComponent },
  template: {"v":4,"t":[{"t":7,"e":"MyComponent","f":["Hello, ",{"t":2,"r":"message"},"!"]}]},
  css: 'div{color:red}div::after{display:block;content:"";clear:both;}',
  data: { message }
})
