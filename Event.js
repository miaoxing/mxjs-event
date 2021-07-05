import { Component } from 'react';
import propTypes from 'prop-types';
import {event} from '@mxjs/app';

export default class extends Component {
  static propTypes = {
    name: propTypes.string,
    children: propTypes.node,
  };

  state = {
    children: [],
    prepend: [],
    append: [],
  };

  componentDidMount() {
    event.trigger(this.props.name, {comp: this});
  }

  children(component) {
    return this.setState({children: this.state.children.concat(component)});
  }

  prepend(component) {
    return this.setState({prepend: this.state.prepend.concat(component)});
  }

  append(component) {
    return this.setState({append: this.state.append.concat(component)});
  }

  render() {
    return <>
      {this.state.prepend}
      {this.state.children.length ? this.state.children : (this.props.children || '')}
      {this.state.append}
    </>;
  }
}
