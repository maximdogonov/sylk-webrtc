'use strict';

const React        = require('react');
const autocomplete = require('autocomplete.js');


class URIInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
            selecting: false
        };
        // ES6 classes no longer autobind
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputKeyDown = this.onInputKeyDown.bind(this);
    }

    componentDidMount() {
        autocomplete('#uri-input', { hint: false }, [
            {
                source: (query, cb) => {
                    let data = this.props.data.filter((item) => {
                        return item.startsWith(query);
                    });
                    cb(data);
                },
                displayKey: String,
                templates: {
                    suggestion: (suggestion) => {
                        return suggestion;
                    }
                }
            }
        ]).on('autocomplete:selected', (event, suggestion, dataset) => {
            this.setValue(suggestion);
        });

        if (this.props.autoFocus) {
            this.refs.uri_input.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.defaultValue
        });
        if (nextProps.autoFocus) {
            this.refs.uri_input.focus();
        }
    }

    setValue(value) {
        this.setState({value: value});
        this.props.onChange(value);
    }

    onInputChange(event) {
        this.setValue(event.target.value);
    }

    onInputKeyDown(event) {
        switch (event.which) {
            case 13:
                // ENTER
                if (this.state.selecting) {
                    this.setState({selecting: false});
                } else {
                    this.props.onSelect(event.target.value);
                }
                break;
            case 27:
                // ESC
                this.setState({selecting: false});
                break;
            case 38:
            case 40:
                // UP / DOWN ARROW
                this.setState({selecting: true});
                break;
            default:
                break;
        }
    }

    onInputBlur(event) {
        // focus was lost, reset selecting state
        this.setState({selecting: false});
    }

    render() {
        return (
            <div className="form-group uri-input">
                <input type="text" id="uri-input" name="uri-input" ref="uri_input" className="form-control input-lg"
                    onChange={this.onInputChange}
                    onKeyDown={this.onInputKeyDown}
                    onBlur={this.onInputBlur}
                    value={this.state.value}
                    autoCapitalize="off"
                    autoCorrect="off"
                    required
                    autoFocus={this.props.autoFocus}
                    placeholder={this.props.placeholder}
                />
            </div>
        );

    }
}

URIInput.propTypes = {
    defaultValue: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    autoFocus: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    placeholder : React.PropTypes.string
};


module.exports = URIInput;
