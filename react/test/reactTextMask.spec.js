import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import packageJson from '../package.json'

const ReactTextMask = (isVerify()) ?
  require(`../${packageJson.main}`) :
  require('../src/reactTextMask.js')

const MaskedInput = ReactTextMask.default
const conformToMask = ReactTextMask.conformToMask

const emailMask = (isVerify()) ?
  require('../../addons/dist/emailMask.js').default :
  require('../../addons/src/emailMask.js').default

describe('MaskedInput', () => {
  it('does not throw when instantiated', () => {
    expect(() => ReactTestUtils.renderIntoDocument(
      <MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}/>
    )).not.to.throw()
  })

  it('renders a single input element', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}/>
    )

    expect(
      () => ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    ).not.to.throw()
  })

  it('renders correctly with an undefined value', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('')
  })

  it('renders correctly with an initial value', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
        value='123'
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('(123) ___-____')
  })

  it('renders mask instead of empty string when showMask is true', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
        showMask={true}
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('(___) ___-____')
  })

  it('does not render mask instead of empty string when showMask is false', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
        showMask={false}
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('')
  })

  it('calls createTextMaskInputElement with the correct config', () => {
    const mask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    const guide = true
    const placeholderChar = '*'
    const keepCharPositions = true
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      mask={mask}
      guide={guide}
      placeholderChar={placeholderChar}
      keepCharPositions={keepCharPositions}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')

    // stub the createTextMaskInputElement method
    maskedInput.createTextMaskInputElement = (config) => {
      expect(typeof config).to.equal('object')
      expect(config.inputElement).to.equal(renderedDOMComponent)
      expect(config.mask).to.equal(mask)
      expect(config.guide).to.equal(guide)
      expect(config.placeholderChar).to.equal(placeholderChar)
      expect(config.keepCharPositions).to.equal(keepCharPositions)
      return {
        update() {}
      }
    }
    maskedInput.initTextMask()
  })

  it('sets textMaskInputElement and calls textMaskInputElement.update with the correct value', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      value='123'
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      />
    )

    // stub the createTextMaskInputElement method
    maskedInput.createTextMaskInputElement = () => {
      return {
        update(value) {
          expect(value).to.equal('123')
        }
      }
    }
    maskedInput.initTextMask()
    expect(typeof maskedInput.textMaskInputElement).to.equal('object')
  })

  it('initializes textMaskInputElement property', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}/>
    )
    expect(typeof maskedInput.textMaskInputElement).to.equal('object')
    expect(typeof maskedInput.textMaskInputElement.state).to.equal('object')
    expect(typeof maskedInput.textMaskInputElement.state.previousConformedValue).to.equal('string')
    expect(typeof maskedInput.textMaskInputElement.update).to.equal('function')
  })

  it('does not render masked characters', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      value='abc'
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('')
  })

  it('does not allow masked characters', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')

    expect(renderedDOMComponent.value).to.equal('')
    maskedInput.textMaskInputElement.update('abc')
    expect(renderedDOMComponent.value).to.equal('')
  })

  it('can be disabled by setting the mask to false', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      value='123abc'
      mask={false}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('123abc')
  })

  it('can call textMaskInputElement.update to update the inputElement.value', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')

    expect(renderedDOMComponent.value).to.equal('')

    renderedDOMComponent.value = '12345'
    maskedInput.textMaskInputElement.update()
    expect(renderedDOMComponent.value).to.equal('(123) 45_-____')
  })

  it('can pass value to textMaskInputElement.update method', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      value='123'
      mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')

    expect(renderedDOMComponent.value).to.equal('(123) ___-____')
    maskedInput.textMaskInputElement.update('1234')
    expect(renderedDOMComponent.value).to.equal('(123) 4__-____')
  })

  it('can pass textMaskConfig to textMaskInputElement.update method', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      value='123'
      mask={false}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')

    expect(renderedDOMComponent.value).to.equal('123')

    maskedInput.textMaskInputElement.update('1234', {
      inputElement: renderedDOMComponent,
      mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    })
    expect(renderedDOMComponent.value).to.equal('(123) 4__-____')
  })

  it('accepts function as mask property', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      value='1234'
      mask={(value) => {
        expect(value).to.equal('1234')
        return ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      }}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('(123) 4__-____')
  })

  it('accepts object as mask property', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      value='abc'
      mask={emailMask}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('abc@ .')
  })

  it('accepts pipe function', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
      value='1234'
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      pipe={(value) => {
        expect(value).to.equal('(123) 4__-____')
        return 'abc'
      }}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    expect(renderedDOMComponent.value).to.equal('abc')
  })

  it('calls textMaskInputElement.update and props.onChange when a change event is received', () => {
    const onChangeSpy = sinon.spy((event) => {
      expect(event.target.value).to.equal('123')
    })
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
        value='123'
        onChange={onChangeSpy}
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    maskedInput.textMaskInputElement.update = sinon.spy(() => {})
    ReactTestUtils.Simulate.change(renderedDOMComponent, {target: {value: '123'}})
    expect(onChangeSpy.callCount).to.equal(1)
    expect(maskedInput.textMaskInputElement.update.callCount).to.equal(1)
  })

  it('calls props.onBlur when a change event is received', () => {
    const onBlurSpy = sinon.spy((event) => {
      expect(event.target.value).to.equal('(123) ___-____')
    })
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
        value='123'
        onBlur={onBlurSpy}
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    ReactTestUtils.Simulate.blur(renderedDOMComponent)
    expect(onBlurSpy.callCount).to.equal(1)
  })

  it('calls textMaskInputElement.update when an input event is received when props.onChange is not set', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
        value='123'
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}/>
    )
    const renderedDOMComponent = ReactTestUtils.findRenderedDOMComponentWithTag(maskedInput, 'input')
    maskedInput.textMaskInputElement.update = sinon.spy(() => {})

    ReactTestUtils.Simulate.change(renderedDOMComponent, {target: {value: '456'}})
    expect(maskedInput.textMaskInputElement.update.callCount).to.equal(1)
  })

  it('calls textMaskInputElement.update via onChange method', () => {
    const maskedInput = ReactTestUtils.renderIntoDocument(
      <MaskedInput
        value='123'
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={true}/>
    )
    maskedInput.textMaskInputElement.update = sinon.spy(() => {})
    maskedInput.onChange()
    expect(maskedInput.textMaskInputElement.update.callCount).to.equal(1)
  })

  // test fix for issues #230, #483, #778 etc.
  it('works correct in stateful Component', () => {
    class StatefulComponent extends React.Component {
      constructor(...args) {
        super(...args)

        this.state = {value: '1234'}
        this.onChange = this.onChange.bind(this)
      }

      onChange(e) {
        this.setState({value: e.target.value})
      }

      render() {
        return <MaskedInput
        onChange={this.onChange}
        value={this.state.value}
        mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        guide={false}/>
      }
    }

    const statefulComponent = ReactTestUtils.renderIntoDocument(
      <StatefulComponent/>
    )
    const renderedDOMInput = ReactTestUtils.findRenderedDOMComponentWithTag(statefulComponent, 'input')

    // Initial value "1234" from StatefulComponent is masked correct
    expect(renderedDOMInput.value).to.equal('(123) 4')

    // Simulate deleting last char "4" from input
    renderedDOMInput.value = '(123'

    // Simulate onChange event with current value "(123) "
    ReactTestUtils.Simulate.change(renderedDOMInput, {target: {value: '(123'}})

    // Now we expect to see value "(123" instead of "(123) "
    expect(renderedDOMInput.value).to.equal('(123')
  })

  // test fix for issue #806.
  it('works correct as controlled component', () => {
    class StatefulComponent extends React.Component {
      constructor(...args) {
        super(...args)

        this.state = {
          value: '',
          mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
          guide: false,
          placeholderChar: '_',
          showMask: false,
          pipe: undefined
        }

        this.onChange = this.onChange.bind(this)
        this.onMaskArray = this.onMaskArray.bind(this)
        this.onMaskFunction = this.onMaskFunction.bind(this)
        this.onGuideOn = this.onGuideOn.bind(this)
        this.onGuideOff = this.onGuideOff.bind(this)
        this.onPlaceholderChar = this.onPlaceholderChar.bind(this)
        this.onShowMaskOn = this.onShowMaskOn.bind(this)
        this.onShowMaskOff = this.onShowMaskOff.bind(this)
        this.onPipe = this.onPipe.bind(this)
      }

      onChange(e) {
        this.setState({value: e.target.value})
      }

      onMaskArray() {
        this.setState({mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]})
      }

      onMaskFunction() {
        this.setState({mask: () => ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]})
      }

      onGuideOn() {
        this.setState({guide: true})
      }

      onGuideOff() {
        this.setState({guide: false})
      }

      onPlaceholderChar() {
        this.setState({placeholderChar: '*'})
      }

      onShowMaskOn() {
        this.setState({
          guide: undefined,
          showMask: true
        })
      }

      onShowMaskOff() {
        this.setState({
          guide: undefined,
          showMask: false
        })
      }

      onPipe() {
        this.setState({
          pipe: (conformedValue) => ({value: `+1 ${conformedValue}`, indexesOfPipedChars: [0, 1, 2]})
        })
      }

      render() {
        return (
          <div>
              <input onChange={this.onChange} value={this.state.value} className={'user-input'}/>
              <MaskedInput
                value={this.state.value}
                mask={this.state.mask}
                guide={this.state.guide}
                placeholderChar={this.state.placeholderChar}
                showMask={this.state.showMask}
                pipe={this.state.pipe}
                className={'masked-input'}
              />
              <button className='mask-array-button' onClick={this.onMaskArray}>Change mask array</button>
              <button className='mask-function-button' onClick={this.onMaskFunction}>Change mask function</button>
              <button className='guide-on-button' onClick={this.onGuideOn}>Guide On</button>
              <button className='guide-off-button' onClick={this.onGuideOff}>Guide Off</button>
              <button className='placeholderChar-button' onClick={this.onPlaceholderChar}>
                Change placeholderChar
              </button>
              <button className='showMask-on-button' onClick={this.onShowMaskOn}>ShowMask On</button>
              <button className='showMask-off-button' onClick={this.onShowMaskOff}>ShowMask Off</button>
              <button className='pipe-button' onClick={this.onPipe}>Change pipe</button>
          </div>
        )
      }
    }

    const statefulComponent = ReactTestUtils.renderIntoDocument(
      <StatefulComponent/>
    )
    // Find inputs
    const renderedDOMUserInput = ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'user-input')
    const renderedDOMMaskedInput = ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'masked-input')
    // Find buttons
    const renderedDOMButtonMaskArray =
      ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'mask-array-button')
    const renderedDOMButtonMaskFunction =
      ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'mask-function-button')
    const renderedDOMButtonGuideOn =
      ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'guide-on-button')
    const renderedDOMButtonGuideOff =
      ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'guide-off-button')
    const renderedDOMButtonShowMaskOn =
      ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'showMask-on-button')
    const renderedDOMButtonShowMaskOff =
      ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'showMask-off-button')
    const renderedDOMButtonPlaceholderChar =
      ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'placeholderChar-button')
    const renderedDOMButtonPipe =
      ReactTestUtils.findRenderedDOMComponentWithClass(statefulComponent, 'pipe-button')

    // Check value changing
    ReactTestUtils.Simulate.change(renderedDOMUserInput, {target: {value: '123'}})
    expect(renderedDOMMaskedInput.value).to.equal('(123) ')
    ReactTestUtils.Simulate.change(renderedDOMUserInput, {target: {value: '12345678901234567890'}})
    expect(renderedDOMMaskedInput.value).to.equal('(123) 456-7890')
    ReactTestUtils.Simulate.change(renderedDOMUserInput, {target: {value: ''}})
    expect(renderedDOMMaskedInput.value).to.equal('')

    // Check showMask changing
    ReactTestUtils.Simulate.click(renderedDOMButtonShowMaskOn)
    expect(renderedDOMMaskedInput.value).to.equal('(___) ___-____')
    ReactTestUtils.Simulate.click(renderedDOMButtonShowMaskOff)
    expect(renderedDOMMaskedInput.value).to.equal('')

    // // Check guide changing
    ReactTestUtils.Simulate.click(renderedDOMButtonGuideOff)
    ReactTestUtils.Simulate.change(renderedDOMUserInput, {target: {value: '123'}})
    expect(renderedDOMMaskedInput.value).to.equal('(123) ')
    ReactTestUtils.Simulate.click(renderedDOMButtonGuideOn)
    expect(renderedDOMMaskedInput.value).to.equal('(123) ___-____')
    ReactTestUtils.Simulate.click(renderedDOMButtonGuideOff)
    expect(renderedDOMMaskedInput.value).to.equal('(123) ')

    // Check placeholderChar changing
    ReactTestUtils.Simulate.click(renderedDOMButtonGuideOn)
    ReactTestUtils.Simulate.change(renderedDOMUserInput, {target: {value: '123'}})
    expect(renderedDOMMaskedInput.value).to.equal('(123) ___-____')
    ReactTestUtils.Simulate.click(renderedDOMButtonPlaceholderChar)
    expect(renderedDOMMaskedInput.value).to.equal('(123) ***-****')
    ReactTestUtils.Simulate.click(renderedDOMButtonGuideOff)

    // Check mask as array changing
    ReactTestUtils.Simulate.change(renderedDOMUserInput, {target: {value: '1234567890'}})
    expect(renderedDOMMaskedInput.value).to.equal('(123) 456-7890')
    ReactTestUtils.Simulate.click(renderedDOMButtonMaskArray)
    expect(renderedDOMMaskedInput.value).to.equal('(123) 456-78-90')
    ReactTestUtils.Simulate.click(renderedDOMButtonGuideOff)

    // Check mask as function changing
    ReactTestUtils.Simulate.change(renderedDOMUserInput, {target: {value: '1234567890'}})
    expect(renderedDOMMaskedInput.value).to.equal('(123) 456-78-90')
    ReactTestUtils.Simulate.click(renderedDOMButtonMaskFunction)
    expect(renderedDOMMaskedInput.value).to.equal('(123) 456-7890')

    // Check pipe changing
    ReactTestUtils.Simulate.click(renderedDOMButtonPipe)
    expect(renderedDOMMaskedInput.value).to.equal('+1 (123) 456-7890')
  })
})

describe('conformToMask', () => {
  it('is a function', () => {
    expect(typeof conformToMask).to.equal('function')
  })
})
