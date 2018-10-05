import React, { PureComponent } from 'react';

import './stylesheet.css';

import SlideUp from '../../../UI/SlideUp';
import TabButtons from '../../../UI/TabButtons';

import _ from 'lodash';
import moment from 'moment';

export default class AgendaModal extends PureComponent {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      'handleTimeframeTypeChange',
      'handleNextDateClick',
      'handlePreviousDateClick',
    ]);

    this.state = {
      selectedDate: moment(),
      timeframeType: 'Week',
    };
  }

  handleTimeframeTypeChange(timeframeType) {
    this.setState({ timeframeType });
  }

  handleNextDateClick() {
    const { selectedDate, timeframeType } = this.state;

    switch (timeframeType) {
      case 'Day':
        this.setState({ selectedDate: selectedDate.clone().add(1, 'day') });
        break;
      case 'Week':
        this.setState({ selectedDate: selectedDate.clone().add(1, 'week') });
        break;
      case 'Month':
        this.setState({ selectedDate: selectedDate.clone().add(1, 'month') });
        break;
      default:
        return '';
    }
  }

  handlePreviousDateClick() {
    const { selectedDate, timeframeType } = this.state;

    switch (timeframeType) {
      case 'Day':
        this.setState({ selectedDate: selectedDate.clone().subtract(1, 'day') });
        break;
      case 'Week':
        this.setState({ selectedDate: selectedDate.clone().subtract(1, 'week') });
        break;
      case 'Month':
        this.setState({ selectedDate: selectedDate.clone().subtract(1, 'month') });
        break;
      default:
        return '';
    }
  }

  calculateTimeframeHeader() {
    const { selectedDate, timeframeType } = this.state;

    switch (timeframeType) {
      case 'Day':
        return selectedDate.format('MMMM Do');
      case 'Week':
        const weekStart = selectedDate.clone().startOf('week');
        const weekEnd = weekStart.clone().add(1, 'week');
        return `${weekStart.format('MMM Do')} - ${weekEnd.format('MMM Do')} (W${weekStart.format(
          'w'
        )})`;
      case 'Month':
        return selectedDate.format('MMMM');
      default:
        return '';
    }
  }

  render() {
    const { onClose } = this.props;
    const { timeframeType, selectedDate } = this.state;

    let dates = [];
    switch (timeframeType) {
      case 'Day':
        dates = [selectedDate];
        break;
      case 'Week':
        const startOfWeek = selectedDate.clone().startOf('week');
        dates = _.range(7).map(daysAfter => startOfWeek.clone().add(daysAfter, 'days'));
        break;
      case 'Month':
        const startOfMonth = selectedDate.clone().startOf('month');
        dates = _.range(selectedDate.daysInMonth()).map(daysAfter =>
          startOfMonth.clone().add(daysAfter, 'days')
        );
        break;
      default:
    }

    return (
      <SlideUp shouldIncludeCloseButton onClose={onClose}>
        <h2 className="agenda__title">Agenda</h2>

        <div className="agenda__tab-container">
          <TabButtons
            buttons={['Day', 'Week', 'Month']}
            selectedButton={timeframeType}
            onSelect={this.handleTimeframeTypeChange}
            useEqualWidthTabs
          />
        </div>

        <div className="agenda__timeframe-header-container">
          <i className="fas fa-chevron-left fa-lg" onClick={this.handlePreviousDateClick} />
          <div className="agenda__timeframe-header">{this.calculateTimeframeHeader()}</div>
          <i className="fas fa-chevron-right fa-lg" onClick={this.handleNextDateClick} />
        </div>

        <div className="agenda__days-container">
          {dates.map(date => (
            <div className="agenda__day-container" key={date.format()}>
              <div className="agenda__day-title">
                <div className="agenda__day-title__day-name">{date.format('dddd')}</div>
                <div className="agenda__day-title__date">{date.format('MMMM Do, YYYY')}</div>
              </div>
            </div>
          ))}
        </div>

        <br />
      </SlideUp>
    );
  }
}
