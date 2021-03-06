import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FormItem from './FormItem';
import Input from '../input';
import './style/form.less';

const isPromise = promise => promise && typeof promise.then === 'function';
const initialValue = initialValue => initialValue === null || initialValue === undefined ? '' : initialValue;
const noop = () => undefined;


export default class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    const { fields } = props;
    this.state = {
      submitting: false,
      errors: {},
      initial: {},
      current: {},
    }
    for (const name in fields) {
      const propsField = fields[name];
      if (!propsField) continue;
      this.state.initial[name] = initialValue(fields[name].initialValue);
      this.state.current[name] = initialValue(fields[name].initialValue);
    }
  }
  onSubmit = e => {
    e && e.preventDefault();
    const { onSubmit, resetOnSubmit, onSubmitError } = this.props;
    const { initial, current } = this.state;
    this.setState({ submitting: true });
    const nextState = { submitting: false };

    const onError = e => {
      this.setState({ ...nextState, errors: (onSubmitError && onSubmitError(e)) || {} });
    };
    const onSuccess = response => {
      this.setState({
        ...nextState,
        current: resetOnSubmit ? initial : current,
        initial: resetOnSubmit ? initial : current,
        errors: {}
      });
    };
    try {
      const afterSubmitPromise = onSubmit({ initial, current });
      if (isPromise(afterSubmitPromise)) {
        return afterSubmitPromise.then(onSuccess).catch(onError);
      } else {
        return onSuccess(afterSubmitPromise);
      }
    } catch (e) {
      onError(e);
      // throw e;
    }
  }

  reset = () => {
    const { initial } = this.state;
    this.setState({ current: initial, errors: {} });
  }

  canSubmit = ({ } = {}) => {
    const { fields } = this.props;
    const { submitting, current, initial } = this.state;
    let passesValidators = true;
    for (const name in fields) {
      const props = fields[name];
      if (!props) continue;
      if (props.validator && props.validator(current[name])) {
        passesValidators = false;
        break;
      }
    }
    return !submitting && passesValidators;
  }
  onChange = (name, validator, element, cb) => (val, list) => {
    let value = val.target && 'value' in val.target ? val.target.value : val;
    // 控件 Checkbox.Group 多选值的处理
    value = list || value;
    // 控件 Checkbox 值的处理
    if (element.props.type === 'checkbox') {
      value = val.target.checked ? element.props.value : '';
    }
    // 控件 Switch 值的处理
    if (element.props.type === 'switch') {
      value = val.target.checked;
    }

    const nextState = { current: { ...this.state.current, [name]: value } };
    this.setState({ test: !this.state.test });
    const error = validator && validator(value);
    if (!error) {
      nextState.errors = { ...this.state.errors };
      delete nextState.errors[name];
    }
    if (typeof val.persist === 'function') val.persist();

    if (cb) this.setState(nextState, () => cb(val));
    else this.setState(nextState);
  };
  controlField = ({ children = <Input type="text" />, validator, name }) => {
    const element = typeof children !== 'function'
      ? children
      : children({
        onChange: this.onChange(name, validator),
        onSubmit: this.onSubmit,
        canSubmit: this.canSubmit,
      });
    if (!element || React.Children.count(element) !== 1 || !name) return element;
    const props = { name: element.props.name || name };
    const hasCurrentValue = this.state.current.hasOwnProperty(name);
    props.id = element.props.id;
    props.value = hasCurrentValue ? (this.state.current && this.state.current[name]) : element.props.value;

    const type = element.props.type;
    if (type === 'checkbox' || type === 'switch') {
      props.checked = !!props.value;
    }
    if (type === 'switch') {
      delete props.value;
    }
    props.onChange = this.onChange(name, validator, element, element.props.onChange);
    return React.cloneElement(element, props);
  }
  render() {
    const { prefixCls, className, fields, children, resetOnSubmit, onSubmitError, ...others } = this.props;
    const { submitting } = this.state;
    const formUnits = {};
    for (const name in fields) {
      const props = fields[name];
      if (!props) continue;
      const error = this.state.errors[name];
      const children = this.controlField({ ...props, name });
      const help = error || props.help;
      const labelFor = props.labelFor;
      formUnits[name] = (
        <FormItem {...{ ...props, key: name, children, help, labelFor, state: this.state, name, hasError: !!error }}/>
      )
    }
    return (
      <form {...{ ...others, className: classnames(prefixCls, className), onSubmit: this.onSubmit }}>
        <fieldset {...{ disabled: submitting }}>
          {children({
            fields: formUnits,
            state: this.state,
            canSubmit: this.canSubmit,
          })}
        </fieldset>
      </form>
    );
  }
}

Form.propTypes = {
  prefixCls: PropTypes.string,
  fields: PropTypes.object,
  onSubmit: PropTypes.func,
  onSubmitError: PropTypes.func,
  resetOnSubmit: PropTypes.bool,
  children: PropTypes.func,
};

Form.defaultProps = {
  prefixCls: 'w-form',
  onSubmitError: () => ({}),
  onSubmit: noop,
  resetOnSubmit: true,
  children: noop,
};
