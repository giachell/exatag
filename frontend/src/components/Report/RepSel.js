import React from "react";
import ReactDOM from "react-dom";
import WindowedSelect from "react-windowed-select";

const options = [];

for (let i = 0; i < 2100; i += 1) {
    options.push({
        label: i+1 ,
        value: i+1
    });
}

export default class RepSel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: null
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectedOption) {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    }
    render() {
        const { selectedOption } = this.state;
        return (
            <WindowedSelect
                isSearchable={false}
                options={options}
                onChange={this.handleChange}
                value={selectedOption}
            />
        );
    }
}

